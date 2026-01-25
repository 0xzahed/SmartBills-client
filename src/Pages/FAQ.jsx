import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is SmartBills?",
      answer:
        "SmartBills is a comprehensive utility bill management system that helps you track, manage, and pay all your utility bills in one place. With AI-powered insights and automated reminders, managing your bills has never been easier.",
    },
    {
      question: "How do I pay my bills using SmartBills?",
      answer:
        "Simply browse available bills from your subscribed providers, select the bill you want to pay, enter your payment details, and complete the transaction. You'll receive an instant email receipt and the bill will be recorded in your payment history.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes! We use industry-standard encryption and security protocols to protect your payment information. We never store your full card details and all transactions are processed through secure payment gateways.",
    },
    {
      question: "Can I view my payment history?",
      answer:
        "Absolutely! Go to 'My Bills' in your dashboard to view all your paid bills, download receipts, and generate payment reports. You can also filter and search through your payment history.",
    },
    {
      question: "What are AI Insights?",
      answer:
        "AI Insights is a powerful feature that analyzes your spending patterns and provides personalized recommendations. It shows you spending trends, category breakdowns, and suggests ways to optimize your utility expenses.",
    },
    {
      question: "How do I subscribe to a provider?",
      answer:
        "Navigate to the Providers page, select the provider you want (Electricity, Gas, Water, or Internet), and click the Subscribe button. Once subscribed, you'll receive bills from that provider.",
    },
    {
      question: "Can I edit or delete a paid bill record?",
      answer:
        "Yes, in your 'My Bills' section, you can edit bill details or delete records if needed. However, this only affects your local records and doesn't cancel actual payments made to providers.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "Currently, we accept major credit and debit cards. We're working on adding more payment options like mobile banking, net banking, and digital wallets in the future.",
    },
    {
      question: "How does the chatbot help me?",
      answer:
        "Our AI-powered chatbot can answer questions about your bills, provide payment guidance, explain features, and help you navigate the platform. Just click the chat icon and start asking questions!",
    },
    {
      question: "Do I need to pay a subscription fee?",
      answer:
        "SmartBills is currently free to use! We don't charge any subscription fees for managing and paying your bills. You only pay for the actual utility bills themselves.",
    },
    {
      question: "Can I access SmartBills on my mobile phone?",
      answer:
        "Yes! SmartBills is fully responsive and works seamlessly on mobile phones, tablets, and desktop computers. Simply access it through your web browser.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "Click on 'Forgot password?' on the login page, enter your email address, and you'll receive instructions to reset your password via email.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#E5CBB8] rounded-full">
              <FiHelpCircle className="w-12 h-12 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Find answers to common questions about SmartBills. Can't find what
            you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-base-200 rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-base-300 transition-colors duration-200"
              >
                <span className="text-left font-semibold text-base-content">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiChevronDown className="w-5 h-5 text-base-content/70" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-base-content/80">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center bg-base-200 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-base-content/70 mb-6">
            Our support team is here to help you with any questions or concerns.
          </p>
          <a
            href="/contact"
            className="btn btn-primary px-8"
            style={{
              backgroundColor: "#E5CBB8",
              color: "black",
              border: "none",
            }}
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
