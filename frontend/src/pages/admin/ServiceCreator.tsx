import { useEffect, useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, Store } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { ErrorApiRes } from "@/types/all";
import { AxiosError } from "axios";
import { serviceSchema } from "@/Schema/admin";

// Form validation schema


type FormData = z.infer<typeof serviceSchema>;

const ServiceCreator = () => {
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
    },
  });


  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/service/get-service/${serviceId}`,
        );
        const data = response.data.data;

        form.reset({
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discount,
        });
      } catch (error) {
        const axiosError = error as AxiosError<ErrorApiRes>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch service data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, form, toast]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
        let response;
        if(serviceId){
            response = await axiosInstance.patch(`/service/update-service/${serviceId}`, data)
        }else {
            response = await axiosInstance.post(`/service/create-service`, data)
        }
      toast({
        title: "Success",
        description: response.data.message || `Service ${serviceId ? "updated" : "created"} successfully`,
      });

      navigate('/admin/manage-services')

      if (!serviceId) {
        form.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 pt-28">
      <Card className="mx-auto max-w-2xl p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            {serviceId ? "Edit Service" : "Create New Service"}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
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
                      placeholder="Enter service description"
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount percentage"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a value between 0 and 100
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {serviceId ? "Update Service" : "Create Service"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ServiceCreator;
