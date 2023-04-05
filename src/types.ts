// types.ts
export type PieceColor = 'red' | 'blue';

type Range1to9 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Rank = Range1to9 | 'S' | 'F' | 'B';

export type GamePieceData = {
  color: PieceColor;
  rank: Rank;
}

export interface RootState {
  turn: string;
  gameId: number | null;
  squares: { [key: number]: GamePieceData };
  tilePool: TilePool;
}

export interface GameSquareData {
  id: number;
  row: number;
  col: number;
  roadblock: boolean;
  territory: PieceColor | 'neutral';
}

export type TilePool = {
  [rank in Rank]: number;
};
