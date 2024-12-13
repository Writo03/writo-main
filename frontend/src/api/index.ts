// Import necessary modules and utilities
import { FreeAPISuccessResponseInterface } from "@/types/api";
import { AxiosResponse } from "axios";
import apiClient from "@/utils/axiosInstance";

// Create an Axios instance for API requests
// const apiClient = axios.create({
//   // baseURL: "http://localhost:8080/api/v1",
//   withCredentials: true,
//   timeout: 120000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
 
// // Add an interceptor to set authorization header with user token before requests
// apiClient.interceptors.request.use(
//   function (config) {
//     // Retrieve user token from local storage
//     const token = localStorage.getItem("accessToken");
//     // console.log(token)
//     // Set authorization header with bearer token
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

const getAvailableUsers = () => {
  return apiClient.get("/chat/users");
};

const getUserChats = () : Promise<AxiosResponse<FreeAPISuccessResponseInterface, never>> => {
  return apiClient.get(`chat/get-all-chats?isPrimary=true`);
};

const createUserChat = (subject: string) => {
  return apiClient.post(`chat/create-or-get-mentor-chat/${subject}`);
};

const getChatMessages = (chatId: string) : Promise<AxiosResponse<FreeAPISuccessResponseInterface, never>> => {
  return apiClient.get(`message/${chatId}`);
};

const sendMessage = (chatId: string, content: string, attachments: string[]) : Promise<AxiosResponse<FreeAPISuccessResponseInterface, never>> => {
  // Create a JSON payload instead of FormData since the backend expects plain data
  const updatedAttachments = attachments.map((file: string) => {
    return { url: file }; // Correctly returning an object with the 'url' property
  });
  
  const payload = {
    content,
    updatedAttachments, // Send the URLs directly as an array
  };

  // Use `apiClient` to send a POST request to the backend
  return apiClient.post(`message/${chatId}`, payload);
};










// Export all the API functions
export {
  createUserChat,
  getAvailableUsers,
  getChatMessages,
  getUserChats,
  sendMessage,
};