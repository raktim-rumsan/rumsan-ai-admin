export const SECTOR = "banking";

export const BANK_CONFIGS = [
  {
    name: "NABIL",
    quickQuestions: [
      "What types of savings accounts are available?",
      "How can I apply for a home loan?",
      "What are the current fixed deposit rates?",
      "How do I activate mobile banking?",
      "What documents are required for KYC update?",
    ],
    primaryColor: "#A71D2A",
  },
  {
    name: "GIME",
    quickQuestions: [
      "How can I open a new bank account?",
      "What are the charges for international remittance?",
      "How do I reset my internet banking password?",
      "What loan products do you offer?",
      "Where is the nearest branch located?",
    ],
    primaryColor: "#1A3C47",
  },
  {
    name: "NMB",
    primaryColor: "#0072AA",
    quickQuestions: [
      "How can I apply for a credit card?",
      "What are the foreign currency exchange rates?",
      "How do I block a lost debit card?",
      "What are the SME loan options?",
      "How do I enable transaction alerts?",
    ],
  },
];

/**
 * Maps workspace/organization names to ENV key names
 * This allows matching "Nabil Bank" -> "NABIL" for API key lookup
 */
export const WORKSPACE_NAME_TO_ENV_KEY: Record<string, string> = {
  "Nabil Bank": "NABIL",
  "Global IME Bank": "GIME",
  "NMB Bank Limited": "NMB",
};
