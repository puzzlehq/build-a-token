import { useAccount, useConnect } from '@puzzlehq/sdk';
import Dashboard from './Dashboard';

function App() {
  const { isConnected, loading } = useAccount();
  const { connect } = useConnect();

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {loading && <>loading...</>}
      {!loading && isConnected && <Dashboard />}
      {!loading && !isConnected && 
        <button onClick={connect}>Connect your wallet</button>
      }
    </div>
  );
};

export default App;
