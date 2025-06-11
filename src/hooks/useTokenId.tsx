import { create } from "zustand";
import { persist } from "zustand/middleware";

type TokenIdStore = {
  tokenIds: string[];
  activeTokenId: string | undefined;
  addTokenId: (tokenId: string) => void;
  setActiveTokenId: (tokenId: string) => void;
};

export const useTokenIds = create<TokenIdStore>()(
  persist(
    (set, get) => ({
      tokenIds: [] as string[],
      activeTokenId: undefined,
      addTokenId: (tokenId: string) => {
        const tokenIds = get().tokenIds;
        set({
          tokenIds: [...tokenIds, tokenId],
          activeTokenId: tokenId,
        });
      },
      setActiveTokenId: (tokenId: string) => {
        const tokenIds = get().tokenIds;
        if (!tokenIds.includes(tokenId)) {
          throw new Error(`tokenId ${tokenId} not in tokenIds`);
        }
        set({
          activeTokenId: tokenId,
        });
      },
    }),
    {
      name: "tokenId-storage",
    },
  ),
);
