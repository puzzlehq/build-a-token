import { useConnect } from '@puzzlehq/sdk';
import Dashboard from './Dashboard.js';

function App() {
  const { connect, isConnected, loading } = useConnect();

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {loading && <>loading...</>}
      {!loading && isConnected && <Dashboard />}
      {!loading && !isConnected && 
        <button onClick={connect}>Connect your wallet</button>
      }
    </div>
  );
}

export default App;
