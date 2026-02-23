"use client";

import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider } from "@mui/material";

// Dummy data – kan senere hentes fra database/API
const hallOfFameData = [
  {
    date: "2025-02-23",
    winner: "Anders",
    totalScore: 142,
  },
  {
    date: "2025-01-18",
    winner: "Mikkel",
    totalScore: 128,
  },
  {
    date: "2024-12-02",
    winner: "Jonas",
    totalScore: 155,
  },
];

export default function HallOfFamePage() {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        🏆 Hall of Fame
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <List>
            {hallOfFameData.map((entry, i) => (
              <Box key={i}>
                <ListItem>
                  <ListItemText
                    primary={`${entry.winner} — ${entry.totalScore} wins`}
                    // secondary={new Date(entry.date).toLocaleDateString("da-DK")}
                  />
                </ListItem>
                {i < hallOfFameData.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
