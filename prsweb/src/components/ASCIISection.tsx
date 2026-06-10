"use client";

import ASCIIText from "@/src/components/reactbits/ASCIIText";

export default function ASCIISection() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-transparent">
      <ASCIIText
        text="helloworld."
        enableWaves={false}
        asciiFontSize={10}
        textFontSize={50}
        planeBaseHeight={7}
      />
    </div>
  );
}
