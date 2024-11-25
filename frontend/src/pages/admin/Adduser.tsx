import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/components/hooks/use-toast";
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
import { UserPlus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { ErrorApiRes } from '@/types/all';

// Service options
const services = [
  { name: "Jee", id: "673c0c5eeef250bcef428646" },
  { name: "NEET", id: "673440f8f547c1a59e6d2a78" },
  { name: "Doubt section", id: "67418c07b084cc5b2e6d1076" },
];

// Validation schema
const userSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  target: z.string().min(1, "Target is required"),
  services: z
    .array(z.object({ name: z.string(), id: z.string() }))
    .min(1, "At least one service must be selected"),
});

type FormData = z.infer<typeof userSchema>;

const AddAdminUser = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      target: '',
      services: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsCreating(true);
    try {
      const res = await axiosInstance.post('/user/registerbyadmin', data);

      toast({
        title: 'Success!',
        description: res.data.message || 'User registered successfully.',
        variant: 'default',
      });

      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 pt-32">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Add New User
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

            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Input placeholder="JEE or NEET" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={JSON.stringify(service)}
                          onChange={(e) => {
                            const selectedService = JSON.parse(e.target.value);
                            if (e.target.checked) {
                              field.onChange([...field.value, selectedService]);
                            } else {
                              field.onChange(
                                field.value.filter((s) => s.id !== selectedService.id)
                              );
                            }
                          }}
                        />
                        <span>{service.name}</span>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isCreating} type="submit" className="w-full disabled:opacity-50">
              {isCreating ? <Loader2 className="animate-spin" /> : <span>Create Admin</span>}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdminUser;
