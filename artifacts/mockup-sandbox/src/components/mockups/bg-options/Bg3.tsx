import { BgVariant } from "./BgTemplate";
export default function Bg3() {
  return <BgVariant cfg={{
    label: "BG3", hex: "#1c1916",
    bg: "#1c1916", cardBg: "#252118",
    bodyText: "#d4bc78", subText: "#9a8548",
    borderBase: "rgba(255,179,0,0.22)", gridLine: "rgba(255,179,0,0.028)",
  }} />;
}
