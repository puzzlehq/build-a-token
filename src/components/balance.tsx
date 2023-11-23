
function Balance({totalBalance, maxSpendable}: {totalBalance: number, maxSpendable: number}) {

  return (
    <div className='w-full border rounded-lg flex flex-col p-4'>
      <div className='w-full flex justify-between'>
        <span className='font-bold'>Total Balance</span>
        <span>{totalBalance.toLocaleString() ?? 0}</span>
      </div>
      <div className='w-full flex justify-between'>
        <span className='font-bold'>Largest Record to Spend</span>
        <span>{maxSpendable.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default Balance;