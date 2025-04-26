import { useTokenIds } from '../hooks/useTokenId';

export const TokenIdDropdown = () => {
  const { tokenIds, activeTokenId, setActiveTokenId } = useTokenIds();

  if (tokenIds.length === 0) return;

  return (
    <div className="relative">
      <select
        value={activeTokenId || ''}
        onChange={(e) => setActiveTokenId(e.target.value)}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>
          Select a Token ID
        </option>
        {tokenIds.map((tokenId) => (
          <option key={tokenId} value={tokenId}>
            {tokenId}
          </option>
        ))}
      </select>
    </div>
  );
}; 