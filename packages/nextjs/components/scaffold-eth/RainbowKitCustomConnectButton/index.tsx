"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Balance } from "@scaffold-ui/components";
import { Address } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="px-4 py-1.5 rounded-lg font-medium transition-all text-sm
                      bg-gradient-to-r from-[#961DD3] to-[#924BDD] 
                      hover:from-[#A31EE8] hover:to-[#A356E8]
                      text-white shadow-lg shadow-[#961DD3]/50
                      hover:shadow-xl hover:shadow-[#961DD3]/70
                      border border-[#961DD3]/50"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex items-center gap-2.5 bg-black/40 border border-[#961DD3]/30 rounded-lg px-3 py-1.5">
                    <div className="flex flex-col items-start min-w-0">
                      <Balance
                        address={account.address as Address}
                        style={{
                          minHeight: "0",
                          height: "auto",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#fff",
                          lineHeight: "1.2",
                        }}
                      />
                      <span className="text-[0.65rem] font-medium whitespace-nowrap" style={{ color: networkColor }}>
                        {chain.name}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-[#961DD3]/30" />
                    <AddressInfoDropdown
                      address={account.address as Address}
                      displayName={account.displayName}
                      ensAvatar={account.ensAvatar}
                      blockExplorerAddressLink={blockExplorerAddressLink}
                    />
                  </div>
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
