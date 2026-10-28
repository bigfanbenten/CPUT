import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FestivalEventId } from '../../types/festival';

interface FestivalAtmosphereProps {
  event: FestivalEventId;
  enableAnimations?: boolean;
  forceAnimations?: boolean;
}

export const FestivalAtmosphere: React.FC<FestivalAtmosphereProps> = ({
  event,
  enableAnimations = true,
  forceAnimations = true,
}) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } catch {
      // Fallback
    }
  }, []);

  // Return nothing if default or animations disabled
  if (event === 'default' || !enableAnimations) {
    return null;
  }

  const effectiveReducedMotion = reducedMotion && !forceAnimations;

  return (
    <div
      className="pointer-events-none select-none fixed inset-0 overflow-hidden z-[60]"
      aria-hidden="true"
    >
      {event === 'halloween' && (
        <HalloweenAtmosphere reducedMotion={effectiveReducedMotion} />
      )}
      {event === 'christmas' && (
        <ChristmasAtmosphere reducedMotion={effectiveReducedMotion} />
      )}
      {event === 'newyear' && (
        <NewYearAtmosphere reducedMotion={effectiveReducedMotion} />
      )}
    </div>
  );
};

/* --------------------------------------------------------------------------
   1. HALLOWEEN ATMOSPHERE — REAL AMERICAN HAUNTED MANSION COMPANION
   Atmospheric overlay particles & accents complementing the real Haunted Mansion scene:
   - Gnarled ancient bare oak branch silhouettes framing top corners
   - 3 sparse realistic gliding microbats
   - Sentinel Jack-o'-Lantern positioned at bottom-left (isolated from scroll-to-top button)
   - Gentle, non-obscuring ground mist
   -------------------------------------------------------------------------- */
