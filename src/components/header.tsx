import { shortenAddress } from "@puzzlehq/sdk";

function Header({address}: {address: string | undefined}) {
  return (
    <div className='w-full fixed top-0 h-16 border-b flex justify-between items-center px-8 bg-[#ffffff] dark:bg-[#242424]'>
      <span className='text-3xl font-bold'>ZK Summit 10 Token</span>
      {address && <span className="text-m">
        {shortenAddress(address)}
      </span>}
    </div>
  );
}

export default Header;