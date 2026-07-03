-- Schema for Misinformation Detector

CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255),
    platform VARCHAR(100),
    url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES posts(id),
    claim_text TEXT NOT NULL,
    subject VARCHAR(255),
    relation VARCHAR(255),
    object VARCHAR(255),
    confidence DOUBLE PRECISION DEFAULT 0.0,
    embedding DOUBLE PRECISION ARRAY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_results (
    claim_id VARCHAR(255) PRIMARY KEY,
    truth_score DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_verdict CHECK (verdict IN ('TRUE', 'FALSE', 'SUSPICIOUS', 'UNVERIFIABLE'))
);

CREATE TABLE IF NOT EXISTS evidence_matches (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(255) NOT NULL REFERENCES verification_results(claim_id),
    source VARCHAR(255),
    url TEXT,
    snippet TEXT,
    similarity_score DOUBLE PRECISION DEFAULT 0.0,
    entailment VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS flagged_posts (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255),
    platform VARCHAR(100),
    truth_score DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    flagged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_flagged_verdict CHECK (verdict IN ('TRUE', 'FALSE', 'SUSPICIOUS', 'UNVERIFIABLE'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_claims_post_id ON claims(post_id);
CREATE INDEX IF NOT EXISTS idx_verification_verdict ON verification_results(verdict);
CREATE INDEX IF NOT EXISTS idx_flagged_verdict ON flagged_posts(verdict);
CREATE INDEX IF NOT EXISTS idx_flagged_flagged_at ON flagged_posts(flagged_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_claim_id ON evidence_matches(claim_id);
CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts(timestamp DESC);
