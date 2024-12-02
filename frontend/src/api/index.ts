// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "../utils/helper";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  // withCredentials: true,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});
 
// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = localStorage.getItem("accessToken");
    // console.log(token)
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const getAvailableUsers = () => {
  return apiClient.get("/chat/users");
};

const getUserChats = () => {
  return apiClient.get(`chat/get-all-chats?isPrimary=true`);
};

const createUserChat = (subject: string) => {
  return apiClient.post(`chat/create-or-get-mentor-chat/${subject}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return apiClient.post(`/chat/group`, data);
};

const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chat/group/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chat/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return apiClient.delete(`/chat/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat/remove/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chat/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chat/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId: string) => {
  return apiClient.get(`message/${chatId}`);
};

const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }
  attachments?.map((file) => {
    formData.append("attachments", file);
  });
  return apiClient.post(`message/${chatId}`, formData);
};

const deleteMessage = (chatId: string, messageId: string) => {
  return apiClient.delete(`message/${chatId}/${messageId}`);
};

const createRoom = () => {
  return apiClient.post("/rooms");
};

const joinRoom = (data: {
  link?: string;
  password?: string;
  roomId?: string;
}) => {
  return apiClient.post("/rooms/join", data);
};





// Export all the API functions
export {
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  getUserChats,

  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
  createRoom,
  joinRoom,

  
};
