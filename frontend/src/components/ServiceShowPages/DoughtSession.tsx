import { useState } from "react";
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
  Send,
  PaperclipIcon,
} from "lucide-react";
// import { Link } from "react-router-dom";

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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Writo Education</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#" className="hover:underline">Home</Link></li>
              <li><Link href="#" className="hover:underline">Courses</Link></li>
              <li><Link href="#" className="hover:underline">About</Link></li>
              <li><Link href="#" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header> */}

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 pt-[20vh] text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Expert Doubt Resolution Sessions
            </h1>
            <p className="mb-8 text-xl">
              Connect directly with our experienced mentors and clear all your
              Doubts
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Book Your Session Now
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Our Expert Mentors
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {subjects.map((subject, index) => (
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
                    <Button className="w-full">Schedule Session</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          {/* <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Real-Time Chat Platform
            </h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-xl">
              <div className="p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
                <div className="mb-8 lg:mb-0 lg:mr-8">
                  <h3 className="mb-4 text-2xl font-bold">Connect Instantly</h3>
                  <p className="mb-6 text-xl text-gray-600">
                    Engage with mentors and fellow students in real-time
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <MessageSquare className="mr-4 text-primary" />
                      <span>Instant messaging with mentors</span>
                    </li>
                    <li className="flex items-center">
                      <UserPlus className="mr-4 text-primary" />
                      <span>Group chats with other students</span>
                    </li>
                    <li className="flex items-center">
                      <Image className="mr-4 text-primary" />
                      <span>
                        Share images and files for better explanations
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <Card className="border-2 border-purple-200 bg-gray-50">
                    <CardHeader>
                      <CardTitle>Live Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="rounded-lg bg-purple-100 p-3">
                            <p className="font-semibold">Student</p>
                            <p>
                              Can someone explain the concept of derivatives?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="rounded-lg bg-blue-100 p-3">
                            <p className="font-semibold">Mentor</p>
                            <p>
                              Derivatives measure the rate of change of a
                              function...
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join the Conversation</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div> */}
          <ChatSection />
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-lg bg-white shadow-xl">
              <div className="p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
                <div className="mb-8 lg:mb-0 lg:mr-8">
                  <h2 className="mb-4 text-3xl font-bold">Exclusive Offer!</h2>
                  <p className="mb-6 text-xl text-gray-600">
                    Get access to Doubt sessions for all subjects and free Test
                    Series
                  </p>
                  <div className="flex items-center space-x-4">
                    <Clock className="text-primary" />
                    <span className="text-lg">Limited Time Offer</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-5xl font-bold text-primary">
                    ₹999
                  </div>
                  <p className="mb-6 text-lg text-gray-600">
                    One-time payment for full access
                  </p>
                  <Button
                    size="lg"
                    className="bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Claim Your Offer Now
                  </Button>
                </div>
              </div>
              <div className="bg-purple-100 p-6 text-center">
                <p className="text-lg font-semibold text-purple-800">
                  Bonus: Get Free Access to Our Comprehensive Test Series!
                </p>
              </div>
            </div>
          </div>
        </section>

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

        <section className="bg-gray-900 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold">
              Ready to Excel in Your Studies?
            </h2>
            <p className="mb-8 text-xl lg:px-[20%]">
              Join our Doubt sessions today and experience the difference
              personalized mentoring can make!
            </p>
            <Button variant="outline" size="lg" className="text-lg">
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      {/* <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Home</Link></li>
                <li><Link href="#" className="hover:underline">Courses</Link></li>
                <li><Link href="#" className="hover:underline">About Us</Link></li>
                <li><Link href="#" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>Email: info@writo-education.com</p>
              <p>Phone: +91 1234567890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Writo Education. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
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
      <h2 className="mb-12 text-center text-3xl font-bold">
        Real-Time Chat Platform
      </h2>
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
        </div>
        {/* <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="h-96 space-y-4 overflow-y-auto">
            {chatMessages.map((msg, idx) => (
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
            ))}
          </CardContent>
          <CardFooter>
            <form
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
            </form>
          </CardFooter>
        </Card> */}
      </div>
      <div className="mt-12 text-center">
        <Badge variant="outline" className="px-4 py-2 text-lg">
          Daily 14-hours Support Available
        </Badge>
      </div>
    </div>
  );
}
