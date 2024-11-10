import React from 'react';
import { CheckCircle2, Trophy, Users, Clock, Video, MessageSquare, Share2, Crown } from 'lucide-react';

const Products = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600">Choose the perfect learning solution for your needs</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Test Series Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100">
            <div className="flex items-center mb-6">
              <Trophy className="h-10 w-10 text-indigo-600" />
              <h3 className="text-2xl font-bold ml-4">Test Series</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Comprehensive practice tests with detailed analytics and competitive rankings.
            </p>
            <div className="space-y-4 mb-8">
              <Feature icon={CheckCircle2} text="Multiple subjects and topics" />
              <Feature icon={Users} text="Compare with peers on leaderboard" />
              <Feature icon={Clock} text="Timed tests with instant results" />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              Start Practicing
            </button>
          </div>

          {/* Live Doubts Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100">
            <div className="flex items-center mb-6">
              <Video className="h-10 w-10 text-indigo-600" />
              <h3 className="text-2xl font-bold ml-4">Live Doubts</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Real-time doubt resolution with expert mentors through chat and video calls.
            </p>
            <div className="space-y-4 mb-8">
              <Feature icon={MessageSquare} text="24/7 chat support" />
              <Feature icon={Share2} text="Screen sharing capability" />
              <Feature icon={Crown} text="Premium mentor access" />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center">
    <Icon className="h-5 w-5 text-indigo-600" />
    <span className="ml-3 text-gray-700">{text}</span>
  </div>
);

export default Products;