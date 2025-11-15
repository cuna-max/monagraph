export interface Node {
  id: string;
  name: string;
  region: string;
  latency: number;
  uptime: number;
  reputation: number;
  endpoint: string;
  status: "healthy" | "degraded" | "down";
  failureRate: number;
}

export interface Feedback {
  id: string;
  nodeId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: Date;
}