const HalloweenAtmosphere: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  // Sparse, realistic microbat silhouettes (3 bats with irregular gliding flight)
  const bats = useMemo(() => [
    { id: 1, anim: 'festBatFlight1 14s cubic-bezier(0.25, 1, 0.5, 1) infinite', delay: '0s', size: 44 },
    { id: 2, anim: 'festBatFlight2 18s cubic-bezier(0.25, 1, 0.5, 1) infinite', delay: '5s', size: 34 },
    { id: 3, anim: 'festBatFlight3 22s cubic-bezier(0.25, 1, 0.5, 1) infinite', delay: '11s', size: 40 },
  ], []);

  return (
    <>
      {/* Dark Ambient Vignette: Cold pale moonlight on top, deep shadow perimeter */}
      <div className="absolute inset-0 bg-radial-[ellipse_100%_70%_at_50%_-10%] from-purple-900/10 via-transparent to-black/40 pointer-events-none" />

      {/* Gnarled Ancient Bare Oak Branches (Top-Left Frame) */}
      <div className="absolute top-0 left-0 w-44 h-32 sm:w-64 sm:h-48 md:w-80 md:h-60 pointer-events-none opacity-30 text-[#07030A]">
        <svg viewBox="0 0 320 220" fill="currentColor" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
          <path d="M0 0 L45 0 C75 25, 95 20, 125 35 C145 45, 165 40, 185 55 C215 45, 245 65, 275 60 L265 65 C235 70, 210 58, 180 70 C155 80, 135 105, 105 115 C75 125, 55 155, 25 175 L0 185 Z" />
          <path d="M125 35 C140 22, 165 18, 195 12 C215 10, 235 15, 255 10 L250 14 C230 18, 210 14, 190 20 C165 25, 145 32, 130 42 Z" />
          <path d="M180 70 C195 85, 220 95, 240 110 C255 120, 285 130, 310 135 L300 139 C275 133, 250 125, 235 115 C215 103, 190 93, 177 78 Z" />
          <path d="M105 115 C115 130, 135 145, 150 165 C160 180, 175 195, 190 210 L183 213 C167 197, 153 183, 143 167 C130 150, 113 135, 100 120 Z" />
        </svg>
      </div>

      {/* Gnarled Ancient Bare Oak Branches (Top-Right Frame) */}
      <div className="absolute top-0 right-0 w-36 h-28 sm:w-56 sm:h-40 md:w-72 md:h-52 pointer-events-none opacity-25 text-[#07030A] transform scale-x-[-1]">
        <svg viewBox="0 0 320 220" fill="currentColor" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
          <path d="M0 0 L45 0 C75 25, 95 20, 125 35 C145 45, 165 40, 185 55 C215 45, 245 65, 275 60 L265 65 C235 70, 210 58, 180 70 C155 80, 135 105, 105 115 C75 125, 55 155, 25 175 L0 185 Z" />
          <path d="M125 35 C140 22, 165 18, 195 12 C215 10, 235 15, 255 10 L250 14 C230 18, 210 14, 190 20 C165 25, 145 32, 130 42 Z" />
          <path d="M180 70 C195 85, 220 95, 240 110 C255 120, 285 130, 310 135 L300 139 C275 133, 250 125, 235 115 C215 103, 190 93, 177 78 Z" />
        </svg>
      </div>

      {/* Non-Obscuring Low Ground Fog Mist */}
      {!reducedMotion && (
        <div
          className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-purple-950/20 via-black/10 to-transparent pointer-events-none z-[4]"
          style={{ animation: 'festMistDrift 28s ease-in-out infinite' }}
        />
      )}

      {/* Sparse Natural Bat Silhouettes in Realistic Gliding Flight */}
      {!reducedMotion && bats.map((bat) => (
        <div
          key={bat.id}
          className="absolute pointer-events-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] z-[5]"
          style={{
            top: 0,
            left: 0,
            animation: bat.anim,
            animationDelay: bat.delay,
          }}
        >
          {/* Anatomical Wing Flapping / Gliding Motion */}
          <div style={{ animation: 'festBatFlap 0.42s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
            <svg
              width={bat.size}
              height={bat.size * 0.52}
              viewBox="0 0 100 50"
              fill="#060309"
              stroke="rgba(249, 115, 22, 0.4)"
              strokeWidth="0.8"
            >
              {/* Detailed American Microbat Wing & Body Silhouette */}
              <path d="M 50 25 C 47 18 42 12 30 10 C 20 8 10 14 0 25 C 10 27 16 36 24 33 C 30 38 37 36 43 31 C 47 37 49 42 50 45 C 51 42 53 37 57 31 C 63 36 70 38 76 33 C 84 36 90 27 100 25 C 90 14 80 8 70 10 C 58 12 53 18 50 25 Z" />
              {/* Pointed Ears & Head Silhouette */}
              <polygon points="46,18 48,12 50,16 52,12 54,18" fill="#060309" />
            </svg>
          </div>
        </div>
      ))}

      {/* Sentinel Carved Jack-o'-Lantern with Realistic Candle Flame Flicker (Positioned at Bottom-Left to avoid Scroll-To-Top button) */}
      <div
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 pointer-events-none select-none w-12 h-12 sm:w-14 sm:h-14 z-[6]"
        style={{ animation: !reducedMotion ? 'festCandleFlicker 3s ease-in-out infinite' : 'none' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(234,88,12,0.85)]">
          <defs>
            <radialGradient id="jackFireGlow" cx="50%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </radialGradient>
          </defs>
          {/* Weathered Pumpkin Husk */}
          <path d="M 50 15 C 25 15 10 32 10 58 C 10 82 28 92 50 92 C 72 92 90 82 90 58 C 90 32 75 15 50 15 Z" fill="#140a1c" stroke="#ea580c" strokeWidth="2.5" />
          {/* Pumpkin Stem */}
          <path d="M 48 15 Q 46 5 54 3 Q 56 10 52 15 Z" fill="#2e1065" stroke="#7e22ce" strokeWidth="1" />
          {/* Sinister Carved Triangular Eyes */}
          <polygon points="32,45 42,42 35,53" fill="url(#jackFireGlow)" />
          <polygon points="68,45 58,42 65,53" fill="url(#jackFireGlow)" />
          {/* Jagged Sinister Grin with Carved Teeth */}
          <path d="M 24 64 Q 50 82 76 64 Q 72 73 66 74 Q 63 68 59 74 Q 50 78 41 74 Q 37 68 34 74 Q 28 73 24 64 Z" fill="url(#jackFireGlow)" />
        </svg>
      </div>
    </>
  );
};

/* --------------------------------------------------------------------------
   2. CHRISTMAS ATMOSPHERE — LOCKED (100% UNCHANGED)
   32 crystal snowflakes falling with gentle sway, sparkling fairy lights garland
   -------------------------------------------------------------------------- */
const ChristmasAtmosphere: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.1 + (i % 5) * 1.5).toFixed(1)}%`,
      delay: `${((i * 0.45) % 8).toFixed(1)}s`,
      duration: `${(6.5 + (i % 6) * 1.8).toFixed(1)}s`,
      size: i % 4 === 0 ? 20 : i % 3 === 0 ? 15 : i % 2 === 0 ? 11 : 8,
      opacity: (0.65 + (i % 4) * 0.1).toFixed(2),
      isCrystal: i % 3 === 0,
    }));
  }, []);

  return (
    <>
      {/* Warm Holiday Ambient Edge Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-emerald-950/25 pointer-events-none" />

      {/* Sparkling Fairy Lights Garland along top */}
      <div className="absolute top-0 left-0 right-0 h-2.5 flex justify-around px-2 pointer-events-none z-10">
        {Array.from({ length: 22 }).map((_, i) => {
          const colors = ['#EF4444', '#10B981', '#F59E0B', '#38BDF8'];
          const color = colors[i % colors.length];
          return (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 0 0 16px ${color}`,
                animation: !reducedMotion ? `festFairyTwinkle ${(1.8 + (i % 4) * 0.4).toFixed(1)}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${(i * 0.2).toFixed(1)}s`,
              }}
            />
          );
        })}
      </div>

      {/* Crystal Falling Snowflakes */}
      {!reducedMotion && snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="absolute select-none pointer-events-none text-white"
          style={{
            left: flake.left,
            top: '-25px',
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `festSnowSwayFall ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))',
          }}
        >
          {flake.isCrystal ? '❄' : '❅'}
        </span>
      ))}

      {/* Glowing Holiday Christmas Tree (Bottom-Left) */}
      <div
        className="absolute bottom-6 left-6 pointer-events-none select-none text-2xl md:text-3xl"
        style={{ animation: !reducedMotion ? 'festFairyTwinkle 3s ease-in-out infinite' : 'none' }}
      >
        <span className="inline-block filter drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]">
          🎄
        </span>
      </div>

      {/* Christmas Bell Accent (Bottom-Right) */}
      <div
        className="absolute bottom-6 right-6 pointer-events-none select-none text-2xl md:text-3xl"
        style={{ animation: !reducedMotion ? 'festFairyTwinkle 3.6s ease-in-out infinite 0.8s' : 'none' }}
      >
        <span className="inline-block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]">
          🔔
        </span>
      </div>
    </>
  );
};

/* --------------------------------------------------------------------------
   3. HAPPY NEW YEAR ATMOSPHERE — INTERACTIVE GOLDEN CELEBRATION
   - NO AUTOMATIC FIREWORKS.
   - Mouse Move: Subtle golden light trail with soft drifting dust.
   - Mouse Click / Tap: Exactly ONE single golden firework burst (0.7s - 0.9s duration).
   - Fully passive events, zero layout thrashing, 100% click-through (pointer-events: none).
   -------------------------------------------------------------------------- */
const NewYearAtmosphere: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Golden cursor trail particle pool
    interface TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
      color: string;
    }
    const trailParticles: TrailParticle[] = [];

    // Interactive firework spark particles
    interface FireworkSpark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      gravity: number;
      friction: number;
      alpha: number;
      decay: number;
      size: number;
      color: string;
    }
    const fireworkSparks: FireworkSpark[] = [];

    let cursorX = -999;
    let cursorY = -999;
    let isMoving = false;
    let moveTimeout: any;

    const createFireworkAt = (x: number, y: number) => {
      if (reducedMotion) {
        // Reduced motion: subtle soft gold glow that fades quickly
        trailParticles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 18,
          alpha: 0.65,
          decay: 0.045,
          color: '#F59E0B',
        });
        return;
      }

      // Limit concurrent active sparks to prevent any performance overhead
      if (fireworkSparks.length > 80) {
        fireworkSparks.splice(0, 30);
      }

      const sparkCount = 28;
      const colors = ['#FEF08A', '#FBBF24', '#F59E0B', '#EF4444', '#FFFFFF'];
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.25;
        const speed = 2.8 + Math.random() * 4.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworkSparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.085,
          friction: 0.945,
          alpha: 1.0,
          decay: 0.02 + Math.random() * 0.012, // 0.7s to 0.9s duration
          size: 1.8 + Math.random() * 1.6,
          color,
        });
      }
    };

    // Passive pointer move listener (Mouse only, ignores touch scroll)
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      cursorX = e.clientX;
      cursorY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 70);

      if (reducedMotion) return;

      // Add a couple of subtle golden dust specks
      if (Math.random() < 0.6) {
        trailParticles.push({
          x: cursorX + (Math.random() - 0.5) * 6,
          y: cursorY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 + 0.15,
          radius: 1.2 + Math.random() * 1.6,
          alpha: 0.75,
          decay: 0.038, // Fast fade in ~250ms
          color: Math.random() > 0.35 ? '#FBBF24' : '#FEF08A',
        });
      }
    };

    // Passive click / tap listener (Mouse click or mobile tap)
    const onPointerDown = (e: PointerEvent) => {
      if (e.button && e.button !== 0) return;
      createFireworkAt(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Soft golden aura directly following cursor
      if (cursorX > 0 && cursorY > 0 && isMoving && !reducedMotion) {
        const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, 20);
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Tiny center spark
        ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw & update trail particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw & update single firework sparks
      for (let i = fireworkSparks.length - 1; i >= 0; i--) {
        const s = fireworkSparks[i];
        s.vx *= s.friction;
        s.vy *= s.friction;
        s.vy += s.gravity;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          fireworkSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(moveTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* Imperial Golden Ambient Edge Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-red-950/20 pointer-events-none" />

      {/* Interactive Golden Cursor Trail & Single Firework Click Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-20"
      />
    </>
  );
};
