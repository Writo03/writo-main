import {
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  GraduationCap,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold">Writo Education</span>
            </div>
            <p className="mb-4 text-gray-400">
              Empowering students with comprehensive test series and
              personalized Doubt resolution.
            </p>
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
                <SocialIcon link={item.link} icon={item.icon} key={idx} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Test Series", "Doubts Sessions", "About"].map(
                (item, idx) => (
                  <FooterLink
                    link={
                      item == "Home"
                        ? "/"
                        : `/${item.split(" ").join("-").toLowerCase()}`
                    }
                    text={item}
                    key={idx}
                  />
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@writo.tech"
                  className="duration-400 group inline-block transform text-gray-400 transition hover:-translate-y-1"
                >
                  <span className="group-hover:text-primary">
                    support@writo.tech
                  </span>
                </a>
              </li>
              <li className="text-gray-400">
                <a
                  href="tel:+918059458609"
                  className="duration-400 group inline-block transform text-gray-400 transition hover:-translate-y-1"
                >
                  <span className="group-hover:text-primary">
                    +91 8059458609
                  </span>
                </a>
              </li>
              <li className="text-gray-400">
                <span>Rewa, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Writo Education. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialIcon = ({ link, icon: Icon }: { link: string; icon: any }) => (
  <a
    href={link}
    className="duration-400 group transform rounded-lg font-bold text-gray-400 transition hover:-translate-y-1"
  >
    <Icon className="h-6 w-6 group-hover:text-primary" />
  </a>
);

const FooterLink = ({ link, text }: { link: string; text: string }) => (
  <li>
    <a
      href={link}
      className="duration-400 group inline-block transform text-gray-400 transition hover:-translate-y-1"
    >
      <span className="group-hover:text-primary">{text}</span>
    </a>
  </li>
);

export default Footer;
