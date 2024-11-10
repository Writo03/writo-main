export interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: number;
  title: string;
  duration: number;
  questions: Question[];
}