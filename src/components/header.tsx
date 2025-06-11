import { shortenAddress, useDisconnect } from "@puzzlehq/sdk";

function Header({ address }: { address: string | undefined }) {
  const { disconnect, loading } = useDisconnect();

  return (
    <div className="fixed top-0 flex h-16 w-full items-center justify-between border-b bg-[#ffffff] px-8 dark:bg-[#242424]">
      <span className="text-3xl font-bold">Build a token</span>
      {address && (
        <button onClick={disconnect} disabled={loading}>
          <span className="text-m">{shortenAddress(address)}</span>
        </button>
      )}
    </div>
  );
}

export default Header;
