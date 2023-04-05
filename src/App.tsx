import React from "react";
import GameBoard from "./GameBoard";
import { CssBaseline, Container } from "@mui/material";
import './styles.scss';

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md">
        <GameBoard />
      </Container>
    </div>
  );
};

export default App;
