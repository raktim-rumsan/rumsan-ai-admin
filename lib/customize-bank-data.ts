export interface AvailableDocument {
  id: string;
  name: string;
  description: string;
  size: string;
}

export interface BotIcon {
  id: string;
  name: string;
  icon: string;
}

export interface BankConfig {
  id: string;
  name: string;
  tagline: string;
  botName?: string;
  logo: string;
  primaryColor: string;
  quickQuestions: string[];
  status: "ready" | "coming-soon";
  availableDocuments: AvailableDocument[];
}

export const botIcons: BotIcon[] = [
  { id: "bot-1", name: "Default Bot", icon: "🤖" },
  { id: "bot-2", name: "Friendly Bot", icon: "😊" },
  { id: "bot-3", name: "Smart Bot", icon: "🧠" },
  { id: "bot-4", name: "Quick Bot", icon: "⚡" },
  { id: "bot-5", name: "Professional Bot", icon: "💼" },
];

export const banks: BankConfig[] = [
  // Ready to Use
  {
    id: "global-trust",
    name: "Global Trust Bank",
    tagline: "Your trusted financial partner",
    logo: "/placeholder-logo.svg",
    primaryColor: "#0066CC",
    status: "ready",
    quickQuestions: [
      "How do I open a savings account?",
      "What are your current loan rates?",
      "How can I reset my online banking password?",
      "What are the ATM withdrawal limits?",
      "How do I activate my debit card?",
      "What documents do I need for a loan?",
      "How can I check my account balance?",
      "What are your branch hours?",
      "How do I report a lost card?",
    ],
    availableDocuments: [
      {
        id: "gt-1",
        name: "Account Opening Guide",
        description: "Step-by-step account opening procedures",
        size: "2.4 MB",
      },
      {
        id: "gt-2",
        name: "Loan Products Brochure",
        description: "Complete loan offerings and rates",
        size: "1.8 MB",
      },
      {
        id: "gt-3",
        name: "Digital Banking Manual",
        description: "Online and mobile banking user guide",
        size: "3.2 MB",
      },
      {
        id: "gt-4",
        name: "Fee Schedule 2024",
        description: "Current fees and charges",
        size: "0.5 MB",
      },
    ],
  },
  {
    id: "sunrise-bank",
    name: "Sunrise Bank",
    tagline: "Banking that rises with you",
    logo: "/placeholder-logo.svg",
    primaryColor: "#E85D04",
    status: "ready",
    quickQuestions: [
      "How do I apply for a credit card?",
      "What investment options do you offer?",
      "How can I set up recurring payments?",
      "What are your business account features?",
      "What are your credit card rewards?",
      "How do I link my accounts?",
      "What is your minimum balance requirement?",
      "How can I update my email address?",
      "What are your wire transfer fees?",
    ],
    availableDocuments: [
      {
        id: "sb-1",
        name: "Credit Card Terms",
        description: "Terms and conditions for all card products",
        size: "1.2 MB",
      },
      {
        id: "sb-2",
        name: "Investment Portfolio Guide",
        description: "Investment options and strategies",
        size: "4.1 MB",
      },
      {
        id: "sb-3",
        name: "Business Banking Handbook",
        description: "Complete business account features",
        size: "2.9 MB",
      },
    ],
  },
  // Coming Soon
  {
    id: "metro-finance",
    name: "Metro Finance",
    tagline: "City-smart banking solutions",
    logo: "/placeholder-logo.svg",
    primaryColor: "#059669",
    status: "coming-soon",
    quickQuestions: [
      "How do I transfer money internationally?",
      "What mortgage options are available?",
      "How can I dispute a transaction?",
      "What are your mobile banking features?",
      "How do I set up direct deposit?",
      "What are the overdraft protection options?",
      "How can I schedule a branch appointment?",
      "What are your savings interest rates?",
      "How do I order new checks?",
    ],
    availableDocuments: [],
  },
  {
    id: "heritage-bank",
    name: "Heritage Bank",
    tagline: "Building legacies together",
    logo: "/placeholder-logo.svg",
    primaryColor: "#7C3AED",
    status: "coming-soon",
    quickQuestions: [
      "How do I open a joint account?",
      "What are your fixed deposit rates?",
      "How can I update my contact information?",
      "What insurance products do you offer?",
      "How do I add a beneficiary?",
      "What are your retirement account options?",
      "How can I download my statements?",
      "What are the benefits of premium accounts?",
      "How do I enable two-factor authentication?",
    ],
    availableDocuments: [],
  },
];

export const readyBanks = banks.filter((bank) => bank.status === "ready");
export const comingSoonBanks = banks.filter(
  (bank) => bank.status === "coming-soon",
);
