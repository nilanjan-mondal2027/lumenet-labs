import { useEffect, useRef } from "react";

export function SignalField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    const points = Array.from({ length: window.innerWidth < 700 ? 45 : 90 }, (_, index) => ({
      angle: index * 2.399,
      radius: 30 + (index % 18) * 27,
      speed: .0007 + (index % 7) * .00006,
      size: index % 11 === 0 ? 2.2 : 1,
    }));
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const cx = width * .72; const cy = height * .5;
      const scale = Math.min(width, height) / 900;
      const positions = points.map((point, index) => {
        const drift = frame * point.speed;
        const r = point.radius * (1 + .08 * Math.sin(drift * 7 + index)) * scale;
        return { x: cx + Math.cos(point.angle + drift) * r * 1.45, y: cy + Math.sin(point.angle + drift) * r, size: point.size };
      });
      context.lineWidth = .65;
      positions.forEach((point, index) => {
        for (let other = index + 1; other < positions.length; other++) {
          const target = positions[other];
          const distance = Math.hypot(point.x - target.x, point.y - target.y);
          if (distance < 92 * scale) {
            context.strokeStyle = `rgba(217,255,61,${Math.max(0, .14 - distance / 800)})`;
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(target.x, target.y); context.stroke();
          }
        }
        context.fillStyle = index % 9 === 0 ? "rgba(243,200,91,.9)" : "rgba(217,255,61,.66)";
        context.beginPath(); context.arc(point.x, point.y, point.size, 0, Math.PI * 2); context.fill();
      });
      frame += 1; raf = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener("resize", resize, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true"/>;
}

export function RevealController() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) { elements.forEach((el) => el.classList.add("visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
