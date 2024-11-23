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
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function ContactUs() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    for(let i:any of e.target){
      console.log(i.id) // all are working fine but subject we have to create a state
    }
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
                  <Phone className="text-primary" />
                  <span>+91 8059458609</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary" />
                  <a href="mailto:support@writoeducation.com">
                    support@writoeducation.com
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 flex-shrink-0 text-primary" />
                  <span>Rewa, India</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-primary" />
                    <span>Monday - Saturday: 9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-transparent" />
                    <span>Saturday: 9.00 am to 06.00 pm</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-transparent" />
                    <span>Sunday also available</span>
                  </div>
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
                  {[
                    {
                      link: "https://www.linkedin.com/company/writo-learning-solutions/",
                      icon: Linkedin,
                    },
                    {
                      link: "https://youtube.com/@writoacademy?si=ySierizfl6kPGwGl",
                      icon: Youtube,
                    },
                    {
                      link: "https://www.instagram.com/writoeducation?igsh=dHI1N2Q1N3FhaXEz",
                      icon: Instagram,
                    },
                    {
                      link: "https://www.facebook.com/profile.php?id=61558449281363&mibextid=ZbWKwL",
                      icon: Facebook,
                    },
                  ].map((item, idx) => (
                    <a
                      href={item.link}
                      className="text-gray-600 transition-colors hover:text-primary/90"
                      key={idx}
                    >
                      <item.icon size={24} />
                    </a>
                  ))}
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
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
