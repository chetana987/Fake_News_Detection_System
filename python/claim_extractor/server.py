import asyncio
import logging
import re
from concurrent.futures import ThreadPoolExecutor

import grpc
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import pipeline

import misinfo_pb2
import misinfo_pb2_grpc

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(title="Claim Extractor")

ner = pipeline("token-classification", model="dslim/bert-base-NER", aggregation_strategy="simple")
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


class ExtractClaimRequest(BaseModel):
    text: str


class ClaimEventResponse(BaseModel):
    post_id: str = ""
    claim_text: str
    subject: str = ""
    relation: str = ""
    object: str = ""
    confidence: float = 0.0


def extract_entities(text: str) -> dict:
    entities = ner(text)
    subject = ""
    obj = ""
    for e in entities:
        word = e["word"]
        if e["entity_group"] in ("PER", "ORG", "LOC"):
            if not subject:
                subject = word
            else:
                obj = word
    return {"subject": subject, "object": obj}


def extract_relation(text: str, subject: str, obj: str) -> str:
    if not subject:
        return ""
    pattern = re.escape(subject) + r"\s+(.+?)\s+" + re.escape(obj) if obj else re.escape(subject) + r"\s+(.+)"
    m = re.search(pattern, text, re.IGNORECASE)
    if m:
        words = m.group(1).split()[:5]
        return " ".join(words)
    verbs = re.findall(r"\b(is|was|are|were|has|have|said|claims|announced|confirmed|denied|revealed|admitted|called)\b", text, re.IGNORECASE)
    return verbs[0] if verbs else "related_to"


def extract_claim_from_text(text: str) -> dict:
    entities = extract_entities(text)
    subject = entities["subject"]
    obj = entities["object"]
    relation = extract_relation(text, subject, obj)
    embedding = embedder.encode(text).tolist()
    return {
        "claim_text": text,
        "subject": subject,
        "relation": relation,
        "object": obj,
        "embedding": embedding,
        "confidence": 0.95 if subject else 0.5,
    }


@app.get("/health")
async def health():
    return {"status": "ok", "service": "claim-extractor"}


@app.post("/extract-claim", response_model=ClaimEventResponse)
async def extract_claim_rest(req: ExtractClaimRequest):
    result = extract_claim_from_text(req.text)
    return ClaimEventResponse(**result)


class ClaimExtractorServicer(misinfo_pb2_grpc.ClaimExtractorServicer):
    def ExtractClaim(self, request, context):
        result = extract_claim_from_text(request.text)
        return misinfo_pb2.ClaimEvent(
            claim_text=result["claim_text"],
            subject=result["subject"],
            relation=result["relation"],
            object=result["object"],
            embedding=result["embedding"],
            confidence=result["confidence"],
        )


async def serve_grpc():
    server = grpc.aio.server(ThreadPoolExecutor(max_workers=4))
    misinfo_pb2_grpc.add_ClaimExtractorServicer_to_server(ClaimExtractorServicer(), server)
    server.add_insecure_port("[::]:50051")
    await server.start()
    log.info("gRPC server running on port 50051")
    await server.wait_for_termination()


async def main():
    grpc_task = asyncio.create_task(serve_grpc())
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
