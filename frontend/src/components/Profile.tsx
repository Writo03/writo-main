import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/types/state";
import { User, Book, ChevronDown } from "lucide-react";

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      navigate("/signin");
    }
  }, [auth, navigate]);

  const items = [
    {
      value: "personal-information",
      trigger: "Personal Information",
      icon: <User className="h-6 w-6 text-white" />,
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium ">Name</p>
                <p className="text-foreground">{user?.fullName}</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 border-l-4 border-primary bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium ">Email</p>
                <p className="text-foreground">{user?.email}</p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary py-12 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-center">
              
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                  <User className="h-16 w-16 text-primary" />
                </div>
                  <h2 className="mt-4 text-2xl font-bold text-white">{user?.fullName}</h2>
              <p className="mt-2 text-white">{user?.email}</p>
            </div>
          </div>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-primary-foreground">
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
    </div>
  );
};

export default Profile;
