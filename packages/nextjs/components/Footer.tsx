import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#961DD3]/20 bg-black/20 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Zap className="w-4 h-4 text-[#924BDD]" fill="currentColor" />
            <span>Powered by Monad Testnet</span>
          </div>

          <div className="text-white/40 text-xs text-center">
            <p>지연을 데이터로 해결하고, 인프라 경쟁을 유도한다.</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/50">
            <a href="#" className="hover:text-[#924BDD] transition-colors">
              API Docs
            </a>
            <a href="#" className="hover:text-[#924BDD] transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-[#924BDD] transition-colors">
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
