import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
          <p className="text-xl text-gray-600">See what our students have to say about their learning journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
            content="Live doubt sessions are a game-changer! Getting instant solutions from expert mentors helped me understand complex topics easily."
          />
          <TestimonialCard
            name="Anjali Patel"
            role="UPSC Aspirant"
            image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128"
            content="The quality of mentors and their dedication to helping students is remarkable. Best educational platform I've used!"
          />
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ name, role, image, content }: { name: string; role: string; image: string; content: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full" />
      <div className="ml-4">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700">{content}</p>
  </div>
);

export default Testimonials;