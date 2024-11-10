import React from 'react';
import { Question } from '../../types/quiz';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number;
  onAnswerSelect: (index: number) => void;
}

export const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <h2 className="text-xl font-semibold mt-2">{question.text}</h2>
        {question.imageUrl && (
          <img
            src={question.imageUrl}
            alt="Question"
            className="mt-4 rounded-lg max-h-64 mx-auto"
          />
        )}
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedAnswer === index
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-600'
            }`}
          >
            <span className="font-medium">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;