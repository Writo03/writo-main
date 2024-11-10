import React from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-2xl font-bold">Writo Education</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering students with comprehensive test series and personalized doubt resolution.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink text="Home" />
              <FooterLink text="Test Series" />
              <FooterLink text="Live Doubts" />
              <FooterLink text="About Us" />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@writoeducation.com</li>
              <li className="text-gray-400">+91 123 456 7890</li>
              <li className="text-gray-400">
                123 Education Street,
                <br />
                Learning Hub, 400001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Writo Education. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: { icon: any }) => (
  <a href="#" className="text-gray-400 hover:text-indigo-400">
    <Icon className="h-5 w-5" />
  </a>
);

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a href="#" className="text-gray-400 hover:text-indigo-400">
      {text}
    </a>
  </li>
);

export default Footer;