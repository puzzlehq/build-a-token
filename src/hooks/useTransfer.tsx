import { requestCreateEvent, useEvent } from "@puzzlehq/sdk";
import { EventType, RecordWithPlaintext } from "@puzzlehq/types";
import { useMutation } from "@tanstack/react-query";
import { PROGRAM_ID } from "../main";
import { useTokenIds } from "./useTokenId";
import { useShallow } from "zustand/shallow";
import { useDappState } from "./useDapp";
import { useRegistryBalance } from "./useRegistryBalance";

type TransferProps = {
  functionId?: "transfer_private" | "transfer_public";
  amount?: number;
  recipient?: string;
  record?: RecordWithPlaintext;
};

// async transition transfer_public(
//   public token_id: field,
//   public recipient: address,
//   public amount: u128
// )

// async transition transfer_private(
//   recipient: address,
//   amount: u128,
//   input_record: Token
// )

export const useTransfer = ({
  amount,
  functionId,
  recipient,
}: TransferProps) => {
  const [activeTokenId] = useTokenIds(
    useShallow((state) => [state.activeTokenId]),
  );
  const { largestRecord } = useRegistryBalance();
  console.log(largestRecord);
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      if (!functionId || !amount || !recipient || !activeTokenId) {
        throw new Error("Missing required parameters for transfer");
      } else if (functionId === "transfer_private" && !largestRecord) {
        throw new Error("Missing record for transfer_private");
      }

      const inputsPublic = [activeTokenId, recipient, `${amount}u128`];
      const inputsPrivate = [
        recipient,
        `${amount}u128`,
        largestRecord!.plaintext,
      ];

      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId,
        fee: 0.25,
        type: EventType.Execute,
        // STEP 3. Fill out inputs to transfer your tokens to a friend!
        inputs: functionId === "transfer_public" ? inputsPublic : inputsPrivate,
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
