import { requestCreateEvent, useAccount, useEvent } from "@puzzlehq/sdk"
import { EventType } from "@puzzlehq/types"
import { useMutation } from "@tanstack/react-query"
import { PROGRAM_ID } from "../main"

type MintTokenProps = {
  functionId?: 'mint_public' | 'mint_private'
  amount?: number,
  recipient?: string,
} 

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

export const useMintToken = ({ functionId, amount, recipient }: MintTokenProps) => {
  const { account } = useAccount();

  const external_authorization_required = false;
  const authorized_until = 0;

  const {data, isPending, error, mutate} = useMutation({
    mutationFn: async () => {
      if (!functionId || !amount || !recipient) {
        throw new Error('Missing required parameters for mint_public and mint_private ')
      }
      
      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId,
        fee: 0.25,
        type: EventType.Execute,
        inputs: []
      });

      if (eventCreateResponse.error) {
        throw new Error(eventCreateResponse.error)
      } else if (!eventCreateResponse.eventId) {
        throw new Error(`No eventId returned!`)
      }

      return eventCreateResponse.eventId;
    }
  })

  const { event } = useEvent({ id: data ?? '' });

  return {
    data, isPending, error, event, eventStatus: event?.status, mutate
  }
}