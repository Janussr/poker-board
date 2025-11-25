"use client";

import { useState, useEffect } from "react";

interface NasaApodResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  url: string;
  title: string;
  media_type: "image" | "video";
}

export default function SpacePage() {
  const [date, setDate] = useState<string>(""); // tom = dagens billede
  const [data, setData] = useState<NasaApodResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchApod = async (d?: string) => {
    try {
      setLoading(true);
      setError("");

      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY; // client-safe
      const url = d
        ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${d}`
        : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

      const res = await fetch(url);

      if (!res.ok) throw new Error("Fejl ved hentning af billedet");

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError("Kunne ikke hente dagens billede.");
    } finally {
      setLoading(false);
    }
  };

  // hent ved load eller når dato ændrer sig
  useEffect(() => {
    fetchApod(date);
  }, [date]);

  const nextDay = () => {
    if (!data) return;
    const next = new Date(data.date);
    next.setDate(next.getDate() + 1);
    setDate(next.toISOString().split("T")[0]);
  };

  const prevDay = () => {
    if (!data) return;
    const prev = new Date(data.date);
    prev.setDate(prev.getDate() - 1);
    setDate(prev.toISOString().split("T")[0]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>NASA Picture of The Day</h1>

      {/* Date Picker */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={prevDay}>⬅ Previous</button>
        <button onClick={nextDay}>Next ➡</button>
      </div>

      {/* Loading state */}
      {loading && <p>Loading… 🚀</p>}

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Content */}
      {data && !loading && (
        <div>
          <h2>{data.title}</h2>
          <p><strong>Date:</strong> {data.date}</p>

          {data.media_type === "image" ? (
            <img
              src={data.hdurl ?? data.url}
              alt={data.title}
              style={{
                maxWidth: "100%",
                borderRadius: "12px",
                margin: "1rem 0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
              }}
            />
          ) : (
            <iframe
              src={data.url}
              width="100%"
              height="500"
              style={{
                border: 0,
                borderRadius: "12px",
                margin: "1rem 0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
              }}
              allow="encrypted-media; picture-in-picture"
            />
          )}

          <p style={{ maxWidth: "800px", lineHeight: "1.6" }}>
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
