# Voice: TTS & STT

> Multi-provider text-to-speech and speech-to-text tools — OpenAI TTS, ElevenLabs, Whisper STT, and local Ollama.

---

## Overview

AgentOS includes a **provider-agnostic speech runtime** that decouples voice capabilities from any single vendor. Two callable tools — `text_to_speech` and `speech_to_text` — let agents synthesize audio and transcribe recordings as part of normal tool-calling turns. No special voice mode required.

The runtime auto-detects which providers are available from your environment variables and selects the best one. You can also pin a specific provider per call.

**Provider priority (TTS):** `OPENAI_API_KEY` > `ELEVENLABS_API_KEY` > Ollama (local fallback)

**Provider priority (STT):** `OPENAI_API_KEY` (Whisper)

---

## Architecture

```
┌──────────────────────────────────────────────┐
│             SpeechRuntime                    │
│        (provider registry + session mgmt)    │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌─────────────────┐
│ TTS      │ │ STT      │ │ VAD             │
│ Providers│ │ Providers│ │ Providers       │
└──────────┘ └──────────┘ └─────────────────┘
       │          │
       ▼          ▼
┌──────────────────────────────────────────────┐
│       voice-synthesis Extension Pack         │
│  ┌──────────────────┐ ┌───────────────────┐  │
│  │ text_to_speech   │ │ speech_to_text    │  │
│  │ (ITool)          │ │ (ITool)           │  │
│  └──────────────────┘ └───────────────────┘  │
└──────────────────────────────────────────────┘
```

The speech runtime (`packages/agentos/src/speech/`) manages provider registration and session lifecycle. The `voice-synthesis` extension pack wraps the runtime into two `ITool` implementations that any agent can call during conversation.

| Layer | Responsibility |
|-------|---------------|
| `SpeechRuntime` | Provider registry, auto-registration from env, session creation |
| `SpeechProviderRegistry` | Stores TTS, STT, VAD, and wake-word providers by ID |
| `TextToSpeechTool` | ITool wrapper — resolves provider, calls synthesis, returns base64 audio |
| `SpeechToTextTool` | ITool wrapper — resolves provider, calls transcription, returns text |
| `voice-synthesis` extension pack | Bundles both tools with config from env/secrets |

---

## The `text_to_speech` Tool

Converts text to speech audio. Returns base64-encoded audio that can be played, saved, or streamed to a client.

### Input Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | yes | Text to convert. Max 5,000 characters. |
| `voice` | string | no | Voice name or ID (see provider tables below). |
| `model` | string | no | TTS model identifier. |
| `provider` | `"openai"` \| `"elevenlabs"` \| `"ollama"` \| `"auto"` | no | Provider override. Default: `"auto"`. |
| `speed` | number | no | OpenAI speed multiplier (0.25 - 4.0). |
| `stability` | number | no | ElevenLabs voice stability (0 - 1). |
| `similarity_boost` | number | no | ElevenLabs similarity boost (0 - 1). |
| `format` | `"mp3"` \| `"opus"` \| `"aac"` \| `"flac"` \| `"wav"` | no | Output audio format. |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `audioBase64` | string | Base64-encoded audio payload |
| `contentType` | string | MIME type (`audio/mpeg`, `audio/opus`, etc.) |
| `voice` | string | Voice used |
| `model` | string | Model used |
| `provider` | string | Provider that handled the request |
| `durationEstimateMs` | number | Estimated audio duration |

### Voice Options by Provider

**OpenAI TTS** (`tts-1`, `tts-1-hd`):

| Voice | Default |
|-------|---------|
| `alloy` | |
| `echo` | |
| `fable` | |
| `onyx` | |
| `nova` | yes |
| `shimmer` | |

**ElevenLabs** (`eleven_monolingual_v1`, `eleven_multilingual_v2`):

| Voice | ID |
|-------|-----|
| `rachel` (default) | `21m00Tcm4TlvDq8ikWAM` |
| `domi` | `AZnzlk1XvdvUeBnXmlld` |
| `bella` | `EXAVITQu4vr4xnSDxMaL` |
| `antoni` | `ErXwobaYiN019PkySvjV` |
| `josh` | `TxGEqnHWrfWFTfGW9XjX` |
| `arnold` | `VR6AewLTigWG4xSOukaG` |
| `adam` | `pNInz6obpgDQGcFmaJgB` |
| `sam` | `yoZ06aMxZJJ28mfd3POQ` |

