import { API_URL } from "../constants.js";

async function parseJson(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchPhotos() {
  const res = await fetch(`${API_URL}/photos`);
  return parseJson(res);
}

export async function uploadPhoto(formData) {
  const res = await fetch(`${API_URL}/photos/upload`, {
    method: "POST",
    body: formData,
  });
  return parseJson(res);
}

export async function updatePhoto(id, body) {
  const res = await fetch(`${API_URL}/photos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function deletePhoto(id) {
  const res = await fetch(`${API_URL}/photos/${id}`, { method: "DELETE" });
  return parseJson(res);
}

export async function reorderPhotos({ gallery, featured }) {
  const res = await fetch(`${API_URL}/photos/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gallery, featured }),
  });
  return parseJson(res);
}
