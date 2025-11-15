import { RpcLatencyMonitor, assertSuccessfulSnapshot } from "./monitor";
import type { LatencySnapshot, RpcLatencyProbe } from "./types";
import { PublicClient, createPublicClient, http } from "viem";

export interface BlockTimestampClockSource {
  readonly endpoint: string;
  fetchLatestBlockTimestamp(): Promise<number>;
}

export class ViemPublicClientClockSource implements BlockTimestampClockSource {
  constructor(
    private readonly client: PublicClient,
    private readonly rpcEndpoint: string,
  ) {}

  public get endpoint(): string {
    return this.rpcEndpoint;
  }

  public async fetchLatestBlockTimestamp(): Promise<number> {
    const block = await this.client.getBlock({ blockTag: "latest" });

    if (block.timestamp == null) {
      throw new Error("Block timestamp unavailable");
    }

    return Number(block.timestamp);
  }
}

export class MonadRpcLatencyProbe implements RpcLatencyProbe {
  constructor(
    private readonly clockSource: BlockTimestampClockSource,
    public readonly network: string = "monad-testnet",
  ) {}

  public get endpoint(): string {
    return this.clockSource.endpoint;
  }

  public async measure(): Promise<LatencySnapshot> {
    const capturedAt = Date.now();

    try {
      const blockTimestamp = await this.clockSource.fetchLatestBlockTimestamp();
      const nowSeconds = capturedAt / 1000;
      const latencyMs = Math.max(0, Math.round((nowSeconds - blockTimestamp) * 1000));

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

export const createMonadRpcLatencyMonitor = (
  endpoint: string,
  network: string = "monad-testnet",
): RpcLatencyMonitor => {
  const client = createPublicClient({
    transport: http(endpoint),
  });
  const clockSource = new ViemPublicClientClockSource(client, endpoint);
  const probe = new MonadRpcLatencyProbe(clockSource, network);

  return new RpcLatencyMonitor(probe);
};

export const getMonadBlockLatency = async (endpoint: string = "https://testnet-rpc.monad.xyz"): Promise<number> => {
  const monitor = createMonadRpcLatencyMonitor(endpoint);
  const snapshot = await monitor.measure();
  const successSnapshot = assertSuccessfulSnapshot(snapshot);

  return successSnapshot.latencyMs;
};
