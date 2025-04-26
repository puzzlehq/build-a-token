import { useRegistryBalance } from "../hooks/useRegistryBalance";

function Balance() {
  const { balance, maxSpendableBalance } = useRegistryBalance();

  return (
    <div className="flex w-full flex-col rounded-lg border p-4">
      <div className="flex w-full justify-between">
        <span className="font-bold">Public Balance</span>
        <span>{balance?.values.public.toLocaleString() ?? 0}</span>
      </div>
      <div className="flex w-full justify-between">
        <span className="font-bold">Private Balance</span>
        <span>{balance?.values.private.toLocaleString() ?? 0}</span>
      </div>
      <div className="flex w-full justify-between">
        <span className="font-bold">Largest Record to Spend</span>
        <span>{maxSpendableBalance?.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default Balance;
