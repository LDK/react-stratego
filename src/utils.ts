// utils.ts
import { GamePieceData, PieceColor, Rank } from "./types";

const randomUnusedSquare = (usedSquares: Set<number>) => {
  let square;
  do {
    square = Math.floor(Math.random() * 100) + 1;
  } while (usedSquares.has(square));
  usedSquares.add(square);
  return square;
};

export const generateInitialSquares = () => {
  const initialSquares: { [key: number]: { color: PieceColor; rank: Rank } } = {};
  const usedSquares = new Set<number>();

  roadblocks.forEach((value:number) => {
    usedSquares.add(value);
  });

  for (const color of ["red", "blue"]) {
    for (const rank of [3, 7, "S", 9, "F"]) {
      const square = randomUnusedSquare(usedSquares);
      initialSquares[square] = { color: (color as PieceColor), rank: (rank as Rank) };
    }
  }

  return initialSquares;
};

export const clearDroppables = () => {
  const squares = document.querySelectorAll("[id^=game-square-]");
  squares.forEach((square) => {
    square.classList.remove("droppable");
  });
}

const isAdjacent = (id1: number, id2: number, gridSize: number): boolean => {
  const row1 = Math.floor((id1 - 1) / gridSize);
  const col1 = (id1 - 1) % gridSize;
  const row2 = Math.floor((id2 - 1) / gridSize);
  const col2 = (id2 - 1) % gridSize;

  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const isDroppable = (
  sourceId: number,
  targetId: number,
  sourcePiece: GamePieceData,
  targetPiece: GamePieceData | undefined,
  squares: { [key: number]: GamePieceData }
) => {
  const { rank } = sourcePiece;

  // Roadblocks can't be dropped on
  if (roadblocks.indexOf(targetId) !== -1) {
    return false;
  }

  // F & B cannot move
  if (rank === "F" || rank === "B") {
    return false;
  }

  if (!isNaN(parseInt(rank as string)) && parseInt(rank as string) === 9) {
    return canMoveInStraightLine(sourceId, targetId, sourcePiece, targetPiece, squares, 10);
  } else {
    return (
      isAdjacent(sourceId, targetId, 10) &&
      (!targetPiece || targetPiece.color !== sourcePiece.color)
    );
  }
};

const canMoveInStraightLine = (
  sourceId: number,
  targetId: number,
  sourcePiece: GamePieceData,
  targetPiece: GamePieceData | undefined,
  squares: { [key: number]: GamePieceData },
  gridSize: number
): boolean => {
  const row1 = Math.floor((sourceId - 1) / gridSize);
  const col1 = (sourceId - 1) % gridSize;
  const row2 = Math.floor((targetId - 1) / gridSize);
  const col2 = (targetId - 1) % gridSize;

  if (row1 !== row2 && col1 !== col2) {
    return false;
  }

  const step = row1 === row2 ? 1 : gridSize;
  const minId = Math.min(sourceId, targetId);
  const maxId = Math.max(sourceId, targetId);

  for (let id = minId + step; id < maxId; id += step) {
    if (squares[id]) {
      return false;
    }
    // Check if there's a roadblock on the current square
    if (roadblocks.includes(id)) {
      return false;
    }
  }

  return !targetPiece || targetPiece.color !== sourcePiece.color;
};

export const roadblocks = [43, 44, 47, 48, 53, 54, 57, 58];