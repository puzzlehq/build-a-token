import { RecordWithPlaintext } from "@puzzlehq/sdk";
import { useState } from "react";
import { useTransfer } from "../hooks/useTransfer";

function Transfer() {
  const [recipient, setRecipient] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [record, setRecord] = useState<RecordWithPlaintext | undefined>();
  const [isReadyToExecute, setIsReadyToExecute] = useState(false);

  const { } = useTransfer({
    amount,
    recipient,

  })

  return (
    <div className='w-full border rounded-lg flex flex-col items-center justify-center gap-4 p-4'>
      <span className='text-xl font-bold'>Transfer</span>
      <div className='w-[80%]'>
        <label htmlFor="recipient" className="block text-sm font-medium leading-6">
          Recipient
        </label>
        <div className="mt-2">
          <input
            name="recipient"
            id="recipient"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="aleo168l7zt7686ns54qmweda5ngs28c9jr6rdehlezdcv6ssr899m5qq4f4qgy"
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
      </div>
      <div className='w-[80%]'>
        <label htmlFor="amount" className="block text-sm font-medium leading-6">
          Amount
        </label>
        <div className="mt-2">
          <input
            name="amount"
            id="amount"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="10"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <button disabled={execute_loading || !amount || !recipient} onClick={send}>send</button>
      {error && <p>{error}</p>}
      {eventId && <p>{eventId}</p>}
      {event && <pre className='whitespace-pre-wrap '>{JSON.stringify(event, null, 2)}</pre>}
    </div>
  )
}

export default Transfer;