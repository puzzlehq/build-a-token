import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { PuzzleWalletProvider } from '@puzzlehq/sdk';

export const PROGRAM_ID = 'token_registry.aleo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PuzzleWalletProvider>
    <div className='h-screen w-screen'>
      <App />
    </div>
  </PuzzleWalletProvider>
);
