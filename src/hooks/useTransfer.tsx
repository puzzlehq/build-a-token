import { requestCreateEvent, useEvent } from "@puzzlehq/sdk";
import { EventType, RecordWithPlaintext } from "@puzzlehq/types";
import { useMutation } from "@tanstack/react-query";
import { PROGRAM_ID } from "../main";

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
  record,
}: TransferProps) => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      if (!functionId || !amount || !recipient) {
        throw new Error("Missing required parameters for transfer");
      } else if (functionId === "transfer_private" && !record) {
        throw new Error("Missing record for transfer_private");
      }

      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId,
        fee: 0.25,
        type: EventType.Execute,
        inputs: [],
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
