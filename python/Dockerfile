FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt ./
RUN pip install --user grpcio-tools
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY misinfo.proto ./
COPY claim_extractor/ ./claim_extractor/
COPY verifier/ ./verifier/
COPY generate_proto.py ./
RUN python generate_proto.py
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000 50051 50052
CMD ["python", "-m", "uvicorn", "claim_extractor.server:app", "--host", "0.0.0.0", "--port", "8000"]
