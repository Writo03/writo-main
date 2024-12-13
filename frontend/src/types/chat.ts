
export interface UserInterface {
    onBreak: boolean;
    onLeave: boolean;
    _id: string;
    isMentor : boolean;
    isAdmin : boolean;
    profilePic : string;
    fullName : string
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    sender: UserInterface;
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