import { useEffect, useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  User
} from "lucide-react";
import { useToast } from '@/components/hooks/use-toast';
import { ErrorApiRes } from '@/types/all';
import { AxiosError } from 'axios';
import axiosInstance from '@/utils/axiosInstance';

interface Mentor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  onBreak: boolean;
}

const ManageMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMentorId, setDeleteMentorId] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axiosInstance.get("/user/get-mentors");
        setMentors(response.data.data)
      } catch (err) {
        const axiosError = err as AxiosError<ErrorApiRes>;
        setError(axiosError.response?.data.message ||'Failed to fetch mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleDelete = async () => {
    if (!deleteMentorId) return;

    try {
      setMentors(mentors.filter(mentor => mentor._id !== deleteMentorId));
      const response = await axiosInstance.delete(`/user/delete-mentor/${deleteMentorId}`)
      toast({
        title: 'Success',
        description: response.data.message || 'Mentor removed successfully',
      });
    } catch (err) {
        const axiosError = err as AxiosError<ErrorApiRes>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ||'Failed to remove mentor',
        variant: 'destructive',
      });
    }
    
    setDeleteMentorId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-28">
      <h1 className="text-3xl font-bold text-foreground mb-8">Manage Mentors</h1>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors.map((mentor) => (
                <TableRow key={mentor._id}>
                  <TableCell className="font-medium">{mentor.fullName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.subject}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{mentor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{mentor.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mentor.onBreak ? "secondary" : "outline"}>
                      {mentor.onBreak ? 'On Break' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteMentorId(mentor._id)}
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
        {mentors.map((mentor) => (
          <Card key={mentor._id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{mentor.fullName}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteMentorId(mentor._id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.subject}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.phone}</span>
              </div>
              <div className="pt-2">
                <Badge variant={mentor.onBreak ? "secondary" : "outline"}>
                  {mentor.onBreak ? 'On Break' : 'Active'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteMentorId} onOpenChange={() => setDeleteMentorId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the mentor
              from the system.
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

export default ManageMentors;