You can also pass a custom ElevenLabs voice ID directly as the `voice` parameter.

**Ollama** (local, experimental): Uses the OpenAI-compatible `/v1/audio/speech` endpoint. Requires a TTS model loaded in Ollama.

---

## The `speech_to_text` Tool

Transcribes audio into text using OpenAI Whisper. Accepts base64-encoded audio or a fetchable URL.

### Input Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audioBase64` | string | one of these | Base64 audio or `data:audio/wav;base64,...` data URL |
| `audioUrl` | string | one of these | Fetchable URL for an audio file |
| `mimeType` | string | no | MIME type override (e.g., `audio/wav`) |
| `fileName` | string | no | File name hint for the transcription provider |
| `format` | string | no | Audio format hint: `wav`, `mp3`, `m4a`, `webm`, `mp4` |
| `provider` | `"auto"` \| `"openai"` | no | Default: `"auto"` |
| `model` | string | no | Transcription model. Default: `whisper-1` |
| `language` | string | no | ISO language hint (e.g., `en`, `es`) |
| `prompt` | string | no | Context prompt to bias transcription |
| `temperature` | number | no | Transcription temperature |
| `responseFormat` | `"json"` \| `"text"` \| `"srt"` \| `"verbose_json"` \| `"vtt"` | no | Response format |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Transcribed text |
| `language` | string | Detected language |
| `durationSeconds` | number | Audio duration |
| `provider` | string | Provider used |
| `model` | string | Model used |
| `segments` | array | Segment metadata (when `verbose_json` format) |

---

## Provider Auto-Detection

When `provider` is `"auto"` (the default), the tools check environment variables in priority order:

**TTS resolution:**

```
1. OPENAI_API_KEY set?    → use OpenAI TTS
2. ELEVENLABS_API_KEY set? → use ElevenLabs
3. Neither?                → try Ollama at localhost:11434
```

**STT resolution:**

```
1. OPENAI_API_KEY set? → use OpenAI Whisper
2. Not set?            → error (no local STT tool yet)
```

You can override with the `provider` parameter on any call, or set a global default via the `TTS_PROVIDER` environment variable.

---

## Code Examples

### Direct Tool Usage

```typescript
import { TextToSpeechTool, SpeechToTextTool } from '@framers/agentos-ext-voice-synthesis';

// TTS — synthesize speech
const tts = new TextToSpeechTool();
const result = await tts.execute(
  { text: 'Hello from AgentOS', voice: 'nova', model: 'tts-1-hd' },
  { gmiId: 'example' }
);

if (result.success) {
  const audioBuffer = Buffer.from(result.output.audioBase64, 'base64');
  // Write to file, stream to client, etc.
}

// STT — transcribe audio
const stt = new SpeechToTextTool();
const transcript = await stt.execute(
  { audioUrl: 'https://example.com/recording.wav', language: 'en' },
  { gmiId: 'example' }
);

if (transcript.success) {
  console.log(transcript.output.text);
}
```

### Via the Extension Pack

The `voice-synthesis` extension pack registers both tools automatically and resolves API keys from secrets or environment variables.

```typescript
import { createExtensionPack } from '@framers/agentos-ext-voice-synthesis';

const pack = createExtensionPack({
  options: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    defaultProvider: 'auto',
  },
  getSecret: (key) => secrets.get(key),
  logger: console,
});

// pack.descriptors contains both tools ready for registration
for (const descriptor of pack.descriptors) {
  toolOrchestrator.registerTool(descriptor.payload);
}
```

### With Explicit Provider Override

```typescript
const tts = new TextToSpeechTool({
  elevenLabsApiKey: 'xi-...',
  defaultProvider: 'elevenlabs',
});

const result = await tts.execute({
  text: 'This uses ElevenLabs regardless of other keys',
  voice: 'bella',
  model: 'eleven_multilingual_v2',
  stability: 0.7,
  similarity_boost: 0.8,
}, { gmiId: 'example' });
```

### Agent Calling TTS in Conversation

When registered as a tool, agents call `text_to_speech` naturally:

```
User: Read this paragraph aloud in a calm voice.
Agent: [calls text_to_speech with { text: "...", voice: "nova" }]
Agent: Here is the audio. [returns base64 audio to client]
```

---

## Configuration

### Environment Variables

