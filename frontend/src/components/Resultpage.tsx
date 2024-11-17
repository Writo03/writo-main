import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { Clock, Award, Check, X } from "lucide-react";
import axiosInstance from '@/utils/axiosInstance';
import { Button } from './ui/button';

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

const QuizResultPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axiosInstance.get(`/result/get-result/${quizId}`);
        setResult(response.data.data[0]);
        // console.log(response)
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch result');
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
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
              <p className="text-xl">No result found for this quiz.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scorePercentage = (result.score / result.questions.length) * 100;
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Award className="text-blue-500 w-8 h-8" />
                <span className="text-2xl font-bold text-blue-600">{result.score}/{result.questions.length}</span>
              </div>
              <p className="text-sm text-gray-600">Score</p>
              {/* <Progress className="mt-2" value={scorePercentage} /> */}
            </div>

            {/* Time Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-purple-500 w-8 h-8" />
                <span className="text-2xl font-bold text-purple-600">{formatTime(result.timeTaken)}</span>
              </div>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>

            {/* Date Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-500 text-lg">Completed</span>
              </div>
              <p className="text-sm text-gray-600">{new Date(result.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">{new Date(result.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result.questions.map((question, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  <span className="font-semibold text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium mb-4">{question.question}</p>
                  
                  {question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className={`p-4 rounded-lg ${
                      question.chosen === question.correct 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="text-sm text-gray-600 mb-2">Your Answer</p>
                      <div className="flex items-center gap-2">
                        {question.chosen === question.correct 
                          ? <Check className="w-5 h-5 text-green-500" />
                          : <X className="w-5 h-5 text-red-500" />
                        }
                        <p className="font-medium">{question.chosen || 'Not Answered'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-gray-600 mb-2">Correct Answer</p>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <p className="font-medium">{question.correct}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          <Button onClick={()=>{
            navigate(`/leaderboard/${quizId}`)
          }} className='mx-auto' size="xl">
      LeaderBoard      
      </Button>
      </div>
    
    </div>
  );
};

export default QuizResultPage;