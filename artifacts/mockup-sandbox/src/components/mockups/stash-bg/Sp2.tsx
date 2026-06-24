import { StashVariant } from "./StashTemplate";
export default function Sp2() {
  return <StashVariant cfg={{
    label: "SP2 Mid Forest", hex: "#1a3020",
    bg: "#1a3020", cardBg: "#223d28", stickyBg: "rgba(26,48,32,0.95)",
    headingColor: "#ffffff", bodyText: "#7ec08e", subText: "#4d8a60",
    mutedText: "#3a6a4a", accentText: "#34d399",
    borderBase: "rgba(52,211,153,0.12)", borderAccent: "rgba(52,211,153,0.38)",
    gridLine: "rgba(52,211,153,0.020)", mode: "dark",
  }} />;
}
