import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Smartphone, Menu, X, Home, BarChart3 } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Beranda", icon: Home },
    { path: "/analisis", label: "Analisis AHP", icon: BarChart3 },
  ];

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        backdrop-blur-lg
        bg-white/70 border border-gray-200/40
        dark:bg-gray-900/60 dark:border-gray-700/40
        shadow-xl rounded-2xl transition-all duration-500
        max-w-5xl w-[92%] sm:w-[90%] px-4 sm:px-6 lg:px-8
        animate-[fadeInDown_0.6s_ease-out]
      `}
    >
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent leading-tight">
              Selectra
            </span>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              Smartphone Decision System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-800 hover:bg-gray-100/60 dark:text-gray-300 dark:hover:bg-gray-800/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-colors"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Mobile Navigation (Dropdown) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col py-3 border-t border-gray-200/40 dark:border-gray-700/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-gray-800 hover:bg-gray-100/60 dark:text-gray-300 dark:hover:bg-gray-800/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