```bash
# Provider API keys — auto-detection uses these
OPENAI_API_KEY=sk-...              # OpenAI TTS + Whisper STT
ELEVENLABS_API_KEY=xi-...          # ElevenLabs TTS

# Optional overrides
TTS_PROVIDER=openai                # Force default TTS provider (openai|elevenlabs|ollama)
OPENAI_TTS_DEFAULT_MODEL=tts-1    # Override OpenAI TTS model
OPENAI_TTS_DEFAULT_VOICE=nova     # Override OpenAI default voice
OPENAI_BASE_URL=https://...       # Custom OpenAI-compatible endpoint
ELEVENLABS_TTS_MODEL=eleven_multilingual_v2  # Override ElevenLabs model
ELEVENLABS_VOICE_ID=custom-id     # Override ElevenLabs voice
OLLAMA_BASE_URL=http://localhost:11434       # Ollama endpoint
WHISPER_MODEL_DEFAULT=whisper-1    # Override Whisper model
```

### Extension Manifest

The `voice-synthesis` extension pack is defined in `manifest.json`:

```json
{
  "id": "com.framers.media.voice-synthesis",
  "extensions": [
    { "kind": "tool", "id": "text_to_speech" },
    { "kind": "tool", "id": "speech_to_text" }
  ],
  "configuration": {
    "properties": {
      "openai.apiKey": { "type": "string", "secret": true },
      "elevenlabs.apiKey": { "type": "string", "secret": true },
      "ollama.baseUrl": { "type": "string" },
      "tts.defaultProvider": {
        "type": "string",
        "enum": ["auto", "openai", "elevenlabs", "ollama"]
      },
      "stt.defaultProvider": {
        "type": "string",
        "enum": ["auto", "openai"]
      }
    }
  }
}
```

---

## Speech Runtime (Lower Level)

For applications that need direct access to the provider registry, sessions, and streaming — bypass the tools and use `SpeechRuntime` directly.

```typescript
import { createSpeechRuntime } from '@framers/agentos/speech';

const runtime = createSpeechRuntime({
  autoRegisterFromEnv: true,
  preferredTtsProviderId: 'elevenlabs',
});

// Create a session with resolved providers
const session = runtime.createSession({
  mode: 'vad',
  autoTranscribeOnSpeechEnd: true,
});

// Synthesize directly
const ttsProvider = runtime.getProviderRegistry().getTtsProvider('openai-tts');
const audio = await ttsProvider.synthesize('Hello', { voice: 'nova', model: 'tts-1' });

// List all registered providers
const providers = runtime.listProviders();
// → [{ id: 'openai-tts', kind: 'tts', registered: true }, ...]
```

The runtime resolves default providers in this order:

| Kind | Resolution Order |
|------|-----------------|
| TTS | Preferred > `openai-tts` > `elevenlabs` > first registered |
| STT | Preferred > `openai-whisper` > first registered |
| VAD | `agentos-adaptive-vad` > first registered |

---

## Source Files

| File | Export |
|------|--------|
| `packages/agentos/src/speech/SpeechRuntime.ts` | `SpeechRuntime`, `createSpeechRuntime` |
| `packages/agentos/src/speech/types.ts` | All speech types and interfaces |
| `packages/agentos/src/speech/SpeechProviderRegistry.ts` | `SpeechProviderRegistry` |
| `packages/agentos/src/speech/SpeechSession.ts` | `SpeechSession` |
| `packages/agentos/src/speech/providerCatalog.ts` | `SPEECH_PROVIDER_CATALOG`, query helpers |
| `packages/agentos/src/speech/providers/OpenAITextToSpeechProvider.ts` | `OpenAITextToSpeechProvider` |
| `packages/agentos/src/speech/providers/OpenAIWhisperSpeechToTextProvider.ts` | `OpenAIWhisperSpeechToTextProvider` |
| `packages/agentos/src/speech/providers/ElevenLabsTextToSpeechProvider.ts` | `ElevenLabsTextToSpeechProvider` |
| `packages/agentos-extensions/.../voice-synthesis/src/tools/textToSpeech.ts` | `TextToSpeechTool` |
| `packages/agentos-extensions/.../voice-synthesis/src/tools/speechToText.ts` | `SpeechToTextTool` |
| `packages/agentos-extensions/.../voice-synthesis/src/index.ts` | `createExtensionPack` |
