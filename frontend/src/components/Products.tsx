import React from "react";
import {
  CheckCircle2,
  Trophy,
  Users,
  Clock,
  Video,
  MessageSquare,
  Share2,
  Crown,
} from "lucide-react";

const Products = () => {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Our Products
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect learning solution for your needs
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Test Series Card */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8">
            <div className="mb-6 flex items-center">
              <Trophy className="h-10 w-10 text-primary" />
              <h3 className="ml-4 text-2xl font-bold">Test Series</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Comprehensive practice tests with detailed analytics and
              competitive rankings.
            </p>
            <div className="mb-8 space-y-4">
              <Feature
                icon={CheckCircle2}
                text="Multiple subjects and topics"
              />
              <Feature icon={Users} text="Compare with peers on leaderboard" />
              <Feature icon={Clock} text="Timed tests with instant results" />
            </div>
            <button className="w-full rounded-lg bg-primary py-3 text-white hover:bg-primary/90">
              Start Practicing
            </button>
          </div>

          {/* Live Doubts Card */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8">
            <div className="mb-6 flex items-center">
              <Video className="h-10 w-10 text-primary" />
              <h3 className="ml-4 text-2xl font-bold">Live Doubts</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Real-time doubt resolution with expert mentors through chat and
              video calls.
            </p>
            <div className="mb-8 space-y-4">
              <Feature icon={MessageSquare} text="24/7 chat support" />
              <Feature icon={Share2} text="Screen sharing capability" />
              <Feature icon={Crown} text="Premium mentor access" />
            </div>
            <button className="w-full rounded-lg bg-primary py-3 text-white hover:bg-primary/90">
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
    <Icon className="h-5 w-5 text-primary" />
    <span className="ml-3 text-gray-700">{text}</span>
  </div>
);

export default Products;
