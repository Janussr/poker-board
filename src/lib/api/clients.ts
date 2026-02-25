export const API_BASE_URL = "http://localhost:5279/api";

export const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const opts = { ...options };
  if (opts.body && typeof opts.body === "object") {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  // Hvis response er tom, returner null i stedet for at json.parse fejler
  const text = await res.text();
  return text ? JSON.parse(text) : (null as unknown as T);
};