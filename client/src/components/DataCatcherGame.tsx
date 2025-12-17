import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Database, FileText, Shield, AlertTriangle, Play, RotateCcw, Trophy } from "lucide-react";

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: 'data' | 'virus';
  speed: number;
}

export default function DataCatcherGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  
  // Refs for game loop and state to avoid re-renders
  const basketRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>(0);
  const lastSpawnTime = useRef(0);
  const objectsRef = useRef<GameObject[]>([]);
  const scoreRef = useRef(0);
  const basketXRef = useRef(50); // Percentage 0-100

  // Handle movement (Mouse/Touch) - Direct DOM update for 60fps
  const updateBasketPosition = (clientX: number) => {
    if (containerRef.current && basketRef.current && gameState === 'playing') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
      
      basketXRef.current = percentage;
      basketRef.current.style.left = `${percentage}%`;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    updateBasketPosition(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateBasketPosition(e.clientX);
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnObject = () => {
      const id = Date.now();
      const type = Math.random() > 0.3 ? 'data' : 'virus'; // 70% data, 30% virus
      const x = Math.random() * 90 + 5; // Random X position 5-95%
      const speed = Math.random() * 0.4 + 0.3; // Slightly slower for better control

      objectsRef.current.push({ id, x, y: -10, type, speed });
    };

    const updateGame = (time: number) => {
      if (time - lastSpawnTime.current > 800) { // Spawn every 0.8 second
        spawnObject();
        lastSpawnTime.current = time;
      }

      // Update objects
      const nextObjects: GameObject[] = [];
      let gameOver = false;

      objectsRef.current.forEach(obj => {
        obj.y += obj.speed;
        
        // Check collision with basket (at bottom 10%)
        // Basket is roughly 10% wide, check if object is within range
        if (obj.y > 85 && obj.y < 95 && Math.abs(obj.x - basketXRef.current) < 8) {
          if (obj.type === 'data') {
            scoreRef.current += 10;
            setScore(scoreRef.current); // Trigger re-render only for score
          } else {
            gameOver = true;
          }
        } else if (obj.y < 100) {
          nextObjects.push(obj);
        }
      });

      objectsRef.current = nextObjects;

      if (gameOver) {
        setGameState('gameover');
        return;
      }

      // Render objects directly to DOM to avoid React reconciliation overhead
      // This is a hybrid approach: React handles structure, we handle positions
      // But for simplicity in this component, we'll force a re-render for objects
      // To make it truly 60fps, we would manipulate DOM nodes directly, but let's try optimized React first
      // If this is still slow, we switch to Canvas or pure DOM
      
      // For now, let's stick to React state for objects but keep basket separate
      // To optimize, we can use a forceUpdate or just setObjects
      // But actually, setting state every frame is what kills performance.
      // Let's try to minimize state updates.
      
      // Actually, for 60fps game loop in React, it's better to use a ref for positions 
      // and only update state for score/gameover.
      // However, we need to render the objects.
      // Let's use a requestAnimationFrame loop that updates DOM elements directly if possible,
      // or just accept React's overhead but optimize the basket.
      
      // We already optimized the basket (it doesn't trigger re-renders).
      // Now let's optimize objects. We will use a forceUpdate-like mechanism 
      // but only for the objects container.
      
      // Actually, let's just use setObjects here. The basket is the most critical part for "feel".
      // Since basket is now ref-based, it should feel instant.
      setObjectsState([...objectsRef.current]);

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  const [objectsState, setObjectsState] = useState<GameObject[]>([]);

  const startGame = () => {
    scoreRef.current = 0;
    setScore(0);
    objectsRef.current = [];
    setObjectsState([]);
    setGameState('playing');
    lastSpawnTime.current = performance.now();
    
    // Reset basket
    basketXRef.current = 50;
    if (basketRef.current) {
      basketRef.current.style.left = '50%';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto h-[400px] bg-[#001835] rounded-xl border border-white/10 overflow-hidden touch-none select-none cursor-crosshair"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
          <div className="w-20 h-20 bg-[var(--brand-cyan)]/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Database className="w-10 h-10 text-[var(--brand-cyan)]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">لعبة اصطياد البيانات</h3>
          <p className="text-white/60 mb-8 text-center max-w-xs">اجمع البيانات الصحيحة <Database className="inline w-4 h-4 mx-1"/> وتجنب الفيروسات <AlertTriangle className="inline w-4 h-4 mx-1 text-red-500"/></p>
          <Button onClick={startGame} size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 font-bold px-8">
            ابدأ اللعب <Play className="mr-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">انتهت اللعبة!</h3>
          <p className="text-xl text-[var(--brand-cyan)] font-bold mb-8">النتيجة: {score}</p>
          <Button onClick={startGame} size="lg" className="bg-white/10 text-white hover:bg-white/20 border border-white/20 font-bold px-8">
            حاول مرة أخرى <RotateCcw className="mr-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Score Display */}
      <div className="absolute top-4 right-4 bg-black/40 px-4 py-2 rounded-full border border-white/10 text-white font-bold z-10">
        النقاط: {score}
      </div>

      {/* Falling Objects */}
      {objectsState.map(obj => (
        <div
          key={obj.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ 
            left: `${obj.x}%`, 
            top: `${obj.y}%`,
          }}
        >
          {obj.type === 'data' ? (
            <div className="text-[var(--brand-cyan)] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
              {obj.id % 2 === 0 ? <Database size={24} /> : <FileText size={24} />}
            </div>
          ) : (
            <div className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              <AlertTriangle size={24} />
            </div>
          )}
        </div>
      ))}

      {/* Player Basket - Ref based for 60fps */}
      <div 
        ref={basketRef}
        className="absolute bottom-4 transform -translate-x-1/2 transition-none will-change-transform"
        style={{ left: '50%' }}
      >
        <div className="w-16 h-12 bg-[var(--brand-blue)] rounded-b-xl border-2 border-[var(--brand-cyan)] flex items-center justify-center relative shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--brand-cyan)]/10 rounded-t-full border-t-2 border-x-2 border-[var(--brand-cyan)]/50" />
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
