export type NotificationType = 'COMMENT_REPLY' | 'COMMENT_LIKE' | 'NEW_PLACE' | 'ANNOUNCEMENT';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
}