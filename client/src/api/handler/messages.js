import { api } from "../apiClient";

export const getMessages = (id, cursor) =>
  api.get(
    `/messages/${id}/${
      cursor?.around
        ? `?around=${cursor.around}`
        : cursor
        ? `?cursor=${cursor}`
        : ""
    }`
  );

export const sendMessage = (channelId, data, onUploadProgress) =>
  api.post(`/messages/${channelId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export const editMessage = (id, content) =>
  api.put(`/messages/${id}`, { content });

export const notification = () => api.get("/messages");
