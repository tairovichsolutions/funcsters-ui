export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategoryId =
  | "general"
  | "getting-started"
  | "billing"
  | "product";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        id: "how-to-sell",
        question: "How to sell?",
        answer:
          "To start selling, create an account, add your products, and connect your payment method. Once your profile is approved, your storefront goes live and you can start receiving orders right away.",
      },
      {
        id: "who-can-use",
        question: "Who can use Funcstres?",
        answer:
          "Funcstres is built for creators, freelancers, and teams of all sizes. Whether you’re just validating an idea or already operating at scale, you can adapt the workspace to fit your workflow.",
      },
      {
        id: "data-secure",
        question: "Is my data secure with Funcstres?",
        answer:
          "Yes. We use encryption in transit and at rest, enforce role-based access controls, and regularly review our infrastructure to keep your data safe and compliant.",
      },
      {
        id: "integrations",
        question: "Does Funcstres integrate with other tools?",
        answer:
          "Funcstres connects with popular tools for payments, analytics, and automations so you can plug it into your existing stack without rebuilding everything from scratch.",
      },
      {
        id: "free-trial",
        question: "Is there a free trial available?",
        answer:
          "You can start with a free trial to explore all core features. Upgrade, downgrade, or cancel anytime directly from your billing settings.",
      },
    ],
  },
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer:
          "Sign up with your email, verify it, and follow the quick onboarding checklist. Most users are set up and ready to go in just a few minutes.",
      },
      {
        id: "first-steps",
        question: "What should I configure first?",
        answer:
          "We recommend setting your brand profile, payment settings, and your first product or service before inviting your team or sharing links with customers.",
      },
      {
        id: "setup-time",
        question: "How long does setup take?",
        answer:
          "Most users complete setup in under 10 minutes, depending on how many products or users they add during onboarding.",
      },
      {
        id: "invite-team",
        question: "Can I invite my team?",
        answer:
          "Yes. You can invite team members anytime from the team settings and assign roles with different permissions.",
      },
      {
        id: "tutorials",
        question: "Are tutorials available?",
        answer:
          "Yes. A guided setup and video tutorials are available inside the platform to help you get up to speed quickly.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    items: [
      {
        id: "billing-cycle",
        question: "How does billing work?",
        answer:
          "You can choose between monthly and yearly billing. Invoices are generated automatically and can be downloaded from your billing dashboard at any time.",
      },
      {
        id: "refunds",
        question: "Do you offer refunds?",
        answer:
          "If something isn’t working as expected, contact support within the refund window and our team will review your case as soon as possible.",
      },
      {
        id: "payment-methods",
        question: "What payment methods are supported?",
        answer:
          "We accept major credit cards and digital payment options depending on your region.",
      },
      {
        id: "change-plan",
        question: "Can I change my plan later?",
        answer:
          "Yes. You can upgrade or downgrade at any time from your billing dashboard. Changes take effect on the next billing cycle.",
      },
      {
        id: "invoices",
        question: "Where can I access invoices?",
        answer:
          "All invoices are stored in your billing history and can be downloaded at any time.",
      },
    ],
  },
  {
    id: "product",
    label: "The Product",
    items: [
      {
        id: "roadmap",
        question: "How often do you ship new features?",
        answer:
          "We ship improvements continuously, with bigger feature drops announced in the in-app changelog and via email updates.",
      },
      {
        id: "feedback",
        question: "Can I request a feature?",
        answer:
          "Yes. You can submit feature requests from inside the app. The product team reviews this feedback regularly when planning the roadmap.",
      },
      {
        id: "mobile",
        question: "Is there a mobile app?",
        answer:
          "A responsive web version is available today, and a native app is in development with updates planned soon.",
      },
      {
        id: "customization",
        question: "Can I customize my storefront?",
        answer:
          "Yes. You can personalize colors, branding, product pages, and more to match your visual identity.",
      },
      {
        id: "performance",
        question: "How fast is the platform?",
        answer:
          "Funcstres is built with performance in mind, using scalable infrastructure to ensure smooth and fast load times even under heavy traffic.",
      },
    ],
  },
];
