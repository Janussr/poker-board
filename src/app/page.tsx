"use client";

import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Poker Scoreboard</Typography>
        </Toolbar>
      </AppBar>

      <Stack spacing={2} direction="row" justifyContent="center" mt={5}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/scoreboard"
        >
          Scoreboard
        </Button>

        <Button
          variant="contained"
          color="success"
          component={Link}
          href="/scoreboard/history"
        >
          History
        </Button>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          href="/players"
        >
          Players
        </Button>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          href="/hall-of-fame"
        >
          Hall of Fame
        </Button>
      </Stack>
    </div>
  );
}
