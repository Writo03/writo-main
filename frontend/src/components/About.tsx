import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  BookOpen,
  Target,
  ArrowRight,
} from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Aisha Patel",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Former IIT professor with 20+ years of experience in education",
  },
  {
    name: "Rahul Sharma",
    role: "Head of Curriculum",
    image: "/placeholder.svg?height=200&width=200",
    bio: "NEET top scorer and curriculum design expert",
  },
  {
    name: "Priya Gupta",
    role: "Chief Technology Officer",
    image: "/placeholder.svg?height=200&width=200",
    bio: "EdTech innovator with a passion for accessible learning",
  },
  {
    name: "Vikram Singh",
    role: "Lead JEE Instructor",
    image: "/placeholder.svg?height=200&width=200",
    bio: "IIT-Delhi alumnus and JEE preparation specialist",
  },
];

const milestones = [
  {
    year: 2019,
    achievement:
      "Founded Writo Education with a vision to revolutionize exam preparation",
  },
  {
    year: 2020,
    achievement: "Launched our first online Test Series for NEET and JEE",
  },
  { year: 2021, achievement: "Reached 1,00,000 enrolled students milestone" },
  {
    year: 2022,
    achievement: "Introduced Doubt Sessions for students to discuss their doubts with subject specific mentors",
  },
  {
    year: 2023,
    achievement: "Real time chat and Google Meet integration for doubt sessions",
  },
  {
    year: 2024,
    achievement: "Test Series for mentors to improve their skills",
  },
];

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            About Writo Education
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Empowering students to achieve their dreams through innovative and
            personalized exam preparation.
          </p>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
              <p className="mb-6 text-lg text-gray-600">
                At Writo Education, we're on a mission to revolutionize the way
                students prepare for competitive exams. We believe that every
                student has the potential to excel, and our goal is to provide
                the tools, resources, and support needed to unlock that
                potential.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Learn More About Our Approach
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/50 to-indigo-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" /> 150,000+
                  </CardTitle>
                </CardHeader>
                <CardContent>Students Enrolled</CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-400 to-red-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2" /> 20+
                  </CardTitle>
                </CardHeader>
                <CardContent>Expert Instructors</CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2" /> 90%
                  </CardTitle>
                </CardHeader>
                <CardContent>Success Rate</CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2" /> 4.8/5
                  </CardTitle>
                </CardHeader>
                <CardContent>Student Satisfaction</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Innovation",
                description:
                  "Constantly improving our methods and technology to provide cutting-edge learning experiences.",
              },
              {
                title: "Personalization",
                description:
                  "Tailoring our approach to meet the unique needs and learning styles of each student.",
              },
              {
                title: "Excellence",
                description:
                  "Striving for the highest standards in education and student support.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="transition-shadow duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="transition-shadow duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <Avatar className="mx-auto mb-4 h-24 w-24">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <CardDescription className="text-center">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <Badge variant="outline" className="mr-4 px-3 py-1 text-lg">
                  {milestone.year}
                </Badge>
                <Card className="flex-grow">
                  <CardContent className="py-4">
                    {milestone.achievement}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of successful students who have achieved their dreams
            with Writo Education.
          </p>
          <a href="/test-series">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore Our Courses <ArrowRight className="ml-2" />
            </Button>
          </a>
        </section>
      </main>
    </div>
  );
}

const AboutPage = memo(AboutUs);
export default AboutPage;
