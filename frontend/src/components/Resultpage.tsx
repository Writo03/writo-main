import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, Check, X, ChevronUp, ChevronDown, HelpCircle, BookOpen, Trophy, Timer } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from './ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  question: string;
  chosen: string;
  correct: string;
  image?: string;
}

interface Result {
  _id: string;
  score: number;
  timeTaken: number;
  createdAt: string;
  questions: Question[];
}

interface ExpandedState {
  [key: number]: boolean;
}

const QuizResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<ExpandedState>({});
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axiosInstance.get(`/result/get-resultbyid/${resultId}`);
        setQuizId(response.data.data[0].quiz)
        setResult(response.data.data[0]);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch result');
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPerformanceMessage = (scorePercentage: number): { message: string; color: string } => {
    if (scorePercentage >= 90) return { message: "Outstanding Performance!", color: "text-green-600" };
    if (scorePercentage >= 75) return { message: "Great Job!", color: "text-blue-600" };
    if (scorePercentage >= 60) return { message: "Good Effort!", color: "text-yellow-600" };
    return { message: "Keep Practicing!", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 animate-pulse">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-red-500 text-center">
              <X className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">Error</h2>
              <p className="mt-2">{error}</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-gray-500 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xl">No result found for this quiz.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Try Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scorePercentage = (result.score / (result.questions.length * 4)) * 100;
  const performanceData = getPerformanceMessage(scorePercentage);

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {performanceData.message}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Score Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="text-blue-500 w-8 h-8" />
                  <span className="text-2xl font-bold text-blue-600">
                    {result.score}/{result.questions.length * 4}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Score</p>
                <Progress 
                  className="mt-2" 
                  value={scorePercentage}
                  indicatorColor={scorePercentage >= 75 ? 'bg-green-500' : scorePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                />
                <p className="text-xs text-gray-500 mt-2">{scorePercentage.toFixed(1)}%</p>
              </motion.div>

              {/* Time Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <Timer className="text-purple-500 w-8 h-8" />
                  <span className="text-2xl font-bold text-purple-600">
                    {formatTime(result.timeTaken)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="text-xs text-gray-500 mt-2">
                  Average: {formatTime(Math.round(result.timeTaken / result.questions.length))} per question
                </p>
              </motion.div>

              {/* Date Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <Award className="text-green-500 w-8 h-8" />
                  <span className="text-lg font-bold text-green-600">Completed</span>
                </div>
                <p className="text-sm text-gray-600">{new Date(result.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">{new Date(result.createdAt).toLocaleTimeString()}</p>
              </motion.div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => setShowAnalysis(!showAnalysis)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
              </Button>
              <Button
                onClick={() => navigate(`/test/leaderboard/${quizId}`, { state: { scorePercentage } })}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                View Leaderboard
              </Button>
            </div>

            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <Alert className="bg-blue-50">
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Quick Analysis:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Correct Answers: {result.questions.filter(q => q.chosen === q.correct).length}</li>
                          <li>Not attempted: {result.questions.filter(q => q.chosen === "").length}</li>
                          <li>Incorrect Answers: {result.questions.filter(q => q.chosen !== q.correct).length-result.questions.filter(q => q.chosen === "").length}</li>
                          <li>Average Time per Question: {formatTime(Math.round(result.timeTaken / result.questions.length))}</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result.questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                      <span className="font-semibold text-gray-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleQuestion(index)}
                      >
                        <div dangerouslySetInnerHTML={{ __html: question.question }} className="mb-4" />

                        {expandedQuestions[index] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedQuestions[index] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {question.image && (
                              <img
                                src={question.image}
                                alt="Question"
                                className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4"
                              />
                            )}

                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const optionLabel = String.fromCharCode(65 + optionIndex);
                                const isCorrect = question.correct === optionLabel;
                                const isChosen = question.chosen === optionLabel;

                                return (
                                  <div
                                    key={optionIndex}
                                    className={`p-3 rounded-lg flex items-center gap-3 ${
                                      isCorrect
                                        ? "bg-green-50 border border-green-200"
                                        : isChosen
                                        ? "bg-red-50 border border-red-200"
                                        : "bg-gray-50 border border-gray-200"
                                    }`}
                                  >
                                    <span className="font-semibold">{optionLabel}:</span>
                                    <span dangerouslySetInnerHTML={{ __html: option }} />
                                    {isCorrect && (
                                      <Check className="w-5 h-5 text-green-500" title="Correct Answer" />
                                    )}
                                    {isChosen && !isCorrect && (
                                      <X className="w-5 h-5 text-red-500" title="Your Answer" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResultPage;