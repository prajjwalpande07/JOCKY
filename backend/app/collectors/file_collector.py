import math
import hashlib
from pathlib import Path
from typing import Dict, Any, List

class FileCollector:
    """Safe forensic file metadata, entropy and hash collector."""

    @staticmethod
    def calculate_entropy(data: bytes) -> float:
        if not data:
            return 0.0
        entropy = 0.0
        length = len(data)
        freq = {}
        for byte in data:
            freq[byte] = freq.get(byte, 0) + 1
        for count in freq.values():
            p_x = count / length
            if p_x > 0:
                entropy -= p_x * math.log2(p_x)
        return round(entropy, 2)

    @staticmethod
    def collect_file_metadata(file_path: str) -> Dict[str, Any]:
        p = Path(file_path)
        if not p.is_file():
            return {"error": "File not found", "path": file_path}

        sha256 = hashlib.sha256()
        sample_bytes = b""
        stat = p.stat()
        try:
            with open(p, "rb") as f:
                # read first 1MB for entropy sample
                sample_bytes = f.read(1024 * 1024)
                sha256.update(sample_bytes)
                while chunk := f.read(65536):
                    sha256.update(chunk)
            
            entropy = FileCollector.calculate_entropy(sample_bytes)
            return {
                "name": p.name,
                "path": str(p.resolve()),
                "size": f"{round(stat.st_size / 1024, 1)} KB",
                "size_bytes": stat.st_size,
                "sha256": sha256.hexdigest(),
                "type": p.suffix.upper().replace(".", "") or "FILE",
                "entropy": entropy,
                "risk": "critical" if entropy > 7.2 else "clean"
            }
        except Exception as e:
            return {"error": str(e), "path": file_path}
