import { StashVariant } from "./StashTemplate";
export default function Sp4() {
  return <StashVariant cfg={{
    label: "SP4 Pale Mint", hex: "#eaf5ec",
    bg: "#eaf5ec", cardBg: "#daeede", stickyBg: "rgba(234,245,236,0.96)",
    headingColor: "#0d1a10", bodyText: "#2a5a38", subText: "#3a6a48",
    mutedText: "#5a8a68", accentText: "#1a8050",
    borderBase: "rgba(30,100,60,0.12)", borderAccent: "rgba(30,100,60,0.32)",
    gridLine: "rgba(30,100,60,0.05)", mode: "light",
  }} />;
}
