import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { ErrorApiRes } from "@/types/all";
import axios, { AxiosError } from "axios";
import { formSchema } from "@/Schema/admin";

const SUBJECTS = ["Physics", "Chemistry", "Biology", "Mathematics"] as const;

const SERVICES = [
  { label: "NEET", value: "673440f8f547c1a59e6d2a78" },
  { label: "JEE", value: "jee" },
] as const;

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type FormData = z.infer<typeof formSchema>;

const QuizCreator = () => {
  const { quizId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      subjects: [],
      isSubjectTest: false,
      services: [],
      questions: [
        {
          question: "",
          image: "",
          options: ["", "", "", ""],
          correct: "A",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/quiz/get-quiz/${quizId}`);
        const data = response.data.data;
        setInitialData(data);
        form.reset(data);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorApiRes>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch quiz data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, form, toast]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let response;
      if (quizId) {
        response = await axiosInstance.patch(`/quiz/get-quiz/${quizId}`, data);
        console.log(data);
      } else {
        response = await axiosInstance.post(`/quiz/create-quiz`, data);
      }
      toast({
        title: "Success",
        description: response.data.message || `Quiz ${quizId ? "updated" : "created"} successfully`,
      });
      navigate("/admin/manage-quiz");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to save quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !initialData && quizId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-28">
      <Card className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {quizId ? "Edit Quiz" : "Create New Quiz"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Quiz Information Section */}
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter quiz description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <FormLabel>Subjects</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {SUBJECTS.map((subject) => (
                        <FormField
                          key={subject}
                          control={form.control}
                          name="subjects"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, subject]);
                                    } else {
                                      field.onChange(
                                        value.filter((val) => val !== subject),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {subject}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSubjectTest"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      This is a subject-specific test
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Services Selection */}
              <FormField
                control={form.control}
                name="services"
                render={() => (
                  <FormItem>
                    <FormLabel>Services</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {SERVICES.map((service) => (
                        <FormField
                          key={service.value}
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.value)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, service.value]);
                                    } else {
                                      field.onChange(
                                        value.filter(
                                          (val) => val !== service.value,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <h2 className="text-center text-xl font-semibold">Questions</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {fields.map((field, index) => (
                    <Button
                      key={field.id}
                      type="button"
                      variant={
                        currentQuestionIndex === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    append({
                      question: "",
                      image: "",
                      options: ["", "", "", ""],
                      correct: "A",
                    });
                    setCurrentQuestionIndex(fields.length);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {/* Dynamic Question Fields */}
              {fields.length > 0 && (
                <Card className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Question {currentQuestionIndex + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        remove(currentQuestionIndex)
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {/* Question Text */}
                    <FormField
                      key={`question-${currentQuestionIndex}`}
                      control={form.control}
                      name={`questions.${currentQuestionIndex}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Text</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Question Image URL */}
                    <FormField
                    key={`image-${currentQuestionIndex}`}
                      control={form.control}
                      name={`questions.${currentQuestionIndex}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Image</FormLabel>

                          {/* Image URL Input */}
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              placeholder="Enter image URL or upload below"
                            />
                          </FormControl>

                          {/* File Upload Option */}
                          <div className="mt-2">
                            <Input
                              type="file"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  setLoading(true);

                                  try {
                                    const formData = new FormData();
                                    formData.append("file", e.target.files[0]);
                                    formData.append(
                                      "upload_preset",
                                      "spx0jjqq",
                                    );

                                    const response = await axios.post(
                                      `https://api.cloudinary.com/v1_1/dlsxjstxo/image/upload`,
                                      formData,
                                    );
                                    field.onChange(response.data.secure_url);

                                    toast({
                                      title: "Success",
                                      description:
                                        "Image uploaded successfully",
                                    });
                                  } catch (error: any) {
                                    toast({
                                      title: "Error",
                                      description:
                                        error.response.data.error.message ||
                                        "Failed to upload image",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setLoading(false);
                                  }
                                }
                              }}
                              className="cursor-pointer file:mr-4 file:cursor-pointer file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-secondary/80"
                            />
                          </div>

                          {/* Preview Image if URL exists */}
                          {field.value && (
                            <div className="mt-2">
                              <img
                                src={field.value}
                                alt="Question preview"
                                className="h-auto max-w-[200px] rounded-md"
                              />
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((optionIndex) => (
                        <FormField
                          key={`option-${currentQuestionIndex}-${optionIndex}`}
                          control={form.control}
                          name={`questions.${currentQuestionIndex}.options.${optionIndex}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Option {OPTION_LETTERS[optionIndex]}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    {/* Correct Answer Selection */}
                    <FormField
                    key={`correct-${currentQuestionIndex}`}
                      control={form.control}
                      name={`questions.${currentQuestionIndex}.correct`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correct Answer</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {OPTION_LETTERS.map((letter) => (
                                <SelectItem key={letter} value={letter}>
                                  Option {letter}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {quizId ? "Update Quiz" : "Create Quiz"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default QuizCreator;
