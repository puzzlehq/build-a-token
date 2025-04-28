import { requestCreateEvent, useAccount, useEvent } from "@puzzlehq/sdk";
import { EventType } from "@puzzlehq/types";
import { useMutation } from "@tanstack/react-query";
import { PROGRAM_ID } from "../main";
import { useTokenIds } from "./useTokenId";
import { useShallow } from "zustand/shallow";
import { useDappState } from "./useDapp";

type MintTokenProps = {
  functionId?: "mint_public" | "mint_private";
  amount?: number;
  recipient?: string;
};

// async transition mint_public(
//   public token_id: field,
//   public recipient: address,
//   public amount: u128,
//   public authorized_until: u32
// )

// async transition mint_private(
//   public token_id: field,
//   recipient: address,
//   public amount: u128,
//   public external_authorization_required: bool,
//   public authorized_until: u32
// )

export const useMintToken = ({
  functionId,
  amount,
  recipient,
}: MintTokenProps) => {
  const [activeTokenId] = useTokenIds(useShallow((state) => [state.activeTokenId]));

  const external_authorization_required = 'false';
  const authorized_until = `0u32`;

  const { data, isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      if (!functionId || !amount || !recipient || !activeTokenId) {
        throw new Error(
          "Missing required parameters for mint_public and mint_private ",
        );
      }

      const inputPublic = [activeTokenId, recipient, `${amount}u128`, authorized_until];
      const inputPrivate = [activeTokenId, recipient, `${amount}u128`, `false`, authorized_until]

      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId,
        fee: 0.25,
        type: EventType.Execute,
        // STEP 2. Fill out inputs to mint your tokens!
        inputs: functionId === 'mint_public' ? inputPublic : inputPrivate,
      });

      if (eventCreateResponse.error) {
        throw new Error(eventCreateResponse.error);
      } else if (!eventCreateResponse.eventId) {
        throw new Error(`No eventId returned!`);
      }

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
