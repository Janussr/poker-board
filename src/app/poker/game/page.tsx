"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const API = "http://localhost:5279/api/games";

interface Game {
  id: number;
  gameNumber: number;
  startedAt: string;
  endedAt?: string;
  isFinished: boolean;
  scores: Score[];
}

interface Score {
  id: number;
  userId: number;
  value: number;
  createdAt: string;
}

export default function GamePage() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState("");
  const [scoreValue, setScoreValue] = useState("");

  // Load all games on mount
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setGames(data);

    const active = data.find((g: Game) => !g.isFinished);
    if (active) setCurrentGame(active);
  };

  const startGame = async () => {
    const res = await fetch(`${API}/start`, {
      method: "POST",
    });
    const data = await res.json();
    setCurrentGame(data);
    fetchGames();
  };

  const addScore = async () => {
    if (!currentGame) return;

    await fetch(`${API}/${currentGame.id}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        value: Number(scoreValue),
      }),
    });

    setUserId("");
    setScoreValue("");
    fetchGames();
  };

  const endGame = async () => {
    if (!currentGame) return;

    await fetch(`${API}/${currentGame.id}/end`, {
      method: "POST",
    });

    setCurrentGame(null);
    fetchGames();
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>
        🎮 Poker Game Admin
      </Typography>

      {!currentGame ? (
        <Button variant="contained" onClick={startGame}>
          Start New Game
        </Button>
      ) : (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">
              Active Game #{currentGame.gameNumber}
            </Typography>
            <Typography>
              Started:{" "}
              {new Date(currentGame.startedAt).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={2}>
              <TextField
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <TextField
                label="Score"
                value={scoreValue}
                onChange={(e) => setScoreValue(e.target.value)}
              />
              <Button variant="contained" onClick={addScore}>
                Add Score
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1">Scores:</Typography>
            {currentGame.scores?.map((s) => (
              <Typography key={s.id}>
                User {s.userId}: {s.value}
              </Typography>
            ))}

            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={endGame}
            >
              End Game
            </Button>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" mt={4}>
        All Games
      </Typography>

      {games.map((g) => (
        <Card key={g.id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography>
              Game #{g.gameNumber} —{" "}
              {g.isFinished ? "Finished" : "Active"}
            </Typography>
            <Typography>
              Started: {new Date(g.startedAt).toLocaleString()}
            </Typography>
            {g.endedAt && (
              <Typography>
                Ended: {new Date(g.endedAt).toLocaleString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
