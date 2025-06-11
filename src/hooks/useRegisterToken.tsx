import { requestCreateEvent, useAccount, useEvent } from "@puzzlehq/sdk";
import { EventType } from "@puzzlehq/types";
import { useMutation } from "@tanstack/react-query";
import { PROGRAM_ID } from "../main";
import { asciiToU128 } from "../data/u128";
import { useTokenIds } from "./useTokenId";
import { useShallow } from "zustand/shallow";

type RegisterTokenProps = {
  name?: string;
  symbol?: string;
  decimals?: number;
  max_supply?: number;
};

// async transition register_token(
//   public token_id: field,
//   public name: u128,
//   public symbol: u128,
//   public decimals: u8,
//   public max_supply: u128,
//   public external_authorization_required: bool,
//   public external_authorization_party: address
// )

export const useRegisterToken = ({
  name,
  symbol,
  decimals,
  max_supply,
}: RegisterTokenProps) => {
  const { account } = useAccount();
  const [addTokenId] = useTokenIds(useShallow((state) => [state.addTokenId]));

  const external_authorization_required = false;
  const external_authorization_party = account?.address;

  const name_u128 = asciiToU128(name ?? "");
  const symbol_u128 = asciiToU128(symbol ?? "");

  const generateRandomTokenId = () => {
    return Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
  };

  const tokenId = `${generateRandomTokenId()}field`;

  const { data, isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      if (
        !name ||
        !symbol ||
        !max_supply ||
        !decimals ||
        !external_authorization_party
      ) {
        throw new Error("Missing required parameters for register_token");
      }

      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId: "register_token",
        fee: 0.25,
        type: EventType.Execute,
        // STEP 1. Fill out inputs to register your token
        inputs: [
          tokenId,
          name_u128,
          symbol_u128,
          `${decimals}u8`,
          `${max_supply}u128`,
          `${external_authorization_required}`,
          `${external_authorization_party}`,
        ],
      });

      if (eventCreateResponse.error) {
        throw new Error(eventCreateResponse.error);
      } else if (!eventCreateResponse.eventId) {
        throw new Error(`No eventId returned!`);
      }

      addTokenId(tokenId);

      return eventCreateResponse.eventId;
    },
  });

  const { event } = useEvent({ id: data ?? "" });

  return {
    data,
    isPending,
    error,
    event,
    eventStatus: event?.status,
    mutate,
  };
};
