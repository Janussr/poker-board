"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Player {
  id: number;
  name: string;
  scores: number[];
}

interface UserDto {
  id: number;
  username: string;
  name: string;
}

export default function ScoreboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<number | "">("");
  const [currentPoints, setCurrentPoints] = useState<{
    [id: number]: number | "";
  }>({});
  const [showTotals, setShowTotals] = useState<{ [id: number]: boolean }>({});
  const [showAll, setShowAll] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5279/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Add manual player
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    setPlayers((prev) => [
      ...prev,
      { id: Date.now(), name: newPlayerName.trim(), scores: [] },
    ]);

    setNewPlayerName("");
  };

  // Remove player
  const removePlayer = (id: number) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));

    setCurrentPoints((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setShowTotals((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Add point
  const addPoint = (id: number) => {
    const point = currentPoints[id];
    if (point === "" || point === undefined) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, scores: [...p.scores, Number(point)] } : p
      )
    );

    setCurrentPoints((prev) => ({ ...prev, [id]: "" }));
  };

  // Remove point
  const removePoint = (playerId: number, index: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, scores: p.scores.filter((_, i) => i !== index) }
          : p
      )
    );
  };

  // Toggle show all totals
  const toggleShowAll = () => {
    if (!showAll) {
      const map: { [id: number]: boolean } = {};
      players.forEach((p) => (map[p.id] = true));
      setShowTotals(map);
      setShowAll(true);
    } else {
      setShowTotals({});
      setShowAll(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Scoreboard
      </Typography>

      {/* Global Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={toggleShowAll}>
          {showAll ? "Hide all totals" : "Show all totals"}
        </Button>

        <Button
          variant="text"
          onClick={() => {
            setPlayers([]);
            setCurrentPoints({});
            setShowTotals({});
            setShowAll(false);
          }}
        >
          Clear all (dev)
        </Button>
      </Stack>

      {/* Select existing user */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          value={selectedPlayer}
          displayEmpty
          onChange={(e: SelectChangeEvent<number>) => {
            const playerId = Number(e.target.value);
            setSelectedPlayer("");

            if (!playerId) return;
            if (players.find((p) => p.id === playerId)) return;

            const userData = allUsers.find((u) => u.id === playerId);
            if (!userData) return;

            setPlayers((prev) => [
              ...prev,
              { id: userData.id, name: userData.name, scores: [] },
            ]);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="" disabled>
            Select player
          </MenuItem>

          {allUsers
            .filter((u) => !players.find((p) => p.id === u.id))
            .map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
        </Select>
      </Box>

      {/* Scoreboard Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Scores</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Add Point</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => {
              const total = player.scores.reduce((a, b) => a + b, 0);

              return (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>

                  <TableCell>
                    {player.scores.map((score, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          mr: 1,
                        }}
                      >
                        <Typography>{score}</Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removePoint(player.id, idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </TableCell>

                  <TableCell>
                    {showAll || showTotals[player.id] ? (
                      <Typography sx={{ fontWeight: "bold" }}>
                        {total}
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: true,
                          }))
                        }
                      >
                        Show
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={currentPoints[player.id] ?? ""}
                        onChange={(e) =>
                          setCurrentPoints((prev) => ({
                            ...prev,
                            [player.id]:
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addPoint(player.id);
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => addPoint(player.id)}
                      >
                        Add
                      </Button>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => removePlayer(player.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
