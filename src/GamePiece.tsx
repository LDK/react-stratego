// GamePiece.tsx
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { GamePieceData, PieceColor, Rank, RootState } from "./types";
import { clearDroppables, isDroppable } from "./utils";

interface GamePieceProps {
  color: PieceColor;
  squareId: number;
  rank: Rank;
}

const GamePiece: React.FC<GamePieceProps> = ({ color, squareId, rank }) => {
  const turn = useSelector((state: RootState) => state.turn);
  const squares = useSelector((state: RootState) => state.squares);
  const squaresRef = useRef(squares);
  const piece:GamePieceData = {color, rank};

  useEffect(() => {
    squaresRef.current = squares;
  }, [squares]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", squareId.toString());
    event.dataTransfer.setData("color", color);
    event.dataTransfer.setData("rank", String(rank));
    
    const allSquares = document.querySelectorAll("[id^='game-square']");
    allSquares.forEach((square) => {
      const targetId = parseInt(square.id.split("-")[2], 10);
      const targetPiece = squaresRef.current[targetId];

      if (isDroppable(squareId, targetId, piece, targetPiece, squaresRef.current)) {
        square.classList.add("droppable");
      }
    });
  
    const svg = event.currentTarget.querySelector("svg");
  
    if (svg) {
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      const style = getComputedStyle(svg);
  
      document.body.appendChild(clonedSvg);
      clonedSvg.style.position = "absolute";
      clonedSvg.style.top = "-9999px";
      clonedSvg.style.pointerEvents = "none";
      clonedSvg.style.width = style.width;
      clonedSvg.style.height = style.height;
  
      event.dataTransfer.setDragImage(
        clonedSvg,
        event.clientX - event.currentTarget.getBoundingClientRect().left,
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );
  
      setTimeout(() => {
        document.body.removeChild(clonedSvg);
      }, 0);
    }
  };

  const handleDragEnd = () => {
    clearDroppables();
  };

  return (
    <div style={{ backgroundColor: color === turn ? 'yellow' : undefined }} draggable={color === turn} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,0 100,100 0,100" fill={color} />
        <text x="50" y="65" textAnchor="middle" fontSize="30" fontWeight="bold" fill="white">
          {rank}
        </text>
      </svg>
    </div>
  );
};

export default GamePiece;