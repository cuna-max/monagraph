import { useEffect, useState } from "react";
import { BlockchainRace } from "./BlockchainRace";
import { Activity, Zap } from "lucide-react";
import { Card } from "~~/components/ui/card";
import type { Node } from "~~/types/monagraph";

interface LatencyMapProps {
  nodes: Node[];
  selectedNode: Node | null;
  onSelectNode: (node: Node) => void;
}

export function LatencyMap({ nodes, selectedNode, onSelectNode }: LatencyMapProps) {
  const [liveNodes, setLiveNodes] = useState(nodes);

  // Simulate real-time latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNodes(prev =>
        prev.map(node => ({
          ...node,
          latency: Math.max(20, node.latency + (Math.random() - 0.5) * 10),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // const getLatencyColor = (latency: number) => {
  //   if (latency < 50) return "#924BDD"; // Excellent
  //   if (latency < 100) return "#961DD3"; // Good
  //   if (latency < 150) return "#7A1AB8"; // Fair
  //   return "#5A1488"; // Poor
  // };

  return (
    <Card className="p-6 bg-black/40 border-[#961DD3]/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-[#924BDD]" />
        <h2 className="text-xl font-semibold text-[#961DD3]">Real-time Latency Map</h2>
        <div className="ml-auto flex items-center gap-2 text-sm text-white/60">
          <div className="w-2 h-2 bg-[#924BDD] rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      {/* Blockchain Race Animation */}
      <div className="mb-6">
        <BlockchainRace />
      </div>

      {/* Node Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {liveNodes.map(node => (
          <button
            key={node.id}
            onClick={() => onSelectNode(node)}
            className={`p-4 rounded-lg border transition-all text-left ${
              selectedNode?.id === node.id
                ? "bg-[#961DD3]/20 border-[#924BDD]"
                : "bg-black/20 border-[#961DD3]/20 hover:border-[#961DD3]/50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-white">{node.name}</h3>
                <p className="text-white/50 text-xs">{node.region}</p>
              </div>
              <div
                className={`px-2 py-1 rounded text-xs ${
                  node.latency < 50
                    ? "bg-[#924BDD]/30 text-[#924BDD]"
                    : node.latency < 100
                      ? "bg-[#961DD3]/30 text-[#961DD3]"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {Math.round(node.latency)}ms
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#924BDD]" />
                <span className="text-white/70">{node.uptime}% uptime</span>
              </div>
              <div className="text-white/50">★ {node.reputation.toFixed(1)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[#961DD3]/20">
        <div className="flex items-center gap-4 text-xs text-white/60 flex-wrap">
          <span>Latency Range:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#924BDD" }}></div>
            <span>{"<"}50ms</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#961DD3" }}></div>
            <span>50-100ms</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#7A1AB8" }}></div>
            <span>100-150ms</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#5A1488" }}></div>
            <span>{">"}150ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
