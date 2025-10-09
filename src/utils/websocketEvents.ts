export const WEBSOCKET_EVENTS = {
  // Client to Server
  JOIN_TASK: 'join_task',
  LEAVE_TASK: 'leave_task',
  SEND_MESSAGE: 'send_message',
  EDIT_MESSAGE: 'edit_message',
  DELETE_MESSAGE: 'delete_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',

  // Server to Client
  NEW_MESSAGE: 'new_message',
  MESSAGE_EDITED: 'message_edited',
  MESSAGE_DELETED: 'message_deleted',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  TASK_NOTIFICATION: 'task_notification',
  TASK_UPDATED: 'task_updated',
  MEMBER_CHANGED: 'member_changed',
  ERROR: 'error'
} as const;
