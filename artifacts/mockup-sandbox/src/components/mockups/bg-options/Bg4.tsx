import { BgVariant } from "./BgTemplate";
export default function Bg4() {
  return <BgVariant cfg={{
    label: "BG4", hex: "#221e16",
    bg: "#221e16", cardBg: "#2c271c",
    bodyText: "#d4bc78", subText: "#9a8548",
    borderBase: "rgba(255,179,0,0.22)", gridLine: "rgba(255,179,0,0.030)",
  }} />;
}
