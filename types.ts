import { upcoming } from "@/data";
import { Doc, Id } from "@/convex/_generated/dataModel";

export type DataType = (typeof upcoming)[0];

export type DashBoardType = {
  outstandingassignment: string;
  registeredcourse: string;
  totallectures: string;
  upcominglectures: string;
};

export type LecturesType = {
  coursecode: string;
  period: string;
  Hall: string;
  timetableid: string;
  courseid: string;
  lecturer: string;
};

export type NewsTypes = {
  messages: string;
  date1: string;
  heading: string;
};

export type ConversationType = {
  id: Id<"conversations">;
  lastMessage: string | undefined;
  lastMessageTime: number | undefined;
  otherUser: Doc<"users"> | null;
  lastMessageSenderId: Id<"users"> | undefined;
};
export type GroupConversationType = {
  id: Id<"conversations">;
  lastMessage: string | undefined;
  name: string | undefined;
  lastMessageTime: number | undefined;
  otherUsers: (Doc<"users"> | null)[];
  lastMessageSenderId: Id<"users"> | undefined;
  createdBy: string;
};
export type GroupMessageType = {
  senderName: string;
  _id: Id<"messages">;
  _creationTime: number;
  isEdited?: boolean | undefined;
  parentMessageId?: Id<"messages"> | undefined;
  senderId: Id<"users">;
  recipient: Id<"users"> | Id<"users">[];
  conversationId: Id<"conversations">;
  content: string;
  contentType: "image" | "text" | "pdf";
  seenId: Id<"users">[];
  image?: string;
  pdf?: string;
};

export type SingleMessageType = Omit<GroupMessageType, "senderName">;
export type NewConversationType = {
  id: Id<"users">;
  name: string;
  image: string;
  userId: string;
};

export type PaginateType = {
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
};
