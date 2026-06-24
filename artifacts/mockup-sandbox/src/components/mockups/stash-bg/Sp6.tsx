import { StashVariant } from "./StashTemplate";
export default function Sp6() {
  return <StashVariant cfg={{
    label: "SP6 Near White", hex: "#f8fcf9",
    bg: "#f8fcf9", cardBg: "#eef8f0", stickyBg: "rgba(248,252,249,0.96)",
    headingColor: "#0a1a10", bodyText: "#2a5038", subText: "#4a7058",
    mutedText: "#6a9078", accentText: "#1a8050",
    borderBase: "rgba(30,100,60,0.09)", borderAccent: "rgba(30,100,60,0.26)",
    gridLine: "rgba(30,100,60,0.035)", mode: "light",
  }} />;
}
