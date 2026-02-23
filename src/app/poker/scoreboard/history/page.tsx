"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Divider, List, ListItem, ListItemText } from "@mui/material";

const GAMES_API = "http://localhost:5279/api/games";

interface Game {
  id: number;
  gameNumber: number;
  endedAt?: string;
  isFinished: boolean;
  winner?: {
    userId: number;
    userName: string;
    winningScore: number;
    winDate: string;
  };
}

interface HistoryEntry {
  gameNumber: number;
  winnerName: string;
  totalScore: number;
  date: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const res = await fetch(GAMES_API);
    const data: Game[] = await res.json();

    const finishedGames = data
      .filter(g => g.isFinished && g.winner)
      .map(g => ({
        gameNumber: g.gameNumber,
        winnerName: g.winner!.userName,
        totalScore: g.winner!.winningScore,
        date: g.endedAt || g.winner!.winDate,
      }));

    setHistory(finishedGames);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        📜 Game History
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <List>
            {history.map((entry, i) => (
              <Box key={i}>
                <ListItem>
                  <ListItemText
                    primary={`Game #${entry.gameNumber} — ${entry.winnerName} — ${entry.totalScore} points`}
                    secondary={new Date(entry.date).toLocaleString("da-DK")}
                  />
                </ListItem>
                {i < history.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}