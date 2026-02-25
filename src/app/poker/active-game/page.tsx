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

export default function ActiveGamePlayerPage() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [points, setPoints] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const { userId, username } = useAuth(); 

  // Hent aktivt spil
  useEffect(() => {
    fetchActiveGame();
  }, []);

  const fetchActiveGame = async () => {
    const games = await getAllGames();
    const active = games.find((g) => !g.isFinished);
    if (active) {
      setCurrentGame(active);

      // Hvis logget bruger allerede er med i spillet, sæt hasJoined
      if (userId && active.participants.some(p => p.userId === Number(userId))) {
        setHasJoined(true);
      }
    }
  };

  const joinGame = async () => {
    if (!currentGame || !userId) return;

    try {
      await apiJoinGame(currentGame.id, [Number(userId)]);
      setHasJoined(true);
      fetchActiveGame();
    } catch (err) {
      console.error("Failed to join game:", err);
    }
  };

  const submitScore = async () => {
    if (!currentGame || !userId || !points) return;

    try {
      await addScore(currentGame.id, Number(userId), Number(points));
      setPoints("");
      fetchActiveGame();
    } catch (err) {
      console.error("Failed to add score:", err);
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
              <Typography mb={2}>Du er logget ind som spiller. {username} Klik for at join spillet</Typography>
              <Button variant="contained" onClick={joinGame}>
                Join game
              </Button>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Du kan kun se og indtaste din egen score.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography mb={2} fontWeight="bold">
                Du spiller som: {username}
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
                  Tilføj points
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight="bold" mb={1}>
                  Dine scores:
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