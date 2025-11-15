import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import { getAddress } from "viem";
import { Address } from "viem";
import { useAccount, useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useCopyToClipboard, useOutsideClick } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import { isENS } from "~~/utils/scaffold-eth/common";

const BURNER_WALLET_ID = "burnerWallet";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const { connector } = useAccount();
  const checkSumAddress = getAddress(address);

  const { copyToClipboard: copyAddressToClipboard, isCopiedToClipboard: isAddressCopiedToClipboard } =
    useCopyToClipboard();
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };

  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className="relative">
        <summary className="flex items-center gap-1.5 cursor-pointer list-none hover:opacity-80 transition-opacity">
          <BlockieAvatar address={checkSumAddress} size={24} ensImage={ensAvatar} />
          <span className="text-xs font-medium text-white">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-white/60" />
        </summary>
        <ul className="absolute right-0 mt-2 w-52 bg-black/95 border border-[#961DD3]/30 rounded-lg shadow-xl shadow-[#961DD3]/20 backdrop-blur-md overflow-hidden z-50">
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? "hidden" : ""}>
            <div
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/90 hover:bg-[#961DD3]/20 cursor-pointer transition-colors"
              onClick={() => copyAddressToClipboard(checkSumAddress)}
            >
              {isAddressCopiedToClipboard ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 text-green-400" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Copy address</span>
                </>
              )}
            </div>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <label
              htmlFor="qrcode-modal"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/90 hover:bg-[#961DD3]/20 cursor-pointer transition-colors"
            >
              <QrCodeIcon className="h-4 w-4" />
              <span>View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <a
              target="_blank"
              href={blockExplorerAddressLink}
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/90 hover:bg-[#961DD3]/20 cursor-pointer transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              <span>View on Block Explorer</span>
            </a>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/90 hover:bg-[#961DD3]/20 cursor-pointer transition-colors"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
                <span>Switch Network</span>
              </button>
            </li>
          ) : null}
          {connector?.id === BURNER_WALLET_ID ? (
            <li>
              <label
                htmlFor="reveal-burner-pk-modal"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-[#961DD3]/20 cursor-pointer transition-colors"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Reveal Private Key</span>
              </label>
            </li>
          ) : null}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-[#961DD3]/20 cursor-pointer transition-colors border-t border-[#961DD3]/20"
              type="button"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};
