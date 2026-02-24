"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const GAME_API = "http://localhost:5279/api/games";
const USERS_API = "http://localhost:5279/api/users";

interface User {
  id: number;
  username: string;
  name: string;
}

interface Participant {
  userId: number;
  userName: string;
}

interface Score {
  id: number;
  userId: number;
  userName: string;
  points: number;
}

interface Game {
  id: number;
  gameNumber: number;
  startedAt: string;
  endedAt?: string;
  isFinished: boolean;
  participants: Participant[];
  scores: Score[];
}


export default function GamePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [scoreInputs, setScoreInputs] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(USERS_API);
    const data = await res.json();
    setUsers(data);
  };

  const fetchGames = async () => {
    const res = await fetch(GAME_API);
    const data = await res.json();
    setGames(data);

    const active = data.find((g: Game) => !g.isFinished);
    if (active) {
      const participants = active.participants || [];
      const scores = active.scores || [];

      setCurrentGame({ ...active, participants, scores });

      const inputs: { [key: number]: string } = {};
      participants.forEach((p: Participant) => (inputs[p.userId] = ""));
      setScoreInputs(inputs);
    }
  };

  const startGame = async () => {
    const res = await fetch(`${GAME_API}/start`, { method: "POST" });
    const game = await res.json();
    setCurrentGame({ ...game, participants: [], scores: [] });
  };

  const addParticipant = async () => {
    if (!currentGame || !selectedUserId) return;

    await fetch(`${GAME_API}/${currentGame.id}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [Number(selectedUserId)] }),
    });

    setSelectedUserId("");
    fetchGames();
  };

  const addScore = async (userId: number) => {
    if (!currentGame) return;
    const value = Number(scoreInputs[userId]);
    if (!value) return;

    await fetch(`${GAME_API}/${currentGame.id}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, value }),
    });

    setScoreInputs({ ...scoreInputs, [userId]: "" });
    fetchGames();
  };

  const endGame = async () => {
    if (!currentGame) return;
    await fetch(`${GAME_API}/${currentGame.id}/end`, { method: "POST" });
    setCurrentGame(null);
    fetchGames();
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>🎮 Poker Game Admin</Typography>

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
              Started: {new Date(currentGame.startedAt).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Add participant */}
            <Stack direction="row" spacing={2} mb={2}>
              <Select
                value={selectedUserId}
                onChange={(e: SelectChangeEvent) => setSelectedUserId(e.target.value)}
                displayEmpty
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="" disabled>
                  Select Player
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} ({u.username})
                  </MenuItem>
                ))}
              </Select>

              <Button variant="contained" onClick={addParticipant}>
                Add Player
              </Button>
            </Stack>

            {/* Participants + score inputs */}
            <Typography variant="subtitle1">Participants</Typography>
            {currentGame.participants.map((p) => (
              <Stack key={p.userId} direction="row" spacing={2} alignItems="center" mb={1}>
                <Typography sx={{ minWidth: 140 }}>{p.userName}</Typography>
                <TextField
                  size="small"
                  label="Score"
                  value={scoreInputs[p.userId] || ""}
                  onChange={(e) =>
                    setScoreInputs({ ...scoreInputs, [p.userId]: e.target.value })
                  }
                />
                <Button variant="contained" onClick={() => addScore(p.userId)}>
                  Add Score
                </Button>
              </Stack>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* All score entries */}
            <Typography variant="subtitle1">Score entries</Typography>
           {currentGame.scores.map((s) => (
  <Typography key={s.id}>
    {s.userName}: {s.points}
  </Typography>
))}

            <Button color="error" variant="outlined" sx={{ mt: 2 }} onClick={endGame}>
              End Game
            </Button>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" mt={4}>All Games</Typography>
      {games.map((g) => (
        <Card key={g.id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography>
              Game #{g.gameNumber} — {g.isFinished ? "Finished" : "Active"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}