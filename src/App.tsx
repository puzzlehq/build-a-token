import { useAccount } from "@puzzlehq/sdk";
import Dashboard from "./Dashboard.js";
import Header from "./components/header.js";
import { useDappState } from "./hooks/useDapp.js";

function App() {
  const { connect, isConnecting } = useDappState();
  const { account } = useAccount();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Header address={account?.address} />
      <div className="h-full w-full items-center pb-4 pt-20 align-middle">
        {isConnecting && !account && (
          <div className="h-full w-full text-center align-middle">
            loading...
          </div>
        )}
        {account && <Dashboard />}
        {!isConnecting && !account && (
          <div className="h-full w-full text-center align-middle">
            <button onClick={() => connect?.()}>Connect your wallet</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
