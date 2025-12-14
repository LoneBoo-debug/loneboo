
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2 } from 'lucide-react';

const COLORS = ['#000000', '#EF4444', '#F97316', '#FBBF24', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const DrawingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        // Set actual size in memory (scaled to account for high DPI screens if needed, but keeping simple here)
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-4 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
          Lavagna Magica
      </h2>

      <div className="bg-white p-4 rounded-[30px] border-4 border-black shadow-xl w-full">
         
         {/* Controls */}
         <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-gray-100 p-3 rounded-2xl border-2 border-gray-200">
             
             {/* Colors - Removed Scrollbar, Added Wrap, Reduced Size */}
             <div className="flex gap-2 flex-wrap justify-center md:justify-start pb-0">
                 {COLORS.map(c => (
                     <button
                        key={c}
                        onClick={() => { setColor(c); setBrushSize(5); }}
                        className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-gray-300 ${color === c ? 'scale-125 border-black shadow-md' : ''}`}
                        style={{ backgroundColor: c }}
                     />
                 ))}
             </div>

             {/* Tools */}
             <div className="flex gap-2">
                 <button 
                    onClick={() => { setColor('white'); setBrushSize(20); }}
                    className={`p-2 rounded-xl border-2 ${color === 'white' ? 'bg-gray-300 border-black' : 'bg-white border-gray-300'}`}
                 >
                     <Eraser size={20} />
                 </button>
                 <button 
                    onClick={clearCanvas}
                    className="p-2 rounded-xl bg-red-100 border-2 border-red-300 text-red-600 hover:bg-red-200"
                 >
                     <Trash2 size={20} />
                 </button>
             </div>
         </div>

         {/* Canvas Area */}
         <div className="relative w-full h-[400px] border-4 border-dashed border-gray-300 rounded-2xl overflow-hidden touch-none cursor-crosshair bg-white">
             <canvas
                ref={canvasRef}
                className="w-full h-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
             />
         </div>
      </div>
    </div>
  );
};

export default DrawingGame;
