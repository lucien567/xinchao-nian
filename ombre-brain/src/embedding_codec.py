"""Compatibility decoding for vectors already stored in embeddings.db."""

import json
import struct


def decode_stored_embedding(value: object) -> list[float]:
    """Read current JSON vectors and legacy little-endian float32 BLOBs."""
    if isinstance(value, (bytes, bytearray, memoryview)):
        payload = bytes(value)
        if not payload or len(payload) % 4:
            raise ValueError("embedding BLOB length is not a multiple of four")
        return list(struct.unpack(f"<{len(payload) // 4}f", payload))
    decoded = json.loads(value)  # type: ignore[arg-type]
    if not isinstance(decoded, list):
        raise TypeError(f"embedding is {type(decoded).__name__}, not list")
    return [float(item) for item in decoded]
