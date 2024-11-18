import React from "react";
import { useParams, Navigate } from "react-router-dom";
import TestSeriesDetails, { ExamDetailsProps } from "./TestSeriesDetails";

interface Data {
  jee: ExamDetailsProps;
  neet: ExamDetailsProps;
}

const data: Data = {
  jee: {
    examName: "JEE Main + Advanced",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    subjects: [
      { name: "Maths", topics: ["Topic 1", "Topic 2"] },
      { name: "Physics", topics: ["Topic 1", "Topic 2"] },
      { name: "Chemistry", topics: ["Topic 1", "Topic 2"] },
    ],
    duration: "30 mins",
    price: 99,
    benefits: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    ],
    aboutProgram:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    languages: ["English", "Hindi"],
  },
  neet: {
    examName: "NEET Exam",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    subjects: [
      { name: "Biology", topics: ["Topic 1", "Topic 2"] },
      { name: "Physics", topics: ["Topic 1", "Topic 2"] },
      { name: "Chemistry", topics: ["Topic 1", "Topic 2"] },
    ],
    duration: "30 mins",
    price: 99,
    benefits: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    ],
    aboutProgram:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci. Donec euismod, nisl eget viverra ultrices, nunc nisl aliquet neque, euismod ultrices nisi ipsum eget orci.",
    languages: ["English", "Hindi"],
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
