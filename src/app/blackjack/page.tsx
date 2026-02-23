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
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        Player hand vs busting
                    </Typography>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        <li><strong>Player Hand Total 21:</strong> Probability of Busting 100%</li>
                        <li><strong>Player Hand Total 20:</strong> Probability of Busting 92%</li>
                        <li><strong>Player Hand Total 19:</strong> Probability of Busting 85%</li>
                        <li><strong>Player Hand Total 18:</strong> Probability of Busting 77%</li>
                        <li><strong>Player Hand Total 17:</strong> Probability of Busting 69%</li>
                        <li><strong>Player Hand Total 16:</strong> Probability of Busting 62%</li>
                        <li><strong>Player Hand Total 15:</strong> Probability of Busting 58%</li>
                        <li><strong>Player Hand Total 14:</strong> Probability of Busting 56%</li>
                        <li><strong>Player Hand Total 13:</strong> Probability of Busting 39%</li>
                        <li><strong>Player Hand Total 12:</strong> Probability of Busting 31%</li>
                    </ul>

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
                        <li><strong>Hit:</strong> Træk et ekstra kort. Betaler 1:1</li>
                        <li><strong>Stand:</strong> Behold nuværende hånd. Betaler 1:1</li>
                        <li><strong>Double Down:</strong> Dobbler indsatsen, træk ét kort og stå. Betaler 1:1 pr hånd</li>
                        <li><strong>Split:</strong> Del to kort med samme værdi i to hænder. Betaler 1:1 pr hånd</li>
                        <li><strong>Surrender:</strong> Opgiv hånden og mist halvdelen af indsatsen. Betaler halvdelen tilbage</li>
                        <li><strong>Insurance:</strong> kun når dealerens opkort er et es - Læg halvdelen af indsatsen. Hvis dealer har blackjack, betaler insurance 2:1 på insurance-bettet.</li>
                        <li><strong>Five card charlie:</strong> Hvis der bliver lagt fem kort, uden at gå bust. Betaler 2:1</li>
                        <li><strong>Blackjack:</strong> Hvis spillerens to første kort giver 21. Betaler 3:2 "bet 10, gevinst 15 total win = 25"</li>
                        <li><strong>Push:</strong> Uafgjort - indsatsen returneres.</li>
                    </ul>

                    <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                        Rules
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        1. Dealeren giver to kort til hver spiller og to til sig selv.<br />
                        2. Spillerne kan "Hit" for flere kort eller "Stand" for at beholde deres hånd.<br />
                        3. Målet er at nå så tæt på 21 som muligt uden at gå over.<br />
                        4. Kort med billedværdi tæller som 10, Esser kan være 1 eller 11.<br />
                        5. Dealer trækker til mindst 17-21, står på soft-17 (fx es + 6 = soft 17).
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
