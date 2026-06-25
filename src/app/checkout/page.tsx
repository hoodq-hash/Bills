"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CreditCard,
  Bitcoin,
  ShoppingCart,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer/Footer";
import Logo from "@/components/Logo/Logo";
import { toast } from "sonner";

const CheckoutNav = ({ currentStep = 2 }) => {
  const steps = [
    { id: 1, name: "Cart", icon: ShoppingCart },
    { id: 2, name: "Checkout", icon: CreditCard },
    { id: 3, name: "Confirmation", icon: CheckCircle },
  ];

  return (
    <nav
      className="bg-elite-bg border-b border-elite-border"
      aria-label="Checkout progress"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo size="sm" />
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <ChevronRight
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`flex items-center space-x-2 ${isActive
                        ? "text-elite-gold"
                        : isPast
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span
                      className={`text-sm font-medium ${isActive
                          ? "text-elite-gold"
                          : isPast
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center">
            <div className="flex items-center space-x-2 text-gray-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function Page() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
    notes: "",
    shippingAddress: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bitcoin");
  const [selectedCity, setSelectedCity] = useState(""); // Add this line
  const [shippingMethod, setShippingMethod] = useState("free");
  const [differentAddress, setDifferentAddress] = useState(false);

  // Shipping costs
  const shippingCosts = {
    free: 0,
    standard: 30,
    express: 50,
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "country",
      "city",
      "zipCode",
      "phone",
      "email",
    ] as const;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = getTotalPrice();
      const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];
      const total = parseFloat(calculateTotal());

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          country: formData.country,
          city: formData.city,
          zipCode: formData.zipCode,
          notes: formData.notes,
          shippingAddress: differentAddress ? formData.shippingAddress : null,
          items: cartItems,
          shippingMethod,
          paymentMethod,
          subtotal,
          shippingCost: shipping,
          discount: 0,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      clearCart();
      router.push(`/confirmation?order=${data.orderNumber}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Fetch countries effect
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Handle country change and fetch cities
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, country }));
    setCities([]); // Clear previous cities

    if (!country) return; // If no country selected, return early

    setIsLoadingCities(true);

    try {
      // Using a different API endpoint that's more reliable for cities
      const response = await fetch(
        `https://countriesnow.space/api/v0.1/countries/cities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: countries.find((c) => c.code === country)?.name,
          }),
        }
      );

      const data = await response.json();
      const cityList =
        data._links?.["a1:items"]?.map((item) => item.name) || [];
      setCities(cityList.sort((a, b) => a.localeCompare(b)));
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Calculate total with selected shipping
  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = shippingCosts[shippingMethod];
    return (subtotal + shipping).toFixed(2);
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <CheckoutNav currentStep={2} />
      <div className="min-h-screen bg-elite-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing Details Section */}
          <div className="bg-elite-surface/50 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-200 mb-8">
              Billing Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.firstName ? "border-red-500" : "border-elite-border"
                      } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.lastName ? "border-red-500" : "border-elite-border"
                      } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company name (optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-elite-card/50 text-white px-4 py-2 border border-elite-border focus:ring-2 focus:ring-elite-gold focus:border-transparent"
                />
              </div>
              {/* Country Search */}
              <div id="country-container" className="relative mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.country ? "border-red-500" : "border-elite-border"
                    } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                >
                  <option value="">Select a country...</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {formErrors.country && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.country}
                  </p>
                )}
              </div>

              {/* City Search */}
              <div id="city-container" className="relative mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!selectedCountry || isLoadingCities}
                  className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.city ? "border-red-500" : "border-elite-border"
                    } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                >
                  <option value="">
                    {isLoadingCities
                      ? "Loading cities..."
                      : cities.length === 0
                        ? "No cities available"
                        : "Select a city..."}
                  </option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.zipCode ? "border-red-500" : "border-elite-border"
                    } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                />
                {formErrors.zipCode && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.zipCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.phone ? "border-red-500" : "border-elite-border"
                    } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-elite-card/50 text-white px-4 py-2 border ${formErrors.email ? "border-red-500" : "border-elite-border"
                    } focus:ring-2 focus:ring-elite-gold focus:border-transparent`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="different-address"
                  checked={differentAddress}
                  onChange={(e) => setDifferentAddress(e.target.checked)}
                  className="w-4 h-4 text-elite-gold rounded focus:ring-elite-gold"
                />
                <label
                  htmlFor="different-address"
                  className="text-sm text-gray-400"
                >
                  Ship to a different address?
                </label>
              </div>

              {differentAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-elite-card/50 text-white px-4 py-2 border border-elite-border focus:ring-2 focus:ring-elite-gold focus:border-transparent"
                  ></textarea>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  rows={4}
                  className="w-full bg-elite-card/50 text-white px-4 py-2 border border-elite-border focus:ring-2 focus:ring-elite-gold focus:border-transparent"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-elite-surface/50 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-200 mb-8">Your Order</h2>

            <div className="space-y-6">
              <div className="border-b border-elite-border">
                <table className="w-full bg-elite-card/50 text-white">
                  <thead>
                    <tr className="border-b border-elite-border">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">
                        Product
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-gray-400">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item._id} className="border-b border-elite-border">
                        <td className="p-4 text-sm text-gray-200">
                          {item.title} × {item.quantity}
                        </td>
                        <td className="p-4 text-sm text-gray-200 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b border-elite-border">
                      <td className="p-4 text-sm font-medium text-gray-400">
                        Subtotal
                      </td>
                      <td className="p-4 text-sm text-gray-200 text-right">
                        ${getTotalPrice().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-200">Shipping Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-elite-border cursor-pointer hover:bg-elite-card/80">
                    <input
                      type="radio"
                      name="shipping"
                      value="free"
                      checked={shippingMethod === "free"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-4 h-4 text-elite-gold"
                    />
                    <div>
                      <p className="font-medium text-gray-200">Free Shipping</p>
                      <p className="text-sm text-gray-500">2-3 business days</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-elite-border cursor-pointer hover:bg-elite-card/80">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-4 h-4 text-elite-gold"
                    />
                    <div>
                      <p className="font-medium text-gray-200">
                        Standard Shipping: $30.00
                      </p>
                      <p className="text-sm text-gray-500">1-2 business days</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-elite-border cursor-pointer hover:bg-elite-card/80">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-4 h-4 text-elite-gold"
                    />
                    <div>
                      <p className="font-medium text-gray-200">
                        Express Shipping: $50.00
                      </p>
                      <p className="text-sm text-gray-500">
                        Overnight delivery
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-200">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-elite-border cursor-pointer hover:bg-elite-card/80">
                    <input
                      type="radio"
                      name="payment"
                      value="bitcoin"
                      checked={paymentMethod === "bitcoin"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-elite-gold"
                    />
                    <Bitcoin className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-200">
                      Bitcoin - BTC
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-elite-border cursor-pointer hover:bg-elite-card/80">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-elite-gold"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-200">PayPal</span>
                  </label>
                </div>

                {paymentMethod === "bitcoin" && (
                  <div className="mt-4 p-6 bg-elite-card/80 space-y-4">
                    <p className="text-sm text-gray-200">
                      To complete your order, send payments to the bitcoin (BTC)
                      wallet address below:
                    </p>

                    <div className="bg-elite-surface/50 p-4 border border-elite-border">
                      <div className="flex justify-center mb-4">
                        <Image
                          src="/images/BTC-QR_CODE.jpg"
                          alt="Bitcoin QR Code"
                          width={200}
                          height={200}
                        // className="
                        />
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-gray-200 text-center">
                          Scan the QR code above or use the wallet address below
                        </p>

                        <div className="bg-elite-card/80 p-3 rounded-md">
                          <p className="text-sm font-mono text-gray-400 break-all text-center">
                            bc1qrrgqy8lm6p445k29m6p4dhpdhjs7zykxdn5u89
                          </p>
                        </div>

                        <div className="text-sm text-gray-200 space-y-2">
                          <p>After completing payment:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Send the transaction ID/hash</li>
                            <li>
                              Or send a screenshot of payment for verification
                            </li>
                          </ul>
                        </div>

                        <div className="border-t border-elite-border pt-4">
                          <p className="text-sm text-gray-200">
                            You can buy bitcoin at{" "}
                            <Link
                              href="/"
                              className="text-elite-gold hover:text-elite-gold-dark"
                            >
                              changelly.com/buy/btc
                            </Link>{" "}
                            or{" "}
                            <Link
                              href="/"
                              className="text-elite-gold hover:text-elite-gold-dark"
                            >
                              moonpay.com
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="mt-4 p-6 bg-elite-card/80 space-y-4">
                    <p className="text-sm text-gray-200">
                      To complete your order using PayPal, follow these steps:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-200">
                      <li>
                        Click the &quot;Pay with PayPal&quot; button below
                      </li>
                      <li>Log in to your PayPal account</li>
                      <li>Review and confirm your payment</li>
                    </ol>
                    <button className="w-full bg-elite-card/50 text-white bg-[#0070BA] py-3 hover:bg-[#003087] transition-colors duration-200">
                      Pay with PayPal
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-elite-border pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-gray-200">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#0d4b88]">
                    ${calculateTotal()}
                  </span>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-[#0A2A4A] text-white py-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-lg font-medium ${isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#4682B4]"
                    }`}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>

                <p className="mt-6 text-sm text-gray-500">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link
                    href="/privacypolicy"
                    className="text-elite-gold hover:text-elite-gold-dark"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </div>

              <div className="border-t border-elite-border pt-6">
                <h3 className="font-medium text-gray-200 mb-4">We Accept</h3>
                <div className="flex gap-4">
                  <div className="w-12 h-8 bg-elite-card/90 rounded flex items-center justify-center">
                    <Bitcoin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="w-12 h-8 bg-elite-card/90 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
