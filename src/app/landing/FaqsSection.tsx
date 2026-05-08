"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Assets } from "@/constants/assets";
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';

import Faq from '@/components/shared/accordian/Faq';


const FAQ_DATA = {
  General: [
    {
      question: "How to sell on Funcstres?",
      answer: "To start selling, simply create an account, navigate to your dashboard, and click 'Create New Listing'. You can upload product details, set your pricing, and go live in minutes."
    },
    {
      question: "Who can use Funcstres?",
      answer: "Funcstres is designed for creators, entrepreneurs, and businesses of all sizes looking to streamline their workflow and reach a global audience with ease."
    },
    {
      question: "Is Funcstres available worldwide?",
      answer: "Yes! Funcstres is a global platform. While some specific localized payment methods may vary by region, the core platform is accessible from anywhere with an internet connection."
    },
    {
      question: "What makes Funcstres different from competitors?",
      answer: "We focus on a 'user-first' experience, providing high-speed performance, intuitive UI/UX design, and dedicated support that helps you grow your brand faster than traditional platforms."
    }
  ],
  "Getting Started": [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button on the homepage. You can join using your email address or quickly through your Google or GitHub account for a seamless setup."
    },
    {
      question: "Do I need coding skills to use the platform?",
      answer: "Not at all. Funcstres is a no-code friendly platform. Everything is managed through a visual dashboard, though we do offer API access for advanced developers."
    },
    {
      question: "How do I verify my email address?",
      answer: "After signing up, check your inbox for a verification link. If you don't see it within 5 minutes, please check your spam folder or request a new link from your profile settings."
    },
    {
      question: "Can I change my username later?",
      answer: "Yes, you can update your profile display name at any time. However, your unique account handle can only be changed once every 30 days via the Account Settings menu."
    }
  ],
  Billing: [
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Stripe for secure, encrypted transactions."
    },
    {
      question: "How do I download my invoices?",
      answer: "Navigate to 'Settings' > 'Billing History'. From there, you can view all past transactions and download PDF versions of your invoices for tax and accounting purposes."
    },
    {
      question: "Is there a free trial available?",
      answer: "Absolutely! You can sign up for a 14-day free trial to explore all our premium features. No credit card is required to get started with the trial."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee if you are not satisfied with our premium plans. Simply contact our support team to initiate the process."
    }
  ],
  "The Product": [
    {
      question: "Is there a mobile app?",
      answer: "Yes, our app is available on both iOS and Android. You can manage your listings, respond to customers, and track analytics directly from your phone."
    },
    {
      question: "Is my data secure with Funcstres?",
      answer: "Security is our top priority. We use industry-standard AES-256 encryption and secure cloud storage to ensure that your personal and business data remains protected."
    },
    {
      question: "How often are new features added?",
      answer: "We follow an agile development cycle and typically release major feature updates once a month, with smaller performance improvements pushed weekly."
    },
    {
      question: "Can I integrate Funcstres with other tools?",
      answer: "Yes, we support integrations with popular tools like Slack, Zapier, and various CRM systems to help you automate your business processes."
    }
  ]
};

// Get the categories (keys) from our data object: ["General", "Getting Started", etc.]
const FaqsSection = () => {
    const categories = Object.keys(FAQ_DATA);
    const [activeCategory, setActiveCategory] = useState("General");

    return (
        <SecondaryContainer>

            <>

                <div className='py-10   text-black'>
                    <PrimaryHeader
                        eyebrow="Faq"
                        eyebrowColor="text-orange-500 font-medium"

                        title={<span className="text-[2.75rem]  sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                            Frequently Asked Question
                        </span>}
                        titleColor="text-white"
                        description={<span>Take on real coding challenges, sharpen your logic, and build<br /> the skills to  level up — one solution at a time.</span>}
                        descriptionColor="text-[#878787] "
                        align="center"
                        alignLg="center"
                    />
                </div>
                {/* bg-[#008CFF] text-white text-base lg:text-lg  rounded-md hover:bg-blue-600 transition */}
                <div className="relative w-full  bg-[#f8f9fb] ">
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((cat) => (
                          
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 md:px-0   min-h-[49px]  rounded-xl  text-base md:min-w-[147px] font-medium transition-all ${activeCategory === cat
                                    ? "bg-[#008CFF] text-white hover:bg-blue-600 shadow-md"
                                    : "bg-[#F5F8FB] hover:bg-white text-neutral-04 border border-neutral-05"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col min-h-128  lg:flex-row-reverse items-center gap-2 lg:gap-8">

                        {/* Left Column: Content */}

                        <div className="basis-1/2    flex flex-col items-start text-left">

                            <div  key={activeCategory} className="py-5 md:py-8 flyIn">
                                <Faq
                                    // Tell TS: "activeCategory is definitely one of the keys in FAQ_DATA"
                                    items={FAQ_DATA[activeCategory as keyof typeof FAQ_DATA]}
                                    key={activeCategory}
                                    animate={true}
                                    preOpenStrategy="first"
                                    transitionMs={300}
                                />
                            </div>
                        </div>
                        <div className="basis-1/2  relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                            <div className="relative flex justify-start items-center  w-full max-w-lg lg:max-w-xl ">
                                <Image
                                    src={Assets.Images.landingPage.faqBanner}
                                    alt="Developer coding illustration"
                                    width={400}
                                    height={200}
                                    className="object-cover h-110   "
                                    priority
                                />
                            </div>
                        </div>



                    </div>
                </div>

            </>


        </SecondaryContainer >);

};

export default FaqsSection;