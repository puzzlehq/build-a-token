import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { PuzzleWalletProvider } from "@puzzlehq/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppContextProvider } from "./hooks/useDapp.js";

export const PROGRAM_ID = "token_registry.aleo";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
          <PuzzleWalletProvider>

    <DAppContextProvider>
        <div className="h-screen w-screen">
          <App />
        </div>
        </DAppContextProvider>
      </PuzzleWalletProvider>
  </QueryClientProvider>

);
