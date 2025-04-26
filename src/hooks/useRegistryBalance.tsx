import { useEffect, useMemo, useState } from "react";
import { useDappState } from "./useDapp";
import { useTokenIds } from "./useTokenId";
import { useShallow } from "zustand/shallow";

export const useRegistryBalance = () => {
  const [activeTokenId] = useTokenIds(useShallow((state) => [state.activeTokenId]));

  const { records, balances } = useDappState();

  const balance = useMemo(() => {
    if (activeTokenId && balances) {
      return balances?.find(b => b.tokenId === activeTokenId);
    }
  }, [activeTokenId, balances])
  const [maxSpendableBalance, setMaxSpendableBalance] = useState<number | undefined>();

  useEffect(() => {
    if (records) {
      let max = 0;
      records.forEach((r) => {
        const credits =
          Number(r.plaintext.split("amount:")[1]?.split("u64")[0]) ?? 0;
        max = Math.max(credits, max);
      });
      setMaxSpendableBalance(max);
    }
  }, [records]);

  return {
    balance,
    maxSpendableBalance
  }
}