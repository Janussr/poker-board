"use client";

import { useState } from "react";
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
  id: string;
  name: string;
  scores: number[];
}

// Mockup for Players-siden
const mockPlayers: { id: string; name: string }[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function ScoreboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [currentPoints, setCurrentPoints] = useState<{
    [id: string]: number | "";
  }>({});
  const [showTotals, setShowTotals] = useState<{ [id: string]: boolean }>({});
  const [showAll, setShowAll] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  // Tilføj ny spiller manuelt
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newPlayerName.trim(), scores: [] },
    ]);
    setNewPlayerName("");
  };

  // Tilføj eksisterende spiller fra mockPlayers
  const addExistingPlayer = () => {
    if (!selectedPlayer) return;
    if (players.find((p) => p.id === selectedPlayer)) return; // undgå duplicates
    const playerData = mockPlayers.find((p) => p.id === selectedPlayer);
    if (!playerData) return;

    setPlayers((prev) => [...prev, { ...playerData, scores: [] }]);
    setSelectedPlayer("");
  };

  const removePlayer = (id: string) => {
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

  const addPoint = (id: string) => {
    const point = currentPoints[id];
    if (point === "" || point === undefined) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, scores: [...p.scores, Number(point)] } : p
      )
    );
    setCurrentPoints((prev) => ({ ...prev, [id]: "" }));
  };

  const removePoint = (playerId: string, index: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, scores: p.scores.filter((_, i) => i !== index) }
          : p
      )
    );
  };

  const toggleShowAll = () => {
    if (!showAll) {
      const map: { [id: string]: boolean } = {};
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

      {/* Global show/hide */}
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

      {/* Tilføj eksisterende spiller automatisk ved valg */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          value={selectedPlayer}
          displayEmpty
          onChange={(e: SelectChangeEvent) => {
            const playerId = e.target.value;
            setSelectedPlayer(""); // reset dropdown efter valg

            if (!playerId) return;
            if (players.find((p) => p.id === playerId)) return; // undgå duplicates

            const playerData = mockPlayers.find((p) => p.id === playerId);
            if (!playerData) return;

            setPlayers((prev) => [...prev, { ...playerData, scores: [] }]);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="" disabled>
            Select player
          </MenuItem>
          {mockPlayers.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Tilføj ny spiller manuelt */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="New player"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addPlayer();
          }}
        />
        <Button variant="contained" onClick={addPlayer}>
          Add Player
        </Button>
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          {total}
                        </Typography>
                        {!showAll && (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() =>
                              setShowTotals((prev) => ({
                                ...prev,
                                [player.id]: false,
                              }))
                            }
                          >
                            Hide
                          </Button>
                        )}
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onPointerDown={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: true,
                          }))
                        }
                        onPointerUp={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: false,
                          }))
                        }
                        onPointerLeave={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: false,
                          }))
                        }
                        onPointerCancel={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: false,
                          }))
                        }
                        onTouchStart={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: true,
                          }))
                        }
                        onTouchEnd={() =>
                          setShowTotals((prev) => ({
                            ...prev,
                            [player.id]: false,
                          }))
                        }
                      >
                        Click to Show
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
