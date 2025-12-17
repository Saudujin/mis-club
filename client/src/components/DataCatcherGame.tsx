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
  const [basketX, setBasketX] = useState(50); // Percentage 0-100
  const [objects, setObjects] = useState<GameObject[]>([]);
  const gameLoopRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnTime = useRef(0);

  // Handle movement (Mouse/Touch)
  const handleMove = (clientX: number) => {
    if (containerRef.current && gameState === 'playing') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setBasketX(Math.max(5, Math.min(95, percentage)));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnObject = () => {
      const id = Date.now();
      const type = Math.random() > 0.3 ? 'data' : 'virus'; // 70% data, 30% virus
      const x = Math.random() * 90 + 5; // Random X position 5-95%
      const speed = Math.random() * 0.5 + 0.5; // Random speed

      setObjects(prev => [...prev, { id, x, y: -10, type, speed }]);
    };

    const updateGame = (time: number) => {
      if (time - lastSpawnTime.current > 1000) { // Spawn every 1 second
        spawnObject();
        lastSpawnTime.current = time;
      }

      setObjects(prev => {
        const nextObjects: GameObject[] = [];
        let newScore = score;
        let gameOver = false;

        prev.forEach(obj => {
          const newY = obj.y + obj.speed;
          
          // Check collision with basket (at bottom 10%)
          if (newY > 85 && newY < 95 && Math.abs(obj.x - basketX) < 10) {
            if (obj.type === 'data') {
              newScore += 10;
            } else {
              gameOver = true;
            }
          } else if (newY < 100) {
            nextObjects.push({ ...obj, y: newY });
          }
        });

        if (gameOver) {
          setGameState('gameover');
          return [];
        }
        
        if (newScore !== score) setScore(newScore);
        return nextObjects;
      });

      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, basketX, score]);

  const startGame = () => {
    setScore(0);
    setObjects([]);
    setGameState('playing');
    lastSpawnTime.current = performance.now();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto h-[400px] bg-[#001835] rounded-xl border border-white/10 overflow-hidden touch-none select-none"
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
      {objects.map(obj => (
        <div
          key={obj.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform"
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

      {/* Player Basket */}
      <div 
        className="absolute bottom-4 transform -translate-x-1/2 transition-all duration-75 ease-out"
        style={{ left: `${basketX}%` }}
      >
        <div className="w-16 h-12 bg-[var(--brand-blue)] rounded-b-xl border-2 border-[var(--brand-cyan)] flex items-center justify-center relative shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--brand-cyan)]/10 rounded-t-full border-t-2 border-x-2 border-[var(--brand-cyan)]/50" />
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
