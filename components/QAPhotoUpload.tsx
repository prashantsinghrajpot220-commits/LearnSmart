import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pickImage, pickDocument, Attachment } from '@/services/FileUploadService';
import { Colors } from '@/constants/colors';

interface QAPhotoUploadProps {
  onAttachment: (attachment: Attachment) => void;
  attachment: Attachment | null;
  onRemove: () => void;
}

export const QAPhotoUpload: React.FC<QAPhotoUploadProps> = ({ onAttachment, attachment, onRemove }) => {
  const handlePickImage = async () => {
    try {
      const result = await pickImage(false);
      if (result) onAttachment(result);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await pickDocument();
      if (result) onAttachment(result);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      {attachment ? (
        <View style={styles.attachmentPreview}>
          {attachment.type === 'image' ? (
            <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={40} color={Colors.light.primary} />
              <Text style={styles.fileName} numberOfLines={1}>{attachment.name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <Ionicons name="close-circle" size={24} color={Colors.light.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.uploadText}>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
            <Ionicons name="document-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.uploadText}>Add File</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    gap: 8,
  },
  uploadText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  attachmentPreview: {
    position: 'relative',
    height: 150,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  fileIcon: {
    alignItems: 'center',
  },
  fileName: {
    marginTop: 4,
    paddingHorizontal: 20,
    fontSize: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
