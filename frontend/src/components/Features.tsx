import React from 'react';
import { BarChart2, Clock, Users, Award } from 'lucide-react';

const Features = () => {
  return (
    <div className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Writo Education?</h2>
          <p className="text-xl text-gray-600">Experience the perfect blend of technology and education</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={BarChart2}
            title="Performance Analytics"
            description="Track your progress with detailed insights and analytics"
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Support"
            description="Get help anytime with our round-the-clock support system"
          />
          <FeatureCard
            icon={Users}
            title="Expert Mentors"
            description="Learn from experienced educators and industry experts"
          />
          <FeatureCard
            icon={Award}
            title="Certified Content"
            description="Study with thoroughly verified and curated content"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Features;