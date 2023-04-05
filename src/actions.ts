// actions.ts
export const TOGGLE_TURN = "TOGGLE_TURN";
export const CHANGE_GAME = "CHANGE_GAME";
export const UPDATE_SQUARES = "UPDATE_SQUARES";

export const toggleTurn = () => ({
  type: TOGGLE_TURN,
});

export const changeGame = (gameId: number | null) => ({
  type: CHANGE_GAME,
  payload: gameId,
});

export const updateSquares = (sourceId: number, targetId: number) => ({
  type: UPDATE_SQUARES,
  payload: { sourceId, targetId },
});
