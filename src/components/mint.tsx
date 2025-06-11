import { useState } from "react";
import { useMintToken } from "../hooks/useMintTokens";
import { useTokenIds } from "../hooks/useTokenId";
import { useShallow } from "zustand/shallow";

function Mint() {
  const [activeTokenId] = useTokenIds(
    useShallow((state) => [state.activeTokenId]),
  );
  const [amount, setAmount] = useState<number | undefined>();
  const [recipient, setRecipient] = useState<string | undefined>();
  const [isPublic, setIsPublic] = useState(true);

  const { event, eventStatus, mutate, isPending, error } = useMintToken({
    functionId: isPublic ? "mint_public" : "mint_private",
    amount,
    recipient,
  });

  const isValidInputs = !!amount && !!recipient && recipient.trim() !== "";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border p-4">
      <span className="text-xl font-bold">Mint</span>
      <p>TokenId: {activeTokenId}</p>

      <div className="w-[80%]">
        <label htmlFor="amount" className="block text-sm font-medium leading-6">
          Amount
        </label>
        <div className="mt-2">
          <input
            name="amount"
            id="amount"
            type="number"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter amount to mint"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
        </div>
      </div>

      <div className="w-[80%]">
        <label
          htmlFor="recipient"
          className="block text-sm font-medium leading-6"
        >
          Recipient Address
        </label>
        <div className="mt-2">
          <input
            name="recipient"
            id="recipient"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter recipient address"
            onChange={(e) => {
              setRecipient(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex w-[80%] items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          <button
            onClick={() => setIsPublic(true)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
              isPublic
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setIsPublic(false)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
              !isPublic
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Private
          </button>
        </div>
      </div>

      <button
        disabled={isPending || !isValidInputs}
        onClick={() => mutate()}
        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isPending ? "Minting..." : "Mint"}
      </button>

      {error && <p className="text-red-500">{error.message}</p>}
      {event && (
        <p>
          {event?._id} {eventStatus}
        </p>
      )}
      {event && (
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(event, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Mint;
