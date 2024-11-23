import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Edit2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { ErrorApiRes } from '@/types/all';
import { useToast } from '@/components/hooks/use-toast';
import { Link } from 'react-router-dom';
import { serviceIds } from '@/utils/contants';

interface Question {
  question: string;
  image?: string;
  options: string[];
  correct: string;
  chosen: string;
}

interface Quiz {
  _id: string;
  name: string;
  description: string;
  duration: number;
  questionNumber: number;
  subjects: string[];
  isSubjectTest: boolean;
  services: string[];
  questions: Question[];
}

const ManageQuiz = () => {
  const [activeTab, setActiveTab] = useState("neet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  const { toast } = useToast();
  const serviceId = activeTab === "neet" ? serviceIds.neet : serviceIds.jee

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`quiz/get-quizes-all?serviceId=${serviceId}`);
        setQuizzes(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorApiRes>
        setError(axiosError.response?.data.message ||'Failed to fetch quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [activeTab, serviceId]);

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return;

    try {
      setQuizzes(quizzes.filter(quiz => quiz._id !== deleteQuizId));
      const response = await axiosInstance.delete(`quiz/get-quiz/${deleteQuizId}`)
      toast({
        title : "Success",
        description : response.data.message || "Quiz deleted successfully",
      })
    } catch (err) {
      const axiosError = err as AxiosError<ErrorApiRes>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to delete quiz. Please try again later.",
      })
    } finally {
      setDeleteQuizId(null);
    }
  };

  const QuizCard = ({ quiz }: { quiz: Quiz }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-card-foreground">{quiz.name}</h3>
        <div className="flex space-x-2">
          <Link to={`/admin/add-quiz/${quiz._id}`}>
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeleteQuizId(quiz._id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {quiz.duration} minutes
        </span>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Questions: {quiz.questionNumber}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {quiz.subjects.map((subject, index) => (
          <Badge key={index} variant="secondary">
            {subject}
          </Badge>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 pt-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Quizzes</h1>
        <Link to="/admin/add-quiz">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Quiz
        </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="neet">NEET</TabsTrigger>
          <TabsTrigger value="jee">JEE</TabsTrigger>
        </TabsList>

        {error ? (
          <div className="flex items-center justify-center p-8 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-6 w-6 text-destructive mr-2" />
            <p className="text-destructive">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="neet" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jee" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz
              and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuiz}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageQuiz;