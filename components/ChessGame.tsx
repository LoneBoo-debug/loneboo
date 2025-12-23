
import React, { useState, useEffect } from 'react';
import { RotateCcw, Loader2, Lock, Settings } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/t4q1TwQW/scxsa-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BG_IMG = 'https://i.postimg.cc/jjgXTVbC/sfondoscacchi.jpg';
const GRANDFATHER_THINKING_IMG = 'https://i.postimg.cc/Cx4Jg8cB/nonno-pensante-(1)-(1).png';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';
type Piece = { type: PieceType; color: PieceColor } | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ChessGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const ChessPieceIcon: React.FC<{ type: PieceType; color: PieceColor; size?: string }> = ({ type, color, size = "w-full h-full" }) => {
    const isWhite = color === 'w';
    const fill = isWhite ? '#FFFFFF' : '#000000';
    const stroke = isWhite ? '#000000' : '#FFFFFF';
    const svgProps = { 
        viewBox: "0 0 45 45", 
        className: `${size} drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]`, 
        style: { transform: 'scale(1.1)' } 
    };

    switch (type) {
        case 'p': // Pawn
            return (
                <svg {...svgProps}>
                    <path d="M 22.5,9 C 20.29,9 18.5,10.79 18.5,13 C 18.5,13.89 18.79,14.71 19.28,15.38 C 17.33,16.5 16,18.59 16,21 C 16,23.03 16.94,24.84 18.41,26.03 C 15.41,27.09 11,31.58 11,39.5 L 34,39.5 C 34,31.58 29.59,27.09 26.59,26.03 C 28.06,24.84 29,23.03 29,21 C 29,18.59 27.67,16.5 25.72,15.38 C 26.21,14.71 26.5,13.89 26.5,13 C 26.5,10.79 24.71,9 22.5,9 z" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );
        case 'r': // Rook
            return (
                <svg {...svgProps}>
                    <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
                        <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
                        <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14" />
                        <path d="M 34,14 L 31,17 L 14,17 L 11,14" />
                        <path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17" />
                        <path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5" />
                    </g>
                </svg>
            );
        case 'n': // Knight
            return (
                <svg {...svgProps}>
                    <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
                        <path d="M 24,18 C 24.38,20.32 19.32,19.97 19,18 C 19,14.5 22,12.5 24,12.5 C 27.5,12.5 28,15.5 28,18 C 28,22.5 24.5,23.5 24.5,24.5" />
                        <path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 z" fill={stroke} />
                    </g>
                </svg>
            );
        case 'b': // Bishop
            return (
                <svg {...svgProps}>
                    <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,39 C 27,39 18,39 9,39 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
                        <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,28.5 30,28.5 C 30,26 27.5,23.5 27.5,23.5 L 28.5,22.5 C 28.5,22.5 26.5,25 24,25 C 21.5,25 19.5,22.5 19.5,22.5 C 20.5,25 18,26.5 18,26.5 C 15.5,26.5 15,28.5 15,28.5 C 15,28.5 14.5,30.5 15,32 z" />
                        <path d="M 25,8 A 2.5,2.5 0 1,1 20,8 A 2.5,2.5 0 1,1 25,8 z" />
                    </g>
                </svg>
            );
        case 'q': // Queen
            return (
                <svg {...svgProps}>
                    <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 8,12 A 2,2 0 1,1 4,12 A 2,2 0 1,1 8,12 z" />
                        <path d="M 24.5,7.5 A 2,2 0 1,1 20.5,7.5 A 2,2 0 1,1 24.5,7.5 z" />
                        <path d="M 41,12 A 2,2 0 1,1 37,12 A 2,2 0 1,1 41,12 z" />
                        <path d="M 11,20 A 2,2 0 1,1 7,20 A 2,2 0 1,1 11,20 z" />
                        <path d="M 38,20 A 2,2 0 1,1 34,20 A 2,2 0 1,1 38,20 z" />
                        <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,9.5 L 19.5,24.5 L 14,11 L 14,25 L 7,14 L 9,26 z" />
                        <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
                        <path d="M 11.5,30 C 15,29 30,29 33.5,30" fill="none" />
                        <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" fill="none" />
                    </g>
                </svg>
            );
        case 'k': // King
            return (
                <svg {...svgProps}>
                    <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 22.5,11.63 L 22.5,6" fill="none" strokeWidth="1.5" />
                        <path d="M 20,8 L 25,8" fill="none" strokeWidth="1.5" />
                        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 z" />
                        <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37 z" />
                        <path d="M 11.5,30 C 17,27 27,27 32.5,30" fill="none" />
                        <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" fill="none" />
                        <path d="M 11.5,37 C 17,34 27,34 32.5,37" fill="none" />
                    </g>
                </svg>
            );
        default: return null;
    }
};

const ChessGame: React.FC<ChessGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [legalMoves, setLegalMoves] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [inCheck, setInCheck] = useState<PieceColor | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  
  // Pezzi catturati
  const [capturedByWhite, setCapturedByWhite] = useState<PieceType[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<PieceType[]>([]);

  // Stato per l'animazione della mossa avversaria
  const [aiMoving, setAiMoving] = useState<{ from: number, to: number } | null>(null);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  useEffect(() => {
      if (showUnlockModal) {
          const p = getProgress();
          setUserTokens(p.tokens);
      }
  }, [showUnlockModal]);

  const handleUnlockHard = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
          setDifficulty('HARD');
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const initBoard = () => {
    const newBoard: Piece[] = Array(64).fill(null);
    const setupRow = (row: number, color: PieceColor, pieces: PieceType[]) => {
      pieces.forEach((p, i) => { newBoard[row * 8 + i] = { type: p, color }; });
    };
    const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    const pawnRow: PieceType[] = Array(8).fill('p');
    setupRow(0, 'b', backRow); 
    setupRow(1, 'b', pawnRow);
    setupRow(6, 'w', pawnRow); 
    setupRow(7, 'w', backRow);
    setBoard(newBoard);
    setTurn('w');
    setWinner(null);
    setInCheck(null);
    setSelectedIdx(null);
    setLegalMoves([]);
    setIsThinking(false);
    setRewardGiven(false);
    setAiMoving(null);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
  };

  useEffect(() => {
    if (difficulty) initBoard();
  }, [difficulty]);

  useEffect(() => {
      if (winner === 'w' && !rewardGiven && onEarnTokens) {
          let reward = 5; 
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 20;
          onEarnTokens(reward);
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  const getPseudoMoves = (idx: number, currentBoard: Piece[], color: PieceColor) => {
    const piece = currentBoard[idx];
    if (!piece || piece.color !== color) return [];
    const moves: number[] = [];
    const row = Math.floor(idx / 8);
    const col = idx % 8;
    const addMove = (r: number, c: number) => {
       if (r >= 0 && r < 8 && c >= 0 && c < 8) {
           const targetIdx = r * 8 + c;
           const targetPiece = currentBoard[targetIdx];
           if (!targetPiece) { moves.push(targetIdx); return true; } 
           else if (targetPiece.color !== color) { moves.push(targetIdx); return false; }
       }
       return false; 
    };
    if (piece.type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        if (row + dir >= 0 && row + dir < 8 && !currentBoard[(row + dir) * 8 + col]) {
            moves.push((row + dir) * 8 + col);
            if ((color === 'w' && row === 6) || (color === 'b' && row === 1)) {
                if (!currentBoard[(row + dir * 2) * 8 + col]) moves.push((row + dir * 2) * 8 + col);
            }
        }
        [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const target = currentBoard[r * 8 + c];
                if (target && target.color !== color) moves.push(r * 8 + c);
            }
        });
    } else {
        const directions = {
            'r': [[0,1], [0,-1], [1,0], [-1,0]],
            'b': [[1,1], [1,-1], [-1,1], [-1,-1]],
            'q': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]],
            'n': [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]],
            'k': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]
        };
        // @ts-ignore
        const dirs = directions[piece.type];
        // @ts-ignore
        dirs.forEach(([dr, dc]) => {
            if (piece.type === 'n' || piece.type === 'k') { addMove(row + dr, col + dc); } 
            else { let r = row + dr, c = col + dc; while (addMove(r, c)) { r += dr; c += dc; } }
        });
    }
    return moves;
  };

  const isSquareAttacked = (targetIdx: number, currentBoard: Piece[], attackerColor: PieceColor) => {
      for (let i = 0; i < 64; i++) {
          const piece = currentBoard[i];
          if (piece && piece.color === attackerColor) {
              const moves = getPseudoMoves(i, currentBoard, attackerColor);
              if (moves.includes(targetIdx)) return true;
          }
      }
      return false;
  };

  const findKing = (currentBoard: Piece[], color: PieceColor) => currentBoard.findIndex(p => p?.type === 'k' && p.color === color);

  const getLegalMoves = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      const pseudoMoves = getPseudoMoves(idx, currentBoard, piece.color);
      return pseudoMoves.filter(toIdx => {
          const tempBoard = [...currentBoard];
          tempBoard[toIdx] = tempBoard[idx];
          tempBoard[idx] = null;
          const kingIdx = findKing(tempBoard, piece.color);
          if (kingIdx === -1) return false; 
          const opponentColor = piece.color === 'w' ? 'b' : 'w';
          return !isSquareAttacked(kingIdx, tempBoard, opponentColor);
      });
  };

  const isCheckmate = (currentBoard: Piece[], color: PieceColor) => {
      const kingIdx = findKing(currentBoard, color);
      const opponentColor = color === 'w' ? 'b' : 'w';
      if (!isSquareAttacked(kingIdx, currentBoard, opponentColor)) return false; 
      for (let i = 0; i < 64; i++) {
          if (currentBoard[i]?.color === color) {
              if (getLegalMoves(i, currentBoard).length > 0) return false; 
          }
      }
      return true; 
  };

  const handleSelect = (idx: number) => {
      if (turn === 'w' && board[idx]?.color === 'w' && !winner && !isThinking && !aiMoving) {
          setSelectedIdx(idx);
          setLegalMoves(getLegalMoves(idx, board));
      }
  };

  const handleMove = (toIdx: number) => {
      if (selectedIdx === null) return;
      const newBoard = [...board];
      const targetPiece = newBoard[toIdx];
      
      if (targetPiece) {
          setCapturedByWhite(prev => [...prev, targetPiece.type]);
      }

      newBoard[toIdx] = newBoard[selectedIdx];
      newBoard[selectedIdx] = null;
      if (newBoard[toIdx]?.type === 'p' && (Math.floor(toIdx / 8) === 0 || Math.floor(toIdx / 8) === 7)) {
          // @ts-ignore
          newBoard[toIdx].type = 'q';
      }
      setBoard(newBoard);
      setSelectedIdx(null);
      setLegalMoves([]);
      if (isCheckmate(newBoard, 'b')) { setWinner('w'); return; }
      const blackKing = findKing(newBoard, 'b');
      if (isSquareAttacked(blackKing, newBoard, 'w')) setInCheck('b'); else setInCheck(null);
      setTurn('b');
  };

  const getPieceValue = (p: Piece) => {
      if (!p) return 0;
      const values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
      return values[p.type];
  };

  const getPositionBonus = (idx: number) => {
      const r = Math.floor(idx / 8); const c = idx % 8;
      if ((r === 3 || r === 4) && (c === 3 || c === 4)) return 3;
      if (r >= 2 && r <= 5 && c >= 2 && c <= 5) return 1;
      return 0;
  };

  useEffect(() => {
    if (turn === 'b' && !winner && difficulty && !aiMoving) {
        setIsThinking(true);
        const aiTimer = setTimeout(() => {
            const allMoves: { from: number, to: number, score: number }[] = [];
            board.forEach((piece, idx) => {
                if (piece?.color === 'b') {
                    const moves = getLegalMoves(idx, board);
                    moves.forEach(to => {
                        const tempBoard = [...board];
                        const capturedPiece = tempBoard[to];
                        tempBoard[to] = tempBoard[idx];
                        tempBoard[idx] = null;
                        let score = 0;
                        if (capturedPiece) score += getPieceValue(capturedPiece) * 10;
                        score += getPositionBonus(to);
                        if (difficulty === 'EASY') score += Math.random() * 50; 
                        else if (difficulty === 'MEDIUM') { if (isSquareAttacked(to, tempBoard, 'w')) score -= getPieceValue(piece); } 
                        else if (difficulty === 'HARD') {
                            let maxPlayerResponse = 0;
                            for(let i=0; i<64; i++) {
                                if (tempBoard[i]?.color === 'w') {
                                    const pMoves = getPseudoMoves(i, tempBoard, 'w');
                                    pMoves.forEach(pm => {
                                        const target = tempBoard[pm];
                                        if (target && target.color === 'b') {
                                            const val = getPieceValue(target);
                                            if (val > maxPlayerResponse) maxPlayerResponse = val;
                                        }
                                    });
                                }
                            }
                            score -= (maxPlayerResponse * 10);
                            const whiteKing = findKing(tempBoard, 'w');
                            if (isSquareAttacked(whiteKing, tempBoard, 'b')) score += 15;
                        }
                        allMoves.push({ from: idx, to, score });
                    });
                }
            });

            if (allMoves.length > 0) {
                allMoves.sort((a, b) => b.score - a.score);
                const topMoves = allMoves.filter(m => m.score >= allMoves[0].score - 5);
                const bestMove = topMoves[Math.floor(Math.random() * topMoves.length)];
                
                // AVVIA ANIMAZIONE VISIVA
                setIsThinking(false);
                setAiMoving({ from: bestMove.from, to: bestMove.to });

                // Aspetta che l'animazione finisca
                setTimeout(() => {
                    const newBoard = [...board];
                    const targetPiece = newBoard[bestMove.to];
                    if (targetPiece) {
                        setCapturedByBlack(prev => [...prev, targetPiece.type]);
                    }

                    newBoard[bestMove.to] = newBoard[bestMove.from];
                    newBoard[bestMove.from] = null;
                    if (newBoard[bestMove.to]?.type === 'p' && Math.floor(bestMove.to / 8) === 7) {
                        // @ts-ignore
                        newBoard[bestMove.to].type = 'q';
                    }
                    setAiMoving(null);
                    setBoard(newBoard);
                    
                    if (isCheckmate(newBoard, 'w')) { setWinner('b'); } 
                    else {
                        const whiteKing = findKing(newBoard, 'w');
                        if (isSquareAttacked(whiteKing, newBoard, 'b')) setInCheck('w'); else setInCheck(null);
                        setTurn('w');
                    }
                }, 800);

            } else { if (inCheck === 'b') setWinner('w'); else setWinner('w'); setIsThinking(false); }
        }, 2500); 
        return () => clearTimeout(aiTimer);
    }
  }, [turn, winner, difficulty, board]);

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) { setShowUnlockModal(true); return; }
      setDifficulty(level);
  };

  const backToMenu = () => { setDifficulty(null); initBoard(); };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  if (!difficulty) {
      return (
          <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" /></button>
              </div>
              <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>
              {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
              <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-16">
                  <img src={TITLE_IMG} alt="Scacchi" className="w-72 md:w-96 h-auto mb-6 relative z-10 hover:scale-105 transition-transform duration-300" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
                  <div className="flex flex-col gap-4 items-center w-full relative z-10">
                      <button onClick={() => handleLevelSelect('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" /></button>
                      <button onClick={() => handleLevelSelect('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" /></button>
                      <div className="relative hover:scale-105 active:scale-95 transition-transform w-48">
                          <button onClick={() => handleLevelSelect('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" /></button>
                          {!isHardUnlocked && (
                              <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                  <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  const tokenReward = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20;

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
        <div className="absolute top-4 left-4 z-50">
            <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-12 w-auto drop-shadow-md" /></button>
        </div>
        <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>

        <div className="w-full h-full flex flex-col items-center justify-center p-2 relative z-10">
            <img src={TITLE_IMG} alt="Scacchi" className="h-16 md:h-20 w-auto mb-2 drop-shadow-md shrink-0" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
            
            <div className="flex items-center gap-4 mb-2 bg-white px-6 py-1 rounded-full border-2 border-black relative shadow-lg shrink-0 scale-90 md:scale-100">
                <div className={`w-4 h-4 rounded-full ${turn === 'w' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-700'}`}></div>
                <span className={`font-bold ${turn === 'w' ? 'text-indigo-600' : 'text-slate-700'}`}>{turn === 'w' ? 'Tocca a te (Bianchi)' : 'Avversario (Neri)'}</span>
                {inCheck && <span className="text-red-600 font-black animate-pulse bg-red-100 px-2 rounded ml-2 text-xs">SCACCO!</span>}
            </div>

            <div className="bg-white/40 backdrop-blur-md p-2 md:p-3 rounded-[30px] border-4 border-white/50 shadow-2xl relative shrink-0 flex flex-col items-center gap-2">
                
                {/* Pezzi catturati dal Nero (Pezzi bianchi persi) */}
                <div className="w-full h-8 bg-black/10 rounded-xl flex items-center px-3 gap-1 overflow-hidden">
                    {capturedByBlack.map((type, i) => (
                        <div key={i} className="w-5 h-5 opacity-80">
                            <ChessPieceIcon type={type} color="w" size="w-full h-full" />
                        </div>
                    ))}
                    {capturedByBlack.length === 0 && <span className="text-[10px] text-gray-500 font-bold uppercase opacity-50">Nessuna cattura</span>}
                </div>

                <div className="relative">
                    {isThinking && (
                        <div className="absolute -top-32 right-[-20px] md:-top-44 md:right-[-40px] z-[100] flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -rotate-6">
                            <span 
                                className="font-luckiest text-lg md:text-2xl text-yellow-300 uppercase whitespace-nowrap mb-[-25px] relative z-10 -translate-x-3"
                                style={{ 
                                    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                    WebkitTextStroke: '1px black'
                                }}
                            >
                                mmmh sto pensando...
                            </span>
                            <img 
                                src={GRANDFATHER_THINKING_IMG} 
                                alt="Nonno che pensa" 
                                className="w-64 h-64 md:w-80 md:h-80 max-w-none object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-8 grid-rows-8 w-[min(85vw,50vh)] h-[min(85vw,50vh)] md:w-[min(55vh,55vw)] md:h-[min(55vh,55vw)] aspect-square border-4 border-indigo-900 rounded-lg overflow-hidden bg-indigo-100">
                        {board.map((piece, idx) => {
                            const row = Math.floor(idx / 8);
                            const col = idx % 8;
                            const isDark = (row + col) % 2 === 1;
                            const isValid = legalMoves.includes(idx);
                            const isSelected = selectedIdx === idx;
                            const isKingInDanger = piece?.type === 'k' && piece?.color === inCheck;
                            
                            const isAiAnimatingFrom = aiMoving?.from === idx;
                            const isAiAnimatingTo = aiMoving?.to === idx;
                            
                            let transform = 'none';
                            let transition = 'none';
                            if (isAiAnimatingFrom) {
                                const toRow = Math.floor(aiMoving!.to / 8);
                                const toCol = aiMoving!.to % 8;
                                const dr = (toRow - row) * 100;
                                const dc = (toCol - col) * 100;
                                transform = `translate(${dc}%, ${dr}%)`;
                                transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            }

                            return (
                                <div key={idx} onClick={() => isValid ? handleMove(idx) : handleSelect(idx)} className={`relative flex items-center justify-center w-full h-full rounded-sm ${isDark ? 'bg-indigo-400' : 'bg-indigo-100'} ${isSelected ? 'ring-inset ring-4 ring-yellow-400 z-10' : ''} ${isKingInDanger ? 'bg-red-500 animate-pulse' : ''}`}>
                                    {isValid && !piece && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full opacity-80 shadow-sm animate-pulse border-2 border-white" />}
                                    {isValid && piece && <div className="absolute inset-0 border-4 border-red-500 rounded-sm opacity-80 z-20" />}
                                    
                                    {piece && !isAiAnimatingTo && (
                                        <div 
                                            className={`w-[90%] h-[90%] transition-transform hover:scale-105 flex items-center justify-center relative ${isAiAnimatingFrom ? 'z-50' : 'z-10'}`}
                                            style={{ transform, transition }}
                                        >
                                            <ChessPieceIcon type={piece.type} color={piece.color} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Pezzi catturati dal Bianco (Pezzi neri persi) */}
                <div className="w-full h-8 bg-white/40 rounded-xl flex items-center px-3 gap-1 overflow-hidden">
                    {capturedByWhite.map((type, i) => (
                        <div key={i} className="w-5 h-5 opacity-80">
                            <ChessPieceIcon type={type} color="b" size="w-full h-full" />
                        </div>
                    ))}
                    {capturedByWhite.length === 0 && <span className="text-[10px] text-gray-800 font-bold uppercase opacity-50">Pronto alla cattura</span>}
                </div>
            </div>

            {winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative flex flex-col items-center">
                        {winner === 'w' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        <h2 className="text-3xl font-black mb-4 text-boo-purple leading-tight">SCACCO MATTO!</h2>
                        {winner === 'w' && <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">+{tokenReward} GETTONI! 🪙</div>}
                        <p className="text-lg font-bold text-gray-600 mb-6">{winner === 'w' ? 'Hai Vinto!' : 'Ha vinto l\'avversario'}</p>
                        <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                            <button onClick={initBoard} className="hover:scale-105 active:scale-95 transition-transform w-44">
                                <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" />
                            </button>
                            <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform w-44">
                                <img src={BTN_BACK_MENU_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ChessGame;
