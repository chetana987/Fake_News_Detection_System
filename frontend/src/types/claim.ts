export type Verdict = 'TRUE' | 'FALSE' | 'SUSPICIOUS' | 'UNVERIFIABLE';

export interface Claim {
  id: string;
  claimText: string;
  postId: string;
  subject?: string;
  relation?: string;
  object?: string;
  confidence: number;
  truthScore?: number;
  verdict?: Verdict;
  platform?: string;
  author?: string;
  text?: string;
  flaggedAt?: string;
  verifiedAt?: string;
  timestamp?: string;
  evidenceMatches?: EvidenceMatch[];
}

export interface EvidenceMatch {
  source: string;
  url: string;
  snippet: string;
  similarityScore: number;
  entailment: string;
}

export interface FlaggedPost {
  id: string;
  text: string;
  author?: string;
  platform?: string;
  truthScore: number;
  confidence: number;
  verdict: Verdict;
  flaggedAt: string;
}
