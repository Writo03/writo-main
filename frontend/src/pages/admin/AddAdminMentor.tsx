import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/components/hooks/use-toast"
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Presentation, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { ErrorApiRes } from '@/types/all';
import axiosInstance from '@/utils/axiosInstance';
import { baseSchema } from '@/Schema/admin';

// Subject options for mentors
const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
] as const;


const mentorSchema = baseSchema.extend({
  subject: z.enum(subjects, {
    required_error: 'Please select a subject',
  }),
});

type FormData = z.infer<typeof baseSchema> & { subject?: string };

const AddAdminMentor = () => {
  const { role } = useParams();
  const isAdmin = role === 'admin';
  const { toast } = useToast()

  const [isCreating, setIsCreating] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(isAdmin ? baseSchema : mentorSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      subject: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsCreating(true)
    try {
      let res;
      if(isAdmin){
        res = await axiosInstance.post("/user/add-admin", data)
      }else {
        res = await axiosInstance.post("/user/add-mentor", data)
      }
      
      toast({
        title: 'Success!',
        description: res.data.message || `${isAdmin ? 'Admin' : 'Mentor'} created successfully.`,
        variant: 'default',
      });
      
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false)
    }
  };

  return (
    <div className="container mx-auto p-6 pt-32">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            {isAdmin ? (
              <UserPlus className="h-6 w-6 text-primary" />
            ) : (
              <Presentation className="h-6 w-6 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Add New {isAdmin ? 'Admin' : 'Mentor'}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isAdmin && (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button disabled={isCreating} type="submit" className="w-full disabled:opacity-50">
              {
                isCreating ? (<Loader2 className='animate-spin'/>) : (
                  <span>Create {isAdmin ? 'Admin' : 'Mentor'}</span>
                )
              }
              
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdminMentor;
