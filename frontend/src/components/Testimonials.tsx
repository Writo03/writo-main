import { Star } from "lucide-react";

const Testimonials = () => {
  return (
<<<<<<< HEAD
    <div className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Student Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            See what our students have to say about their learning journey
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <TestimonialCard
            name="Priya Sharma"
            role="GATE Aspirant"
            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
            content="The test series helped me track my preparation effectively. The detailed analytics showed me exactly where I needed to improve."
          />
          <TestimonialCard
            name="Rahul Verma"
            role="JEE Student"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
            content="Live Doubt sessions are a game-changer! Getting instant solutions from expert mentors helped me understand complex topics easily."
          />
          <TestimonialCard
            name="Anjali Patel"
            role="UPSC Aspirant"
            image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
            content="The quality of mentors and their dedication to helping students is remarkable. Best educational platform I've used!"
          />
=======
    <div className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
          <p className="text-xl text-gray-600">See what our students have to say about their learning journey</p>
        </div>

        <div className="relative w-full flex space-x-8 animate-marquee">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex space-x-8">
              {testimonialData.map((testimonial, index) => (
                <TestimonialCard key={`${index}-${idx}`} {...testimonial} />
              ))}
            </div>
          ))}
>>>>>>> 0c09c8a7fac4466d1c44abb655bf400f3db21b24
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const TestimonialCard = ({
  name,
  role,
  image,
  content,
}: {
  name: string;
  role: string;
  image: string;
  content: string;
}) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
    <div className="mb-4 flex items-center">
      <img src={image} alt={name} className="h-12 w-12 rounded-full" />
=======
const TestimonialCard = ({ name, role, image, content }: { name: string; role: string; image: string; content: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 w-72">
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full" />
>>>>>>> 0c09c8a7fac4466d1c44abb655bf400f3db21b24
      <div className="ml-4">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
    <div className="mb-4 flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700">{content}</p>
  </div>
);

<<<<<<< HEAD
=======
const testimonialData = [
  {
    name: "Priya Sharma",
    role: "GATE Aspirant",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128",
    content: "The test series helped me track my preparation effectively. The detailed analytics showed me exactly where I needed to improve."
  },
  {
    name: "Rahul Verma",
    role: "JEE Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128",
    content: "Live doubt sessions are a game-changer! Getting instant solutions from expert mentors helped me understand complex topics easily."
  },
  {
    name: "Anjali Patel",
    role: "UPSC Aspirant",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128",
    content: "The quality of mentors and their dedication to helping students is remarkable. Best educational platform I've used!"
  }
];

>>>>>>> 0c09c8a7fac4466d1c44abb655bf400f3db21b24
export default Testimonials;
