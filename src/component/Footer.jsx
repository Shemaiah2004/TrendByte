import React from "react";
import { motion } from "framer-motion";
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaRocket 
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="space-y-4"
          >
            <div className="flex items-center">
              <FaRocket className="text-indigo-400 text-2xl mr-2" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Trendy-Bytes
              </span>
            </div>
            <p className="text-gray-400">
              Exploring the future of e-commerce with cutting-edge technology and innovative design.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.2, color: "#818CF8" }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
              Trendy Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Features", href: "/features" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
              Connect With Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Trendy Avenue<br />
                  Tech City, TC 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-400 mr-3" />
                <a 
                  href="mailto:info@Trendyshop.com" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  info@Trendyshop.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-indigo-400 mr-3" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
              Trendy Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and futuristic products.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-r-lg flex items-center"
              >
                <FiSend className="mr-2" />
                Join
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} TrendyShop. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}