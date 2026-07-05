export interface Message {
    _id?: string;
    sender: any;
    receiver: any;
    content: string;
    read?: boolean;
    createdAt?: string;
  }
  
  export interface Conversation {
    otherId: string;
    otherName: string;
    lastMessage: string;
    lastDate: string;
    unread: boolean;
  }