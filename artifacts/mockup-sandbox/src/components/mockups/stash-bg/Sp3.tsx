import { StashVariant } from "./StashTemplate";
export default function Sp3() {
  return <StashVariant cfg={{
    label: "SP3 Soft Sage", hex: "#d4e8d8",
    bg: "#d4e8d8", cardBg: "#c4deca", stickyBg: "rgba(212,232,216,0.96)",
    headingColor: "#0d1a10", bodyText: "#2a5a38", subText: "#3a6a48",
    mutedText: "#4a7a58", accentText: "#1a8050",
    borderBase: "rgba(30,100,60,0.14)", borderAccent: "rgba(30,100,60,0.35)",
    gridLine: "rgba(30,100,60,0.06)", mode: "light",
  }} />;
}
