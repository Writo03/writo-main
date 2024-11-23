import { X, Clock, Book, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestStartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testDetails?: {
    id: string;
    name: string;
    description: string;
    subjects: string;
    duration: string;
    questionNumber: number;
    difficulty: "Easy" | "Medium" | "Hard";
  };
}

export default function TestStartPopup({
  isOpen,
  onClose,
  onConfirm,
  testDetails,
}: TestStartPopupProps) {
  if (!isOpen) return null;
  if (!testDetails) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="text-3xl font-bold text-purple-800">
            {testDetails.name}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {testDetails.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-700">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{testDetails.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-indigo-700">
              <Book className="h-5 w-5" />
              <span className="font-semibold">
                {testDetails.questionNumber} Questions
              </span>
            </div>
            <Badge
              className={`${getDifficultyColor(testDetails.difficulty)} px-3 py-1 text-sm font-medium`}
            >
              {testDetails.difficulty}
            </Badge>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-inner">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Before you begin:
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet place to take the test</li>
              <li>Keep necessary materials (pen, paper) handy</li>
              <li>Once started, the test timer cannot be paused</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between rounded-b-lg bg-gradient-to-r from-purple-100 to-indigo-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Cancel
          </Button>
          <Button
            onClick={()=>{onConfirm(testDetails)}}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
