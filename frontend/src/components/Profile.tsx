// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Edit3,
  Camera,
  Save,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RootState } from "@/types/state";
import axiosInstance from "@/utils/axiosInstance";
import { updateuser } from "@/redux/auth";

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import TestList from "./Testlist";
import { Card, CardContent } from "./ui/card";
import Navbar from "@/MainLayout/NavBar";

const MemoizedNavbar = React.memo(Navbar);

// Validation Schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.number().optional(),
  institution: z.string().optional(),
});

const Profile = () => {
  // useEffect(async ()=>{
  //   const res = await axiosInstance.get("/chat/get-all-chats");
  //   console.log("CHATS:",res);
  // },[])

  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  // console.log(user)
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | undefined>(
    undefined,
  );

  // Form Hook
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || undefined,
      institution: user?.institution || "",
    },
  });

  // Profile Picture Upload
  const handleProfilePictureUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Cloudinary Upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "spx0jjqq");

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );

      // Backend Update
      const backendResponse = await axiosInstance.post("/user/updateprofile", {
        profilePic: cloudinaryResponse.data.url,
      });

      if (backendResponse.status === 200) {
        setImagePreview(cloudinaryResponse.data.url);
        dispatch(
          updateuser({
            user: {
              ...user,
              profilePic: cloudinaryResponse.data.url,
            },
          }),
        );

        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been successfully updated.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description:
          error.response?.data?.error?.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Profile Update Submit Handler
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const response = await axiosInstance.put("/user/self", data);

      if (response.status === 200) {
        const updatedUser = response.data?.data;

        dispatch(
          updateuser({
            user: {
              userId: updatedUser._id,
              email: updatedUser.email,
              fullName: updatedUser.fullName,
              institution: updatedUser.institution,
              phone: updatedUser.phone,
              target: updatedUser.target || "",
              isAdmin: updatedUser.isAdmin,
              isMentor: updatedUser.isMentor,
              profilePic: updatedUser.profilePic || "",
            },
          }),
        );

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });

        setIsModalOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };
  const [openItem, setOpenItem] = useState<string | null>(null);
  const items = [
    {
      value: "personal-information",
      trigger: "Personal Information",
      icon: <UserIcon className="h-6 w-6 text-white" />,
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-foreground">{user?.fullName}</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-foreground">{user?.phone}</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Institution</p>
                <p className="text-foreground">{user?.institution}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   value: "educational-services",
    //   trigger: "Educational Services",
    //   icon: <Book className="h-6 w-6 text-primary" />,
    //   content: (
    //     <div className="space-y-4">
    //       {Object.entries(user?.student_services || {}).map(([service, isActive]) => (
    //         <div
    //           key={service}
    //           className="group overflow-hidden rounded-lg bg-card shadow-sm transition-all hover:shadow-md"
    //         >
    //           <div className="flex items-center justify-between p-4">
    //             <div className="flex items-center space-x-3">
    //               <div
    //                 className={`flex h-10 w-10 items-center justify-center rounded-full ${
    //                   isActive ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground'
    //                 }`}
    //               >
    //                 <Book className="h-5 w-5" />
    //               </div>
    //               <div>
    //                 <p className="font-medium text-foreground">
    //                   {service.replace(/([A-Z])/g, ' $1').trim()}
    //                 </p>
    //                 <p
    //                   className={`text-sm ${
    //                     isActive ? 'text-primary' : 'text-destructive'
    //                   }`}
    //                 >
    //                   {isActive ? 'Active' : 'Inactive'}
    //                 </p>
    //               </div>
    //             </div>
    //             <button
    //               className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100"
    //               onClick={() => {
    //                 if (service === "neetTestSeries") navigate("/neet-price");
    //                 if (service === "jeeTestSeries") navigate("/jee-price");
    //                 if (service === "doubtClearing") navigate("/doubtcourses");
    //               }}
    //             >
    //               {isActive ? "Manage" : "Activate"}
    //             </button>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
  ];

  const toggleItem = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  const ProfileSection = ({
    title,
    icon: Icon,
    children,
    name,
  }: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    children: React.ReactNode;
    name: string;
  }) => (
    <AccordionItem value={name} className="border-b">
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          <span className="text-lg font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-0">{children}</AccordionContent>
    </AccordionItem>
  );

  if (!user) {
    return (
      <div className="min-h-screen animate-pulse bg-background p-6">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-12 shadow-lg">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="group relative">
            <Avatar className="mx-auto h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage
                src={imagePreview || user.profilePic}
                alt="Profile Picture"
              />
              <AvatarFallback>
                <UserIcon className="h-16 w-16 text-gray-400" />
              </AvatarFallback>

              <label
                htmlFor="profile-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                {isUploading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                ) : (
                  <Camera className="h-10 w-10 text-white" />
                )}
                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProfilePictureUpload(file);
                  }}
                />
              </label>
            </Avatar>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-white">
            {user.fullName}
          </h2>
          <Badge variant="secondary" className="mt-2">
            {user.target || "No target set"}
          </Badge>
          <p className="mt-2 text-white/80">{user.email}</p>

          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="overflow-hidden rounded-lg bg-card shadow-lg">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.value}
                className="border-b border-border last:border-none"
                data-state={openItem === item.value ? "open" : "closed"}
              >
                <button
                  className="group flex w-full items-center justify-between px-6 py-4 transition-all hover:bg-muted"
                  onClick={() => toggleItem(item.value)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium text-foreground">
                      {item.trigger}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openItem === item.value ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                <div
                  className="overflow-hidden bg-muted transition-all"
                  style={{
                    height: openItem === item.value ? "auto" : 0,
                    opacity: openItem === item.value ? 1 : 0,
                  }}
                >
                  <div className="p-6">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4">
        <TestList />
      </div>
      {/* Edit Profile Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={activeSection}
            onValueChange={setActiveSection}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <ProfileSection
                  title="Personal Information"
                  icon={UserIcon}
                  name="personal"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ProfileSection>
                <ProfileSection
                  title="Contact Details"
                  icon={Phone}
                  name="contact"
                >
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your institution"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ProfileSection>

                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function () {
  return (
    <div className="min-h-screen flex-col bg-gray-50">
      <MemoizedNavbar className="absolute"/>
      <Profile />
    </div>
  );
}
