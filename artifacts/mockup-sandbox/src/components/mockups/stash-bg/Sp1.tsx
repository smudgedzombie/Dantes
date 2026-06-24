import { StashVariant } from "./StashTemplate";
export default function Sp1() {
  return <StashVariant cfg={{
    label: "SP1 Dark Forest", hex: "#0d1a10",
    bg: "#0d1a10", cardBg: "#122016", stickyBg: "rgba(13,26,16,0.95)",
    headingColor: "#ffffff", bodyText: "#6aaa80", subText: "#3d7a50",
    mutedText: "#2a5436", accentText: "#34d399",
    borderBase: "rgba(52,211,153,0.10)", borderAccent: "rgba(52,211,153,0.35)",
    gridLine: "rgba(52,211,153,0.018)", mode: "dark",
  }} />;
}
