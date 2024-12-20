import { ArrowRight, Brain, Video } from "lucide-react";
import { Button } from "./ui/button";
import HeroSlider from "./Home/HomeSlider";

import sliderimg1 from "@/assets/slider!img/1.png";
import sliderimg2 from "@/assets/slider!img/2.png";
import sliderimg3 from "@/assets/slider!img/3.png";
import sliderimg4 from "@/assets/slider!img/4.png";
import sliderimg5 from "@/assets/slider!img/5.png";

import { Suspense, memo } from "react";
import { useNavigate } from "react-router-dom";

export function Fallback() {
  return (
    <div className="h-full w-full bg-primary text-center text-2xl text-primary-foreground">
      Loading...
    </div>
  );
}
const MemoizedFallback = memo(Fallback);

interface Item {
  src: string;
  alt: string;
  href?: string;
}

const data: Item[] = [
  { src: sliderimg1, alt: "All India Test Series", href: "/test-series" },
  { src: sliderimg2, alt: "Doubt Sessions", href: "/doubt-sessions" },
  { src: sliderimg3, alt: "All India Test Series JEE", href: "/test-series/details/jee" },
  { src: sliderimg4, alt: "All India Test Series NEET", href: "/test-series/details/neet" },
  { src: sliderimg5, alt: "School Batch", href: "" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 md:pt-10">
      <div className="mt-[5vh] h-[12vh] w-full md:h-[20vh] lg:h-[35vh]">
        <Suspense fallback={<MemoizedFallback />}>
          <HeroSlider items={data} />
        </Suspense>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Make Yourself Future Fit
            <span className="text-primary"> Writo Education</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Comprehensive test series and live Doubt Solving sessions to help
            you achieve academic excellence.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Button size="xl" onClick={() => navigate("/test-series")}>
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" onClick={() => navigate("/")}>
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <Brain className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-4 text-2xl font-bold">
              Comprehensive Test Series
            </h3>
            <p className="mb-4 text-gray-600">
              Practice with our expertly crafted tests, get instant feedback,
              and track your progress on the leaderboard.
            </p>
            <button
              className="inline-flex items-center font-semibold text-primary"
              onClick={() => navigate("/test-series")}
            >
              Explore Tests <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <Video className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-4 text-2xl font-bold">Live Doubt Sessions</h3>
            <p className="mb-4 text-gray-600">
              Connect with expert mentors through chat or video calls for
              real-time Doubt resolution and screen sharing.
            </p>
            <button
              className="inline-flex items-center font-semibold text-primary"
              onClick={() => navigate("/doubt-sessions")}
            >
              Join Sessions <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
