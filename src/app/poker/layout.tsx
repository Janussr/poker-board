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
        <Button component={Link} href="/poker/active-game" variant="contained">
          Join game
        </Button>

        <Button component={Link} href="/poker/game-history" variant="contained">
          Game history
        </Button>

        <Button component={Link} href="/poker" variant="contained">
         Poker hand ranking
        </Button>

        <Button component={Link} href="/poker/hall-of-fame" variant="contained">
          Hall of Fame
        </Button>

        <Button component={Link} href="/poker/setup-game" variant="contained">
          Setup game
        </Button>

      </Stack>

      <Box mt={4}>{children}</Box>
    </Box>
  );
}
