// import React, { useState } from "react";
// import Header from "../components/Layout/Header";
// import Footer from "../components/Layout/Footer";

// const FAQPage = () => {
//   return (
//     <div>
//       <Header activeHeading={5} />
//       <FAQ />
//       <Footer />
//     </div>
//   );
// };

// const FAQ = () => {
//   const [tab, setTab] = useState(0);

//   const toggleTab = (index) => {
//     if (tab === index) {
//       setTab(0);
//     } else {
//       setTab(index);
//     }
//   };

//   return (
//     <div className="w-11/12 mx-auto py-16">
//       <h2 className="text-2xl font-semibold text-purple-800 mb-10">FAQ</h2>
//       <div className="mx-auto space-y-4">
//         {/* single Faq */}

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(2)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               What is your return policy?
//             </span>
//             {tab === 2 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 2 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 If you're not satisfied with your purchase, we accept returns
//                 within 30 days of delivery. To initiate a return, please email
//                 us at support@myecommercestore.com with your order number and a
//                 brief explanation of why you're returning the item.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(3)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               How do I track my order?
//             </span>
//             {tab === 3 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 3 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 You can track your order by clicking the tracking link in your
//                 shipping confirmation email, or by logging into your account on
//                 our website and viewing the order details.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(4)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               How do I contact customer support?
//             </span>
//             {tab === 4 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 4 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 You can contact our customer support team by emailing us at
//                 support@myecommercestore.com, or by calling us at (555) 123-4567
//                 between the hours of 9am and 5pm EST, Monday through Friday.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(5)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               Can I change or cancel my order?
//             </span>
//             {tab === 5 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 5 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 Unfortunately, once an order has been placed, we are not able to
//                 make changes or cancellations. If you no longer want the items
//                 you've ordered, you can return them for a refund within 30 days
//                 of delivery.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(6)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               Do you offer international shipping?
//             </span>
//             {tab === 6 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 6 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 Currently, we only offer shipping within the United States.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="border-b border-gray-200 pb-4">
//           <button
//             className="flex items-center justify-between w-full"
//             onClick={() => toggleTab(7)}
//           >
//             <span className="text-lg font-medium text-gray-900">
//               What payment methods do you accept?
//             </span>
//             {tab === 7 ? (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-6 w-6 text-gray-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </button>
//           {tab === 7 && (
//             <div className="mt-4">
//               <p className="text-base text-gray-500">
//                 We accept visa,mastercard,paypal payment method also we have
//                 cash on delivery system.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default FAQPage;

import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={6} />
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
      question: "Question 1",
      answer: "Answer 1",
    },
    {
      id: 2,
      question: "Question 2",
      answer: "Answer 2",
    },
    {
      id: 3,
      question: "Question 3",
      answer: "Answer 3",
    },
    {
      id: 4,
      question: "Question 4",
      answer: "Answer 4",
    },
    {
      id: 5,
      question: "Question 5",
      answer: "Answer 5",
    },
    {
      id: 6,
      question: "Question 6",
      answer: "Answer 6",
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
