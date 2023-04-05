// actions.ts
import { GamePieceData, Rank } from "./types";

export const TOGGLE_TURN = "TOGGLE_TURN";
export const CHANGE_GAME = "CHANGE_GAME";
export const UPDATE_SQUARES = "UPDATE_SQUARES";
export const UPDATE_TILE_POOL = "UPDATE_TILE_POOL";
export const PLACE_PIECE = "PLACE_PIECE";

export const toggleTurn = () => ({
  type: TOGGLE_TURN,
});

export const changeGame = (gameId: number | null) => ({
  type: CHANGE_GAME,
  payload: gameId,
});

export const placePiece = (sourceId: number, targetId: number, piece: GamePieceData) => ({
  type: PLACE_PIECE,
  payload: { sourceId, targetId, piece },
});

export const updateSquares = (sourceId: number, targetId: number) => ({
  type: UPDATE_SQUARES,
  payload: { sourceId, targetId },
});

export const updateTilePool = (rank: Rank, change: number) => ({
  type: UPDATE_TILE_POOL,
  payload: { rank, change },
});
