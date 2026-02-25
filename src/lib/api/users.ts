import { User } from "../models/user";
import { apiFetch } from "./clients";

export const getAllUsers = () =>
  apiFetch<User[]>(`/users`);

