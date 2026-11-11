import { useEffect, useRef } from "react";

// Lightweight WebGL mesh-gradient background in CERI colors (no extra packages).
const FRAG = `precision mediump float;
uniform vec2 r; uniform float t;
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float a = t * 0.05;
  vec2 p1 = vec2(0.2 + 0.15*sin(a*1.3), 0.8 + 0.1*cos(a));
  vec2 p2 = vec2(0.85 + 0.1*cos(a*0.9), 0.3 + 0.15*sin(a*1.1));
  vec2 p3 = vec2(0.5 + 0.2*sin(a*0.7), 0.1 + 0.1*cos(a*1.4));
  vec3 base = vec3(0.985, 0.975, 0.96);
  vec3 amber = vec3(1.0, 0.69, 0.0);
  vec3 orange = vec3(0.91, 0.29, 0.0);
  vec3 navy = vec3(0.09, 0.11, 0.157);
  vec3 c = base;
  c = mix(c, amber, 0.22 * exp(-6.0*dot(uv-p1, uv-p1)));
  c = mix(c, orange, 0.14 * exp(-7.0*dot(uv-p2, uv-p2)));
  c = mix(c, navy, 0.07 * exp(-5.0*dot(uv-p3, uv-p3)));
  gl_FragColor = vec4(c, 1.0);
}`;
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const gl = cv?.getContext("webgl", { antialias: false, alpha: false });
    if (!cv || !gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => { const s = 0.5; cv.width = innerWidth * s; cv.height = innerHeight * s; gl.viewport(0, 0, cv.width, cv.height); };
    resize(); addEventListener("resize", resize);
    let raf = 0; const start = performance.now();
    const draw = () => {
      gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
    document.addEventListener("visibilitychange", vis);
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
