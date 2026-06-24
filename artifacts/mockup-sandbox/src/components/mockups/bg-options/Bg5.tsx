import { BgVariant } from "./BgTemplate";
export default function Bg5() {
  return <BgVariant cfg={{
    label: "BG5", hex: "#28231a",
    bg: "#28231a", cardBg: "#332c20",
    bodyText: "#d4bc78", subText: "#9a8548",
    borderBase: "rgba(255,179,0,0.24)", gridLine: "rgba(255,179,0,0.032)",
  }} />;
}
