export type GoogleGenerativeAIModel =
  | "gemini-3-pro-preview"
  | "gemini-3-pro-image-preview"
  | "gemini-3-flash-preview"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-preview-09-2025"
  | "gemini-2.5-flash-image"
  | "gemini-2.5-flash-native-audio-preview-12-2025"
  | "gemini-2.5-flash-native-audio-preview-09-2025"
  | "gemini-2.5-flash-preview-tts"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-lite-preview-09-2025"
  | "gemini-2.5-pro"
  | "gemini-2.5-pro-preview-tts"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-001"
  | "gemini-2.0-flash-exp"
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-flash-lite-001";

export const AVAILABLE_MODELS = [
  // Gemini 3
  "gemini-3-pro-preview",
  "gemini-3-pro-image-preview",
  "gemini-3-flash-preview",

  // Gemini 2.5 Flash
  "gemini-2.5-flash",
  "gemini-2.5-flash-preview-09-2025",
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-native-audio-preview-12-2025",
  "gemini-2.5-flash-native-audio-preview-09-2025",
  "gemini-2.5-flash-preview-tts",

  // Gemini 2.5 Flash Lite
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-lite-preview-09-2025",

  // Gemini 2.5 Pro
  "gemini-2.5-pro",
  "gemini-2.5-pro-preview-tts",

  // Deprecated (still usable for now)
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
];

const newModels = [
  "gemini-1.5-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-2",
  "gemini-2.5",
  "gemini-3",
];
