import { useAccount } from "@puzzlehq/sdk";
import Mint from "./components/mint.js";
import Transfer from "./components/transfer.js";
import Balance from "./components/balance.js";
import { TokenIdDropdown } from "./components/TokenIdDropdown.js";
import Register from "./components/register.js";

function Dashboard() {
  const { account } = useAccount();

  if (!account) {
    return <p>loading account info...</p>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="flex w-3/4 flex-col items-center justify-center gap-10 pb-4 lg:w-1/2">
        <TokenIdDropdown />
        {account?.address === account.address &&
          <>
            <Balance />
            <Register/>
            <Mint />
            <Transfer/>
          </>
        }
      </div>
    </div>
  );
}

export default Dashboard;
