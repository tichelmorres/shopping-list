/**
 * API integration module for the Shopping List frontend.
 * Provides interface for CRD operations with the backend.
 *
 * Endpoints:
 * - POST /{value}: Add new item
 * - GET /items: Retrieve all items
 * - DELETE /{id}: Remove specific item
 *
 * Error Handling:
 * - Catches and logs API errors
 * - Throws standardized error messages
 * - Includes proper type definitions for responses
 *
 * Configuration:
 * - Uses axios for HTTP requests
 * - Configurable API_BASE_URL for different environments
 */

"use server";

import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.RENDER_WEB_APP_API_BASE_URL;

// Configure axios defaults
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced error handler with specific status code handling
const handleApiError = (error: AxiosError, customMessage: string) => {
  if (error.response) {
    // Handle specific status codes
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

export const addItem = async (value: string) => {
  try {
    const response = await apiClient.post(`/${encodeURIComponent(value)}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to add item");
  }
};

export const getItems = async (): Promise<{ id: string; value: string }[]> => {
  try {
    const response = await apiClient.get("/items");
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to fetch items");
    return [];
  }
};

export const removeItem = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/${encodeURIComponent(id)}`);
  } catch (error) {
    handleApiError(error as AxiosError, "Failed to remove item");
  }
};
