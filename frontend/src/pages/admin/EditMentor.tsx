import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, UserCog } from "lucide-react";
import { mentorSchema } from "@/Schema/admin";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ErrorApiRes } from "@/types/all";
import { AxiosError } from "axios";
import { useAppSelector } from "@/redux/hooks";

const EditMentor = () => {
  const { mentorId } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.user.isAdmin);

  const form = useForm<z.infer<typeof mentorSchema>>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      subject: undefined,
      role: [],
      onBreak: false,
      onLeave: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof mentorSchema>) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/user/update-mentor/${mentorId}`,
        data,
      );
      toast({
        title: "Success!",
        description: res.data.message,
      });
      navigate("/admin/manage-mentors");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/get-mentor/${mentorId}`,
        );
        form.reset({
          subject: response.data.data.subject,
          role: response.data.data.role,
          onBreak: response.data.data.onBreak,
          onLeave: response.data.data.onLeave,
        });
      } catch (error) {
        const axiosError = error as AxiosError<ErrorApiRes>;
        setError(axiosError.response?.data.message || "Failed to fetch mentor");
      } finally {
        setIsLoading(false);
      }
    };
    if (isAdmin) {
      fetchMentor();
    } else {
      navigate("/admin");
    }
  }, [mentorId, form, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      <Card className="mx-auto max-w-2xl p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Edit Mentor Details
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Mathematics", "Physics", "Chemistry", "Biology"].map(
                        (subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Quiz", value: "QUIZ" },
                      { label: "Chat", value: "CHAT" },
                    ].map((role) => (
                      <FormField
                        key={role.value}
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  role.value as "QUIZ" | "CHAT",
                                )}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  if (checked) {
                                    field.onChange([...value, role.value]);
                                  } else {
                                    field.onChange(
                                      value.filter((val) => val !== role.value),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {role.label}
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
              name="onBreak"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Currently on break
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="onLeave"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Currently on leave
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Mentor Details
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditMentor;
