"use client"
import React, { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  DollarSignIcon,
  GlobeIcon,
  LockIcon,
  MessageCircleIcon,
} from "lucide-react";

export default function FAQPage() {
  const [openSection, setOpenSection] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqSections = [
    {
      id: 1,
      title: "Shipping & Delivery",
      icon: <TruckIcon className="w-6 h-6" />,
      questions: [
        {
          id: "s1q1",
          question: "How long does shipping take?",
          answer: "Standard shipping typically takes 3-5 business days within the US and 7-14 business days for international orders. Express shipping options are available for faster delivery."
        },
        {
          id: "s1q2",
          question: "Do you offer international shipping?",
          answer: "Yes, we offer worldwide shipping to most countries. Shipping times and costs vary by destination."
        },
        {
          id: "s1q3",
          question: "How do you ensure discrete shipping?",
          answer: "All packages are shipped in plain, unmarked boxes with no indication of contents. We use various shipping carriers to ensure maximum security."
        }
      ]
    },
    {
      id: 2,
      title: "Payment & Security",
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      questions: [
        {
          id: "s2q1",
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including cryptocurrency for enhanced privacy and security."
        },
        {
          id: "s2q2",
          question: "How do you protect customer information?",
          answer: "We use end-to-end encryption and secure servers. All customer data is automatically deleted after order completion."
        },
        {
          id: "s2q3",
          question: "Is my transaction secure?",
          answer: "Yes, all transactions are processed through secure, encrypted channels. We don't store any payment information."
        }
      ]
    },
    {
      id: 3,
      title: "Bills & Services",
      icon: <CreditCardIcon className="w-6 h-6" />,
      questions: [
        {
          id: "s3q1",
          question: "What types of bills do you offer?",
          answer: "We offer a wide range of high-quality bills in USD, Euro, GBP, and CAD. Contact our support team for detailed information about our current inventory."
        },
        {
          id: "s3q2",
          question: "Do you offer quality guarantees?",
          answer: "Yes, we stand behind the quality of our bills. Each order undergoes strict quality control before shipping."
        },
        {
          id: "s3q3",
          question: "How do I check bill availability?",
          answer: "Bill availability is shown in real-time on our website. You can also contact support for specific inquiries."
        }
      ]
    },
    {
      id: 4,
      title: "Support & Assistance",
      icon: <MessageCircleIcon className="w-6 h-6" />,
      questions: [
        {
          id: "s4q1",
          question: "How can I contact customer support?",
          answer: "Our support team is available 24/7 through live chat, email, and secure messaging platforms."
        },
        {
          id: "s4q2",
          question: "What if I have issues with my order?",
          answer: "Contact our support team immediately with your order number, and we'll resolve any issues promptly."
        },
        {
          id: "s4q3",
          question: "Do you offer refunds?",
          answer: "Each case is handled individually. Contact support to discuss any concerns about your order."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-elite-surface">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl">
            Find answers to common questions about our services and bills
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {faqSections.map((section) => (
          <div key={section.id} className="mb-8">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-6 bg-elite-surface rounded-xl hover:bg-elite-surface/80 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-elite-gold/20 flex items-center justify-center text-elite-gold">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
              {openSection === section.id ? (
                <ChevronUpIcon className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-gray-400" />
              )}
            </button>

            {openSection === section.id && (
              <div className="mt-4 space-y-4">
                {section.questions.map((q) => (
                  <div key={q.id} className="border border-elite-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                      className="w-full flex items-center justify-between p-4 bg-elite-surface/50 hover:bg-elite-surface transition-all duration-300"
                    >
                      <span className="text-white text-left">{q.question}</span>
                      {openQuestion === q.id ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openQuestion === q.id && (
                      <div className="p-4 bg-elite-surface/30 text-gray-300">
                        {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}