import { ArrowRight, Brain, Video } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Studies with
            <span className="text-indigo-600"> Writo Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive test series and live doubt-solving sessions to help
            you achieve academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Button size="lg">
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Brain className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Comprehensive Test Series
            </h3>
            <p className="text-gray-600 mb-4">
              Practice with our expertly crafted tests, get instant feedback,
              and track your progress on the leaderboard.
            </p>
            <button className="text-indigo-600 font-semibold inline-flex items-center">
              Explore Tests <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Video className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Live Doubt Sessions</h3>
            <p className="text-gray-600 mb-4">
              Connect with expert mentors through chat or video calls for
              real-time doubt resolution and screen sharing.
            </p>
            <button className="text-indigo-600 font-semibold inline-flex items-center">
              Join Sessions <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
