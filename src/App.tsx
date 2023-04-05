// App.tsx
import React from "react";
import GameBoard from "./GameBoard";
import { CssBaseline, Grid } from "@mui/material";
import './styles.scss';
import TileRack from "./TileRack";

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
        <Grid container>
          <Grid item xs={9}>
            <GameBoard />
          </Grid>
          <Grid item xs={3}>
            <TileRack />
            {/* Not built yet!  Should be able to drag an assortment of GamePiece items from here onto the board (but not the other way around) */}
            {/* Should start with a pool of 6 B's, 1 1, 1 2, 2 3's, 3 4's, 4 each of 5 6 & 7, 5 8's, 8 9's, 1 S and 1 F */}
            {/* Instead of showing multiple of each rank, should be aligned in rank order 1-9, S, F, B... */}
            {/* if multiple of a rank are still available to drag onto the board, show a label like (x3) next to it */}
            {/* Decrease remaining number in the pool for that rank once a tile is dropped onto the board */}
          </Grid>
        </Grid>
    </div>
  );
};

export default App;
