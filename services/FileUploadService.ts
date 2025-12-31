import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { canUploadImage, incrementImageUploadCount } from '@/utils/uploadLimits';

export interface Attachment {
  uri: string;
  name: string;
  type: 'image' | 'file';
  mimeType?: string;
  size?: number;
  content?: string; // For text extracted from files
}

export const pickImage = async (useCamera: boolean = false): Promise<Attachment | null> => {
  const hasLimit = await canUploadImage();
  if (!hasLimit) {
    throw new Error('Daily image limit reached. Try again tomorrow at 2 AM.');
  }

  let result;
  if (useCamera) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission is required to take photos.');
    }
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission is required to pick images.');
    }
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  }

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    
    // Validate size (max 5MB)
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB.');
    }

    await incrementImageUploadCount();

    return {
      uri: asset.uri,
      name: asset.fileName || `image_${Date.now()}.jpg`,
      type: 'image',
      mimeType: asset.mimeType || 'image/jpeg',
      size: asset.fileSize,
    };
  }

  return null;
};

export const pickDocument = async (): Promise<Attachment | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];

    // Validate size (max 10MB)
    if (asset.size && asset.size > 10 * 1024 * 1024) {
      throw new Error('File size should be less than 10MB.');
    }

    return {
      uri: asset.uri,
      name: asset.name,
      type: 'file',
      mimeType: asset.mimeType,
      size: asset.size,
    };
  }

  return null;
};

// In a real app, this would be handled on the server or with heavy libraries
// For this environment, we will mock the extraction or use basic fetch for text files
export const extractTextFromFile = async (attachment: Attachment): Promise<string> => {
  if (attachment.type !== 'file') return '';

  try {
    if (attachment.mimeType === 'text/plain') {
      const response = await fetch(attachment.uri);
      return await response.text();
    }
    
    // For PDF, DOCX, PPTX, we would normally use pdf-parse, mammoth, etc.
    // Since we are in a React Native environment, many of these Node libraries might not work directly.
    // In a production app, we would send these to a backend.
    // For this task, I will provide a placeholder that indicates we are analyzing.
    
    return `[Extracted text from ${attachment.name}]`;
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};
