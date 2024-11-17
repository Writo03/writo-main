import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useSelector } from "react-redux";
import {
  GraduationCap,
  CornerRightUp,
  LogOut,
  Settings,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/types/state";
import { isMobile } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import axiosInstance from "@/utils/axiosInstance";
import { logout } from "@/redux/auth";
import { useToast } from "@/components/hooks/use-toast";
// import Loading from "@/components/ui/Loading";
// import { setIsAuthenticated } from "@/redux/auth";

function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isSidbarOpen, setIsSidbarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { toast } = useToast()

  const navigate = useNavigate();
  const [isloading, setisloading] = useState<boolean>(false);

  useMotionValueEvent(scrollYProgress, "change", () => {
    const current = scrollYProgress.get();
    const previous = scrollYProgress.getPrevious();

    if (previous !== undefined) {
      const direction = current - previous;

      if (current < 0.05) {
        setVisible(true); // Show the nav when scrolled to the top
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    } else {
      // Handle the case when previous is undefined
      if (current < 0.05) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  const logoutHandler = async () => {
    try {
      console.log("hi");
      setisloading(true);
      const response = await axiosInstance.get("/user/logout");
      if (response.status === 200) {
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
        setisloading(false);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast({
        title: 'Error while Logout!',
        description: error.response?.data?.message,
        variant: 'default',
      });
      setisloading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="fixed inset-x-0 z-[5000] flex items-center justify-center"
      >
        <NavigationMenu>
          <NavigationMenuList className="mt-1 w-[98vw] justify-between rounded-[var(--radius)] bg-[rgba(255,255,255,0.5)] px-3 py-1 text-base backdrop-blur-sm md:mt-2 md:px-6 md:py-3 md:text-xl lg:text-2xl">
            {/* Logo */}
            <NavigationMenuItem>
              <Link to="/">
                <img
                  src="/logo-with-text.png"
                  alt="Logo"
                  className="w-18 h-6 cursor-pointer md:h-6 md:w-24 lg:h-7 lg:w-28"
                />
              </Link>
            </NavigationMenuItem>
            {!isMobile() ? (
              <>
                {/* Navigation Menu */}
                <div className="flex">
                  {/* Test Series */}
                  <NavigationMenuItem
                    className="relative"
                    onClick={() => navigate("/test-series")}
                  >
                    <NavigationMenuTrigger>Test Series</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/test-series"
                            >
                              <GraduationCap className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Writo All India Test Series
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Achieve your best with Writo All India Test
                                Series - Realistic exam practice for real
                                results.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/test-series/neet" title="NEET Exam">
                          Re-usable components built using Radix UI and Tailwind
                          CSS.
                        </ListItem>
                        <ListItem
                          href="/test-series/neet"
                          title="JEE(Main + Adv)"
                        >
                          How to install dependencies and structure your app.
                        </ListItem>
                        <ListItem href="/test-series" title="Learn More">
                          Styles for headings, paragraphs, lists...etc
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  {/* Dought Sessions */}
                  <NavigationMenuItem>
                    <Link to="/docs">
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent",
                        )}
                      >
                        Dought Sessions
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {/* About Us */}
                  <NavigationMenuItem>
                    <Link to="/docs">
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent",
                        )}
                      >
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {/* Contect Us */}
                  <NavigationMenuItem>
                    <Link to="/docs">
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent",
                        )}
                      >
                        Contact
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </div>
                {/* Login/Signin */}
                {!isAuthenticated ? (
                  <NavigationMenuItem>
                    <Link to="/signin">
                      <Button>Login</Button>
                    </Link>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar>
                            <AvatarImage src="/profile.png" alt="@ks" />
                            <AvatarFallback>KS</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <Link
                            to="/profile"
                            className="flex w-full items-center"
                          >
                            {user.fullName}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            to="/settings"
                            className="flex w-full items-center"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutHandler}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                )}
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <SidebarIcon
                    className="h-8"
                    onClick={() => setIsSidbarOpen(true)}
                  />
                  <Sidebar
                    open={isSidbarOpen}
                    setOpen={setIsSidbarOpen}
                    auth={isAuthenticated}
                  />
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </AnimatePresence>
  );
}

function Sidebar({
  className,
  open,
  setOpen,
  auth,
}: {
  className?: string;
  open: boolean;
  setOpen: any;
  auth: boolean;
}) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <motion.div
      className={cn(
        "absolute top-0 z-[999999] h-[100vh] w-[100vw] bg-background px-3 pb-[13vh] text-primary-foreground",
        className,
      )}
      initial={{ left: "-110vw", opacity: 0 }}
      animate={{
        left: open ? "0vw" : "-110vw",
        opacity: open ? 1 : 0,
        transition: { duration: 0.4 },
      }}
    >
      <div className="relative mt-2 flex items-center justify-between px-2">
        <span className="rounded-lg bg-white p-1">
          <img src="logo-only.png" className="h-8 w-8" alt="logo" />
        </span>
        <SidebarIcon onClick={() => setOpen(false)} className="h-8" />
        <div className="absolute left-0 top-0 z-[-1] h-full w-full pl-6 pr-1">
          {/* alternate color bg-[#1F5F69] */}
          <div className="h-full w-full rounded-lg bg-primary opacity-90"></div>{" "}
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-between bg-background py-4 text-secondary-foreground">
        <div className="flex w-full flex-col items-start justify-center space-y-4">
          {[
            {
              title: "Test Series",
              icon: <ArrowUpRight />,
              href: "/test-series",
            },
            {
              title: "Dought Sessions",
              icon: <ArrowUpRight />,
              href: "/dought-sessions",
            },
            {
              title: "About",
              icon: <ArrowUpRight />,
              href: "/about",
            },
            {
              title: "Contact",
              icon: <ArrowUpRight />,
              href: "/contact",
            },
          ].map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, left: "-110vw" }}
              animate={{
                left: open ? 0 : "-110vw",
                opacity: open ? 1 : 0,
                transition: { duration: 0.5, delay: 0.2 * idx },
              }}
              key={idx}
              className="group relative flex w-full flex-col items-start justify-start active:bg-primary active:text-white"
              onClick={() => navigate(item.href)}
            >
              <motion.hr className="h-[2px] w-full bg-primary" />
              <motion.h1 className="text-left text-[2rem] font-bold leading-tight">
                {item.title}
                {item.icon && (
                  <div className="absolute right-0 top-0 flex h-full w-4 items-center justify-center text-primary">
                    <ArrowUpRight className="group-active:text-white" />
                  </div>
                )}
              </motion.h1>
              <motion.hr className="h-[2px] w-full bg-primary" />
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, bottom: "-100vw" }}
          animate={{
            bottom: open ? 0 : "-100vw",
            opacity: open ? 1 : 0,
            transition: { duration: 0.5, delay: 0.2 * 3 },
          }}
          className="relative w-full"
        >
          {/* Login/Signin */}
          {!auth ? (
            <NavigationMenuItem>
              <Link to="/signin">
                <Button size="lg" className="w-full text-xl">
                  Login
                </Button>
              </Link>
            </NavigationMenuItem>
          ) : !isMobile() ? (
            <NavigationMenuItem className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="/profile.png" alt="@ks" />
                      <AvatarFallback>KS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full items-center">
{user.fullName}                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          ) : (
            <div className="flex w-full items-center justify-between px-4">
              <Link to="/profile" className="flex w-full items-center text-2xl">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src="/profile.png" alt="@ks" />
                    <AvatarFallback>KS</AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
              <span className="flex space-x-4">
                <Link to="/settings">
                  <LogOut className="h-6 w-6" />
                </Link>
                <Link to="/settings">
                  <Settings className="h-6 w-6" />
                </Link>
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
export default Navbar;

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink>
          <a
            ref={ref}
            className={cn(
              "group flex select-none items-center justify-between space-x-3 rounded-md px-2 py-1 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              {children && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              )}
            </div>
            <CornerRightUp className="hidden h-3 w-3 text-base group-hover:block" />
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

function SidebarIcon({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      aria-label="Open-sidebar"
      className={cn("rounded-lg focus-visible:outline-0", className)}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
          fill="currentColor"
        ></path>
      </svg>
    </button>
  );
}
