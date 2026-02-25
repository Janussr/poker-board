export const API_BASE_URL = "http://localhost:5279/api";


//Hvis du laver API-funktioner i lib/api/*.ts, brug apiFetch.
//Hvis du laver direkte API-kald i en komponent og vil reagere på token + logout automatisk, brug useApi.
export const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const opts: RequestInit = { ...options };
  
  // Hvis body er objekt, gør det til JSON
  if (opts.body && typeof opts.body === "object") {
    opts.body = JSON.stringify(opts.body);
  }

  // Headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };

  // ✅ Hent token fra localStorage og sæt Authorization header
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, { ...opts, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (null as unknown as T);
};