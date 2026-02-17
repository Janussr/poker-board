"use client";

import { useState } from "react";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import Image from "next/image";

export default function BlackJackPage() {
    const [activeTab, setActiveTab] = useState("playerOptions");

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
            <Typography
                variant="h4"
                sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
            >
                 Black Jack
            </Typography>

            {/* Knapper til at skifte mellem tabs */}
            <ButtonGroup sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                <Button
                    variant={activeTab === "playerOptions" ? "contained" : "outlined"}
                    onClick={() => setActiveTab("playerOptions")}
                >
                    Player options
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
                    {/* SKIFT TIL BLACK JACK BILLEDE */}
                    <Image
                        src="/images/black-jack-cheatsheet.jpg"
                        alt="Black Jack Cheatsheet"
                        width={500}
                        height={300}
                        style={{ width: "100%", height: "auto", margin: "0 auto" }}
                    />
                </Box>
            )}

            {/* Player Options */}
            {activeTab === "playerOptions" && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        Player Actions
                    </Typography>
                    <ul>
                        <li><strong>Hit:</strong> Træk et ekstra kort.</li>
                        <li><strong>Stand:</strong> Behold nuværende hånd.</li>
                        <li><strong>Double Down:</strong> Dobbler indsatsen, træk ét kort og stå.</li>
                        <li><strong>Split:</strong> Del to ens kort i to hænder, matches på værdi kan godt være en 10'er og et billedekort.</li>
                        <li><strong>Surrender:</strong> Opgiv hånden og mist halvdelen af indsatsen.</li>
                        <li><strong>Insurance:</strong> Sideindsats mod dealerens BlackJack - Hvis det første dealer kort er et es.</li>
                        <li><strong>Even Money:</strong> Tag 1:1 udbetaling hvis du har BlackJack mod dealerens es.</li>
                        <li><strong>Push:</strong> Uafgjort, indsatsen returneres.</li>
                    </ul>

                    <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                        Rules
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        1. Dealeren giver to kort til hver spiller og to til sig selv.<br />
                        2. Spillerne kan "Hit" for flere kort eller "Stand" for at beholde deres hånd.<br />
                        3. Målet er at nå så tæt på 21 som muligt uden at gå over.<br />
                        4. Kort med billedværdi tæller som 10, Esser kan være 1 eller 11.<br />
                        5. Dealer trækker til mindst 17.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
