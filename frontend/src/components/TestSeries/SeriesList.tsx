import { useEffect, useState, useMemo } from "react";
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
import TestStartPopup from "./PopUp";
import useFetchTestSeries from "@/components/hooks/useFetchTestSeries";
import axiosInstance from "@/utils/axiosInstance";
import { idtoService } from "@/utils/contants";
import { useNavigate } from "react-router-dom";
// import { useToast } from '@/components/hooks/use-toast';

interface TestSeries {
  _id: string;
  name: string;
  description: string;
  subjects: string;
  duration: string;
  questionNumber: number;
  services: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

interface TestSeriesPageProps {
  pageTitle: string;
  pageDescription: string;
  serviceId: string;
}

export default function TestSeriesList({
  pageTitle,
  pageDescription,
  serviceId,
}: TestSeriesPageProps) {
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isSubjectTest, setIsSubjectTest] = useState(true);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    setIsSubjectTest(subjectFilter === "all");
    setIsFree(subjectFilter === "free");
  }, [subjectFilter]);

  const {
    testSeries_t: testSeries,
    loading_t: loading,
    error_t: error,
  } = useFetchTestSeries(isSubjectTest, isFree, serviceId);

  const filteredTestSeries = useMemo(() => {
    return testSeries.filter((test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [testSeries, searchTerm]);

  const paginatedTestSeries = useMemo(() => {
    return filteredTestSeries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredTestSeries, currentPage, itemsPerPage]);
  const pageCount = Math.ceil(filteredTestSeries.length / itemsPerPage);

  const [isOpen, setIsOpen] = useState(false);
  const [testDetails, setTestDetails] = useState<TestSeries>();
  const onClose = () => setIsOpen(false);

  const onConfirm = (test: TestSeries) => {
    const res = axiosInstance.get(
      "/subscription/get-subscriptions?type=active",
    );
    res
      .then((response) => {
        const data = response.data.data;
        let found = false;
        data.forEach((item: any) => {
          if (item.service === serviceId) {
            found = true;
            window.location.href = `/test/${test._id}`;
          }
        });
        if (!found) {
          const service =
            idtoService[test.services[0] as keyof typeof idtoService];
          window.location.href = "/test-series/details/" + service;
        }
      })
      .catch(console.error)
      .finally(() => setIsOpen(false));
  };

  const handdleStartTest = (test: TestSeries) => {
    setIsOpen(true);
    setTestDetails(test);
  };

  const navigate = useNavigate();
  // const { toast } = useToast();

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
          <CardFooter className="flex items-center justify-center space-x-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button onClick={() => navigate("/test-series")}>
              Go Back to Test Series
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Test Series of {pageTitle}
          </h1>
          <p className="mb-8 text-center text-xl text-gray-500">
            Explore our comprehensive range of test series to boost your{" "}
            {pageDescription} exam preparation
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
                <SelectItem value="all">Subjects</SelectItem>
                <SelectItem value="notall">Mock Test</SelectItem>
                <SelectItem value="free">Free</SelectItem>
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
                    <div className="mb-4 flex items-center justify-start space-x-2">
                      {series.subjects.map((subject:string) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                      {/* <Badge className={getDifficultyColor(series.difficulty)}>
                        {series.difficulty}
                      </Badge> */}
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
                    <Button asChild onClick={() => handdleStartTest(series)}>
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
      <TestStartPopup
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        testDetails={testDetails}
      />
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
