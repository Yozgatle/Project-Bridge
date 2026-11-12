import { lazy, Suspense, useEffect, useState } from "react";

// Animated CERI-colored background via the official `shadergradient` package.
// Loaded only in the browser (WebGL/three.js) so SSR stays safe.
const Gradient = lazy(async () => {
  const m = await import("shadergradient");
  const Canvas = m.ShaderGradientCanvas as any;
  const Shader = m.ShaderGradient as any;
  return {
    default: ({ animate }: { animate: boolean }) => (
      <Canvas style={{ position: "absolute", inset: 0 }} pixelDensity={1} fov={45} pointerEvents="none">
        <Shader
          control="props"
          type="waterPlane"
          animate={animate ? "on" : "off"}
          uTime={0}
          uSpeed={0.12}
          uStrength={1.6}
          uDensity={1.1}
          uFrequency={5.5}
          uAmplitude={0}
          color1="#ffb000"
          color2="#f6efe4"
          color3="#e84b00"
          brightness={1.25}
          grain="off"
          lightType="3d"
          envPreset="city"
          reflection={0.1}
          cAzimuthAngle={180}
          cPolarAngle={80}
          cDistance={2.8}
          cameraZoom={9}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
        />
      </Canvas>
    ),
  };
});

export function ShaderBackground() {
  const [ready, setReady] = useState(false);
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-background">
      {ready && (
        <Suspense fallback={null}>
          <Gradient animate={animate} />
        </Suspense>
      )}
      {/* soft veil keeps text readable */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}
