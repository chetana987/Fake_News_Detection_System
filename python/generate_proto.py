import os
import subprocess

PROTO_DIR = os.path.dirname(os.path.abspath(__file__))
PROTO_FILE = os.path.join(PROTO_DIR, "misinfo.proto")

subprocess.run([
    "python", "-m", "grpc_tools.protoc",
    f"--proto_path={PROTO_DIR}",
    f"--python_out={PROTO_DIR}",
    f"--grpc_python_out={PROTO_DIR}",
    PROTO_FILE
], check=True)

print("gRPC stubs generated successfully.")
