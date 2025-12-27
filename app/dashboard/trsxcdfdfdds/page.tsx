// app/dashboard/help/page.tsx
"use client";

import React, { useState } from "react";

import {
  Car,
  Users,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Video,
  Phone,
  Mail,
  FileText,
  Download,
  Search,
  ChevronRight,
  ExternalLink,
  Headphones,
  Shield,
  Clock,
  Globe,
} from "lucide-react";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqCategories = [
    { id: "all", label: "All FAQs", icon: HelpCircle, count: 25 },
    { id: "bookings", label: "Bookings", icon: BookOpen, count: 8 },
    { id: "payments", label: "Payments", icon: FileText, count: 6 },
    { id: "vehicles", label: "Vehicles", icon: Car, count: 7 },
    { id: "customers", label: "Customers", icon: Users, count: 4 },
  ];

  const faqs = [
    {
      id: 1,
      category: "bookings",
      question: "How do I create a new booking?",
      answer:
        'Navigate to the Bookings page and click "Create New Booking". Fill in customer details, select vehicle, choose dates, and confirm payment.',
      popular: true,
    },
    {
      id: 2,
      category: "payments",
      question: "What payment methods are accepted?",
      answer:
        "We accept credit/debit cards, PayPal, cash, and bank transfers. You can configure payment methods in Settings.",
      popular: true,
    },
    {
      id: 3,
      category: "vehicles",
      question: "How do I add a new vehicle to the fleet?",
      answer:
        'Go to Cars page, click "Register New Car", fill in the vehicle details, upload photos, and save.',
      popular: true,
    },
    {
      id: 4,
      category: "customers",
      question: "How can I send bulk messages to customers?",
      answer:
        "Use the Customers page broadcast feature to send SMS or email messages to selected or all customers.",
      popular: false,
    },
    {
      id: 5,
      category: "bookings",
      question: "How do I handle booking cancellations?",
      answer:
        'Find the booking in the Bookings page, click "Cancel", select reason, and process any refunds if applicable.',
      popular: false,
    },
  ];

  const supportContacts = [
    {
      title: "Phone Support",
      description: "Available 24/7 for urgent issues",
      icon: Phone,
      contact: "+1 (800) 123-4567",
      hours: "24/7",
    },
    {
      title: "Email Support",
      description: "Response within 24 hours",
      icon: Mail,
      contact: "support@yosrentals.com",
      hours: "Mon-Fri, 9AM-6PM",
    },
    {
      title: "Live Chat",
      description: "Instant help from our team",
      icon: MessageSquare,
      contact: "Click to start chat",
      hours: "Mon-Fri, 9AM-6PM",
    },
    {
      title: "Emergency Line",
      description: "For critical system issues",
      icon: Headphones,
      contact: "+1 (800) 999-8888",
      hours: "24/7",
    },
  ];

  const documentation = [
    {
      title: "User Manual",
      description: "Complete guide to using YOS Rentals",
      icon: BookOpen,
      size: "5.2 MB",
      format: "PDF",
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Developer guide for integrations",
      icon: FileText,
      size: "2.8 MB",
      format: "PDF",
      link: "#",
    },
    {
      title: "Setup Guide",
      description: "Step-by-step installation guide",
      icon: Video,
      size: "15.3 MB",
      format: "Video",
      link: "#",
    },
    {
      title: "Security Guide",
      description: "Best practices for data security",
      icon: Shield,
      size: "1.5 MB",
      format: "PDF",
      link: "#",
    },
  ];

  const tutorials = [
    {
      title: "Getting Started",
      duration: "5 min",
      level: "Beginner",
      topics: ["Dashboard Overview", "Navigation", "Basic Settings"],
    },
    {
      title: "Managing Bookings",
      duration: "12 min",
      level: "Intermediate",
      topics: [
        "Creating Bookings",
        "Modifying Reservations",
        "Processing Payments",
      ],
    },
    {
      title: "Fleet Management",
      duration: "18 min",
      level: "Advanced",
      topics: [
        "Adding Vehicles",
        "Maintenance Tracking",
        "Insurance Management",
      ],
    },
    {
      title: "Customer Management",
      duration: "10 min",
      level: "Intermediate",
      topics: ["Customer Profiles", "Communication Tools", "Loyalty Programs"],
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Help & Support
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get help, browse documentation, and contact support
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Support Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportContacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <div
              key={contact.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                {contact.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {contact.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">
                    Contact:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {contact.contact}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-500 dark:text-gray-400">
                    {contact.hours}
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact Now
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }
                `}
                >
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-left font-medium text-gray-800 dark:text-white">
                        {faq.question}
                      </h4>
                      {faq.popular && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No FAQs found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or browse all categories
            </p>
          </div>
        )}
      </div>

      {/* Documentation & Tutorials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Documentation
              </h3>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {documentation.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.title}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {doc.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {doc.size} • {doc.format}
                    </span>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Download className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tutorials */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Video className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Video Tutorials
              </h3>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.title}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {tutorial.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {tutorial.duration}
                    </span>
                    <span
                      className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${
                        tutorial.level === "Beginner"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : ""
                      }
                      ${
                        tutorial.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : ""
                      }
                      ${
                        tutorial.level === "Advanced"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : ""
                      }
                    `}
                    >
                      {tutorial.level}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutorial.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Watch Tutorial
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <Globe className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Additional Resources
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="#"
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Community Forum
              </h4>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect with other users and share tips
            </p>
          </a>

          <a
            href="#"
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Release Notes
              </h4>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay updated with latest features and fixes
            </p>
          </a>

          <a
            href="#"
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Training Schedule
              </h4>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join our weekly training sessions
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Import missing icons
