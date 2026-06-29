import MysteryHintBox from "../../../components/minigame/MysteryHintBox";
import Balatro from "../../../components/reactbits/background/Balatro";

export default function Page() {
  return <div className="min-h-screen flex items-center justify-center p-4">
    {/* Background */}
    <div className="fixed inset-0 -z-10">
      <Balatro
        isRotate={false}
        mouseInteraction={false}
        pixelFilter={490}
        color1="#18191d"
        color2="#253037"
        color3="#0d1111"
      />
    </div>
    <MysteryHintBox />
  </div>;
}
