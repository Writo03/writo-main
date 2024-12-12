
export interface UserInterface {
    onBreak: any;
    onLeave: any;
    _id: string;
    avatar: {
      url: string;
      localPath: string;
      _id: string;
    };
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProfileInterface {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }
  
export interface ChatListItemInterface {
    subject: any;
    admin: string;
    createdAt: string;
    isGroupChat: boolean;
    lastMessage?: ChatMessageInterface;
    name: string;
    participants: UserInterface[];
    updatedAt: string;
    _id: string;
  }
  
  export interface ChatMessageInterface {
    _id: string;
    sender: Pick<UserInterface, "_id" | "avatar" | "email" | "username">;
    content: string;
    chat: string;
    attachments: {
      url: string;
      localPath: string;
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }