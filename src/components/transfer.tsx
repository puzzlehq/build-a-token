import { RecordWithPlaintext } from "@puzzlehq/sdk";
import { useState } from "react";
import { useTransfer } from "../hooks/useTransfer";

function Transfer() {
  const [recipient, setRecipient] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const [record, setRecord] = useState<RecordWithPlaintext | undefined>();
  const [isPublic, setIsPublic] = useState(true);

  const functionId = isPublic ? 'transfer_public' : 'transfer_private';

  const {data, error, event, isPending, eventStatus, mutate} = useTransfer({
    functionId,
    amount,
    recipient,
    record
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border p-4">
      <span className="text-xl font-bold">Transfer</span>
      <div className="w-[80%]">
        <label
          htmlFor="recipient"
          className="block text-sm font-medium leading-6"
        >
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
      <div className="w-[80%]">
        <label htmlFor="amount" className="block text-sm font-medium leading-6">
          Amount
        </label>
        <div className="mt-2">
          <input
            name="amount"
            id="amount"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="10"
            type={'number'}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between w-[80%]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          <button
            onClick={() => setIsPublic(true)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
              isPublic ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setIsPublic(false)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
              !isPublic ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Private
          </button>
        </div>
      </div>
      <button
        disabled={isPending || !amount || !recipient}
        onClick={() => mutate()}
      >
        Send
      </button>
      {error && <p>{error.message}</p>}
      {data && <p>{data}</p>}
      {event && (
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(event, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Transfer;
