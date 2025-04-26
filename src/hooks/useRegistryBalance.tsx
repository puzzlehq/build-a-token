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
  const [largestRecord, setLargestRecord] = useState<any | undefined>();
  const [maxSpendableBalance, setMaxSpendableBalance] = useState<number | undefined>();

  useEffect(() => {
    if (records) {
      let max = 0;
      let largest = undefined;
      const filteredRecord = records.filter(r => {
        const recordtokenid = r.data.token_id;
        if (typeof recordtokenid === 'string') {
          return recordtokenid.replace('.private', '') === activeTokenId
        }
        return false
      })
      filteredRecord.forEach((r) => {
        const credits =
          Number(r.plaintext.split("amount:")[1]?.split("u64")[0]) ?? 0;
        if (credits > max) {
          max = credits;
          largest = r;
        }
      });
      setLargestRecord(largest);
      setMaxSpendableBalance(max);
    }
  }, [records, activeTokenId]);

  return {
    balance,
    largestRecord,
    maxSpendableBalance,
  }
}