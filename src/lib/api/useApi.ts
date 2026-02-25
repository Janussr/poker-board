"use client";

import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = "http://localhost:5279/api"; // ret hvis nødvendigt

//Hvis du laver API-funktioner i lib/api/*.ts, brug apiFetch.
//Hvis du laver direkte API-kald i en komponent og vil reagere på token + logout automatisk, brug useApi.
export function useApi() {
  const { token, logout } = useAuth();

  const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // Auto-logout hvis token er udløbet / invalid
    if (res.status === 401) {
      logout();
      throw new Error("Session udløbet. Log ind igen.");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Noget gik galt");
    }

    // Hvis der ikke er body
    if (res.status === 204) return null;

    return res.json();
  };

  return { request };
}