"use client";

import { useState } from "react";
// import { LatencyMap } from "~~/components/LatencyMap";
import { BlockchainRace } from "~~/components/BlockchainRace";
import { FeedbackPanel } from "~~/components/FeedbackPanel";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { NodeDetailPanel } from "~~/components/NodeDetailPanel";
import type { Node } from "~~/types/monagraph";

// import { mockNodes } from "~~/data/mockData";

const Home = () => {
  const [selectedNode] = useState<Node | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Blockchain Race */}
        <section className="mb-12">
          <BlockchainRace />
        </section>

        {/* Node Detail Panel */}
        {selectedNode && (
          <section className="mb-12">
            <NodeDetailPanel node={selectedNode} />
          </section>
        )}

        {/* Feedback Panel */}
        <section className="mb-12">
          <FeedbackPanel node={selectedNode} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
