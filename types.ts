

export interface VocabWord {
  id: number;
  word: string;
  ipa: string;
  meaning: string;
}

export interface DialogueLine {
  id: number;
  speaker: 'Mai' | 'Nam' | 'Trung';
  text: string;
  translation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
  options: string[]; // For multiple choice if needed, or simple text check
  correctFeedback: string;
}

export interface FillBlankData {
  fullText: string;
  translation: string; // Added translation
  segments: {
    id: number;
    text: string;
    isBlank: boolean;
    correctWord?: string;
  }[];
  wordBank: string[];
}

export interface GameTarget {
  id: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100 from top
  width: number; // px - determines visual size
  height: number; // px - determines visual size
  value: number; // score value
  solved: boolean;
  visible: boolean;
}

export interface AssessmentQuestion {
  id: number;
  part: 1 | 2; // 1 = Vocab, 2 = Grammar/Sentences
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface BubbleQuestion {
  id: number;
  question: string;
  correct: string;
  wrong: string[];
}

export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

export interface WheelQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// New Interface for Interaction Room
export interface ClassComment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: number;
  isTeacher?: boolean;
}

export enum GameSection {
  HOME = 'HOME',
  VOCAB = 'VOCAB',
  DIALOGUE = 'DIALOGUE',
  GAME_ZONE = 'GAME_ZONE',
  FILL_BLANK = 'FILL_BLANK',
  ASSESSMENT = 'ASSESSMENT',
  INTERACTION_ROOM = 'INTERACTION_ROOM',
  ADMIN_PANEL = 'ADMIN_PANEL', // New Admin Section
}