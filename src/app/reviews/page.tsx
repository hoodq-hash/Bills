"use client"
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { 
  Star,
  ThumbsUp,
  ShieldCheck,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Alex M.",
      location: "United States",
      rating: 5,
      date: "November 15, 2024",
      title: "Excellent Service and Fast Delivery",
      comment: "Outstanding service from start to finish. The shipping was incredibly fast and the tracking system kept me informed throughout. Everything arrived exactly as described.",
      verified: true,
      productType: "Express Shipping"
    },
    {
      id: 2,
      name: "Sarah K.",
      location: "Canada",
      rating: 5,
      date: "November 12, 2024",
      title: "Very Professional and Reliable",
      comment: "This is my third time using their service and each time has been perfect. The customer support is responsive and helpful. Will definitely use again.",
      verified: true,
      productType: "Standard Shipping"
    },
    {
      id: 3,
      name: "Michael R.",
      location: "United Kingdom",
      rating: 5,
      date: "November 10, 2024",
      title: "Top Notch Security and Privacy",
      comment: "Very impressed with the security measures and privacy protection. Everything was handled professionally and discretely.",
      verified: true,
      productType: "Premium Service"
    },
    {
      id: 4,
      name: "David L.",
      location: "Australia",
      rating: 5,
      date: "December 8, 2024",
      title: "Reliable International Shipping",
      comment: "International shipping can be tricky, but they handled everything perfectly. Great communication throughout the process.",
      verified: true,
      productType: "International Shipping"
    },
    {
      id: 5,
      name: "Emma S.",
      location: "Germany",
      rating: 4,
      date: "November 5, 2024",
      title: "Good Service Overall",
      comment: "Very good service and support. Only giving 4 stars because shipping took a bit longer than expected, but everything else was perfect.",
      verified: true,
      productType: "Standard Shipping"
    },
    {
      id: 6,
      name: "James H.",
      location: "France",
      rating: 5,
      date: "December 3, 2024",
      title: "Exceptional Customer Support",
      comment: "The support team went above and beyond to help with my queries. Very professional and knowledgeable service.",
      verified: true,
      productType: "Express Shipping"
    }
  ];

  const stats = [
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      value: "98%",
      label: "Satisfaction Rate"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      value: "100%",
      label: "Secure Transactions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "24/7",
      label: "Customer Support"
    }
  ];

  const calculateAverageRating = () => {
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-elite-surface">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Customer Reviews
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl">
            See what our customers are saying about our services
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-elite-surface/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-elite-surface p-6 rounded-xl border border-elite-border hover:border-elite-gold transition-all duration-300">
                <div className="w-12 h-12 bg-elite-gold/20 rounded-lg flex items-center justify-center mb-4 text-elite-gold">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Rating Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-elite-surface rounded-xl p-8 border border-elite-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-white mb-4">
                  {calculateAverageRating()}
                </div>
                <div className="flex justify-center md:justify-start mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-gray-400">
                  Based on {reviews.length} verified reviews
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-center md:text-right text-elite-muted">
                  Trusted by customers worldwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-elite-surface rounded-xl p-6 border border-elite-border hover:border-elite-gold transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-elite-gold/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-elite-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                    <p className="text-sm text-gray-400">{review.location}</p>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <h4 className="text-white font-semibold mb-2">{review.title}</h4>
              <p className="text-gray-300 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-elite-gold">{review.productType}</span>
                <span className="text-gray-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}