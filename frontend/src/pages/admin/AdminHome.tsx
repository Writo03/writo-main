import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  BookOpen, 
  BrainCircuit,
  Presentation,
  Shield
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const isAdmin = true; // Replace with actual admin check logic
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6 space-y-8 pt-32">
      <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>
      
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground">Add Admin</h3>
                <p className="text-sm text-muted-foreground">Create new admin accounts</p>
              </div>
              <Button onClick={() => navigate("add-admin-mentor/admin")} variant="secondary">
                Add New
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Presentation className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground">Add Mentor</h3>
                <p className="text-sm text-muted-foreground">Manage teaching staff</p>
              </div>
              <Button onClick={() => navigate("add-admin-mentor/mentor")} variant="secondary">
                Add New
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quiz Management */}
        <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-accent/10">
              <BrainCircuit className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Quiz Management</h3>
              <p className="text-sm text-muted-foreground mt-2">Create and manage quizzes</p>
            </div>
            <Button onClick={() => navigate("manage-quiz")} variant={"outline"} className="w-full">Manage Quizzes</Button>
          </div>
        </Card>

        {/* Services Overview */}
        <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-secondary/10">
              <BookOpen className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Services</h3>
              <p className="text-sm text-muted-foreground mt-2">View active services</p>
            </div>
            <Button variant="outline" className="w-full">View Services</Button>
          </div>
        </Card>

        {/* View Mentors */}
        <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-accent/10">
              <Presentation className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Mentors</h3>
              <p className="text-sm text-muted-foreground mt-2">View all mentors</p>
            </div>
            <Button variant="outline" className="w-full">View Mentors</Button>
          </div>
        </Card>

        {/* View Admins */}
        <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Admins</h3>
              <p className="text-sm text-muted-foreground mt-2">View all administrators</p>
            </div>
            <Button variant="outline" className="w-full">View Admins</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
