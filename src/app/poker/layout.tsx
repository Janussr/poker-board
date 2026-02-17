"use client";

import { ReactNode } from "react";
import { Stack, Button, Box } from "@mui/material";
import Link from "next/link";

export default function PokerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box>
      <Stack spacing={2} direction="row" justifyContent="center" mt={5}>
        <Button component={Link} href="/poker/scoreboard" variant="contained">
          Scoreboard
        </Button>

        <Button component={Link} href="/poker/scoreboard/history" variant="contained">
          History
        </Button>

        <Button component={Link} href="/poker/players" variant="contained">
          Players
        </Button>

        <Button component={Link} href="/poker/hall-of-fame" variant="contained">
          Hall of Fame
        </Button>

        <Button component={Link} href="/poker" variant="contained">
          Cheat sheet
        </Button>

      </Stack>

      <Box mt={4}>{children}</Box>
    </Box>
  );
}
