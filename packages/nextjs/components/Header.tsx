import { Zap } from "lucide-react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export function Header() {
  return (
    <header className="border-b border-[#961DD3]/20 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-2 text-[#961DD3] shrink-0">
              <Zap className="w-6 h-6" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#961DD3] tracking-tight">Monagraph</h1>
              <p className="text-xs text-white/70 tracking-tight hidden sm:block">Where Blocks Meet Speed</p>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center shrink-0">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
        <p className="mt-2 text-xs text-white/60 tracking-tight">
          내가 쓰는 RPC가 얼마나 빠른지, 안정적인지 시각화한다.
        </p>
      </div>
    </header>
  );
}
