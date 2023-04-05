// types.ts
export type PieceColor = 'red' | 'blue';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'S' | 'F' | 'B';

export type GamePieceData = {
  color: PieceColor;
  rank: Rank;
}
export interface RootState {
  turn: string;
  gameId: number | null;
  squares: {[key: number]: GamePieceData};
}