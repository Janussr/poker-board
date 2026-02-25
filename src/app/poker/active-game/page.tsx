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

import { getAllGames, addParticipants as apiJoinGame, addScore } from "@/lib/api/games";
import { getAllUsers } from "@/lib/api/users";
import { Game } from "@/lib/models/game";
import { User } from "@/lib/models/user";


export default function ActiveGamePlayerPage() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [points, setPoints] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchActiveGame();
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const fetchActiveGame = async () => {
    const games = await getAllGames();
    const active = games.find((g) => !g.isFinished);
    if (active) setCurrentGame(active);
  };

  const joinGame = async () => {
    if (!currentGame || !selectedUserId) return;
    await apiJoinGame(currentGame.id, [Number(selectedUserId)]);
    setHasJoined(true);
    fetchActiveGame();
  };

  const submitScore = async () => {
    if (!currentGame || !selectedUserId || !points) return;
    await addScore(currentGame.id, Number(selectedUserId), Number(points));
    setPoints("");
    fetchActiveGame();
  };

  if (!currentGame) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, textAlign: "center" }}>
        <Typography variant="h5">Currently no active game</Typography>
      </Box>
    );
  }

  const selectedUser = users.find((u) => u.id === Number(selectedUserId));

  //Total score
  const myTotal = currentGame.scores
    .filter((s) => s.userId === Number(selectedUserId))
    .reduce((sum, s) => sum + s.points, 0);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        🎮 Aktivt spil #{currentGame.gameNumber}
      </Typography>

      <Card>
        <CardContent>
          {!hasJoined ? (
            <>
              <Typography mb={2}>Vælg dig selv</Typography>

              <Stack direction="row" spacing={2} mb={2}>
                <Select
                  fullWidth
                  value={selectedUserId}
                  onChange={(e: SelectChangeEvent) => setSelectedUserId(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Vælg spiller
                  </MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name} ({u.username})
                    </MenuItem>
                  ))}
                </Select>

                <Button variant="contained" onClick={joinGame}>
                  Join
                </Button>
              </Stack>

              <Divider />
              <Typography variant="caption" color="text.secondary">
                Du kan kun se og indtaste din egen score.
              </Typography>
            </>
          ) : (
            <>
              <Typography mb={2} fontWeight="bold">
                Du spiller som: {selectedUser?.name}
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

                {hasJoined && currentGame && (
                  <>
                    <Divider sx={{ my: 2 }} />

                    <Typography fontWeight="bold" mb={1}>
                      Dine scores:
                    </Typography>

                    {currentGame.scores
                      .filter((s) => s.userId === Number(selectedUserId))
                      .map((s) => (
                        <Typography key={s.id}>
                          +{s.points} point
                        </Typography>
                      ))}

                    <Typography mt={1} fontWeight="bold">
                      Total: {myTotal} points
                    </Typography>
                  </>
                )}
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}