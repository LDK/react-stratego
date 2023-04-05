// GameBoard.tsx
import * as React from "react";
import { Grid } from "@mui/material";
import GameSquare from "./GameSquare";
import { roadblocks } from "./utils";

const GameBoard: React.FC = () => {
  const gridSize = 10;

  return (
    <Grid container spacing={0} maxWidth="sm" mx="auto" mt={4}>
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
          const id = row * gridSize + col + 1;
          const roadblock = roadblocks.indexOf(id) !== -1;
          const territory = (id > 60) ? 'red' : (id > 40 ? 'neutral' : 'blue');

          return (
            <Grid item key={id} xs={12 / gridSize}>
              <GameSquare {...{ id, row, col, roadblock, territory }} />
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default GameBoard;
