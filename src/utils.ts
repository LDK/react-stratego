// utils.ts
import { GamePieceData } from "./types";

export const clearDroppables = () => {
  const squares = document.querySelectorAll("[id^=game-square-]");
  squares.forEach((square) => {
    square.classList.remove("droppable");
  });
}

export const squareTerritory = (id:number) => id > 60 ? 'red' : (id > 40 ? 'neutral' : 'blue');

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
  const { rank, color } = sourcePiece;
  const territory = squareTerritory(targetId);

  // If a space is empty, the source piece is from the tile rack, 
  // and the space's territory matches the piece's color, it is droppable.
  if (sourceId === -1 && !targetPiece && color === territory) {
    return true;
  }

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