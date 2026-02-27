"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";

import { getAllGames, addParticipants as apiJoinGame, addScore } from "@/lib/api/games";
import { Game } from "@/lib/models/game";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ActiveGamePlayerPage() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [points, setPoints] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const { userId, username, numericUserId } = useAuth();
  const router = useRouter();

  // Fetch active game
  useEffect(() => {
    fetchActiveGame();
  }, []);

  const fetchActiveGame = async () => {
    const games = await getAllGames();
    const active = games.find((g) => !g.isFinished);
    if (active) {
      setCurrentGame(active);

      if (userId && active.participants.some(p => p.userId === Number(userId))) {
        setHasJoined(true);
      }
    }
  };

  const joinGame = async () => {
    // If not logged in -> login page
    if (!numericUserId) {
      router.push("/login");
      return;
    }

    if (!currentGame) return;

    try {
      await apiJoinGame(currentGame.id, [numericUserId]);
      setHasJoined(true);
      fetchActiveGame();
    } catch (err) {
      console.error("Failed to join game:", err);
    }
  };
  const submitScore = async () => {
    if (!currentGame || !numericUserId || !points) return;

    try {
      await addScore(currentGame.id, numericUserId, Number(points));
      setPoints("");
      fetchActiveGame();
    } catch (err: any) {
      if (err.message.includes("Game has ended") || err.message.includes("Game has ended")) {
        alert("Game has ended.");
      } else {
        console.error("Error at submitScore:", err);
        alert("Something went wrong try later.");
      }
    }
  };

  if (!currentGame) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, textAlign: "center" }}>
        <Typography variant="h5">Currently no active game</Typography>
      </Box>
    );
  }

  const myTotal = currentGame.scores
    .filter((s) => s.userId === Number(userId))
    .reduce((sum, s) => sum + s.points, 0);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        🎮 Aktivt spil #{currentGame.gameNumber}
      </Typography>

      <Card>
        <CardContent>
          {!hasJoined ? (
            <Box textAlign="center">
              <Typography mb={2}>You are logged in as. {username} Click to join the game</Typography>
              <Button variant="contained" onClick={joinGame}>
                Join game
              </Button>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                You can onle see and type in your own points.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography mb={2} fontWeight="bold">
                Playing as: {username}
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Dine points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  disabled={currentGame?.isFinished}
                  sx={{
                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={submitScore}
                  disabled={currentGame?.isFinished}
                >
                  Add points
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight="bold" mb={1}>
                  Your scores:
                </Typography>

                {currentGame.scores
                  .filter((s) => s.userId === Number(userId))
                  .map((s) => (
                    <Typography key={s.id}>{username}: +{s.points} point</Typography>
                  ))}

                <Typography mt={1} fontWeight="bold">
                  Total: {myTotal} points
                </Typography>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}