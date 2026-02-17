"use client";

import { useState } from "react";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import Image from "next/image";

export default function RoulettePage() {
  const [activeTab, setActiveTab] = useState("cheatsheet");

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
      >
        Roulette
      </Typography>

      {/* Knapper til at skifte mellem tabs */}
      <ButtonGroup sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        
        <Button
          variant={activeTab === "rules" ? "contained" : "outlined"}
          onClick={() => setActiveTab("rules")}
        >
          Rules
        </Button>
        <Button
          variant={activeTab === "cheatsheet" ? "contained" : "outlined"}
          onClick={() => setActiveTab("cheatsheet")}
        >
          Cheatsheet
        </Button>
      </ButtonGroup>

      {/* Indhold */}
      {activeTab === "cheatsheet" && (
        <Box sx={{ textAlign: "center" }}>
          <Image
            src="/images/French-Roulette-Rules.png"
            alt="Black Jack Cheatsheet"
            width={500}
            height={300}
            style={{ width: "100%", height: "auto", margin: "0 auto" }}
          />
        </Box>
      )}

      {activeTab === "rules" && (
        <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Bet Types
        </Typography>
        <ul>
          <li><strong>Straight Up:</strong> Bet på ét enkelt tal. Udbetaling 35:1.</li>
          <li><strong>Split:</strong> Bet på to tilstødende tal. Udbetaling 17:1.</li>
          <li><strong>Street:</strong> Bet på tre tal i en række. Udbetaling 11:1.</li>
          <li><strong>Corner:</strong> Bet på fire tal i en firkant. Udbetaling 8:1.</li>
          <li><strong>Six Line:</strong> Bet på seks tal (to rækker). Udbetaling 5:1.</li>
          <li><strong>Red / Black:</strong> Bet på farve. Udbetaling 1:1.</li>
          <li><strong>Even / Odd:</strong> Bet på lige eller ulige tal. Udbetaling 1:1.</li>
          <li><strong>High / Low:</strong> Bet på 1–18 eller 19–36. Udbetaling 1:1.</li>
          <li><strong>Dozens:</strong> Bet på 1–12, 13–24 eller 25–36. Udbetaling 2:1.</li>
          <li><strong>Columns:</strong> Bet på én af de tre kolonner. Udbetaling 2:1.</li>
        </ul>
    
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
          Rules
        </Typography>
        <ul>
          <li>Spillere placerer deres indsatser på bordet før kuglen sættes i spil.</li>
          <li>Dealeren (croupieren) spinner hjulet og kaster kuglen i modsatte retning.</li>
          <li>Før kuglen lander i et nummer, lukkes for flere bets.</li>
          <li>Vindende indsatser udbetales efter den fastsatte odds.</li>
          <li>Tabende indsatser fjernes fra bordet.</li>
        </ul>
      </Box>
      )}
    </Box>
  );
}
