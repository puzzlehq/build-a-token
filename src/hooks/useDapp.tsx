import {
  ConnectResponse,
  Network,
  PuzzleAccount,
  RecordWithPlaintext,
  useAccount,
  useBalance,
  useConnect,
  useRecords,
} from "@puzzlehq/sdk";
import { createContext, useContext } from "react";
import { PROGRAM_ID } from "../main";
import { Balance, RecordStatus } from "@puzzlehq/types";

export type DappContextType = {
  records: RecordWithPlaintext[] | undefined;
  account: PuzzleAccount | undefined;
  connect: (() => Promise<ConnectResponse>) | undefined;
  isConnected: boolean | undefined;
  isConnecting: boolean | undefined;
  balances: Balance[] | undefined;
};

const DAppContext = createContext<DappContextType | null>(null);

export const DAppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { account } = useAccount();

  const {
    connect,
    isConnected,
    loading: isConnecting,
  } = useConnect({
    dAppInfo: {
      description: "Fun dApp",
      name: "Puzzle",
    },
    permissions: {
      programIds: {
        [Network.AleoTestnet]: ["token_registry.aleo", "credits.aleo"],
      },
    },
  });

  const { records } = useRecords({
    filter: { programIds: [PROGRAM_ID], status: RecordStatus.Unspent },
  });

  const { balances } = useBalance();

  return (
    <DAppContext.Provider
      value={{
        account,
        connect,
        isConnected,
        records,
        isConnecting,
        balances,
      }}
    >
      {children}
    </DAppContext.Provider>
  );
};

export const useDappState = (): DappContextType => {
  const ctx = useContext(DAppContext);

  return {
    account: ctx?.account,
    connect: ctx?.connect,
    isConnected: ctx?.isConnected,
    isConnecting: ctx?.isConnected,
    records: ctx?.records,
    balances: ctx?.balances,
  };
};
