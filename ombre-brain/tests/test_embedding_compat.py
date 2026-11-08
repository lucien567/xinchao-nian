import json
import struct
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from embedding_codec import decode_stored_embedding


class StoredEmbeddingCompatibilityTest(unittest.TestCase):
    def test_reads_current_json_vector(self):
        self.assertEqual(
            decode_stored_embedding(json.dumps([0.25, -0.5, 1.0])),
            [0.25, -0.5, 1.0],
        )

    def test_reads_legacy_little_endian_float32_blob(self):
        vector = [0.25, -0.5, 1.0]
        blob = struct.pack("<3f", *vector)
        self.assertEqual(decode_stored_embedding(blob), vector)

    def test_rejects_truncated_blob(self):
        with self.assertRaisesRegex(ValueError, "multiple of four"):
            decode_stored_embedding(b"bad")


if __name__ == "__main__":
    unittest.main()
