// reducers.ts
import { TOGGLE_TURN, CHANGE_GAME, UPDATE_SQUARES, UPDATE_TILE_POOL, PLACE_PIECE } from "./actions";
import { GamePieceData, RootState, Rank } from "./types";

const initialState: RootState = {
  turn: "blue",
  gameId: null,
  squares: {},
  tilePool: {
    "1": 1,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 4,
    "7": 4,
    "8": 5,
    "9": 8,
    "S": 1,
    "F": 1,
    "B": 6,
  },
};

const rootReducer = (
  state = initialState,
  action: { type: string; payload?: any }
): RootState => {
  switch (action.type) {
    case TOGGLE_TURN:
      return { ...state, turn: state.turn === "blue" ? "red" : "blue" };
    case CHANGE_GAME:
      return { ...state, gameId: action.payload || null };
    case UPDATE_SQUARES:
      const { sourceId, targetId } = action.payload;

      const newSquares = { ...state.squares };

      if (sourceId && targetId) {
        const sourcePiece: GamePieceData = state.squares[sourceId];
        delete newSquares[sourceId];
        newSquares[targetId] = sourcePiece;
      }

      return { ...state, squares: newSquares };

    case PLACE_PIECE:
      const { sourceId: srcId, targetId: tgtId, piece } = action.payload;
      const updatedSquares = { ...state.squares };
    
      if (srcId === -1 && tgtId) {
        updatedSquares[tgtId] = piece;
      }
    
      return { ...state, squares: updatedSquares };
      
    case UPDATE_TILE_POOL:
      const { rank, change } = action.payload;
      const newTilePool = { ...state.tilePool };
      newTilePool[rank as Rank] = Math.max(newTilePool[rank as Rank] + change, 0);

      return { ...state, tilePool: newTilePool };
    default:
      return state;
    }
};

export default rootReducer;
