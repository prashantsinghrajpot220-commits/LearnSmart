import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_DAILY_IMAGES = 6;
const RESET_HOUR_UTC = 2;
const LIMIT_STORAGE_KEY = '@smarty_upload_limits';

interface UploadLimits {
  imageCount: number;
  lastResetTimestamp: number;
}

export const getUploadLimits = async (): Promise<UploadLimits> => {
  try {
    const data = await AsyncStorage.getItem(LIMIT_STORAGE_KEY);
    const now = Date.now();
    const todayReset = getTodayResetTimestamp();

    if (!data) {
      return { imageCount: 0, lastResetTimestamp: todayReset };
    }

    const limits: UploadLimits = JSON.parse(data);

    // Check if we need to reset
    if (now >= todayReset && limits.lastResetTimestamp < todayReset) {
      const newLimits = { imageCount: 0, lastResetTimestamp: todayReset };
      await saveUploadLimits(newLimits);
      return newLimits;
    }

    return limits;
  } catch (error) {
    console.error('Error getting upload limits:', error);
    return { imageCount: 0, lastResetTimestamp: Date.now() };
  }
};

export const incrementImageUploadCount = async (): Promise<void> => {
  const limits = await getUploadLimits();
  limits.imageCount += 1;
  await saveUploadLimits(limits);
};

export const canUploadImage = async (): Promise<boolean> => {
  const limits = await getUploadLimits();
  return limits.imageCount < MAX_DAILY_IMAGES;
};

export const getRemainingImages = async (): Promise<number> => {
  const limits = await getUploadLimits();
  return Math.max(0, MAX_DAILY_IMAGES - limits.imageCount);
};

const saveUploadLimits = async (limits: UploadLimits): Promise<void> => {
  try {
    await AsyncStorage.setItem(LIMIT_STORAGE_KEY, JSON.stringify(limits));
  } catch (error) {
    console.error('Error saving upload limits:', error);
  }
};

const getTodayResetTimestamp = (): number => {
  const now = new Date();
  const reset = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    RESET_HOUR_UTC,
    0,
    0,
    0
  ));

  // If current time is before today's reset, the relevant reset was yesterday
  if (now.getTime() < reset.getTime()) {
    reset.setUTCDate(reset.getUTCDate() - 1);
  }

  return reset.getTime();
};
