import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoiceNote } from '@/types/notes';

const VOICE_NOTES_STORAGE_KEY = 'learnsmart_voice_notes';

interface VoiceNoteState {
  notes: VoiceNote[];
  currentNote: VoiceNote | null;
  isRecording: boolean;
  isTranscribing: boolean;
  isSummarizing: boolean;
  
  // Actions
  addNote: (note: VoiceNote) => Promise<void>;
  updateNote: (id: string, updates: Partial<VoiceNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => VoiceNote | undefined;
  getNotesBySubject: (subject: string) => VoiceNote[];
  getNotesByTag: (tag: string) => VoiceNote[];
  toggleStar: (id: string) => Promise<void>;
  searchNotes: (query: string) => VoiceNote[];
  
  setCurrentNote: (note: VoiceNote | null) => void;
  setRecording: (isRecording: boolean) => void;
  setTranscribing: (isTranscribing: boolean) => void;
  setSummarizing: (isSummarizing: boolean) => void;
  
  loadNotes: () => Promise<void>;
  clearAllNotes: () => Promise<void>;
}

export const useVoiceNoteStore = create<VoiceNoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  isRecording: false,
  isTranscribing: false,
  isSummarizing: false,

  addNote: async (note) => {
    try {
      const newNote: VoiceNote = {
        ...note,
        id: note.id || `note_${Date.now()}`,
        createdAt: note.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      
      set((state) => ({
        notes: [...state.notes, newNote],
      }));
      
      await AsyncStorage.setItem(
        VOICE_NOTES_STORAGE_KEY,
        JSON.stringify(get().notes)
      );
    } catch (error) {
                  // Debug statement removed
    }
  },

  updateNote: async (id, updates) => {
    try {
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: Date.now() }
            : note
        ),
      }));
      
      await AsyncStorage.setItem(
        VOICE_NOTES_STORAGE_KEY,
        JSON.stringify(get().notes)
      );
    } catch (error) {
                  // Debug statement removed
    }
  },

  deleteNote: async (id) => {
    try {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        currentNote:
          get().currentNote?.id === id ? null : get().currentNote,
      }));
      
      await AsyncStorage.setItem(
        VOICE_NOTES_STORAGE_KEY,
        JSON.stringify(get().notes)
      );
    } catch (error) {
                  // Debug statement removed
    }
  },

  getNoteById: (id) => {
    return get().notes.find((note) => note.id === id);
  },

  getNotesBySubject: (subject) => {
    return get().notes.filter((note) => note.subject === subject);
  },

  getNotesByTag: (tag) => {
    return get().notes.filter((note) => note.tags.includes(tag));
  },

  toggleStar: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (note) {
      await get().updateNote(id, { isStarred: !note.isStarred });
    }
  },

  searchNotes: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.summarizedContent.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  setCurrentNote: (note) => {
    set({ currentNote: note });
  },

  setRecording: (isRecording) => {
    set({ isRecording });
  },

  setTranscribing: (isTranscribing) => {
    set({ isTranscribing });
  },

  setSummarizing: (isSummarizing) => {
    set({ isSummarizing });
  },

  loadNotes: async () => {
    try {
      const data = await AsyncStorage.getItem(VOICE_NOTES_STORAGE_KEY);
      if (data) {
        set({ notes: JSON.parse(data) });
      }
    } catch (error) {
                  // Debug statement removed
    }
  },

  clearAllNotes: async () => {
    try {
      set({ notes: [], currentNote: null });
      await AsyncStorage.removeItem(VOICE_NOTES_STORAGE_KEY);
    } catch (error) {
                  // Debug statement removed
    }
  },
}));
