// import { useState } from "react";
import {
  BookOpen,
  Calculator,
  Atom,
  Dna,
  Cpu,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Image as ImageIcon,
  /* Send, */
  PaperclipIcon,
  LogIn as LogInIcon,
  UserCheck,
  BadgeAlert,
  Video as VideoIcon,
} from "lucide-react";
// import { Link } from "react-router-dom";
import { serviceNames, serviceIds } from "@/utils/contants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import PaymentButton from "../ui/PaymentButton";
import { toast } from "../hooks/use-toast";
import { PaymentSuccessDetails } from "../TestSeries/TestSeriesDetails";
import ChatButton from "../Chat/ChatButton";
import { useAppSelector } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/types/state";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  {
    name: "Mathematics",
    icon: Calculator,
    mentor: "Dr. Ramanujan Iyer",
    experience: "1+ years",
  },
  {
    name: "Chemistry",
    icon: Atom,
    mentor: "Prof. Marie Curie",
    experience: "2+ years",
  },
  {
    name: "Physics",
    icon: BookOpen,
    mentor: "Dr. Albert Einstein",
    experience: "1+ years",
  },
  {
    name: "Biology",
    icon: Dna,
    mentor: "Dr. Jane Goodall",
    experience: "3+ years",
  },
];

export default function DoubtSessionPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  // const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const subscriptions = useAppSelector(
    (state) => state.subscriptions.subscriptions,
  );
  const isMentor = useSelector((state: RootState) => state.auth.user.isMentor);
  const requiredServiceId = serviceIds.doubtSession;
  const hasDoubtService = subscriptions.includes(requiredServiceId);
  const navigate = useNavigate();

  // Determine which cards to show
  // const showNEETCard = !isAuthenticated || user.target === "NEET";
  // const showJEECard = !isAuthenticated || user.target === "JEE";
  const filteredSubjects = subjects.filter((subject) => {
    if (user?.target === "NEET" && subject.name === "Mathematics") return false;
    if (user?.target === "JEE" && subject.name === "Biology") return false;
    return true;
  });

  useEffect(() => {
    if (isMentor) {
      navigate("/chat/mentor");
      return;
    }
  }, [isMentor, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-grow">
        {!hasDoubtService ? (
          <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 pt-[20vh] text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Expert Doubt Resolution Sessions
              </h1>
              <p className="mb-8 text-xl">
                Connect directly with our experienced mentors and clear all your
                Doubts
              </p>
              <a href="#our-mentors">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Book Your Session Now
                </Button>
              </a>
            </div>
          </section>
        ) : (
          ""
        )}

        <section id="our-mentors" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Our Expert Mentors
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {filteredSubjects.map((subject, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-2xl">
                        <subject.icon className="mr-2" />
                        {subject.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-white text-primary"
                      >
                        {subject.experience}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center">
                      <Users className="mr-2" />
                      <CardDescription className="text-lg font-medium">
                        Mentor: {subject.mentor}
                      </CardDescription>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* <Button className="w-full">Schedule Session</Button> */}
                    <ChatButton
                      buttonText="Chat with Mentor"
                      subject={subject.name}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {!hasDoubtService ? (
          <section className="bg-gray-100 py-16">
            <ChatSection />
          </section>
        ) : (
          ""
        )}

        {!hasDoubtService ? (
          <section className="py-16">
            <ExclusiveSection className="px-4" />
          </section>
        ) : (
          ""
        )}

        {!hasDoubtService ? (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Why Choose Our Doubt Sessions?
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: Users,
                    title: "Expert Mentors",
                    description:
                      "Learn from experienced professionals in their respective fields",
                  },
                  {
                    icon: Clock,
                    title: "Flexible Scheduling",
                    description:
                      "Book sessions at your convenience, 7 days a week",
                  },
                  {
                    icon: BookOpen,
                    title: "Comprehensive Coverage",
                    description: "Get help with any topic in your syllabus",
                  },
                  {
                    icon: CheckCircle,
                    title: "Personalized Attention",
                    description: "One-on-one sessions tailored to your needs",
                  },
                  {
                    icon: Cpu,
                    title: "Advanced Learning Tools",
                    description:
                      "Access to digital whiteboards and screen sharing",
                  },
                  {
                    icon: Calculator,
                    title: "Practice Resources",
                    description:
                      "Receive curated practice problems after each session",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="text-center transition-shadow duration-300 hover:shadow-lg"
                  >
                    <CardContent className="pt-6">
                      <feature.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
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
        ) : (
          ""
        )}

        {!hasDoubtService ? (
          <section className="bg-gray-900 py-16 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-8 text-3xl font-bold">
                Ready to Excel in Your Studies?
              </h2>
              <p className="mb-8 text-xl lg:px-[20%]">
                Join our Doubt sessions today and experience the difference
                personalized mentoring can make!
              </p>
              <a href="#our-mentors">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg text-black"
                >
                  Get Started Now
                </Button>
              </a>
            </div>
          </section>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export function ExclusiveSection({ className }: { className?: string }) {
  const handlePaymentSuccess = (details: PaymentSuccessDetails) => {
    toast({
      title: "Payment Sucessful!!",
      description: details.serviceName,
    });
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment failed:", error);
    toast({
      title: "Payment failed!!",
      description: error.message,
    });
  };
  return (
    <div id="paymentsection" className={cn("container mx-auto", className)}>
      <div className="overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
          <div className="mb-8 lg:mb-0 lg:mr-8">
            <h2 className="mb-4 text-3xl font-bold">Exclusive Offer!</h2>
            <p className="mb-6 text-xl text-gray-600">
              Get access to Doubt sessions for all subjects and free Test Series
            </p>
            <div className="flex items-center space-x-4">
              <Clock className="text-primary" />
              <span className="text-lg">Limited Time Offer</span>
            </div>
          </div>
          <div className="text-center">
            <div className="mb-4 text-5xl font-bold text-primary">₹999</div>
            <p className="mb-6 text-lg text-gray-600">
              One-time payment for full access
            </p>
            {/* <Button
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-700" 
            >

              Claim Your Offer Now
            </Button> */}
            <PaymentButton
              price={999}
              serviceName={serviceNames.doubtSession}
              serviceId={serviceIds.doubtSession}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              currencySymbol="Rs"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            />
          </div>
        </div>
        <div className="bg-purple-100 p-6 text-center">
          <p className="text-lg font-semibold text-purple-800">
            Bonus: Get Free Access to Our Comprehensive Test Series!
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChatSection() {
  // const [message, setMessage] = useState("");

  // type ChatMessage = {
  //   sender: string;
  //   content: string;
  //   time: string;
  // };

  // const chatMessages: ChatMessage[] = [
  //   {
  //     sender: "Student",
  //     content: "Can someone explain the concept of derivatives?",
  //     time: "2:30 PM",
  //   },
  //   {
  //     sender: "Dr. Ramanujan",
  //     content:
  //       "Derivatives measure the rate of change of a function with respect to a variable. It's like finding the slope of a tangent line at any point on a curve.",
  //     time: "2:32 PM",
  //   },
  // ];

  // const handleSendMessage = () => {
  //   if (message.trim()) {
  //     // In a real app, you'd send this message to a backend
  //     console.log("Sending message:", message);
  //     setMessage("");
  //   }
  // };

  return (
    <div className="container mx-auto px-4">
      {/* <h2 className="mb-12 text-center text-3xl font-bold">
        Real-Time Chat Platform
      </h2> */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Connect Instantly</h3>
          <p className="text-xl text-gray-600">
            Engage with mentors and fellow students in real-time to get
            immediate help and collaborate on challenging topics.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                icon: MessageSquare,
                title: "Instant Messaging",
                description: "Get quick responses from mentors",
              },
              {
                icon: UserPlus,
                title: "Group Discussions",
                description: "Collaborate with peers on tough problems",
              },
              {
                icon: ImageIcon,
                title: "Media Sharing",
                description: "Send images and files for clearer explanations",
              },
              {
                icon: PaperclipIcon,
                title: "Resource Sharing",
                description: "Exchange helpful study materials",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="transition-shadow duration-300 hover:shadow-md"
              >
                <CardContent className="flex items-start space-x-4 p-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Badge variant="outline" className="px-4 py-2 text-lg">
              Daily 14-hours Support Available
            </Badge>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>How to use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            {DoubtSessionSteps.map((item, idx) => (
              <Alert key={idx}>
                <item.icon className="h-6 w-6 text-primary" />
                <AlertTitle className="ml-2 text-lg font-medium">
                  {item.title}
                </AlertTitle>
                <AlertDescription>{item.description}</AlertDescription>
              </Alert>
            ))}
            {/* {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${msg.sender === "Student" ? "justify-end" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder-avatar-${idx + 1}.png`} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${msg.sender === "Student" ? "bg-purple-100" : "bg-gray-100"}`}
                >
                  <p className="font-semibold">{msg.sender}</p>
                  <p>{msg.content}</p>
                  <p className="mt-1 text-xs text-gray-500">{msg.time}</p>
                </div>
              </div>
            ))} */}
          </CardContent>
          <CardFooter>
            <a href="#our-mentors">
              <Button className="w-full">Try Now</Button>
            </a>
            {/* <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full space-x-2"
            >
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const DoubtSessionSteps = [
  {
    title: "Sign In",
    description: "Create an account to access the platform",
    icon: LogInIcon,
  },
  {
    title: "Subscribe to a Subject",
    description: "Choose a subject to connect with your mentors",
    icon: UserCheck,
  },
  {
    title: "Share your Doubts",
    description: "Share your doubts with your mentors",
    icon: BadgeAlert,
  },
  {
    title: "Video Call",
    description: "Video call with the mentors",
    icon: VideoIcon,
  },
];
