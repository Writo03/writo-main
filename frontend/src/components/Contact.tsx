import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function ContactUs() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Get in Touch</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            We're here to help you succeed in your educational journey. Reach
            out to us with any questions or concerns.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Find us through various channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-purple-600" />
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-purple-600" />
                  <span>info@writo-education.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 flex-shrink-0 text-purple-600" />
                  <span>
                    123 Education Street, Knowledge City, Learning State -
                    100001, India
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-purple-600" />
                  <span>Monday - Saturday: 9:00 AM - 6:00 PM</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl">Connect With Us</CardTitle>
                <CardDescription>Follow us on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-purple-600"
                  >
                    <Facebook size={24} />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-purple-600"
                  >
                    <Twitter size={24} />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-purple-600"
                  >
                    <Instagram size={24} />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-purple-600"
                  >
                    <Linkedin size={24} />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  We'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone (optional)
                    </label>
                    <Input id="phone" type="tel" placeholder="+91 1234567890" />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="courses">
                          Course Information
                        </SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      className="h-32"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="mb-4 text-center text-2xl font-bold">Find Us</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965634179067!2d77.64954031482158!3d12.934494090877536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1451d4a09b0f%3A0x3a4c2528f212f3d5!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1605942334134!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Writo Education Location"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}
