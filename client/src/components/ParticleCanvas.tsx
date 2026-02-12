import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

interface ParticleCanvasProps {
  particleColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  particleCount?: number;
  interactionRadius?: number;
}

export const ParticleCanvas = ({
  particleColor,
  lineColor,
  backgroundColor = "transparent",
  particleCount = 100,
  interactionRadius = 150,
}: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Determine colors
    const isDark = theme === "dark";
    // Default to a techy cyan/blue if not specified for a "cool" look
    const pColor = particleColor || (isDark ? "rgba(6, 182, 212, 0.5)" : "rgba(15, 118, 110, 0.5)"); // Cyan-500/700
    const lColor = lineColor || (isDark ? "rgba(6, 182, 212, 0.15)" : "rgba(15, 118, 110, 0.15)");

    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      
      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1; 
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Wall bounce
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < interactionRadius) {
           // Gentle repulsion
           const angle = Math.atan2(dy, dx);
           const force = (interactionRadius - distance) / interactionRadius;
           const repulse = force * 2; 
           
           this.vx -= Math.cos(angle) * repulse * 0.05;
           this.vy -= Math.sin(angle) * repulse * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      
      particles = [];
      // Adjust count based on screen size
      const count = window.innerWidth < 768 ? Math.floor(particleCount / 2) : particleCount;
      
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We don't fill rect if transparent, just clear
      if (backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
           const dx = particles[i].x - particles[j].x;
           const dy = particles[i].y - particles[j].y;
           const distance = Math.sqrt(dx * dx + dy * dy);

           if (distance < 100) {
             ctx.beginPath();
             ctx.strokeStyle = lColor;
             // Fade out line as it gets longer
             ctx.globalAlpha = 1 - distance / 100;
             ctx.lineWidth = 1;
             ctx.moveTo(particles[i].x, particles[i].y);
             ctx.lineTo(particles[j].x, particles[j].y);
             ctx.stroke();
             ctx.globalAlpha = 1; 
           }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handlers
    const handleResize = () => {
        initParticles();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (canvas) {
           const rect = canvas.getBoundingClientRect();
           mouse.x = e.clientX - rect.left;
           mouse.y = e.clientY - rect.top;
        }
    };
    
    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    // Listen on window for smoother tracking if we want, or container
    // Using container/canvas specific listeners for now
    if (containerRef.current) {
         containerRef.current.addEventListener("mousemove", handleMouseMove);
         containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    }
    
    // Initial start
    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
          containerRef.current.removeEventListener("mousemove", handleMouseMove);
          containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, particleColor, lineColor, backgroundColor, particleCount, interactionRadius]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
