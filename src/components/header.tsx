import { shortenAddress } from "@puzzlehq/sdk";

function Header({ address }: { address: string | undefined }) {
  return (
    <div className="fixed top-0 flex h-16 w-full items-center justify-between border-b bg-[#ffffff] px-8 dark:bg-[#242424]">
      <span className="text-3xl font-bold">HoZK College Tour</span>
      {address && <span className="text-m">{shortenAddress(address)}</span>}
    </div>
  );
}

export default Header;
