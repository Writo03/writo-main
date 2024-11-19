import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  Book,
  Globe,
  Target,
  CheckCircle,
  AlertCircle,
  CornerDownRight,
} from "lucide-react";

import { ExclusiveSection } from "@/components/ServiceShowPages/DoughtSession";

interface Subject {
  name: string;
  topics: string[];
}

interface AboutProgram {
  title:
    | "All India Ranks"
    | "Test Analysis"
    | "Flexible Test Series"
    | "Practice on the Go";
  list: string[];
}

export interface ExamDetailsProps {
  examName: string;
  description: string;
  subjects: Subject[];
  languages: string[];
  duration: string;
  price: number;
  benefits: string[];
  aboutPrograms: AboutProgram[];
}

export default function TestSeriesDetails({
  examName,
  description,
  subjects,
  languages,
  duration,
  price,
  benefits,
  aboutPrograms,
}: ExamDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="mb-6 text-center text-4xl font-bold md:text-5xl">
          {examName} Preparation Program
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
          {description}
        </p>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" /> Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{duration}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" /> Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <Badge key={index} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2" /> Subjects Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, index) => (
                  <Badge key={index} variant="outline">
                    {subject.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Subjects and Topics</CardTitle>
            <CardDescription>
              Comprehensive coverage of all important areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {subjects.map((subject, index) => (
                <AccordionItem key={index} value={`subject-${index}`}>
                  <AccordionTrigger>{subject.name}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6">
                      {subject.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>{topic}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What You'll Get</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About the Program</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {aboutPrograms.map((aboutProgram, index) => (
                  <li key={index} className="flex flex-col">
                    <h2 className="text-lg font-bold">{aboutProgram.title}</h2>
                    <ul>
                      {aboutProgram.list.map((litem, index) => (
                        <li key={index} className="flex items-start">
                          <CornerDownRight className="mr-2 h-[5vw] w-[5vw] md:h-4 md:w-4 text-primary" />
                          <h3>{litem}</h3>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <ExclusiveSection />
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Excel?</CardTitle>
            <CardDescription>
              Join our program and take the first step towards your dream career
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center text-4xl font-bold">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Enroll Now
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="flex items-center text-sm text-gray-500">
              <AlertCircle className="mr-2 h-4 w-4" />
              30-day money-back guarantee
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
