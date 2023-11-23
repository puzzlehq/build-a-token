import { useAccount, useConnect, useRecords } from '@puzzlehq/sdk';
import { useEffect, useState } from 'react';
import Mint from './components/mint.js';
import { PROGRAM_ID } from './main.js';
import Transfer from './components/transfer.js';
import Balance from './components/balance.js';

function Dashboard() {
  const { account } = useAccount();
  const { loading } = useConnect();
  const { records, refetch } = useRecords({
    filter: { programId: PROGRAM_ID, type: 'unspent' }
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [maxSpendable, setMaxSpendable] = useState(0);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (records) {
      // console.log('records', records);
      let total = 0;
      let max = 0;
      records.forEach(r => {
        const credits = Number(r.plaintext.split('amount:')[1]?.split('u64')[0]) ?? 0;
        total += credits;
        max = Math.max(credits, max);
      });
      setTotalBalance(total);
      setMaxSpendable(max);
    }
  }, [records]);


  // if (!isConnected) {
  //   throw new Error('dashboard shouldn\'t be showing rn');
  // }

  if (loading) {
    return <>loading...</>
  }


  console.log(account);
  if (!account) {
    return <p>loading account info...</p>
  }

  return (
    <div className='flex flex-col w-full h-full gap-2 items-center'>
      <div className='w-3/4 lg:w-1/2 flex flex-col items-center justify-center gap-10 pb-4'>
        <Balance maxSpendable={maxSpendable} totalBalance={totalBalance}/>
        { account?.address === account.address && records.length > 0 && ( 
          <Transfer/>
        )}
        { account?.address === account.address && (  
          <Mint />
        )}
      </div>
    </div>
  );
}

export default Dashboard;