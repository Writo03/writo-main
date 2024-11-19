import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  BookOpen,
  BrainCircuit,
  Presentation,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const isAdmin = true; // Replace with actual admin check logic
  const navigate = useNavigate();

  return (
    <div className="container mx-auto space-y-8 p-6 pt-32">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        {isAdmin ? "Admin" : "Mentor"} Dashboard
      </h1>

      {isAdmin && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Add Admin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create new admin accounts
                </p>
              </div>
              <Button
                onClick={() => navigate("add-admin-mentor/admin")}
                variant="secondary"
              >
                Add New
              </Button>
            </div>
          </Card>

          <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Presentation className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Add Mentor
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage teaching staff
                </p>
              </div>
              <Button
                onClick={() => navigate("add-admin-mentor/mentor")}
                variant="secondary"
              >
                Add New
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Quiz Management */}
        <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-accent/10 p-4">
              <BrainCircuit className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">
                Quiz Management
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create and manage quizzes
              </p>
            </div>
            <Button
              onClick={() => navigate("manage-quiz")}
              variant={"outline"}
              className="w-full"
            >
              Manage Quizzes
            </Button>
          </div>
        </Card>

        {isAdmin && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-secondary/10 p-4">
                  <BookOpen className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Services
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View active services
                  </p>
                </div>
                <Button
                  onClick={() => navigate("manage-services")}
                  variant="outline"
                  className="w-full"
                >
                  View Services
                </Button>
              </div>
            </Card>

            <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-accent/10 p-4">
                  <Presentation className="h-8 w-8 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Mentors
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View all mentors
                  </p>
                </div>
                <Link to={"manage-mentors"}>
                  <Button variant="outline" className="w-full">
                    View Mentors
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="bg-card p-6 transition-shadow hover:shadow-lg">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-destructive/10 p-4">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    Admins
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View all administrators
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  View Admins
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
