import { BgVariant } from "./BgTemplate";
export default function Bg2() {
  return <BgVariant cfg={{
    label: "BG2", hex: "#161614",
    bg: "#161614", cardBg: "#1e1c18",
    bodyText: "#d4bc78", subText: "#9a8548",
    borderBase: "rgba(255,179,0,0.20)", gridLine: "rgba(255,179,0,0.026)",
  }} />;
}
