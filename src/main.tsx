import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { configureConnection } from '@puzzlehq/sdk';

export const PROGRAM_ID = 'zksummit_token_v10.aleo';

(async () => {
  configureConnection({
    dAppName:'Build-A-Token',
    dAppDescription:'Create and manage your own custom token.',
    dAppUrl:'https://zksummit10.vercel.app',
    dAppIconURL:'https://link.to/assets/your_logo.png'
  });
  return ReactDOM.createRoot(document.getElementById('root')!).render(
    <div className='h-screen w-screen'>
      <App />
    </div>
  );
})();
