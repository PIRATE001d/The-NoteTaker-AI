import subprocess
import os
import tempfile
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

WHISPER_CMD = os.getenv("WHISPER_CMD")
MODEL_PATH = os.getenv("WHISPER_MODEL")


class AudioProcessor:
    def __init__(self):
        if not WHISPER_CMD or not MODEL_PATH:
            raise ValueError("WHISPER_CMD or WHISPER_MODEL not set in environment")
        self.whisper_cmd = WHISPER_CMD
        self.model_path = MODEL_PATH

    def transcribe_chunk(self, audio_bytes: bytes) -> str:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(audio_bytes)
            temp_path = tmp.name

        try:
            result = subprocess.run(
                [
                    self.whisper_cmd,
                    "-m", self.model_path,
                    "-f", temp_path,
                    "-nt",
                    "--language", "en",
                ],
                capture_output=True,
                text=True,
                timeout=60,
            )
            transcript = result.stdout.strip()
            
            lines = transcript.split('\n')
            filtered_lines = []
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                if line.startswith('whisper_'):
                    continue
                if 'main:' in line and 'processing' in line:
                    continue
                if 'read_audio_data:' in line:
                    continue
                if line.startswith('system_info:'):
                    continue
                filtered_lines.append(line)
            
            clean_transcript = ' '.join(filtered_lines).strip()
            
            if len(clean_transcript) < 3:
                return ""
            
            words = clean_transcript.lower().split()
            if len(words) <= 2 and len(set(words)) == 1:
                return ""
            
            noise_patterns = ['you you', 'you.', 'you', 'thank you', 'thanks', 'the end']
            if clean_transcript.lower() in noise_patterns:
                return ""
            
            return clean_transcript
        except subprocess.TimeoutExpired:
            logger.warning("Whisper timed out on audio chunk")
            return ""
        except Exception as e:
            logger.error(f"Whisper chunk transcription failed: {e}")
            return ""
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
