export type ResultCategory =
  | 'document'
  | 'image'
  | 'presentation'
  | 'video'
  | 'audio'
  | 'code'
  | 'data'
  | 'other';

export type ReviewStatus = 'good' | 'could_improve' | 'needs_improvement';

export interface PromptElements {
  context: string;
  role: string;
  audience: string;
  format: string;
  task: string;
}

export interface PromMaruResponse {
  status: 'question' | 'draft';
  questions: string[];
  prompt_en: string;
  prompt_ko: string;
  review_status: ReviewStatus;
  review: string;
  elements: PromptElements;
}

export type EditMode = 'create' | 'refine' | 'partial';
export type EditTarget = 'Context' | 'Role' | 'Audience' | 'Format' | 'Task' | 'none';

export interface PromptHistoryItem {
  id: string;
  createdAt: number;
  topic: string;
  category: ResultCategory;
  resultType: string;
  targetAi: string;
  resultLanguage: string;
  promptEn: string;
  promptKo: string;
  reviewStatus: ReviewStatus;
  review: string;
  elements: PromptElements;
  tags?: string[];
}

export interface TargetAIOption {
  id: string;
  name: string;
  category: ResultCategory | 'all';
  description: string;
  url?: string;
  badge?: string;
  recommendedFor?: string;
}
