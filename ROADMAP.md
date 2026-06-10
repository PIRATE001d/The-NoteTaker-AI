# The Noter AI - Roadmap

## Completed
- [x] Live streaming transcription via WebSocket
- [x] Real-time audio capture from browser tab
- [x] Web Speech API for mic input ("thinking out loud")
- [x] Auto-stop after 45 seconds of silence
- [x] Gemini AI processing for summaries, tasks, decisions
- [x] Noise filtering for Whisper transcripts

## In Progress
- [ ] Premium UI/UX redesign

## Future Enhancements

### P0 - High Priority

#### Chrome Extension
- Auto-detect meeting URLs (meet.google.com, zoom.us, teams.microsoft.com)
- One-click start recording from any meeting
- Background operation without keeping tab open
- Tab capture API for cleaner audio extraction
- Publish to Chrome Web Store

#### Speaker Diarization
- Separate "You" (mic) vs "Meeting" (tab) speakers in transcript
- Visual distinction in UI with different colors/labels
- Speaker identification labels in final transcript
- Merge overlapping speech segments intelligently

#### Background Processing
- Move Whisper execution to async/background tasks
- Use FastAPI BackgroundTasks or Celery
- Queue system for multiple concurrent sessions
- Progress callbacks via WebSocket
- Reduce API blocking time from 20-40s to instant response

#### Progress UI
- Real-time transcription progress indicator
- Audio level visualization during recording
- Chunk processing status (e.g., "Processing chunk 5/20")
- Estimated time remaining
- Better loading states for Gemini processing

### P1 - Medium Priority

#### Enhanced Gemini Integration
- Streaming Gemini responses (show summary as it generates)
- Better prompting for action items with owners/deadlines
- JSON schema validation with retry logic
- Confidence scores for extracted data

#### Session Management
- Session history page with search
- Export transcripts (TXT, PDF, Markdown)
- Share session links
- Session tags/categories

#### Database Improvements
- Vector embeddings for semantic search
- Speaker diarization storage
- Session metadata (duration, participant count)
- Alembic migrations setup

### P2 - Nice to Have

#### Multi-Platform Support
- Firefox extension
- Safari extension
- Desktop app (Electron/Tauri)
- Mobile app (React Native)

#### Advanced Features
- Real-time translation
- Meeting calendar integration
- Automated meeting summaries via email
- Integration with project management tools (Jira, Asana, Linear)
- Voice commands ("Hey Noter, save this")

#### Analytics
- Meeting duration trends
- Most common action items
- Speech patterns analysis
- Engagement metrics

## Technical Debt
- [ ] Replace ScriptProcessorNode with AudioWorkletNode
- [ ] Add comprehensive error boundaries
- [ ] Unit tests for hooks and services
- [ ] E2E tests for live session flow
- [ ] Add Alembic migrations (currently using create_all)
- [ ] Implement proper FK constraints in database
- [ ] Add authentication/authorization

## Known Issues
- Web Speech API requires internet connection (Chrome only)
- Whisper runs synchronously (blocks during transcription)
- No retry logic for failed Gemini calls
- Session status polling could be replaced with WebSocket updates
