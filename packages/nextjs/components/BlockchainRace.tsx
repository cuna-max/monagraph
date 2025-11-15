import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface Chain {
  id: string;
  name: string;
  color: string;
  speed: number; // Lower is faster
  emoji: string;
  logo: string; // Path to logo image
  isMonad?: boolean;
}

const chains: Chain[] = [
  {
    id: "monad",
    name: "Monad",
    color: "#961DD3",
    speed: 25,
    emoji: "⚡",
    logo: "/assets/chain-logos/monad.svg",
    isMonad: true,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    color: "#627EEA",
    speed: 180,
    emoji: "💎",
    logo: "/assets/chain-logos/ethereum.jpg",
  },
  {
    id: "solana",
    name: "Solana",
    color: "#14F195",
    speed: 65,
    emoji: "🔥",
    logo: "/assets/chain-logos/Solana_logo.png",
  },
  {
    id: "polygon",
    name: "Polygon",
    color: "#8247E5",
    speed: 95,
    emoji: "🟣",
    logo: "/assets/chain-logos/polygon.jpg",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    color: "#E84142",
    speed: 110,
    emoji: "🔺",
    logo: "/assets/chain-logos/avalanche.jpg",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    color: "#28A0F0",
    speed: 140,
    emoji: "🔷",
    logo: "/assets/chain-logos/arbitrum.jpg",
  },
];

export function BlockchainRace() {
  const [raceProgress, setRaceProgress] = useState<Record<string, number>>({});
  // const [raceStarted, setRaceStarted] = useState(false);

  useEffect(() => {
    // Initialize progress
    const initialProgress: Record<string, number> = {};
    chains.forEach(chain => {
      initialProgress[chain.id] = 0;
    });
    setRaceProgress(initialProgress);

    // Start race after a short delay
    // setTimeout(() => setRaceStarted(true), 500);

    // Update progress
    const interval = setInterval(() => {
      setRaceProgress(prev => {
        const newProgress = { ...prev };
        chains.forEach(chain => {
          // Monad is consistently fastest
          const baseSpeed = chain.isMonad ? 3.5 : (200 - chain.speed) / 100;
          const randomFactor = chain.isMonad ? 1 : 0.8 + Math.random() * 0.4;
          newProgress[chain.id] = Math.min(100, (prev[chain.id] || 0) + baseSpeed * randomFactor);
        });
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const sortedChains = [...chains].sort((a, b) => {
    return (raceProgress[b.id] || 0) - (raceProgress[a.id] || 0);
  });

  return (
    <div className="space-y-6">
      {/* Race Title */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white/90 mb-2">Blockchain Speed Race</h3>
        <p className="text-white/50 text-sm">Real-time latency comparison</p>
      </div>

      {/* Race Track */}
      <div className="relative space-y-4">
        {chains.map(chain => {
          const progress = raceProgress[chain.id] || 0;
          // const isWinning = sortedChains[0]?.id === chain.id && progress > 50;

          return (
            <div key={chain.id} className="relative">
              {/* Track */}
              <div
                className={`relative h-16 bg-black/40 rounded-lg border overflow-hidden ${
                  chain.isMonad ? "border-[#924BDD] shadow-[0_0_20px_rgba(146,75,221,0.3)]" : "border-white/10"
                }`}
              >
                {/* Progress Bar */}
                <motion.div
                  className="absolute inset-y-0 left-0 opacity-20"
                  style={{
                    backgroundColor: chain.color,
                    width: `${progress}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05 }}
                />

                {/* Chain Info */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image src={chain.logo} alt={chain.name} width={32} height={32} className="object-cover" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${chain.isMonad ? "text-[#924BDD]" : "text-white"}`}>
                      {chain.name}
                    </p>
                    <p className="text-xs text-white/50">{chain.speed}ms avg</p>
                  </div>
                </div>

                {/* Racing Icon */}
                <motion.div
                  className={`absolute top-1/2 -translate-y-1/2 z-20 ${chain.isMonad ? "scale-125" : "scale-100"}`}
                  style={{
                    left: `${Math.max(2, Math.min(95, progress))}%`,
                  }}
                  initial={{ left: "2%" }}
                  animate={{
                    left: `${Math.max(2, Math.min(95, progress))}%`,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: "linear",
                  }}
                >
                  <div className={`relative ${chain.isMonad ? "animate-pulse" : ""}`}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg"
                      style={{
                        backgroundColor: chain.color,
                        borderColor: chain.isMonad ? "#924BDD" : chain.color,
                        boxShadow: chain.isMonad
                          ? `0 0 20px ${chain.color}, 0 0 40px ${chain.color}`
                          : `0 4px 8px rgba(0,0,0,0.3)`,
                      }}
                    >
                      {chain.isMonad && <Zap className="w-5 h-5 text-white" fill="white" />}
                    </div>
                    {chain.isMonad && progress < 100 && (
                      <motion.div
                        className="absolute -right-8 top-1/2 -translate-y-1/2"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                        }}
                      >
                        <div className="text-[#924BDD] text-xl">⚡</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Finish Line */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

                {/* Winner Badge */}
                {progress >= 100 && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        chain.isMonad ? "bg-[#924BDD] text-white" : "bg-white/20 text-white/70"
                      }`}
                    >
                      {chain.isMonad ? "🏆 Winner!" : "Finished"}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Position Indicator */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs text-white/60">
                {sortedChains.findIndex(c => c.id === chain.id) + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-[#961DD3]/20">
        {sortedChains.map((chain, index) => (
          <div
            key={chain.id}
            className={`p-3 rounded-lg border ${
              chain.isMonad ? "bg-[#961DD3]/20 border-[#924BDD]" : "bg-black/20 border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                <Image src={chain.logo} alt={chain.name} width={20} height={20} className="object-cover" />
              </div>
              <span className={`text-xs ${chain.isMonad ? "text-[#924BDD] font-medium" : "text-white/70"}`}>
                {chain.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${chain.isMonad ? "text-[#924BDD]" : "text-white"}`}>
                {chain.speed}
              </span>
              <span className="text-xs text-white/50">ms</span>
            </div>
            {index === 0 && chain.isMonad && <div className="text-[#924BDD] text-xs mt-1">⚡ Fastest</div>}
          </div>
        ))}
      </div>

      {/* Monad Highlight */}
      <div className="bg-gradient-to-r from-[#961DD3]/20 to-[#924BDD]/20 rounded-lg p-4 border border-[#924BDD]/50">
        <div className="flex items-start gap-3">
          <div className="text-3xl">⚡</div>
          <div>
            <h4 className="text-base font-semibold text-[#924BDD] mb-1">Why Monad is Faster</h4>
            <p className="text-white/70 text-sm">
              Monad&apos;s parallel execution and optimized consensus deliver{" "}
              {Math.round(chains[1].speed / chains[0].speed)}x faster transaction speeds compared to traditional
              blockchains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
