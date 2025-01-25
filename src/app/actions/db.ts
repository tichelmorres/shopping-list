"use server";

import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_RENDER_WEB_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: AxiosError, customMessage: string) => {
  if (error.response) {
    switch (error.response.status) {
      case 500:
        console.error("Server Error:", error.response.data);
        throw new Error("Internal server error. Please try again later.");
      case 404:
        throw new Error("Resource not found.");
      case 400:
        throw new Error("Invalid request. Please check your input.");
      default:
        throw new Error(`${customMessage} (Status: ${error.response.status})`);
    }
  } else if (error.request) {
    console.error("Network Error:", error.request);
    throw new Error(
      "Unable to reach the server. Please check your connection."
    );
  } else {
    console.error("Request Error:", error.message);
    throw new Error(error.message);
  }
};

export async function addItem(value: string) {
  try {
    const response = await apiClient.post(`/${encodeURIComponent(value)}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to add item");
  }
}

export async function getItems(): Promise<{ id: string; value: string }[]> {
  try {
    const response = await apiClient.get("/items");
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to fetch items");
    return [];
  }
}

export async function removeItem(id: string): Promise<void> {
  try {
    await apiClient.delete(`/${encodeURIComponent(id)}`);
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to remove item");
  }
}
