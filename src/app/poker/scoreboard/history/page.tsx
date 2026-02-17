"use client";

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface PlayerScore {
  name: string;
  scores: number[];
}

interface PokerNight {
  date: string;
  players: PlayerScore[];
}

const dummyHistory: PokerNight[] = [
  {
    date: "2025-11-10",
    players: [
      { name: "Alice", scores: [10, 15, 20] },
      { name: "Bob", scores: [20, 10, 15] },
      { name: "Charlie", scores: [5, 25, 15] },
    ],
  },
  {
    date: "2025-11-03",
    players: [
      { name: "Alice", scores: [15, 10, 5] },
      { name: "Bob", scores: [10, 20, 15] },
    ],
  },
];

export default function HistoryPage() {
  // Funktion til at finde vinder
  const getWinner = (players: PlayerScore[]) => {
    if (!players || players.length === 0) return null;
    let maxPoints = -Infinity;
    let winner = "";
    players.forEach((p) => {
      const total = p.scores.reduce((a, b) => a + b, 0);
      if (total > maxPoints) {
        maxPoints = total;
        winner = p.name;
      }
    });
    return winner;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        History
      </Typography>

      {dummyHistory.map((night, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          <Typography variant="h6">{night.date}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>Scores</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {night.players.map((player, pIdx) => {
                  const total = player.scores.reduce((a, b) => a + b, 0);
                  return (
                    <TableRow key={pIdx} sx={{ backgroundColor: getWinner(night.players) === player.name ? "#ffeb3b33" : "inherit" }}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.scores.join(", ")}</TableCell>
                      <TableCell>{total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Typography sx={{ mt: 1, ml: 1, fontStyle: "italic" }}>
              Winner: {getWinner(night.players)}
            </Typography>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
}
