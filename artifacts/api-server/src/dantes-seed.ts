import { db, memberApplicationsTable } from "@workspace/db";
import { count } from "drizzle-orm";

const COMPANIES = [
  {
    fullName: "Kasem Wattanavit",
    email: "k.wattanavit@kasikornasset.co.th",
    phone: "+66 2 673 3000",
    company: "Kasikorn Asset Management Co., Ltd.",
    country: "Thailand",
    industry: "Asset Management",
    businessDescription: "One of Thailand's largest asset managers with AUM exceeding THB 1.2 trillion across mutual funds, private funds, and provident funds. We operate a full suite of equity, fixed income, and multi-asset strategies.",
    grahamGoals: "Automate portfolio rebalancing signals, generate compliance-ready reporting for SEC Thailand, and deploy AI-driven client communication for HNW relationship managers.",
    budget: "USD 8,000–15,000/mo",
    referral: "Direct outreach",
  },
  {
    fullName: "Pimchanok Sirivichayakul",
    email: "pimchanok.s@scbam.com",
    phone: "+66 2 949 1500",
    company: "SCB Asset Management Co., Ltd.",
    country: "Thailand",
    industry: "Wealth Management",
    businessDescription: "The asset management arm of Siam Commercial Bank, managing over THB 900 billion. We serve institutional investors, HNW individuals, and retail clients through a broad fund range.",
    grahamGoals: "Build a Graham agent to monitor macroeconomic signals and generate fund recommendation briefs for our wealth advisors, with real-time FX and rate sensitivity analysis.",
    budget: "USD 6,000–12,000/mo",
    referral: "SCB Group referral",
  },
  {
    fullName: "Thanakorn Ruangrat",
    email: "t.ruangrat@bangkoklife.co.th",
    phone: "+66 2 777 8000",
    company: "Bangkok Life Assurance PCL",
    country: "Thailand",
    industry: "Insurance & Investment",
    businessDescription: "Listed Thai life insurer managing a THB 400B+ investment portfolio. Asset allocation spans government bonds, equities, and real estate under strict OIC regulatory requirements.",
    grahamGoals: "Deploy AI agent to monitor investment policy compliance, flag duration mismatches in bond portfolio, and produce monthly board-ready performance summaries.",
    budget: "USD 5,000–10,000/mo",
    referral: "Conference introduction",
  },
  {
    fullName: "William Heinecke Jr.",
    email: "w.heinecke@minor.com",
    phone: "+66 2 365 7500",
    company: "Minor International PCL",
    country: "Thailand",
    industry: "Hospitality & Retail Conglomerate",
    businessDescription: "A multinational hospitality, real estate, and retail group operating 530+ hotels across 55 countries. We manage complex multi-currency treasury positions and cross-border capital flows.",
    grahamGoals: "Centralise group treasury intelligence — FX exposure monitoring, cash pooling signals, and subsidiary financial health dashboards — through a single AI command layer.",
    budget: "USD 12,000–20,000/mo",
    referral: "Direct CEO introduction",
  },
  {
    fullName: "Nattapong Charoenruk",
    email: "nattapong.c@pttplc.com",
    phone: "+66 2 537 2000",
    company: "PTT Public Company Limited",
    country: "Thailand",
    industry: "Energy & Petrochemicals",
    businessDescription: "Thailand's national oil and gas company with annual revenue exceeding USD 60B. We manage sovereign-scale commodity price risk, FX hedging, and capital project financing.",
    grahamGoals: "Automate commodity hedging alerts, build AI-driven scenario analysis for crude price movements, and produce investor relations reporting packages via Graham agents.",
    budget: "USD 20,000–40,000/mo",
    referral: "Government enterprise referral",
  },
  {
    fullName: "Nattawut Chivatxaranukul",
    email: "nattawut.c@cpn.co.th",
    phone: "+66 2 667 5555",
    company: "Central Pattana PCL",
    country: "Thailand",
    industry: "Real Estate & Retail Development",
    businessDescription: "Thailand's largest retail property developer with 37 shopping centres and a THB 200B+ investment property portfolio requiring granular property-level P&L monitoring.",
    grahamGoals: "Deploy Graham agents to track rental yield trends per asset, flag covenant breaches in JV structures, and automate quarterly valuation reporting for institutional investors.",
    budget: "USD 7,000–14,000/mo",
    referral: "Central Group CFO referral",
  },
  {
    fullName: "Ajay Vir Jakhar",
    email: "ajay.jakhar@truevc.co.th",
    phone: "+66 2 699 0000",
    company: "True Corporation PCL",
    country: "Thailand",
    industry: "Telecommunications & Technology",
    businessDescription: "Thailand's second-largest telecom operator post-merger, managing a THB 500B balance sheet with significant spectrum asset valuations and 5G infrastructure debt.",
    grahamGoals: "Build an AI financial command layer for M&A integration monitoring, spectrum ROI tracking, and automated lender covenant compliance dashboards.",
    budget: "USD 10,000–18,000/mo",
    referral: "Investment bank introduction",
  },
  {
    fullName: "Santi Bhirombhakdi",
    email: "santi.b@thaibev.com",
    phone: "+66 2 785 5555",
    company: "Thai Beverage PCL (ThaiBev)",
    country: "Thailand",
    industry: "Consumer Goods & FMCG",
    businessDescription: "Southeast Asia's largest beverage group with brands including Chang Beer. Listed in Singapore, managing multi-country P&L and FX consolidation from ASEAN operations.",
    grahamGoals: "Automate group FX consolidation reporting, deploy Graham agents to monitor brand-level margins and flag supply chain cost anomalies across the ASEAN portfolio.",
    budget: "USD 9,000–16,000/mo",
    referral: "TCC Group referral",
  },
];

export async function seedDantesIfEmpty(log: (msg: string) => void) {
  try {
    const [{ total }] = await db.select({ total: count() }).from(memberApplicationsTable);
    if (Number(total) === 0) {
      await db.insert(memberApplicationsTable).values(COMPANIES);
      log(`Dantès: seeded ${COMPANIES.length} enterprise member applications`);
    }
  } catch (err) {
    log(`Dantès seed warning: ${err}`);
  }
}
