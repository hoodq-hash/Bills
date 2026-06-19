"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-8 text-elite-gold">
          Terms and Conditions — Elite Notes
        </h1>

        <div className="space-y-8">
          <section className="bg-elite-surface rounded-lg p-6 border border-elite-border">
            <p className="leading-relaxed">
              These terms and conditions ("Terms") govern your use of the Elite
              Notes website and services. By accessing our website and
              placing orders, you agree to abide by these Terms. Please read
              them carefully.
            </p>
          </section>

          {[
            {
              title: "1. Age Requirement:",
              content:
                "You must be at least 18 years old to use our website and purchase our bills.",
            },
            {
              title: "2. Bill Information:",
              content:
                "The information on our website is for general informational purposes.",
            },
            {
              title: "3. Ordering and Payment:",
              content:
                "By placing an order, you confirm that you are allowed to purchase bills on our website. We accept payments through methods provided on our website's checkout page.",
            },
            {
              title: "4. Bill Availability:",
              content:
                "We do our best to keep bill listings up to date. However, bill availability may change, and we reserve the right to limit quantities.",
            },
            {
              title: "5. Delivery:",
              content:
                "We offer delivery services worldwide to all locations discreetly.",
            },
            {
              title: "6. Privacy and Security:",
              content:
                "We value your privacy and use secure encryption to protect your personal information.",
            },
            {
              title: "7. Returns and Refunds:",
              content:
                "Please refer to our Refund Policy for details on returns and refunds.",
            },
            {
              title: "8. Intellectual Property:",
              content:
                "All content on our website is protected by intellectual property rights and may not be used without our permission.",
            },
            {
              title: "9. Amendments:",
              content:
                "We reserve the right to amend these Terms as needed. Updates will be posted on our website.",
            },
            {
              title: "10. Termination:",
              content:
                "We may terminate your access to our website and services if you violate these Terms.",
            },
            {
              title: "11. Contact Information:",
              content:
                "For questions or concerns about these Terms, please contact our customer support as listed on our website.",
            },
          ].map((section, index) => (
            <section
              key={index}
              className="bg-elite-surface rounded-lg p-6 border border-elite-border"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {section.title}
              </h2>
              <p className="leading-relaxed">{section.content}</p>
            </section>
          ))}

          <section className="bg-elite-surface rounded-lg p-6 border border-elite-border">
            <p className="leading-relaxed">
              By using our website and services, you agree to these Terms and
              acknowledge that any violation may result in legal action. Elite
              Notes reserves the right to modify these Terms at any time.
              It is your responsibility to check for updates.
            </p>
          </section>
        </div>
      </div>
      <Footer/>
    </div>
  );
}















// ////////////////////////////////////////////

