export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  provider?: string;
  responseTime?: number;
  attachments?: Attachment[];
  reactions?: Reaction[];
  isStreaming?: boolean;
  metadata?: MessageMetadata;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code' | 'url';
  url: string;
  size?: number;
  mimeType?: string;
  preview?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface MessageMetadata {
  model?: string;
  tokensUsed?: number;
  cost?: number;
  confidence?: number;
  sources?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  tags: string[];
  shared?: boolean;
  shareId?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  models: AIModel[];
  capabilities: AICapability[];
  isActive: boolean;
  apiKey?: string;
  settings?: Record<string, any>;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  capabilities: AICapability[];
}

export type AICapability = 
  | 'text-generation'
  | 'image-analysis'
  | 'code-execution'
  | 'file-analysis'
  | 'web-search'
  | 'real-time-data'
  | 'function-calling';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  tags: string[];
  variables: PromptVariable[];
}

export interface PromptVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  defaultValue?: string | number;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  category: ExtensionCategory;
  settings?: Record<string, any>;
  commands: ExtensionCommand[];
}

export type ExtensionCategory = 
  | 'productivity'
  | 'development'
  | 'research'
  | 'creativity'
  | 'analysis'
  | 'utilities';

export interface ExtensionCommand {
  id: string;
  name: string;
  description: string;
  trigger: string;
  parameters?: CommandParameter[];
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file';
  required: boolean;
  description: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showLineNumbers: boolean;
  autoSave: boolean;
  streamingEnabled: boolean;
  soundEnabled: boolean;
  defaultModel: string;
  defaultProvider: string;
  shortcuts: Record<string, string>;
}

export interface SearchResult {
  conversation: Conversation;
  message: Message;
  score: number;
  highlights: string[];
}

export interface AIResponse {
  message: string;
  usage?: {
    tokens: number;
    cost?: number;
  };
  provider: string;
  model?: string;
  confidence?: number;
  sources?: string[];
  metadata?: Record<string, any>;
  isQuotaExceeded?: boolean;
}

export interface StreamingResponse {
  text: string;
  isComplete: boolean;
  usage?: {
    tokens: number;
  };
  metadata?: Record<string, any>;
}

export interface CodeBlock {
  language: string;
  code: string;
  executable?: boolean;
  output?: string;
  error?: string;
}

export interface ShareSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  expiresAt?: Date;
  password?: string;
}