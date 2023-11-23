import { EventType, RecordWithPlaintext, useRecords, useRequestCreateEvent } from "@puzzlehq/sdk";
import { useEffect, useState } from "react";
import { PROGRAM_ID } from "../main";

function Transfer() {

  const [recipient, setRecipient] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [record, setRecord] = useState<RecordWithPlaintext | undefined>();
  const [isReadyToExecute, setIsReadyToExecute] = useState(false);

  const { records } = useRecords({ filter: { type: "unspent", programId: PROGRAM_ID } });

  const {
    requestCreateEvent,
    loading: execute_loading,
    eventId,
    error
  } = useRequestCreateEvent({
    programId: PROGRAM_ID,
    functionId: 'transfer_private',
    type: EventType.Execute,
    fee: 0.25,
    inputs: [record ?? '', recipient ?? '', amount + 'u64']
  });

  const send = () => {
    if (!records) {
      console.log('send called with no records');
      return;
    }
    const recordToSpendIndex = records.findIndex(r => {
      const credits = Number(r.plaintext.split('amount:')[1].split('u64')[0]);
      if (credits > Number(amount!)) {
        console.log('setting record', r);
        return r;
      }
    });
    if (recordToSpendIndex < 0) {
      console.log('could not find record to spend');
      return;
    }
    const recordToSpend = records[recordToSpendIndex];
    console.log(`sending ${amount} to ${recipient} with ${recordToSpend}`);
    setRecord(recordToSpend);
    setIsReadyToExecute(true);
  };

  useEffect(() => {
    if (isReadyToExecute) {
      requestCreateEvent();
      setIsReadyToExecute(false);
    }
  }, [isReadyToExecute]);


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