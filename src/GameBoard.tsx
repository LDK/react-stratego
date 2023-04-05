// GameBoard.tsx
import * as React from "react";
import { Grid } from "@mui/material";
import GameSquare from "./GameSquare";

const GameBoard: React.FC = () => {
  const n = 10; // Replace this with your desired grid size

  return (
    <Grid container spacing={0} maxWidth="sm" mx="auto" mt={4}>
      {Array.from({ length: n }, (_, row) =>
        Array.from({ length: n }, (_, col) => {
          const id = row * n + col + 1;
          return (
            <Grid item key={id} xs={12 / n}>
              <GameSquare id={id} />
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default GameBoard;
