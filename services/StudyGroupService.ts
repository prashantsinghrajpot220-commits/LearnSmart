import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentValidator } from '@/services/ContentValidator';
import { notificationService } from '@/services/NotificationService';
import { ContentType, type AgeGroup as ContentAgeGroup } from '@/types/content';
import { useUserStore } from '@/store/userStore';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdBy: string;
  members: string[];
  adminIds: string[];
  createdAt: string;
  isPrivate: boolean;

  memberProfiles: Record<string, { userName: string; avatar: string }>;
  inviteCodes: string[];
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  userId: string;
  message: string;
  timestamp: string;
}

export interface GroupNote {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface StudyScheduleEntry {
  id: string;
  groupId: string;
  title: string;
  scheduledAt: string;
  createdBy: string;
  createdAt: string;
}

type Listener<T> = (payload: T) => void;

const STORAGE_KEYS = {
  GROUPS: '@learnsmart/study_groups',
  CHAT: (groupId: string) => `@learnsmart/study_group_chat:${groupId}`,
  NOTES: (groupId: string) => `@learnsmart/study_group_notes:${groupId}`,
  SCHEDULE: (groupId: string) => `@learnsmart/study_group_schedule:${groupId}`,
};

const MAX_CHAT_MESSAGES = 250;
const MAX_NOTES = 250;
const MAX_SCHEDULE = 100;

function randomId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function validateUserText(text: string, contentId: string): string {
  const ageGroup = (useUserStore.getState().ageGroup ?? 'under12') as ContentAgeGroup;
  const { sanitizedText, result } = ContentValidator.validateTextSync({
    text,
    context: {
      contentId,
      contentType: ContentType.UserGeneratedText,
      ageGroup,
      source: 'StudyGroupService',
    },
  });

  if (result.decision !== 'allow') {
    throw new Error(result.fallbackText ?? 'This content is not allowed.');
  }

  return sanitizedText;
}

export class StudyGroupService {
  private static instance: StudyGroupService;

  private groupsCache: StudyGroup[] | null = null;
  private chatCache = new Map<string, GroupChatMessage[]>();
  private notesCache = new Map<string, GroupNote[]>();
  private scheduleCache = new Map<string, StudyScheduleEntry[]>();

  private groupListeners = new Set<Listener<StudyGroup[]>>();
  private chatListeners = new Map<string, Set<Listener<GroupChatMessage[]>>>();
  private notesListeners = new Map<string, Set<Listener<GroupNote[]>>>();
  private scheduleListeners = new Map<string, Set<Listener<StudyScheduleEntry[]>>>();

  static getInstance(): StudyGroupService {
    if (!StudyGroupService.instance) {
      StudyGroupService.instance = new StudyGroupService();
    }
    return StudyGroupService.instance;
  }

  private async ensureGroupsLoaded(): Promise<StudyGroup[]> {
    if (this.groupsCache) return this.groupsCache;

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.GROUPS);
      this.groupsCache = raw ? (JSON.parse(raw) as StudyGroup[]) : [];
    } catch (error) {
      console.error('Failed to load study groups:', error);
      this.groupsCache = [];
    }

