export type QuizCategory =
  | "programming"
  | "database"
  | "network"
  | "security"
  | "cloud"
  | "algorithm"
  | "web"
  | "mobile"
  | "devops"
  | "general";

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  category: QuizCategory;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  selected_answer: number;
  is_correct: boolean;
  answered_at: string;
}
