import { useState } from "react";
import { Activity, AlertCircle, Check, Copy, Server, TrendingUp } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import type { Node } from "~~/types/monagraph";

interface NodeDetailPanelProps {
  node: Node | null;
}

export function NodeDetailPanel({ node }: NodeDetailPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (node?.endpoint) {
      navigator.clipboard.writeText(node.endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!node) {
    return (
      <Card className="p-6 bg-black/40 border-[#961DD3]/30 backdrop-blur-sm h-full flex items-center justify-center">
        <div className="text-center text-white/50">
          <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a node to view details</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-[#924BDD] bg-[#924BDD]/20";
      case "degraded":
        return "text-yellow-400 bg-yellow-400/20";
      case "down":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-white/50 bg-white/10";
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-[#961DD3]/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Server className="w-5 h-5 text-[#924BDD]" />
        <h2 className="text-xl font-semibold text-[#961DD3]">Node Details</h2>
      </div>

      {/* Node Header */}
      <div className="mb-6 pb-6 border-b border-[#961DD3]/20">
        <h3 className="text-lg font-semibold text-white mb-2">{node.name}</h3>
        <p className="text-white/50 text-sm mb-3">{node.region}</p>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(node.status)}`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
          {node.status.toUpperCase()}
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4 mb-6">
        {/* Latency */}
        <div className="bg-[#961DD3]/10 rounded-lg p-4 border border-[#961DD3]/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#924BDD]" />
            <span className="text-white/70 text-sm">Average Latency</span>
          </div>
          <div className="text-white text-2xl font-bold">
            {Math.round(node.latency)}
            <span className="text-sm text-white/50 ml-1 font-normal">ms</span>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-[#961DD3]/10 rounded-lg p-4 border border-[#961DD3]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#924BDD]" />
            <span className="text-white/70 text-sm">Uptime</span>
          </div>
          <div className="text-white text-2xl font-bold">
            {node.uptime}
            <span className="text-sm text-white/50 ml-1 font-normal">%</span>
          </div>
          <div className="mt-2 w-full bg-black/40 rounded-full h-2">
            <div className="bg-[#924BDD] h-2 rounded-full transition-all" style={{ width: `${node.uptime}%` }}></div>
          </div>
        </div>

        {/* Reputation */}
        <div className="bg-[#961DD3]/10 rounded-lg p-4 border border-[#961DD3]/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#924BDD] text-lg">★</span>
            <span className="text-white/70 text-sm">Reputation Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-white text-2xl font-bold">{node.reputation.toFixed(1)}</div>
            <div className="text-white/50 text-sm">/ 5.0</div>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`text-lg ${star <= Math.round(node.reputation) ? "text-[#924BDD]" : "text-white/20"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Failure Rate */}
        <div className="bg-[#961DD3]/10 rounded-lg p-4 border border-[#961DD3]/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#924BDD]" />
            <span className="text-white/70 text-sm">Failure Rate</span>
          </div>
          <div className="text-white text-2xl font-bold">
            {node.failureRate.toFixed(1)}
            <span className="text-sm text-white/50 ml-1 font-normal">%</span>
          </div>
        </div>
      </div>

      {/* Endpoint */}
      <div className="bg-black/40 rounded-lg p-4 border border-[#961DD3]/20">
        <p className="text-white/50 text-xs mb-2">RPC Endpoint</p>
        <div className="flex items-center gap-2">
          <code className="text-[#924BDD] text-sm flex-1 truncate">{node.endpoint}</code>
          <Button size="sm" variant="ghost" onClick={handleCopy} className="text-[#924BDD] hover:bg-[#961DD3]/20">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
