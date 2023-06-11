import { api } from "../apiClient";

export const createGuild = (body) => api.post("/guilds/create", body);
export const getUserGuilds = () => api.get("/guilds");
