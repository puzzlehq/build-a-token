import { requestCreateEvent, useAccount, useEvent } from "@puzzlehq/sdk"
import { EventType } from "@puzzlehq/types"
import { useMutation } from "@tanstack/react-query"
import { PROGRAM_ID } from "../main"

type RegisterTokenProps = {
  name?: string,
  symbol?: string,
  decimals?: number,
  max_supply?: number,
} 

// async transition register_token(
//   public token_id: field,
//   public name: u128,
//   public symbol: u128,
//   public decimals: u8,
//   public max_supply: u128,
//   public external_authorization_required: bool,
//   public external_authorization_party: address
// )

export const useRegisterToken = ({ name, symbol, decimals, max_supply }: RegisterTokenProps) => {
  const { account } = useAccount();

  const external_authorization_required = false;
  const external_authorization_party = account?.address;

  const { data, isPending, error, mutate } = useMutation({
    mutationFn: async () => {
      if (!name || !symbol || !max_supply || !decimals) {
        throw new Error('Missing required parameters for register_token')
      }
      
      const eventCreateResponse = await requestCreateEvent({
        programId: PROGRAM_ID,
        functionId: 'register_token',
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
  });

  const { event } = useEvent({ id: data ?? '' });

  return {
    data, isPending, error, event, eventStatus: event?.status, mutate
  }
}