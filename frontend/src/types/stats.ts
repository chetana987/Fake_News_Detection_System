export interface DashboardStats {
  total: number;
  falseCount: number;
  suspiciousCount: number;
  trueCount: number;
  unverifiableCount?: number;
  avgTruthScore: number;
  avgConfidence?: number;
  avgLatency?: number;
}
