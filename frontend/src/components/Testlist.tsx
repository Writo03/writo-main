import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Book, 
  Clock, 
  BarChart, 
  ArrowRight
} from "lucide-react";

import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
  } from "@/components/ui/accordion";
interface Test {
  _id: string;
  quizName: string;
  createdAt: string;
  score?: number;
  totalQuestions?: number;
  subject?: string;
}

const TestList: React.FC = () => { 
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axiosInstance.get("/result/all-testsresult");
        if (response.status === 200) {
          const sortedTests = response.data.data.sort((a: Test, b: Test) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setTests(sortedTests);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTestClick = (testId: string) => {
    navigate(`/test/quizresult/${testId}`);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Book className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No tests taken yet. Start your learning journey!
            </p>
            <Button onClick={() => navigate('/tests')}>
              Take a Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <Card>
          <CardHeader className="py-4">
            <AccordionTrigger>
              <CardTitle className="flex items-center ">
                <Book className="w-6 h-6 mr-2 text-primary" />
                Your Tests
              </CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent>
              <motion.div initial="hidden" animate="visible" className="space-y-4">
                {tests.map((test) => (
                  <motion.div
                    key={test._id}
                    variants={itemVariants}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleTestClick(test._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Book className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {test.quizName || "Unnamed Test"}
                            {test.subject && (
                              <span className="text-muted-foreground text-sm ml-2">
                                ({test.subject})
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                          </div>
                          {test.score !== undefined && test.totalQuestions !== undefined && (
                            <div className="flex items-center space-x-1">
                              <BarChart className="w-4 h-4" />
                              <span>
                                {test.score}/{test.totalQuestions}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
  
};

export default TestList;