import React from 'react';
import { Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start items-center gap-2 mb-4 md:mb-0">
            <Database className="text-primary-500" size={20} />
            <span className="font-semibold text-gray-900 dark:text-white">TGIRS Academic Project</span>
          </div>
          
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Home</Link>
            <Link to="/browse" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Search & Browse</Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">IR Concepts</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} CSC 522 Information Storage & Retrieval.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
