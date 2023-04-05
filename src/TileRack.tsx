import React from "react";
import { useSelector } from "react-redux";
import { RootState, Rank, TilePool } from "./types";
import GamePiece from "./GamePiece";
import "./TileRack.scss";
import { Grid } from "@mui/material";

const TileRack: React.FC = () => {
  const tilePool: TilePool = useSelector((state: RootState) => state.tilePool);

  return (
    <Grid container className="tile-rack" spacing={0}>
      {Object.entries(tilePool).map(([rank, count]) => {
        if (count === 0) {
          return null;
        }

        return (
          <Grid item xs={12} md={5}
            key={rank}
            className="tile-container"
          >
            <GamePiece color="blue" squareId={-1} rank={rank as Rank} />
            <div className="tile-count">x{count}</div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TileRack;
