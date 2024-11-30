const ChatEventEnum = Object.freeze({
  USER_JOINED: "userJoined",
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: "leaveChat",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: "newChat",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when message is deleted
  MESSAGE_DELETE_EVENT: "messageDeleted",
})

const AvailableChatEvents = Object.values(ChatEventEnum)

const ServiceIds = Object.freeze({
    JEE : "673c0c5eeef250bcef428646",
    NEET : "673440f8f547c1a59e6d2a78",
    DOUBT_SESSION : "67418c07b084cc5b2e6d1076"
})

const AvailableServices = Object.values(ServiceIds)

export {ChatEventEnum, AvailableChatEvents, ServiceIds, AvailableServices}