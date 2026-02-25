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
import Link from "next/link";
import router from "next/router";
import { getAllGames, cancelGame, startGame, endGame, addParticipants, removeParticipant, addScore } from "@/lib/api/games";
import { getAllUsers } from "@/lib/api/users";
import { Score } from "@/lib/models/score";
import { Game, Participant } from "@/lib/models/game";
import { User } from "@/lib/models/user"

// const GAME_API = "http://localhost:5279/api/games";
// const USERS_API = "http://localhost:5279/api/users";

// interface User {
//   id: number;
//   username: string;
//   name: string;
// }

// interface Participant {
//   userId: number;
//   userName: string;
// }

// interface Score {
//   id: number;
//   userId: number;
//   userName: string;
//   points: number;
// }

// interface Game {
//   id: number;
//   gameNumber: number;
//   startedAt: string;
//   endedAt?: string;
//   isFinished: boolean;
//   participants: Participant[];
//   scores: Score[];
// }


export default function AdminPanelPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [scoreInputs, setScoreInputs] = useState<{ [key: number]: string }>({});
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  // const fetchUsers = async () => {
  //   const res = await fetch(USERS_API);
  //   const data = await res.json();
  //   setUsers(data);
  // };

  const fetchUsers = async () => {
  try {
    const data = await getAllUsers();
    setUsers(data);
  } catch (err) {
    console.error(err);
  }
};

  // const fetchGames = async () => {
  //   const res = await fetch(GAME_API);
  //   const data = await res.json();
  //   setGames(data);

  //   const active = data.find((g: Game) => !g.isFinished);
  //   if (active) {
  //     const participants = active.participants || [];
  //     const scores = active.scores || [];

  //     setCurrentGame({ ...active, participants, scores });

  //     const inputs: { [key: number]: string } = {};
  //     participants.forEach((p: Participant) => (inputs[p.userId] = ""));
  //     setScoreInputs(inputs);
  //   }
  // };

  const fetchGames = async () => {
  try {
    const data = await getAllGames();
    setGames(data);

    const active = data.find(g => !g.isFinished);
    if (active) {
      const participants = active.participants || [];
      const scores = active.scores || [];
      setCurrentGame({ ...active, participants, scores });

      const inputs: { [key: number]: string } = {};
      participants.forEach(p => (inputs[p.userId] = ""));
      setScoreInputs(inputs);
    }
  } catch (err) {
    console.error(err);
  }
};

  // const startGame = async () => {
  //   const res = await fetch(`${GAME_API}/start`, { method: "POST" });
  //   const game = await res.json();
  //   setCurrentGame({ ...game, participants: [], scores: [] });
  // };

  const startGameHandler = async () => {
  try {
    const game = await startGame();
    setCurrentGame({ ...game, participants: [], scores: [] });
  } catch (err) {
    console.error(err);
  }
};

  // const addScore = async (userId: number) => {
  //   if (!currentGame) return;
  //   const value = Number(scoreInputs[userId]);
  //   if (!value) return;

  //   await fetch(`${GAME_API}/${currentGame.id}/score`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ userId, value }),
  //   });

  //   setScoreInputs({ ...scoreInputs, [userId]: "" });
  //   fetchGames();
  // };

  const addScoreHandler = async (userId: number) => {
  if (!currentGame) return;
  const value = Number(scoreInputs[userId]);
  if (!value) return;

  try {
    await addScore(currentGame.id, userId, value);
    setScoreInputs({ ...scoreInputs, [userId]: "" });
    fetchGames();
  } catch (err) {
    console.error(err);
  }
};

  // const endOrCancelGame = async () => {
  //   if (!currentGame) return;

  //   const endpoint =
  //     currentGame.scores.length === 0
  //       ? `${GAME_API}/${currentGame.id}/cancel`
  //       : `${GAME_API}/${currentGame.id}/end`;

  //   const res = await fetch(endpoint, { method: "POST" });

  //   if (!res.ok) {
  //     const err = await res.json();
  //     alert(err.message || "Noget gik galt");
  //     return;
  //   }
  //   setCurrentGame(null);
  //   fetchGames();
  // };

  const endOrCancelGame = async () => {
  if (!currentGame) return;

  try {
    if (currentGame.scores.length === 0) {
      await cancelGame(currentGame.id);
    } else {
      await endGame(currentGame.id);
    }
    setCurrentGame(null);
    fetchGames();
  } catch (err: any) {
    alert(err.message || "Noget gik galt");
  }
};

  // const handleSelectUser = async (e: SelectChangeEvent) => {
  //   const userId = e.target.value;
  //   setSelectedUserId(userId);

  //   if (!currentGame || !userId) return;

  //   try {
  //     await fetch(`${GAME_API}/${currentGame.id}/participants`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userIds: [Number(userId)] }),
  //     });

  //     setSelectedUserId("");
  //     fetchGames();
  //     setHasJoined(true);
  //   } catch (error) {
  //     console.error("Failed to add participant:", error);
  //   }
  // };

  const handleSelectUser = async (e: SelectChangeEvent) => {
  const userId = Number(e.target.value);
  setSelectedUserId(String(userId));

  if (!currentGame || !userId) return;

  try {
    await addParticipants(currentGame.id, [userId]);
    setSelectedUserId("");
    fetchGames();
    setHasJoined(true);
  } catch (err) {
    console.error("Failed to add participant:", err);
  }
};

  // const handleRemovePlayer = async (gameId: number, userId: number) => {
  //   const res = await fetch(`${GAME_API}/${gameId}/participants/${userId}`, { method: "DELETE" });
  //   if (!res.ok) return alert("Kunne ikke fjerne spiller");

  //   const updatedParticipants: Participant[] = await res.json();
  //   setCurrentGame(prev => prev ? { ...prev, participants: updatedParticipants } : prev);
  // };

  const handleRemovePlayer = async (gameId: number, userId: number) => {
  try {
    const updatedParticipants = await removeParticipant(gameId, userId);
    setCurrentGame(prev => prev ? { ...prev, participants: updatedParticipants } : prev);
  } catch (err) {
    alert("Kunne ikke fjerne spiller");
  }
};

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>🎮 Poker Game Admin</Typography>

      {!currentGame ? (
        <Button variant="contained" onClick={startGameHandler}>
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
                displayEmpty
                onChange={handleSelectUser}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="" disabled>
                  Vælg spiller
                </MenuItem>
                {users
                  .filter((u) => !currentGame?.participants.some((p) => p.userId === u.id))
                  .map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name} ({u.username})
                    </MenuItem>
                  ))}
              </Select>
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
                <Button variant="contained" onClick={() => addScoreHandler(p.userId)}>
                  Add Score
                </Button>

                <Button variant="outlined" color="error" onClick={() => handleRemovePlayer(currentGame.id, p.userId)}>
                  Remove
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
            <Button
              color={currentGame.scores.length === 0 ? "warning" : "error"}
              variant="contained"
              onClick={endOrCancelGame}
            >
              {currentGame.scores.length === 0 ? "Annullér spil" : "Afslut spil"}
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
            <Link href={`/poker/game-results/${g.id}`} passHref>
              <Button variant="outlined" size="small">
                Se scoreboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}