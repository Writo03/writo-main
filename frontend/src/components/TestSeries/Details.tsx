import { useParams, Navigate } from "react-router-dom";
import TestSeriesDetails, { ExamDetailsProps } from "./TestSeriesDetails";
import {serviceIds,serviceNames} from '../../utils/contants'
interface Data {
  jee: ExamDetailsProps;
  neet: ExamDetailsProps;
}

const data: Data = {
  jee: {
    examName: "JEE Online Test Series(Mains +Advance)",
    serviceName:serviceNames.jee,
    serviceId:serviceIds.jee,
    description:
      "This is a test series for the students who want to get a good score in JEE Mains and Advance. The test series is conducted by the JEE Council and is open to all the candidates who are eligible for JEE Mains and Advance.",
    subjects: [
      { name: "Maths", topics: ["Topic 1", "Topic 2"] },
      { name: "Physics", topics: ["Topic 1", "Topic 2"] },
      { name: "Chemistry", topics: ["Topic 1", "Topic 2"] },
    ],
    duration: "2 Years",
    price: 99,
    benefits: [
      "24 Tests (12 Minor + 2 Semi-Major + 10 Major) in the first year. Second year tests will be announced in April'25.",
      "Missed tests available for re-attempt",
      "Get detailed solutions for every test",
      "You get All India Rank & detailed performance analysis",
      "5000+ topic-wise questions to perfect your practice",
      "Improvement Book to track & fix all your mistakes",
    ],
    aboutPrograms: [
      {
        title: "All India Ranks",
        list: [
          "National level ranking Writo students with All India online open test",
          "Opportunity to know where you stand among everyone",
        ],
      },
      {
        title: "Test Analysis",
        list: [
          "Improvement book to revise your mistakes",
          "Detailed test performance insights of your test",
        ],
      },
      {
        title: "Flexible Test Series",
        list: [
          "Online tests which you can take from anywhere",
          "Attempt at your convenience at a 24 hr window",
        ],
      },
      {
        title: "Practice on the Go",
        list: [
          "Create quick quizzes with custom practice from 5000+ questions",
          "Online practice problems for all the topics",
        ],
      },
    ],
    languages: ["English"],
  },
  neet: {
    examName: "NEET Test Series",
    serviceName:serviceNames.neet,
    serviceId:serviceIds.neet,
    description:
      "This is a test series for the students who want to get a good score in NEET. The test series is conducted by the JEE Council and is open to all the candidates who are eligible for NEET.",
    subjects: [
      { name: "Biology", topics: ["Topic 1", "Topic 2"] },
      { name: "Physics", topics: ["Topic 1", "Topic 2"] },
      { name: "Chemistry", topics: ["Topic 1", "Topic 2"] },
    ],
    duration: "2 Years",
    price: 99,
    benefits: [
      "24 Tests (12 Minor + 2 Semi-Major + 10 Major) in the first year. Second year tests will be announced in April'25.",
      "Missed tests available for re-attempt",
      "Get detailed solutions for every test",
      "You get All India Rank & detailed performance analysis",
      "5000+ topic-wise questions to perfect your practice",
      "Improvement Book to track & fix all your mistakes",
    ],
    aboutPrograms: [
      {
        title: "All India Ranks",
        list: [
          "National level ranking Writo students with All India online open test",
          "Opportunity to know where you stand among everyone",
        ],
      },
      {
        title: "Test Analysis",
        list: [
          "Improvement book to revise your mistakes",
          "Detailed test performance insights of your test",
        ],
      },
      {
        title: "Flexible Test Series",
        list: [
          "Online tests which you can take from anywhere",
          "Attempt at your convenience at a 24 hr window",
        ],
      },
      {
        title: "Practice on the Go",
        list: [
          "Create quick quizzes with custom practice from 5000+ questions",
          "Online practice problems for all the topics",
        ],
      },
    ],
    languages: ["English"],
  },
};

function Details() {
  const { jeeorneet } = useParams();
  console.log("here", jeeorneet);
  if (jeeorneet == undefined || jeeorneet == "") {
    Navigate({ to: "/test-series" });
  } else if (jeeorneet == "jee") {
    return <TestSeriesDetails {...data.jee} />;
  } else if (jeeorneet == "neet") {
    return <TestSeriesDetails {...data.neet} />;
  }
}

export default Details;
