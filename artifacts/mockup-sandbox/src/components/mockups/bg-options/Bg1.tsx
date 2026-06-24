import { BgVariant } from "./BgTemplate";
export default function Bg1() {
  return <BgVariant cfg={{
    label: "BG1", hex: "#111111",
    bg: "#111111", cardBg: "#181818",
    bodyText: "#d4bc78", subText: "#9a8548",
    borderBase: "rgba(255,179,0,0.20)", gridLine: "rgba(255,179,0,0.024)",
  }} />;
}
