import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  Trash2,
  Mail,
  Phone,
  User
} from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { ErrorApiRes } from "@/types/all";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface Admin {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.user.isAdmin);

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/user/get-admins");
        setAdmins(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorApiRes>;
        setError(
          axiosError.response?.data.message || "Failed to fetch admins",
        );
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) {
      fetchAdmins();
    } else {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleDelete = async () => {
    if (!deleteAdminId) return;

    try {
      setAdmins(admins.filter((admin) => admin._id !== deleteAdminId));
      const response = await axiosInstance.delete(
        `/user/delete-admin/${deleteAdminId}`,
      );
      toast({
        title: "Success",
        description: response.data.message || "Admin removed successfully",
      });
    } catch (err) {
      const axiosError = err as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to remove admin",
        variant: "destructive",
      });
    }

    setDeleteAdminId(null);
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
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Manage Admins
      </h1>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell className="font-medium">
                    {admin.fullName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteAdminId(admin._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {admins.map((admin) => (
          <Card key={admin._id} className="p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{admin.fullName}</h3>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteAdminId(admin._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{admin.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{admin.phone}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deleteAdminId}
        onOpenChange={() => setDeleteAdminId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              admin from the system.
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

export default ManageAdmins;
