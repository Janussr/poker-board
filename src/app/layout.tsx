"use client";

import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

import Link from "next/link";
import Providers from "./Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Global Header */}
          <AppBar
            position="sticky"
            sx={{
              background: "linear-gradient(90deg, #4a1f1f, #8b0000)",
              borderBottom: "2px solid gold",
              boxShadow: "0 0 15px rgba(255, 215, 0, 0.4)",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  color: "gold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  component={Link}
                  href="/"
                  sx={{
                    color: "gold",
                    "&:hover": { color: "white", transform: "scale(1.1)" },
                    transition: "0.2s",
                  }}
                >
                  ♠ Jsr Casino ♦
                </Button>
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>

              <Button
                  component={Link}
                  href="/blackjack"
                  sx={{
                    color: "gold",
                    "&:hover": { color: "white", transform: "scale(1.1)" },
                    transition: "0.2s",
                  }}
                >
                 ♣ Black Jack
                </Button>

                <Button
                  component={Link}
                  href="/poker"
                  sx={{
                    color: "gold",
                    "&:hover": { color: "white", transform: "scale(1.1)" },
                    transition: "0.2s",
                  }}
                >
                 ♦ Poker
                </Button>

                <Button
                  component={Link}
                  href="/roulette"
                  sx={{
                    color: "gold",
                    "&:hover": { color: "white", transform: "scale(1.1)" },
                    transition: "0.2s",
                  }}
                >
                 ♠ Roulette
                </Button>


                <Button
                  component={Link}
                  href="/login"
                  sx={{
                    color: "gold",
                    "&:hover": { color: "white", transform: "scale(1.1)" },
                    transition: "0.2s",
                  }}
                >
                 Login
                </Button>


              </Box>
            </Toolbar>
          </AppBar>

          {/* Main content */}
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
