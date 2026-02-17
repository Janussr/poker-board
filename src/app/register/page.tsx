"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at center, #8b0000, #1a0000)",
      }}
    >
      <Card
        sx={{
          width: 450,
          borderRadius: 4,
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.4)",
          border: "2px solid gold",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#8b0000",
              mb: 3,
            }}
          >
            ♦ Create Account ♠
          </Typography>

          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#8b0000",
              "&:hover": {
                backgroundColor: "#a30000",
              },
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Register
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <MuiLink component={Link} href="/login" underline="hover">
              Login
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
