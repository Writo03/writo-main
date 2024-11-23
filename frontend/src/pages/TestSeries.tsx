import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizTimer from '../components/quiz/QuizTimer';
import SubmitModal from '../components/quiz/SubmitModal';
import axiosInstance from '@/utils/axiosInstance';
import Loading from '@/components/ui/Loading';

// Types and interfaces
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  name: string;
  duration: number;
  questions: Question[];
}

type AnswerStatus = 'answered' | 'unanswered';

interface ApiResponse {
  data: {
    data: Quiz;
  };
}

export const TestSeries: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(quiz?.duration  || 0);


  useEffect(() => {
    const fetchQuiz = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get<ApiResponse>(`/quiz/get-quiz/${quizId}`);
        const fetchedQuiz = response.data.data;
        setQuiz(fetchedQuiz);
        setAnswers(new Array(fetchedQuiz.questions.length).fill(-1));
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswer = (optionIndex: number): void => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = (): void => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!quiz) return;
  
    // const submittedQuestions = quiz.questions.map((question, index) => ({
    //   ...question, // Spread all properties of the question
    //   chosen: answers[index], // Add the user's chosen answer
    // }));
    
    const submittedQuestions = quiz.questions.map((question, index) => {
      const answerIndex = answers[index];
      const chosenAnswer = answerIndex === -1 ? "" : String.fromCharCode(65 + answerIndex); // Convert to A, B, C, D
  
      return {
       ...question,
        chosen: chosenAnswer, // Store the user's chosen answer
      }
    });
    const requestBody = {
      quizId: quiz._id,
      questions: submittedQuestions,
      timeTaken: quiz.duration *60 - remainingTime,
    };
  
    try {
      const response = await axiosInstance.post('/result/submit-test', requestBody);
      const resultId=response.data.data._id
      navigate(`quizresult/${resultId}`);
    } catch (error) {
      console.error('Error submitting test:', error.response?.data || error.message);
    }
  };
  

  const handleTimeUp = (): void => {
    handleSubmit();
  };

  const getAnswerStatus = (index: number): AnswerStatus => {
    if (answers[index] === -1) return 'unanswered';
    return 'answered';
  };

  if (!quiz) {
    return <Loading />;
  }

  const QuestionOverview = () => (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Overview</h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestion(index);
                setIsSidebarOpen(false);
              }}
              className={`
                aspect-square flex items-center justify-center rounded-lg 
                text-sm font-medium transition-all duration-200
                ${index === currentQuestion 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : getAnswerStatus(index) === 'answered'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* <div className="mt-auto">
        <QuizTimer 
          duration={quiz.duration} 
          onTimeUp={handleTimeUp}
        />
      </div> */}
    </div>
  );

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between text-gray-900 p-4">
          <h1 className="text-lg font-semibold ">{quiz.name}</h1>
          <QuizTimer  duration={quiz.duration} onTimeUp={handleTimeUp}   onTimeUpdate={setRemainingTime} />

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80 lg:border-l lg:border-gray-200">
          <div className="sticky top-0 p-6 h-screen overflow-y-auto">
            <QuestionOverview />
          </div>
        </div>

        {/* Mobile Sidebar Modal */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar Content */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Question Overview</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <QuestionOverview />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="hidden  justify-between items-center lg:flex bg-indigo-600 p-6">
                <h1 className="text-2xl font-bold text-white">{quiz.name}</h1>
                <QuizTimer duration={quiz.duration} onTimeUp={handleTimeUp} />
              </div>


              <div className="p-6">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      {getAnswerStatus(currentQuestion) === 'answered' ? 'Answered' : 'Not answered'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    {currentQuestionData.question}
                  </h3>
                      {/* Image Rendering */}
                    {currentQuestionData.image && (
                      <img
                        src={currentQuestionData.image}
                        alt="Question"
                        className="mt-4 rounded-lg max-h-64 mx-auto"
                      />
                    )}
                  <div className="space-y-4">
                    {currentQuestionData.options.map((option, index) => (
                      <label
                        key={index}
                        className={`
                          flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                          hover:bg-gray-50 transition-colors
                          ${answers[currentQuestion] === index ? 'bg-indigo-50 border border-indigo-200' : ''}
                        `}
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="question-option"
                            value={index}
                            checked={answers[currentQuestion] === index}
                            onChange={() => handleAnswer(index)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-700">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 flex justify-between items-center border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  Previous
                </button>
                
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
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