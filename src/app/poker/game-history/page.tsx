"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from "@mui/material";

const GAMES_API = "http://localhost:5279/api/games";

interface Game {
  id: number;
  gameNumber: number;
  endedAt?: string;
  isFinished: boolean;
  participants: { userId: number; userName: string }[];
  winner?: {
    userId: number;
    userName: string;
    winningScore: number;
    winDate: string;
  };
}

interface HistoryEntry {
  id: number;
  gameNumber: number;
  winnerName: string;
  totalScore: number;
  date: string;
  playerCount: number;
}

export default function GameHistoryPage() {
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
        id: g.id,
        gameNumber: g.gameNumber,
        winnerName: g.winner!.userName,
        totalScore: g.winner!.winningScore,
        date: g.endedAt || g.winner!.winDate,
        playerCount: g.participants.length ?? 0,
      }));

    setHistory(finishedGames);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
      >
        📜 Game History
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <List>
            {history.map((entry, i) => (
              <Box key={entry.id}>
                <ListItem>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <ListItemText
                      primary={`Game #${entry.gameNumber} — ${entry.winnerName} — ${entry.totalScore} pts`}
                      secondary={`${new Date(entry.date).toLocaleString("da-DK")} • ${entry.playerCount} spillere`}
                    />

                    <Link href={`/poker/game-results/${entry.id}`} passHref>
                      <Button variant="outlined" size="small" >
                        Se scoreboard
                      </Button>
                    </Link>
                  </Stack>
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