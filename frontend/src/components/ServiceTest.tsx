import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Loading from './ui/Loading';
import { useAppDispatch,useAppSelector } from '@/redux/hooks';
import { setSubscriptions } from '@/redux/subscriptions';


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
  services : string[]
  isForFree: boolean;
  isForMentors: boolean;
}

const ServiceTest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [isMentorQuiz, setIsMentorQuiz] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=> state.auth.user)
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions);
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get('/subscription/get-subscriptions?type=active');
      console.log(response)
      if (response.status === 200) {
        const serviceIds = response.data.data.map((subscription: { service: string }) => subscription.service);
        dispatch(setSubscriptions(serviceIds)); // Store only the IDs
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  // Fetch quiz details
  const fetchQuiz = async () => {
    try {
      const response = await axiosInstance.get(`/quiz/get-quiz/${quizId}`);
      const fetchedQuiz = response.data.data;
      setQuiz(fetchedQuiz);
      setIsFree(fetchedQuiz.isForFree);
      setIsMentorQuiz(fetchedQuiz.isForMentors);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSubscriptions(), fetchQuiz()]);
      setIsLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, quizId]); 

  useEffect(() => {
    if (isLoading || isFree || isMentorQuiz || user.isAdmin || user.isMentor) return;
    // Check if the user is subscribed to the required service
    const requiredServiceId = quiz?.services[0] as string; // JEE Service ID
    const hasMatchingService = subscriptions.includes(requiredServiceId);

    if (!hasMatchingService) {
      navigate('/'); // Redirect if the user is not subscribed
    }
  }, [isLoading, isFree, isMentorQuiz, subscriptions, navigate, quiz, user]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceTest;
