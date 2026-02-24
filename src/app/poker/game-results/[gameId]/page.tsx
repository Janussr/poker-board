"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Card, CardContent, Stack, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/navigation";

interface Score {
  id: number;
  userId: number;
  userName: string;
  points: number;
  createdAt: string;
}

interface Winner {
  userId: number;
  userName: string;
  winningScore: number;
  winDate: string;
}

interface GameDetails {
  id: number;
  gameNumber: number;
  startedAt: string;
  endedAt?: string;
  isFinished: boolean;
  scores: Score[];
  winner?: Winner | null;
}

interface PlayerScoreDetails {
  userId: number;
  userName: string;
  totalPoints: number;
  entries: Score[];
}

export default function GameResultspage() {
  const params = useParams();
  const gameId = Number(params.gameId);
  const router = useRouter();

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [playerScores, setPlayerScores] = useState<PlayerScoreDetails | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5279/api/games/${gameId}`);
        if (!res.ok) {
          router.push("/poker");
          return;
        }
        const data: GameDetails = await res.json();
        setGame({ ...data, scores: data.scores || [] });
      } catch (err) {
        console.error("Failed to fetch game:", err);
        router.push("/poker");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(gameId)) fetchGame();
  }, [gameId, router]);

  const openPlayerModal = async (userId: number) => {
    if (!game) return;
    try {
      const res = await fetch(`http://localhost:5279/api/games/${gameId}/players/${userId}/scores`);
      if (!res.ok) throw new Error("Failed to fetch player scores");
      const data: PlayerScoreDetails = await res.json();
      setPlayerScores(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPlayerScores(null);
  };

  if (loading) return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading game...</Typography>;
  if (!game) return <Typography sx={{ textAlign: "center", mt: 4 }}>Game not found</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
        🎲 Game #{game.gameNumber} Scoreboard
      </Typography>

      <Typography variant="subtitle2" sx={{ mb: 2, textAlign: "center" }}>
        Started: {new Date(game.startedAt).toLocaleString()}
        {game.endedAt && <> — Ended: {new Date(game.endedAt).toLocaleString()}</>}
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          {game.scores?.slice()
            .sort((a, b) => b.points - a.points)
            .map((s, idx) => {
              const isWinner = game.winner?.userId === s.userId;
              return (
                <Box key={`${s.id ?? idx}-${s.userId}`}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ py: 1, px: 2, borderRadius: 1 }}
                  >
                    <Button onClick={() => openPlayerModal(s.userId)} sx={{ fontWeight: isWinner ? "bold" : "normal" }}>
                      {s.userName}
                    </Button>
                    <Typography sx={{ fontWeight: isWinner ? "bold" : "normal" }}>
                      {s.points} pts
                    </Typography>
                  </Stack>
                  <Divider />
                </Box>
              );
            })}

          {game.winner && (
            <Typography sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}>
              🏆 Winner: {game.winner.userName} ({game.winner.winningScore} pts)
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>{playerScores?.userName} – Score Details</DialogTitle>
        <DialogContent dividers>
          {playerScores?.entries.map((entry, idx) => (
            <Stack
              key={`${entry.id ?? idx}-${entry.createdAt}`}
              direction="row"
              justifyContent="space-between"
              sx={{ py: 1 }}
            >
              <Typography>Points: {entry.points}</Typography>
              <Typography>{new Date(entry.createdAt).toLocaleString()}</Typography>
            </Stack>
          ))}
          {playerScores?.entries.length === 0 && <Typography>No scores yet.</Typography>}
          <Divider sx={{ my: 1 }} />
          <Typography sx={{ mt: 1, fontWeight: "bold" }}>Total: {playerScores?.totalPoints}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}