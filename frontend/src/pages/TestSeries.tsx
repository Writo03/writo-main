import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizTimer from '../components/quiz/QuizTimer';
import SubmitModal from '../components/quiz/SubmitModal';
import { Quiz } from '../types/quiz';

const mockQuiz: Quiz = {
  id: 1,
  title: 'Mathematics Practice Test',
  duration: 30,
  questions: [
    {
      id: 1,
      text: 'What is the value of π (pi) to two decimal places?',
      options: ['3.14', '3.16', '3.12', '3.18'],
      correctAnswer: 0,
    },
    {
      id: 2,
      text: 'Solve the equation: 2x + 5 = 13',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500',
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 3'],
      correctAnswer: 0,
    },
  ],
};

export const TestSeries = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(mockQuiz.questions.length).fill(-1)
  );
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = answers.reduce((acc, answer, index) => {
      return answer === mockQuiz.questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    navigate('/leaderboard', { state: { score } });
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{mockQuiz.title}</h1>
              <QuizTimer duration={mockQuiz.duration} onTimeUp={handleTimeUp} />
            </div>
          </div>

          <QuestionCard
            question={mockQuiz.questions[currentQuestion]}
            currentIndex={currentQuestion}
            totalQuestions={mockQuiz.questions.length}
            selectedAnswer={answers[currentQuestion]}
            onAnswerSelect={handleAnswer}
          />

          <div className="p-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestion === mockQuiz.questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirmSubmit && (
        <SubmitModal
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmSubmit(false)}
        />
      )}
    </div>
  );
};

export default TestSeries;