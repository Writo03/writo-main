import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Book, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import TestStartPopup from "./PopUp";
import axiosInstance from "@/utils/axiosInstance";

interface TestSeries {
  id: string;
  name: string;
  description: string;
  subjects: string;
  duration: string;
  questionNumber: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface TestSeriesPageProps {
  pageTitle?: string;
  pageDescription?: string;
}

export default function TestSeriesList({
  pageTitle = "Available Test Series",
  pageDescription = "Explore our comprehensive range of test series to boost your exam preparation",
}: TestSeriesPageProps) {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isOpen, setIsOpen] = useState(false);
  const [testDetails, setTestDetails] = useState<TestSeries>();
  const onClose = () => setIsOpen(false);
  const onConfirm = () => {
    setIsOpen(false);
    window.location.href = `/test`;
  };

  const handdleStartTest = (test: TestSeries) => {
    setIsOpen(true);
    setTestDetails(test);
  }

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const response = await axiosInstance(
          "/quiz/get-quizes?isSubjectTest=true&serviceId=673440f8f547c1a59e6d2a78",
        );
        if (!response.data) {
          throw new Error("Failed to fetch test series");
        }
        const data = await response.data;
        setTestSeries(data.data);
      } catch (err) {
        setError("Failed to load test series. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeries();
  }, []);

  const filteredTestSeries = testSeries.filter(
    (series) =>
      series.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (subjectFilter === "all" || series.subjects === subjectFilter),
  );

  const pageCount = Math.ceil(filteredTestSeries.length / itemsPerPage);
  const paginatedTestSeries = filteredTestSeries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const subjects = Array.from(
    new Set(testSeries.map((series) => series.subjects)),
  );

  const getDifficultyColor = (difficulty: TestSeries["difficulty"]) => {
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 pt-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {pageTitle}
        </h1>
        <p className="mb-8 text-center text-xl text-gray-500">
          {pageDescription}
        </p>

        <div className="mb-8 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search test series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {paginatedTestSeries.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex h-64 flex-col items-center justify-center">
              <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
              <p className="text-xl font-semibold text-gray-700">
                No test series found
              </p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedTestSeries.map((series) => (
              <Card key={series.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{series.name}</CardTitle>
                  <CardDescription>{series.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="secondary">{series.subjects}</Badge>
                    <Badge className={getDifficultyColor(series.difficulty)}>
                      {series.difficulty}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{series.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Book className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{series.questionNumber} questions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button asChild onClick={()=>handdleStartTest(series)}>
                    {/* <Link to={`/test-series/${series.id}`}>Start Test</Link> */}
                    {/* <Link to="/test">Start Test</Link> */}
                    <span>Start Test</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
    <TestStartPopup isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} testDetails={testDetails} />
    </>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
