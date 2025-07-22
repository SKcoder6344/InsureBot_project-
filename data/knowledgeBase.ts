import { KnowledgeBase } from '../types';

export const knowledgeBase: KnowledgeBase = {
  faqs: [
    {
      question: "What is term life insurance?",
      answer: "Term life insurance is a type of life insurance that provides coverage for a specific period or 'term'. If you pass away during this term, your beneficiaries receive the death benefit. It's typically the most affordable type of life insurance and is ideal for temporary needs like income replacement or debt coverage.",
      category: "life_insurance",
      keywords: ["term", "life", "insurance", "coverage", "death benefit", "affordable"]
    },
    {
      question: "How much life insurance do I need?",
      answer: "A general rule of thumb is 10-12 times your annual income. However, the exact amount depends on your debts, family size, lifestyle, and financial goals. Consider factors like outstanding loans, children's education costs, and your spouse's income when calculating your coverage needs.",
      category: "life_insurance",
      keywords: ["amount", "coverage", "income", "family", "debts", "calculate"]
    },
    {
      question: "What is health insurance premium?",
      answer: "Health insurance premium is the amount you pay regularly (monthly, quarterly, or annually) to keep your health insurance policy active. It's like a subscription fee that ensures you have coverage when you need medical care. Premiums vary based on age, health condition, coverage amount, and policy features.",
      category: "health_insurance",
      keywords: ["premium", "health", "payment", "monthly", "coverage", "medical"]
    },
    {
      question: "What is a deductible in insurance?",
      answer: "A deductible is the amount you pay out of pocket before your insurance coverage kicks in. For example, if you have a ₹5,000 deductible and a medical bill of ₹20,000, you pay the first ₹5,000, and insurance covers the remaining ₹15,000. Higher deductibles usually mean lower premiums.",
      category: "general",
      keywords: ["deductible", "out of pocket", "coverage", "medical bill", "premium"]
    },
    {
      question: "How do I file an insurance claim?",
      answer: "To file an insurance claim: 1) Contact your insurer immediately after the incident, 2) Fill out the claim form completely, 3) Gather all required documents (medical reports, bills, police reports if applicable), 4) Submit everything to your insurer, 5) Follow up regularly on claim status. Most insurers now offer online claim filing for faster processing.",
      category: "claims",
      keywords: ["claim", "file", "documents", "process", "submit", "online"]
    }
  ],
  products: [
    {
      id: "term_life_basic",
      name: "SecureLife Term Plan",
      type: "life",
      description: "Comprehensive term life insurance with high coverage at affordable premiums",
      keyFeatures: [
        "Coverage up to ₹2 crores",
        "Premium starting from ₹500/month",
        "Tax benefits under Section 80C",
        "Online policy management",
        "Quick claim settlement"
      ],
      eligibility: [
        "Age: 18-65 years",
        "Good health condition",
        "Regular income proof",
        "Medical examination may be required"
      ],
      premiumRange: "₹500 - ₹5,000 per month"
    },
    {
      id: "health_family",
      name: "FamilyCare Health Insurance",
      type: "health",
      description: "Complete family health coverage with cashless treatment at 10,000+ hospitals",
      keyFeatures: [
        "Family floater coverage",
        "Cashless treatment",
        "Pre and post hospitalization",
        "Day care procedures covered",
        "Annual health check-ups"
      ],
      eligibility: [
        "Age: 18-65 years for adults",
        "Children: 3 months to 25 years",
        "Pre-existing conditions after waiting period",
        "Family size up to 6 members"
      ],
      premiumRange: "₹8,000 - ₹25,000 per year"
    }
  ],
  policies: [
    {
      type: "Life Insurance",
      coverage: "Death benefit, terminal illness, accidental death",
      exclusions: ["Suicide within first year", "Death due to war", "Self-inflicted injuries"],
      claimProcess: [
        "Notify insurer within 30 days",
        "Submit death certificate",
        "Provide medical records",
        "Complete claim forms",
        "Await investigation and settlement"
      ]
    },
    {
      type: "Health Insurance",
      coverage: "Hospitalization, surgery, medical treatments, ambulance",
      exclusions: ["Pre-existing conditions (first 2-4 years)", "Cosmetic surgery", "Dental treatment"],
      claimProcess: [
        "Cashless: Pre-authorization at network hospital",
        "Reimbursement: Pay first, then submit bills",
        "Submit all medical documents",
        "Claim settlement within 30 days"
      ]
    }
  ]
};