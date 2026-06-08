from google import genai
from app.core.settings import settings
import json
import logging
from typing import Dict, Any


logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is missing from environment variables")

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )
        self.model = "gemini-2.5-flash"

    def _call_gemini_json(self, prompt: str) -> Dict[str, Any]:
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )

            text = response.text.strip()

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
            logger.error(f"Raw text: {text}")
            return {}
        except Exception as e:
            logger.exception("Gemini generation failed")
            return {}

    def generate_notes(self, transcript: str) -> dict:
        """
        Perform a multi-pass extraction on the transcript to build high-quality notes.
        Pass 1: Identify participants/speakers.
        Pass 2: Extract decisions.
        Pass 3: Extract action items (with owner, confidence, evidence).
        Pass 4: Extract deadlines and add to action items.
        Pass 5: Generate summary, risks, key takeaways, and open questions.
        """

        # Pass 1: Identify speakers
        pass1_prompt = f"""
You are an AI assistant. Analyze the transcript and return ONLY valid JSON identifying the participants/speakers.
Schema: {{"participants": ["string"]}}

Transcript:
{transcript}
"""
        pass1_res = self._call_gemini_json(pass1_prompt)
        participants = pass1_res.get("participants", [])

        # Pass 2: Extract decisions
        pass2_prompt = f"""
You are an AI assistant. Analyze the transcript and extract decisions.
Distinguish between consensus ("agreed") and suggestions ("proposed").
A decision is an agreement without an assigned owner.
Return ONLY valid JSON.
Schema: {{"decisions": [{{"decision": "string", "status": "agreed" | "proposed"}}]}}

Transcript:
{transcript}
"""
        pass2_res = self._call_gemini_json(pass2_prompt)
        decisions = pass2_res.get("decisions", [])

        # Pass 3: Extract action items
        pass3_prompt = f"""
You are an AI assistant. Extract action items/tasks from the transcript.
Rules for tasks:
1. Task = verb + owner + future action. No owner = not a task.
2. Look for explicit assignment language (e.g., "I'm going to ping you", "Can you", "You need to").
3. Assign a confidence score (0.0 to 1.0) to every task.
4. Provide the exact snippet from the transcript as 'evidence' (a list of strings).
Return ONLY valid JSON.
Schema: {{"action_items": [{{"task": "string", "owner": "string", "confidence": 0.0, "evidence": ["string"]}}]}}

Participants for context: {json.dumps(participants)}

Transcript:
{transcript}
"""
        pass3_res = self._call_gemini_json(pass3_prompt)
        action_items = pass3_res.get("action_items", [])

        # Pass 4: Extract deadlines for tasks
        # If no tasks, we can skip or just pass empty
        pass4_prompt = f"""
You are an AI assistant. Add deadlines to the extracted action items.
Extract mentioned deadlines (e.g., "Tuesday", "next week", "EOD") and assign a deadline_confidence score.
If no deadline is mentioned, return null (do not invent "TBD").
Return ONLY valid JSON.
Input Action Items: {json.dumps(action_items)}

Return the identical array of action items but with `due_date` and `deadline_confidence` fields added.
Schema: {{"action_items": [{{"task": "string", "owner": "string", "confidence": 0.0, "evidence": ["string"], "due_date": "string" | null, "deadline_confidence": 0.0 | null}}]}}

Transcript:
{transcript}
"""
        pass4_res = self._call_gemini_json(pass4_prompt)
        action_items_with_deadlines = pass4_res.get("action_items", action_items)

        # Pass 5: Generate summary, key takeaways, risks, and open questions
        pass5_prompt = f"""
You are an AI assistant. Analyze the transcript and extract the remaining context.
Generate a concise summary, key takeaways (top 5 facts useful for search), risks, and open questions.
Return ONLY valid JSON.
Schema:
{{
  "summary": "string",
  "key_takeaways": ["string"],
  "risks": ["string"],
  "open_questions": ["string"]
}}

Transcript:
{transcript}
"""
        pass5_res = self._call_gemini_json(pass5_prompt)

        # Combine all parts
        final_result = {
            "summary": pass5_res.get("summary", ""),
            "decisions": decisions,
            "action_items": action_items_with_deadlines,
            "risks": pass5_res.get("risks", []),
            "open_questions": pass5_res.get("open_questions", []),
            "key_takeaways": pass5_res.get("key_takeaways", []),
            "participants": participants,
            "confidence_score": 0.95  # Arbitrary top-level score, could be averaged from tasks
        }

        return final_result
