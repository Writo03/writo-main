import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  BookOpen,
  CheckCircle,
  PenTool,
  Trophy,
  Microscope,
  Calculator,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TestSeriesPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Determine which cards to show
  const showNEETCard = !isAuthenticated || user.target === "NEET";
  const showJEECard = !isAuthenticated || user.target === "JEE";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 pt-[20vh] text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Ace Your Entrance Exams
            </h1>
            <p className="mb-8 text-xl">
              Comprehensive mock test series for {showNEETCard && "NEET"} 
              {showNEETCard && showJEECard && " and "} 
              {showJEECard && "JEE (Main + Advanced)"}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className={`grid gap-8 ${showNEETCard && showJEECard ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
              {showNEETCard && (
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-bold">
                      <Microscope className="mr-2" /> NEET Exam Preparation
                    </CardTitle>
                    <CardDescription>
                      For aspiring medical professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        Comprehensive Biology focus
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        Physics and Chemistry coverage
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        NCERT-aligned question patterns
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => navigate("/test-series/neet/all")}
                    >
                      Start NEET Preparation
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {showJEECard && (
                <Card className="transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-bold">
                      <Calculator className="mr-2" /> JEE (Main + Advanced) Preparation
                    </CardTitle>
                    <CardDescription>
                      For future engineers and tech innovators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        In-depth Mathematics coverage
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        Advanced Physics and Chemistry
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" />
                        JEE Main and Advanced patterns
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => navigate("/test-series/jee/all")}
                    >
                      Start JEE Preparation
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Choose Our Test Series?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <BookOpen className="h-10 w-10" />,
                  title: "Comprehensive Coverage",
                  description: "All topics covered as per the latest syllabus",
                },
                {
                  icon: <PenTool className="h-10 w-10" />,
                  title: "Realistic Exam Environment",
                  description: "Simulates actual exam conditions for better preparation",
                },
                {
                  icon: <CheckCircle className="h-10 w-10" />,
                  title: "Detailed Analysis",
                  description: "Get insights on your performance and areas of improvement",
                },
                {
                  icon: <Trophy className="h-10 w-10" />,
                  title: "Competitive Edge",
                  description: "Compare your scores with peers across the country",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="text-center transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold">Unbeatable Offer!</h2>
            <div className={`mx-auto grid max-w-4xl gap-8 ${showNEETCard && showJEECard ? 'md:grid-cols-2' : 'max-w-md'}`}>
              {showNEETCard && (
                <div className="-rotate-2 transform rounded-lg bg-yellow-400 px-6 py-4 text-yellow-900 transition-transform duration-300 hover:rotate-0">
                  <span className="text-4xl font-bold">Only ₹99/-</span>
                  <span className="block text-lg">
                    for full access to NEET mock tests
                  </span>
                  <Button
                    size="lg"
                    className="mt-4 bg-green-500 text-white hover:bg-green-600"
                    onClick={() => navigate("/test-series/details/neet")}
                  >
                    Get NEET Tests
                  </Button>
                </div>
              )}
              {showJEECard && (
                <div className="rotate-2 transform rounded-lg bg-yellow-400 px-6 py-4 text-yellow-900 transition-transform duration-300 hover:rotate-0">
                  <span className="text-4xl font-bold">Only ₹99/-</span>
                  <span className="block text-lg">
                    for full access to JEE mock tests
                  </span>
                  <Button
                    size="lg"
                    className="mt-4 bg-green-500 text-white hover:bg-green-600"
                    onClick={() => navigate("/test-series/details/jee")}
                  >
                    Get JEE Tests
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-8 text-xl">
              Don't miss this opportunity to supercharge your exam preparation!
            </p>
          </div>
        </section>

        <section className="bg-gray-900 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold">
              Join Thousands of Successful Students
            </h2>
            <p className="mb-8 text-xl lg:px-[20%]">
              Our test series has helped countless students achieve their dreams
              in both medical and engineering fields. You could be next!
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-lg text-black"
              onClick={() => navigate("/about")}
            >
              Learn More About Our Success Stories
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}