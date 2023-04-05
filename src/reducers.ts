// reducers.ts
import { TOGGLE_TURN, CHANGE_GAME, UPDATE_SQUARES } from "./actions";
import { GamePieceData, RootState } from "./types";
import { generateInitialSquares } from "./utils";

const initialState: RootState = {
  turn: "blue",
  gameId: null,
  squares: generateInitialSquares(),
};

const rootReducer = (state = initialState, action: { type: string; payload?: any }): RootState => {
  switch (action.type) {
    case TOGGLE_TURN:
      return { ...state, turn: state.turn === "blue" ? "red" : "blue" };
    case CHANGE_GAME:
      return { ...state, gameId: action.payload || null };
    case UPDATE_SQUARES:
      const { sourceId, targetId } = action.payload;

      const newSquares = { ...state.squares };

      if (sourceId && targetId) {
        const sourcePiece:GamePieceData = state.squares[sourceId];
        delete newSquares[sourceId];
        newSquares[targetId] = sourcePiece;
      }

      return { ...state, squares: newSquares };
    default:
      return state;
  }
};

export default rootReducer;
