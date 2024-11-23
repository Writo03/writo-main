import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {  Edit2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { ErrorApiRes } from "@/types/all";
import { Link } from "react-router-dom";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
}

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/service/get-services");
        setServices(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorApiRes>;
        setError(
          axiosError.response?.data.message || "Failed to fetch services",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteServiceId) return;

    try {
      setServices(
        services.filter((service) => service._id !== deleteServiceId),
      );
      const response = await axiosInstance.delete(
        `/service/get-service/${deleteServiceId}`,
      );

      toast({
        title: "Success",
        description: response.data.message || "Service deleted successfully",
      });
    } catch (err) {
      const axiosError = err as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to delete service",
        variant: "destructive",
      });
    }

    setDeleteServiceId(null);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return Math.floor(price - (price * discount) / 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-28">
      {/* <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Services</h1>
        <Link to={"/admin/create-edit-service"}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
        </Link>
      </div> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service._id}
            className="p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-semibold text-card-foreground">
                {service.name}
              </h3>
              <div className="flex space-x-2">
                <Link to={`/admin/create-edit-service/${service._id}`}>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                </Link>
              </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {service.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Original Price
                </span>
                <span className="font-medium">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">
                  {service.discount}%
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Final Price</span>
                <span className="text-lg font-bold text-primary">
                  ₹
                  {calculateDiscountedPrice(
                    service.price,
                    service.discount,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deleteServiceId}
        onOpenChange={() => setDeleteServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageServices;
