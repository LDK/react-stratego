// GameSquare.tsx
import { Box, rgbToHex } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTurn, updateSquares } from "./actions";
import GamePiece from "./GamePiece";
import { GamePieceData, GameSquareData, PieceColor, Rank, RootState } from "./types";
import { clearDroppables, isDroppable } from "./utils";

const getSource = (event:React.DragEvent<HTMLDivElement>) => {
  const sourceId = Number(event.dataTransfer.getData("text/plain"));
  const sourceColor = event.dataTransfer.getData("color");
  const sourceRank = event.dataTransfer.getData("rank");

  const sourcePiece: GamePieceData = {
    rank: sourceRank as Rank,
    color: sourceColor as PieceColor
  };
  return { sourceId, sourcePiece };
}

const GameSquare: React.FC<GameSquareData> = ({ id, row, col, roadblock, territory }) => {
  const dispatch = useDispatch();
  
  const squares = useSelector((state: RootState) => state.squares);
  const squaresRef = useRef(squares);
  const piece:(GamePieceData | undefined) = squares[id];

  useEffect(() => {
    squaresRef.current = squares;
  }, [squares]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    clearDroppables();

    const { sourceId, sourcePiece } = getSource(event);

    if (sourceId !== id && !roadblock) {
      // Check if the move is allowed
      if (isDroppable(sourceId, id, sourcePiece, piece, squaresRef.current)) {
        dispatch(updateSquares(sourceId, id));
  
        // Dispatch the toggleTurn and updateSquares actions to update the state in the Redux store
        dispatch(toggleTurn());
      }
    }
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.backgroundColor = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const gamePiece = (!piece) ? null : (
    <GamePiece
      squareId={id}
      {...piece}
    />
  );

  return (
    <Box id={`game-square-${id}`} width="100%" height={0} position="relative" display="flex" alignItems="center"
      sx={{
        paddingBottom: "100%",
        justifyContent: "center",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        backgroundColor: roadblock ? 'rgb(75,20,20)' : "#f0f0f0",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {Boolean(piece) && (
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          {gamePiece}
        </Box>
      )}
    </Box>
  );
};

export default GameSquare;
