import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TaskViewResponse } from '../services/taskViewService';

// Task View Context untuk global state management sesuai dokumentasi

interface TaskViewState {
  taskView: TaskViewResponse | null;
  loading: boolean;
  error: string | null;
}

type TaskViewAction =
  | { type: 'SET_TASK_VIEW'; payload: TaskViewResponse }
  | { type: 'UPDATE_TASK_DETAILS'; payload: Partial<TaskViewResponse['details']> }
  | { type: 'ADD_CHAT_MESSAGE'; payload: TaskViewResponse['chat']['messages'][0] }
  | { type: 'ADD_ATTACHMENT'; payload: TaskViewResponse['attachments'][0] }
  | { type: 'ADD_MEMBER'; payload: TaskViewResponse['members'][0] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const taskViewReducer = (state: TaskViewState, action: TaskViewAction): TaskViewState => {
  switch (action.type) {
    case 'SET_TASK_VIEW':
      return { ...state, taskView: action.payload, error: null };
    
    case 'UPDATE_TASK_DETAILS':
      if (!state.taskView) return state;
      return {
        ...state,
        taskView: {
          ...state.taskView,
          details: state.taskView.details 
            ? { ...state.taskView.details, ...action.payload }
            : action.payload as TaskViewResponse['details']
        }
      };
    
    case 'ADD_CHAT_MESSAGE':
      if (!state.taskView) return state;
      return {
        ...state,
        taskView: {
          ...state.taskView,
          chat: {
            ...state.taskView.chat,
            messages: [action.payload, ...state.taskView.chat.messages]
          }
        }
      };
    
    case 'ADD_ATTACHMENT':
      if (!state.taskView) return state;
      return {
        ...state,
        taskView: {
          ...state.taskView,
          attachments: [action.payload, ...state.taskView.attachments]
        }
      };
    
    case 'ADD_MEMBER':
      if (!state.taskView) return state;
      return {
        ...state,
        taskView: {
          ...state.taskView,
          members: [...state.taskView.members, action.payload]
        }
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

interface TaskViewContextType {
  state: TaskViewState;
  dispatch: React.Dispatch<TaskViewAction>;
}

const TaskViewContext = createContext<TaskViewContextType | undefined>(undefined);

interface TaskViewProviderProps {
  children: ReactNode;
}

export const TaskViewProvider: React.FC<TaskViewProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskViewReducer, {
    taskView: null,
    loading: false,
    error: null
  });

  return (
    <TaskViewContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskViewContext.Provider>
  );
};

export const useTaskViewContext = (): TaskViewContextType => {
  const context = useContext(TaskViewContext);
  if (!context) {
    throw new Error('useTaskViewContext must be used within TaskViewProvider');
  }
  return context;
};

// Helper hooks untuk specific actions
export const useTaskViewActions = () => {
  const { dispatch } = useTaskViewContext();

  const setTaskView = (taskView: TaskViewResponse) => {
    dispatch({ type: 'SET_TASK_VIEW', payload: taskView });
  };

  const updateTaskDetails = (details: Partial<TaskViewResponse['details']>) => {
    dispatch({ type: 'UPDATE_TASK_DETAILS', payload: details });
  };

  const addChatMessage = (message: TaskViewResponse['chat']['messages'][0]) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  };

  const addAttachment = (attachment: TaskViewResponse['attachments'][0]) => {
    dispatch({ type: 'ADD_ATTACHMENT', payload: attachment });
  };

  const addMember = (member: TaskViewResponse['members'][0]) => {
    dispatch({ type: 'ADD_MEMBER', payload: member });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return {
    setTaskView,
    updateTaskDetails,
    addChatMessage,
    addAttachment,
    addMember,
    setLoading,
    setError
  };
};
