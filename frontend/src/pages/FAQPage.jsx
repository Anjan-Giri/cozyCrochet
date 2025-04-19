import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={7} />
      <FAQ />
      <Footer />
    </div>
  );
};

const FAQ = () => {
  const [tab, setTab] = useState(0);

  const toggleTab = (index) => {
    if (tab === index) {
      setTab(0);
    } else {
      setTab(index);
    }
  };

  const faqData = [
    {
      id: 1,
      question: "How are your crochet items made?",
      answer:
        "All our crochet items are handmade with love and care. The artisans use premium quality yarns and follow traditional crochet techniques while incorporating modern designs. Each piece is crafted individually, ensuring attention to detail and high-quality craftsmanship.",
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer:
        "There is no return policy for the orders. The orders are non-returnable and non-refundable.",
    },
    {
      id: 3,
      question: "How do I care for my crochet items?",
      answer:
        "Most of our crochet items should be hand-washed in cold water with mild soap and laid flat to dry. Avoid wringing or twisting the items. For specific care instructions, please refer to the shop dealing with the product. Proper care will ensure your crochet items maintain their shape and quality for years to come.",
    },
    {
      id: 4,
      question: "Do you offer custom orders?",
      answer:
        "Yes! Our artisans love creating custom crochet pieces. Whether you need a specific size, color, or design, we're happy to work with you. Custom orders typically take 2-4 weeks to complete depending on complexity. To request a custom order, please contact your chosen shop through our website's contact form with details of what you're looking for.",
    },
    {
      id: 5,
      question: "How long will shipping take?",
      answer:
        "The orders are typically processed within 1-3 business days and shipping takes an additional 3-5 business days. For available products in the website, we ship sooner, while custom ordeers may take longer.",
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer:
        "We accept stripe payment and also accept cash on delivery for your orders.",
    },
    {
      id: 7,
      question: "Can I cancel my order?",
      answer:
        "Orders are non-cancellable. So make sure to properly double check your order details before placing it.",
    },
  ];

  return (
    <div className="w-8/12 mx-auto py-16">
      <h2 className="text-2xl font-semibold text-purple-900 mb-10">FAQ</h2>
      <div className="mx-auto space-y-4">
        {faqData.map((faq) => (
          <div key={faq.id} className="border-b border-purple-800 pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(faq.id)}
            >
              <span className="text-lg font-medium text-pink-900">
                {faq.question}
              </span>
              {tab === faq.id ? (
                <svg
                  className="h-6 w-6 text-purple-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-pink-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {tab === faq.id && (
              <div className="mt-4">
                <p className="text-base text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
