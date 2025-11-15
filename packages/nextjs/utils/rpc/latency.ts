import { Connection } from "@solana/web3.js";

export type LatencySnapshot =
  | {
      status: "success";
      latencyMs: number;
      network: string;
      endpoint: string;
      capturedAt: number;
    }
  | {
      status: "error";
      error: string;
      network: string;
      endpoint: string;
      capturedAt: number;
    };

export interface RpcLatencyProbe {
  readonly network: string;
  readonly endpoint: string;
  measure(): Promise<LatencySnapshot>;
}

export class RpcLatencyMonitor {
  constructor(private readonly probe: RpcLatencyProbe) {}

  public measure(): Promise<LatencySnapshot> {
    return this.probe.measure();
  }
}

export interface SolanaClockSource {
  readonly endpoint: string;
  fetchLatestSlot(): Promise<number>;
  fetchBlockTime(slot: number): Promise<number | null>;
}

export class SolanaConnectionClockSource implements SolanaClockSource {
  constructor(private readonly connection: Connection) {}

  public get endpoint(): string {
    return this.connection.rpcEndpoint;
  }

  public fetchLatestSlot(): Promise<number> {
    return this.connection.getSlot();
  }

  public fetchBlockTime(slot: number): Promise<number | null> {
    return this.connection.getBlockTime(slot);
  }
}

export class SolanaRpcLatencyProbe implements RpcLatencyProbe {
  constructor(
    private readonly clockSource: SolanaClockSource,
    public readonly network: string = "solana-mainnet",
  ) {}

  public get endpoint(): string {
    return this.clockSource.endpoint;
  }

  public async measure(): Promise<LatencySnapshot> {
    const capturedAt = Date.now();

    try {
      const slot = await this.clockSource.fetchLatestSlot();
      const blockTime = await this.clockSource.fetchBlockTime(slot);

      if (blockTime == null) {
        return this.createErrorSnapshot("Unable to fetch block time", capturedAt);
      }

      const nowSeconds = capturedAt / 1000;
      const latencyMs = Math.max(0, Math.round((nowSeconds - blockTime) * 1000));

      return {
        status: "success",
        latencyMs,
        network: this.network,
        endpoint: this.endpoint,
        capturedAt,
      };
    } catch (error) {
      return this.createErrorSnapshot(error instanceof Error ? error.message : "Unknown error", capturedAt);
    }
  }

  private createErrorSnapshot(error: string, capturedAt: number): LatencySnapshot {
    return {
      status: "error",
      error,
      network: this.network,
      endpoint: this.endpoint,
      capturedAt,
    };
  }
}

export const createSolanaRpcLatencyMonitor = (
  endpoint: string,
  network: string = "solana-mainnet",
): RpcLatencyMonitor => {
  const connection = new Connection(endpoint);
  const clockSource = new SolanaConnectionClockSource(connection);
  const probe = new SolanaRpcLatencyProbe(clockSource, network);

  return new RpcLatencyMonitor(probe);
};

export const getSolanaSlotLatency = async (
  endpoint: string = "https://api.mainnet-beta.solana.com",
): Promise<number> => {
  const monitor = createSolanaRpcLatencyMonitor(endpoint);
  const snapshot = await monitor.measure();

  if (snapshot.status === "error") {
    throw new Error(`[Solana RPC Latency] ${snapshot.error}`);
  }

  return snapshot.latencyMs;
};
