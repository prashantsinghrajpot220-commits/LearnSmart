import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChatContextType {
  currentSubject: string | undefined;
  currentChapter: string | undefined;
  currentLesson: string | undefined;
  setCurrentContext: (subject?: string, chapter?: string, lesson?: string) => void;
  getContextInfo: () => { subject?: string; chapter?: string; lesson?: string };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const SmartyChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubject, setCurrentSubject] = useState<string | undefined>();
  const [currentChapter, setCurrentChapter] = useState<string | undefined>();
  const [currentLesson, setCurrentLesson] = useState<string | undefined>();

  const setCurrentContext = useCallback(
    (subject?: string, chapter?: string, lesson?: string) => {
      setCurrentSubject(subject);
      setCurrentChapter(chapter);
      setCurrentLesson(lesson);
    },
    []
  );

  const getContextInfo = useCallback(() => {
    return { subject: currentSubject, chapter: currentChapter, lesson: currentLesson };
  }, [currentSubject, currentChapter, currentLesson]);

  return (
    <ChatContext.Provider
      value={{
        currentSubject,
        currentChapter,
        currentLesson,
        setCurrentContext,
        getContextInfo,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useSmartyContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useSmartyContext must be used within a SmartyChatProvider');
  }
  return context;
};
