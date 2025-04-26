import { useState } from "react";
import { useRegisterToken } from "../hooks/useRegisterToken";

function Register() {
  const [name, setName] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  const [decimals, setDecimals] = useState<number | undefined>();
  const [max_supply, setMaxSupply] = useState<number | undefined>();

  const {
    event,
    eventStatus,
    mutate,
    isPending,
    error,

  } = useRegisterToken({
    name,
    symbol,
    decimals,
    max_supply,
  });

  const isValidStrings = !!name && name.trim() !== '' && !!symbol && symbol.trim() !== '';
  const isValidNumbers = !!decimals && !!max_supply;
  const isValidInputs = isValidStrings && isValidNumbers;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border p-4">
      <span className="text-xl font-bold">Register</span>
      <div className="w-[80%]">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6"
        >
          Name
        </label>
        <div className="mt-2">
          <input
            name="name"
            id="name"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="NYC coin"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="w-[80%]">
        <label
          htmlFor="symbol"
          className="block text-sm font-medium leading-6"
        >
          Symbol
        </label>
        <div className="mt-2">
          <input
            name="symbol"
            id="symbol"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="NYC"
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="w-[80%]">
        <label htmlFor="decimals" className="block text-sm font-medium leading-6">
          Decimals
        </label>
        <div className="mt-2">
          <input
            name="decimals"
            id="decimals"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={'6'}
            type='number'
            onChange={(e) => {
              setDecimals(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className="w-[80%]">
        <label htmlFor="max_supply" className="block text-sm font-medium leading-6">
          Max Supply
        </label>
        <div className="mt-2">
          <input
            name="max_supply"
            id="max_supply"
            className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={'6'}
            type='number'
            onChange={(e) => {
              setMaxSupply(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <button
        disabled={isPending || !isValidInputs}
        onClick={() => mutate()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isPending ? 'Registering...' : 'Register'}
      </button>
      {error && <p>{error.message}</p>}
      {event && <p>{event?._id} {eventStatus}</p>}
      {event && (
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(event, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Register;
