import { ConnectResponse, Network, PuzzleAccount, RecordWithPlaintext, useAccount, useConnect, useRecords } from "@puzzlehq/sdk";
import { createContext, useContext } from "react";
import { PROGRAM_ID } from "../main";
import { RecordStatus } from "@puzzlehq/types";

export type DappContextType = {
  records: RecordWithPlaintext[] | undefined;
  account: PuzzleAccount | undefined
  connect: (() => Promise<ConnectResponse>) | undefined;
  isConnected: boolean | undefined;
};

const DAppContext = createContext<DappContextType | null>(null)

export const DAppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { account } = useAccount();

  const { connect, isConnected } = useConnect({
    dAppInfo: {
      description: 'Fun dApp',
      name: 'Puzzle'
    },
    permissions: {
      programIds: {
        [Network.AleoTestnet]: ['token_registry.aleo', 'credits.aleo']
      }
    }
  })

  const { records } = useRecords({
    filter: { programIds: [PROGRAM_ID], status: RecordStatus.Unspent }
  });

  return (
    <DAppContext.Provider
      value={{
        account,
        connect,
        isConnected,
        records
      }}
    
    >
      {children}
    </DAppContext.Provider>
  )

  
}

export const useDappState = (): DappContextType => {
  const ctx = useContext(DAppContext);

  return {
    account: ctx?.account,
    connect: ctx?.connect,
    isConnected: ctx?.isConnected,
    records: ctx?.records
  };
};
