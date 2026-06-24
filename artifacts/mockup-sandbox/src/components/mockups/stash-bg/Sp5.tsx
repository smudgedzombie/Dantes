import { StashVariant } from "./StashTemplate";
export default function Sp5() {
  return <StashVariant cfg={{
    label: "SP5 Light Cream", hex: "#f2f8f3",
    bg: "#f2f8f3", cardBg: "#e4f2e7", stickyBg: "rgba(242,248,243,0.96)",
    headingColor: "#0d1a10", bodyText: "#2a5a38", subText: "#4a7a58",
    mutedText: "#6a9a78", accentText: "#1a8050",
    borderBase: "rgba(30,100,60,0.10)", borderAccent: "rgba(30,100,60,0.28)",
    gridLine: "rgba(30,100,60,0.04)", mode: "light",
  }} />;
}
