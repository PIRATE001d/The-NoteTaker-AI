from google import genai
from app.core.settings import settings
import json
import logging


logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is missing from environment variables")

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate_notes(self, transcript: str) -> dict:
        """
        Generate structured notes from a transcript.
        """

        prompt = f"""
You are The Noter AI.

Analyze the following transcript and extract:

1. Summary
2. Action Items
3. Decisions

Return ONLY valid JSON.

Schema:

{{
  "summary": "string",
  "tasks": [
    {{
      "task": "string",
      "owner": "string",
      "due_date": "string"
    }}
  ],
  "decisions": [
    "string"
  ]
}}

Transcript:

{transcript}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            text = response.text.strip()

            # Remove markdown code blocks if Gemini returns them
            if text.startswith("```json"):
                text = text.replace("```json", "", 1)

            if text.startswith("```"):
                text = text.replace("```", "", 1)

            if text.endswith("```"):
                text = text[:-3]

            text = text.strip()

            return json.loads(text)

        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")

            return {
                "summary": "Failed to parse Gemini response",
                "tasks": [],
                "decisions": []
            }

        except Exception as e:
            logger.exception("Gemini generation failed")

            return {
                "summary": f"Gemini error: {str(e)}",
                "tasks": [],
                "decisions": []
            }