import { apiFetch } from "./clients";
import { Game, GameDetails, HallOfFameEntry, Participant } from "@/lib/models/game";
import { PlayerScoreDetails, Score } from "@/lib/models/score";

export const startGame = () =>
  apiFetch<Game>(`/games/start`, { method: "POST" });

export const endGame = (gameId: number) =>
  apiFetch(`/games/${gameId}/end`, { method: "POST" });

export const cancelGame = (gameId: number) =>
  apiFetch(`/games/${gameId}/cancel`, { method: "POST" });

export const getGameDetails = (gameId: number) =>
  apiFetch<GameDetails>(`/games/${gameId}`);

export const getPlayerScoreDetails = (gameId: number, userId: number) =>
  apiFetch<PlayerScoreDetails>(`/games/${gameId}/players/${userId}/scores`);

export const getAllGames = () =>
  apiFetch<Game[]>(`/games`);

export const getHallOfFame = () =>
  apiFetch<HallOfFameEntry[]>(`/halloffame`);

export const addScore = (gameId: number, userId: number, value: number) =>
  apiFetch<PlayerScoreDetails>(`/games/${gameId}/score`, {
    method: "POST",
    body: { userId, value } as any, 
  });

  export const addPointsBulk = (gameId: number, scores: { userId: number; points: number }[]) =>
  apiFetch<Score[]>(`/games/${gameId}/points/bulk`, {
    method: "POST",
    body: JSON.stringify({ gameId, scores }),
  });

  export const removePoints = (pointId: number) =>
  apiFetch<Participant[]>(`/games/points/${pointId}`, {
    method: "DELETE",
  });



export const addParticipants = (gameId: number, userIds: number[]) =>
  apiFetch<Participant[]>(`/games/${gameId}/participants`, {
    method: "POST",
    body: { userIds } as any,
  });

export const removeParticipant = (gameId: number, userId: number) =>
  apiFetch<Participant[]>(`/games/${gameId}/participants/${userId}`, {
    method: "DELETE",
  });

  