import { Camera, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Camera className="h-8 w-8 text-blue-800 mr-3" />
              <span className="text-2xl font-bold text-gray-900">SEO Snap</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Transform your product photos into compelling, SEO-optimized descriptions with the power of AI. 
              Trusted by thousands of e-commerce businesses worldwide.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/seosnap" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-800 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://github.com/seosnap" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-800 transition-colors"
                aria-label="View our GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="mailto:hello@seosnap.com"
                className="text-gray-500 hover:text-blue-800 transition-colors"
                aria-label="Email us"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/plans" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-800 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@seosnap.com" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#community" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SEO Snap. All rights reserved. Made with ❤️ for e-commerce businesses.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;