"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Card, CardContent, Stack, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
interface Score {
  userId: number;
  userName: string;
  totalPoints: number;
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

export default function GameResultspage() {
  const params = useParams();
  const gameId = Number(params.gameId);
  const router = useRouter();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5279/api/games/${gameId}`);

        if (!res.ok) {
          // hvis 404 eller BadRequest (fx spillet ikke færdigt)
          router.push("/poker"); // redirect til fx hovedsiden
          return;
        }

        const data: GameDetails = await res.json();
        setGame({ ...data, scores: data.scores || [] });
      } catch (err) {
        console.error("Failed to fetch game:", err);
        router.push("/poker"); // redirect ved network error
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(gameId)) fetchGame();
  }, [gameId, router]);

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
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((s) => {
              const isWinner = game.winner?.userId === s.userId;
              return (
                <Box key={s.userId}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: isWinner ? "bold" : "normal" }}>
                      {s.userName}
                    </Typography>
                    <Typography sx={{ fontWeight: isWinner ? "bold" : "normal" }}>
                      {s.totalPoints} pts
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
    </Box>
  );
}