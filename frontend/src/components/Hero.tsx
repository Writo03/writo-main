import { ArrowRight, Brain, Video } from "lucide-react";
import { Button } from "./ui/button";
import HeroSlider from "./Home/HomeSlider";

const Hero = () => {
  return (
    <div className="pt-10">
      <div className="mt-[5vh] h-[20vh] w-full md:h-[30vh] lg:h-[40vh]">
        <HeroSlider
          items={Array.from({ length: 9 }).map(
            (_, i) => `https://picsum.photos/1920/1080?random=${i}`,
          )}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Master Your Studies with
            <span className="text-indigo-600"> Writo Education</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Comprehensive test series and live doubt-solving sessions to help
            you achieve academic excellence.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Button size="xl">
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <Brain className="mb-4 h-12 w-12 text-indigo-600" />
            <h3 className="mb-4 text-2xl font-bold">
              Comprehensive Test Series
            </h3>
            <p className="mb-4 text-gray-600">
              Practice with our expertly crafted tests, get instant feedback,
              and track your progress on the leaderboard.
            </p>
            <button className="inline-flex items-center font-semibold text-indigo-600">
              Explore Tests <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <Video className="mb-4 h-12 w-12 text-indigo-600" />
            <h3 className="mb-4 text-2xl font-bold">Live Doubt Sessions</h3>
            <p className="mb-4 text-gray-600">
              Connect with expert mentors through chat or video calls for
              real-time doubt resolution and screen sharing.
            </p>
            <button className="inline-flex items-center font-semibold text-indigo-600">
              Join Sessions <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
