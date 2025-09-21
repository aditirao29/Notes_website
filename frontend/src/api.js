import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add token automatically for each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createFolder = (name, parentFolder = null) =>
  API.post("/folders", { name, parentFolder });

export const getFolders = () => API.get("/folders");
export const getRootFolders = () => API.get("/folders");
export const getFolderChildren = (id) => API.get(`/folders/${id}`);
export const createNote = (title, folderId, content = "") =>
  API.post("/notes", { title, folderId, content });
export const getNote = (id) => API.get(`/notes/${id}`);

export default API;