    return this.groupsCache;
  }

  private async persistGroups(next: StudyGroup[]): Promise<void> {
    this.groupsCache = next;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(next));
    } catch (error) {
      console.error('Failed to persist study groups:', error);
    }

    this.groupListeners.forEach((cb) => cb(next));
  }

  subscribeToGroups(listener: Listener<StudyGroup[]>): () => void {
    this.groupListeners.add(listener);
    void this.ensureGroupsLoaded().then((groups) => listener(groups));

    return () => {
      this.groupListeners.delete(listener);
    };
  }

  async getMyGroups(): Promise<StudyGroup[]> {
    const { userId } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();
    return groups
      .filter((g) => g.members.includes(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getGroup(groupId: string): Promise<StudyGroup | null> {
    const groups = await this.ensureGroupsLoaded();
    return groups.find((g) => g.id === groupId) ?? null;
  }

  async createGroup(params: {
    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
  }): Promise<StudyGroup> {
    const { userId, userName, selectedAvatar, addStudyGroupMembership } = useUserStore.getState();

    if (!userId) throw new Error('User not initialized');

    const id = randomId('group');
    const createdAt = new Date().toISOString();

    const name = validateUserText(params.name.trim(), `study_group:${id}:name`);
    const description = validateUserText(params.description.trim(), `study_group:${id}:description`);
    const icon = params.icon?.trim() || '👥';

    const group: StudyGroup = {
      id,
      name,
      description,
      icon,
      createdBy: userId,
      members: [userId],
      adminIds: [userId],
      createdAt,
      isPrivate: params.isPrivate,
      memberProfiles: {
        [userId]: { userName: userName || 'You', avatar: selectedAvatar || 'Robot' },
      },
      inviteCodes: [],
    };

    const groups = await this.ensureGroupsLoaded();
    await this.persistGroups([group, ...groups]);
    await addStudyGroupMembership({ groupId: id, role: 'admin', joinedAt: createdAt });

    return group;
  }

  async updateGroup(
    groupId: string,
    updates: Partial<Pick<StudyGroup, 'name' | 'description' | 'icon' | 'isPrivate'>>
  ): Promise<StudyGroup> {
    const { userId } = useUserStore.getState();

    const groups = await this.ensureGroupsLoaded();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');

    const group = groups[idx];
    if (!group.adminIds.includes(userId)) throw new Error('Admin permission required');

    const next: StudyGroup = {
      ...group,
      name: updates.name !== undefined ? validateUserText(updates.name.trim(), `study_group:${groupId}:name`) : group.name,
      description:
        updates.description !== undefined
          ? validateUserText(updates.description.trim(), `study_group:${groupId}:description`)
          : group.description,
      icon: updates.icon !== undefined ? updates.icon : group.icon,
      isPrivate: updates.isPrivate !== undefined ? updates.isPrivate : group.isPrivate,
    };

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);
    return next;
  }

  async createInviteCode(groupId: string): Promise<string> {
    const { userId } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');

    const group = groups[idx];
    if (!group.adminIds.includes(userId)) throw new Error('Admin permission required');

    const code = randomId('invite');
    const next = { ...group, inviteCodes: [code, ...group.inviteCodes].slice(0, 25) };

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);
    return code;
  }

  async inviteByUsername(groupId: string, username: string): Promise<void> {
    const group = await this.getGroup(groupId);
    if (!group) throw new Error('Group not found');

    const { userName } = useUserStore.getState();

    if (username.trim().toLowerCase() === (userName || '').trim().toLowerCase()) {
      notificationService.notifyGroupInvite({ groupId, groupName: group.name, invitedBy: userName || 'Someone' });
    }
  }

  async joinGroupByCode(codeOrGroupId: string): Promise<StudyGroup> {
    const { userId, userName, selectedAvatar, addStudyGroupMembership } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();

    const code = codeOrGroupId.trim();

    const idx = groups.findIndex((g) => g.id === code || g.inviteCodes.includes(code));
    if (idx === -1) throw new Error('Invalid group code');

    const group = groups[idx];

    if (group.members.includes(userId)) return group;

    if (group.isPrivate && group.id !== code && !group.inviteCodes.includes(code)) {
      throw new Error('Invite code required');
    }

    const joinedAt = new Date().toISOString();

    const next: StudyGroup = {
      ...group,
      members: [...group.members, userId],
      memberProfiles: {
        ...group.memberProfiles,
        [userId]: { userName: userName || 'You', avatar: selectedAvatar || 'Robot' },
      },
    };

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);
    await addStudyGroupMembership({ groupId: group.id, role: 'member', joinedAt });

    return next;
  }

  async leaveGroup(groupId: string): Promise<void> {
    const { userId, removeStudyGroupMembership } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();

    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');

    const group = groups[idx];
    if (!group.members.includes(userId)) return;

    const nextMembers = group.members.filter((m) => m !== userId);
    const nextAdmins = group.adminIds.filter((a) => a !== userId);

    const nextProfiles = { ...group.memberProfiles };
    delete nextProfiles[userId];

    let next: StudyGroup = {
      ...group,
      members: nextMembers,
      adminIds: nextAdmins,
      memberProfiles: nextProfiles,
    };

    if (next.adminIds.length === 0 && next.members.length > 0) {
      next = { ...next, adminIds: [next.members[0]] };
    }

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);
    await removeStudyGroupMembership(groupId);
  }

  async removeMember(groupId: string, memberId: string): Promise<void> {
    const { userId } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();

    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');

    const group = groups[idx];
    if (!group.adminIds.includes(userId)) throw new Error('Admin permission required');
    if (!group.members.includes(memberId)) return;

    const nextProfiles = { ...group.memberProfiles };
    delete nextProfiles[memberId];

    const next: StudyGroup = {
      ...group,
      members: group.members.filter((m) => m !== memberId),
      adminIds: group.adminIds.filter((a) => a !== memberId),
      memberProfiles: nextProfiles,
    };

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);

    if (memberId === useUserStore.getState().userId) {
      await useUserStore.getState().removeStudyGroupMembership(groupId);
    }
  }

  async promoteToAdmin(groupId: string, memberId: string): Promise<void> {
    const { userId, addStudyGroupMembership } = useUserStore.getState();
    const groups = await this.ensureGroupsLoaded();

    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');

    const group = groups[idx];
    if (!group.adminIds.includes(userId)) throw new Error('Admin permission required');
    if (!group.members.includes(memberId)) throw new Error('User is not a member');

    const next: StudyGroup = {
      ...group,
      adminIds: group.adminIds.includes(memberId) ? group.adminIds : [...group.adminIds, memberId],
    };

    const newGroups = [...groups];
    newGroups[idx] = next;

    await this.persistGroups(newGroups);

    if (memberId === userId) {
      await addStudyGroupMembership({ groupId, role: 'admin', joinedAt: new Date().toISOString() });
    }
  }

  private async loadChat(groupId: string): Promise<GroupChatMessage[]> {
    const cached = this.chatCache.get(groupId);
    if (cached) return cached;

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.CHAT(groupId));
      const messages = raw ? (JSON.parse(raw) as GroupChatMessage[]) : [];
      this.chatCache.set(groupId, messages);
      return messages;
    } catch (error) {
      console.error('Failed to load group chat:', error);
      this.chatCache.set(groupId, []);
      return [];
    }
  }

  private async persistChat(groupId: string, messages: GroupChatMessage[]): Promise<void> {
    this.chatCache.set(groupId, messages);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT(groupId), JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to persist group chat:', error);
    }

    this.chatListeners.get(groupId)?.forEach((cb) => cb(messages));
  }

  subscribeToChat(groupId: string, listener: Listener<GroupChatMessage[]>): () => void {
    const setForGroup = this.chatListeners.get(groupId) ?? new Set<Listener<GroupChatMessage[]>>();
    setForGroup.add(listener);
    this.chatListeners.set(groupId, setForGroup);

    void this.loadChat(groupId).then((m) => listener(m));

    return () => {
      const setNow = this.chatListeners.get(groupId);
      setNow?.delete(listener);
      if (setNow && setNow.size === 0) this.chatListeners.delete(groupId);
    };
  }

  async sendChatMessage(groupId: string, message: string): Promise<GroupChatMessage> {
    const { userId } = useUserStore.getState();

    const group = await this.getGroup(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) throw new Error('You are not a member of this group');

    const trimmed = message.trim();
    if (!trimmed) throw new Error('Message is empty');

    const sanitized = validateUserText(trimmed, `study_group:${groupId}:message:${Date.now()}`);

    const msg: GroupChatMessage = {
      id: randomId('msg'),
      groupId,
      userId,
      message: sanitized,
      timestamp: new Date().toISOString(),
    };

    const current = await this.loadChat(groupId);
    const next = [...current, msg].slice(-MAX_CHAT_MESSAGES);
    await this.persistChat(groupId, next);

    notificationService.notifyGroupMessage({
      groupId,
      groupName: group.name,
      fromUserName: group.memberProfiles[userId]?.userName || 'Someone',
      preview: sanitized.length > 80 ? `${sanitized.slice(0, 77)}...` : sanitized,
    });

    return msg;
  }

  private async loadNotes(groupId: string): Promise<GroupNote[]> {
    const cached = this.notesCache.get(groupId);
    if (cached) return cached;

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.NOTES(groupId));
      const notes = raw ? (JSON.parse(raw) as GroupNote[]) : [];
      this.notesCache.set(groupId, notes);
      return notes;
    } catch (error) {
      console.error('Failed to load group notes:', error);
      this.notesCache.set(groupId, []);
      return [];
    }
  }

  private async persistNotes(groupId: string, notes: GroupNote[]): Promise<void> {
    this.notesCache.set(groupId, notes);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES(groupId), JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to persist group notes:', error);
    }

    this.notesListeners.get(groupId)?.forEach((cb) => cb(notes));
  }

  subscribeToNotes(groupId: string, listener: Listener<GroupNote[]>): () => void {
    const setForGroup = this.notesListeners.get(groupId) ?? new Set<Listener<GroupNote[]>>();
    setForGroup.add(listener);
    this.notesListeners.set(groupId, setForGroup);

    void this.loadNotes(groupId).then((n) => listener(n));

    return () => {
      const setNow = this.notesListeners.get(groupId);
      setNow?.delete(listener);
      if (setNow && setNow.size === 0) this.notesListeners.delete(groupId);
    };
  }

  async addNote(groupId: string, content: string): Promise<GroupNote> {
    const { userId } = useUserStore.getState();

    const group = await this.getGroup(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) throw new Error('You are not a member of this group');

    const trimmed = content.trim();
    if (!trimmed) throw new Error('Note is empty');

    const sanitized = validateUserText(trimmed, `study_group:${groupId}:note:${Date.now()}`);

    const note: GroupNote = {
      id: randomId('note'),
      groupId,
      userId,
      content: sanitized,
      createdAt: new Date().toISOString(),
    };

    const current = await this.loadNotes(groupId);
    const next = [note, ...current].slice(0, MAX_NOTES);
    await this.persistNotes(groupId, next);

    return note;
  }

  private async loadSchedule(groupId: string): Promise<StudyScheduleEntry[]> {
    const cached = this.scheduleCache.get(groupId);
    if (cached) return cached;

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE(groupId));
      const entries = raw ? (JSON.parse(raw) as StudyScheduleEntry[]) : [];
      this.scheduleCache.set(groupId, entries);
      return entries;
    } catch (error) {
      console.error('Failed to load group schedule:', error);
      this.scheduleCache.set(groupId, []);
      return [];
    }
  }

  private async persistSchedule(groupId: string, entries: StudyScheduleEntry[]): Promise<void> {
    this.scheduleCache.set(groupId, entries);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULE(groupId), JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to persist group schedule:', error);
    }

    this.scheduleListeners.get(groupId)?.forEach((cb) => cb(entries));
  }

  subscribeToSchedule(groupId: string, listener: Listener<StudyScheduleEntry[]>): () => void {
    const setForGroup = this.scheduleListeners.get(groupId) ?? new Set<Listener<StudyScheduleEntry[]>>();
    setForGroup.add(listener);
    this.scheduleListeners.set(groupId, setForGroup);

    void this.loadSchedule(groupId).then((n) => listener(n));

    return () => {
      const setNow = this.scheduleListeners.get(groupId);
      setNow?.delete(listener);
      if (setNow && setNow.size === 0) this.scheduleListeners.delete(groupId);
    };
  }

  async addScheduleEntry(groupId: string, params: { title: string; scheduledAt: string }): Promise<StudyScheduleEntry> {
    const { userId } = useUserStore.getState();

    const group = await this.getGroup(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) throw new Error('You are not a member of this group');

    const title = validateUserText(params.title.trim(), `study_group:${groupId}:schedule:${Date.now()}`);

    const entry: StudyScheduleEntry = {
      id: randomId('schedule'),
      groupId,
      title,
      scheduledAt: params.scheduledAt,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    };

    const current = await this.loadSchedule(groupId);
    const next = [entry, ...current].slice(0, MAX_SCHEDULE);
    await this.persistSchedule(groupId, next);

    return entry;
  }
}

export const studyGroupService = StudyGroupService.getInstance();
