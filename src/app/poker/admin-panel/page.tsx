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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllGames, cancelGame, startGame, endGame, addParticipants, removeParticipant, addScore, removePoints, addPointsBulk } from "@/lib/api/games";
import { getAllUsers } from "@/lib/api/users";
import { Score } from "@/lib/models/score";
import { Game, Participant } from "@/lib/models/game";
import { User } from "@/lib/models/user"
import { useAuth } from "@/context/AuthContext";

export default function AdminPanelPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [scoreInputs, setScoreInputs] = useState<{ [key: number]: string }>({});
  const [hasJoined, setHasJoined] = useState(false);
  const { isLoggedIn, role } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scoreToRemove, setScoreToRemove] = useState<Score | null>(null);
  const [endGameConfirmOpen, setEndGameConfirmOpen] = useState(false);

  // 🔐 Route protection
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (role !== "Admin") {
      router.replace("/");
      return;
    }
  }, [isLoggedIn, role, router]);

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const startGameHandler = async () => {
    try {
      const game = await startGame();
      setCurrentGame({ ...game, participants: [], scores: [] });
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleEndGameClick = () => {
    setEndGameConfirmOpen(true);
  };

  const confirmEndOrCancelGame = async () => {
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
    } finally {
      setEndGameConfirmOpen(false);
    }
  };

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

  const handleRemovePlayer = async (gameId: number, userId: number) => {
    try {
      const updatedParticipants = await removeParticipant(gameId, userId);
      setCurrentGame(prev => prev ? { ...prev, participants: updatedParticipants } : prev);
    } catch (err) {
      alert("Kunne ikke fjerne spiller");
    }
  };

  //Handle remove points
  const handleConfirmRemove = (score: Score) => {
    setScoreToRemove(score);
    setConfirmOpen(true);
  };

  const handleCancelRemove = () => {
    setScoreToRemove(null);
    setConfirmOpen(false);
  };

  const handleRemovePoint = async () => {
    if (!scoreToRemove) return;
    try {
      await removePoints(scoreToRemove.id);
      fetchGames(); // refresh game data
    } catch (err) {
      console.error("Failed to remove points:", err);
      alert("Could not remove points");
    } finally {
      setConfirmOpen(false);
      setScoreToRemove(null);
    }
  };

  const addAllScoresHandler = async () => {
    if (!currentGame) return;

    const scoresToAdd = Object.entries(scoreInputs)
      .map(([userId, points]) => ({ userId: Number(userId), points: Number(points) }))
      .filter(s => s.points > 0);

    if (scoresToAdd.length === 0) return;

    try {
      await addPointsBulk(currentGame.id, scoresToAdd);
      setScoreInputs({});
      fetchGames();
    } catch (err) {
      console.error(err);
      alert("Could not add scores");
    }
  };

  //Keep this just above return
  if (!isLoggedIn || role !== "Admin") {
    return null;
  }
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
              Started: {new Date(currentGame.startedAt).toLocaleString("da-DK")}
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
                  label="Type points to add"
                  value={scoreInputs[p.userId] || ""}
                  onChange={(e) =>
                    setScoreInputs({ ...scoreInputs, [p.userId]: e.target.value })
                  }
                />
                <Button variant="contained" onClick={() => addScoreHandler(p.userId)}>
                  Add Points
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleRemovePlayer(currentGame.id, p.userId)}>
                  Remove Player
                </Button>
              </Stack>
            ))}
            <Divider sx={{ my: 2 }} />

            {/* All score entries */}
            <Typography variant="subtitle1">Score entries</Typography>
            {currentGame.scores.map((s) => (
              <Stack key={s.id} direction="row" spacing={2} alignItems="center" mb={1}>
                <Typography sx={{ minWidth: 140 }}>
                  {s.userName}: {s.points}
                </Typography>
                {s.points > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleConfirmRemove(s)}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}

            <Dialog open={confirmOpen} onClose={handleCancelRemove}>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogContent>
                Are you sure you want to remove {scoreToRemove?.points} points from {scoreToRemove?.userName}?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelRemove}>No</Button>
                <Button color="error" onClick={handleRemovePoint}>Yes</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={endGameConfirmOpen} onClose={() => setEndGameConfirmOpen(false)}>
              <DialogTitle>
                {currentGame?.scores.length === 0 ? "Cancel game?" : "End game?"}
              </DialogTitle>
              <DialogContent>
                {currentGame?.scores.length === 0
                  ? "Are you sure you want to cancel this game?"
                  : "Are you sure you want to end this game?"}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEndGameConfirmOpen(false)}>No</Button>
                <Button color="error" onClick={confirmEndOrCancelGame}>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Button variant="contained" color="primary" onClick={addAllScoresHandler}>
              Add All Scores
            </Button>

            <Box display="flex" justifyContent="space-between" mt={2}></Box>
            <Button
              color={currentGame.scores.length === 0 ? "warning" : "error"}
              variant="contained"
              onClick={handleEndGameClick}
            >
              {currentGame.scores.length === 0 ? "Cancel game" : "End game"}
            </Button>
            <Box />
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" mt={4}>All Games</Typography>
      {[...games]
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .map((g) => (
          <Card key={g.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography>
                Game #{g.gameNumber} — {g.isFinished ? "Finished" : "Active"}
              </Typography>
              <Link href={`/poker/game-results/${g.id}`} passHref>
                <Button variant="outlined" size="small">
                  View scoreboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}