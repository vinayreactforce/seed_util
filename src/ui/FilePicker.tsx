import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native-unistyles';
import { FileService, FileData } from '../services/FileService';
import ActionRow from './ActionRow';
import FileAttachmentItem from './FileAttachmentItem';
import ImageLightbox from './ImageLightBox';
import AppText from './AppText';
import * as icons from 'lucide-react-native';

export type FilePickerSource = 'camera' | 'gallery' | 'document';

interface SourceConfig {
  id: FilePickerSource;
  label: string;
  icon: string;
}

interface FilePickerProps {
  files?: FileData[];
  onFilesChange: (files: FileData[]) => void;
  triggerElement?: React.ReactNode;
  maxFiles?: number;
  sources?: FilePickerSource[];
  btnText?: string;
}

const SOURCE_MAP: Record<FilePickerSource, SourceConfig> = {
  camera: { id: 'camera', label: 'Take Photo', icon: 'Camera' },
  gallery: { id: 'gallery', label: 'Upload from Gallery', icon: 'Image' },
  document: { id: 'document', label: 'Select Document', icon: 'FileText' },
};

export const FilePicker: React.FC<FilePickerProps> = ({ 
  files = [], 
  onFilesChange, 
  triggerElement,
  maxFiles = 1,
  sources = ['camera', 'gallery', 'document'],
  btnText = "+ Add Attachment"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Optimized: Internal state for the high-performance previewer
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const handleAction = async (action: FilePickerSource) => {
    setIsVisible(false);
    
    const result = action === 'document' 
      ? await FileService.pickDocument() 
      : await FileService.pickImage(action);

    // 1. Result Check
    if (!result) return;

    // 2. Capacity Guard
    if (files.length >= maxFiles) return;

    // 3. Duplicate Guard
    if (files.some(f => f.uri === result.uri)) return;

    onFilesChange([...files, result]);
  };

  const onTriggerPress = () => {
    if (sources.length === 1) {
      handleAction(sources[0]);
    } else {
      setIsVisible(true);
    }
  };

  const handleRemove = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <View style={styles.wrapper}>
      {/* Selection Preview List */}
      <View style={styles.list}>
        {files.map((file) => (
          <FileAttachmentItem 
            key={file.id} 
            file={file} 
            onRemove={handleRemove}
            onPreview={(uri:string) => setPreviewUri(uri)} 
          />
        ))}
      </View>

      {/* Trigger Logic (Hidden if maxFiles reached) */}
      {files.length < maxFiles && (
        <Pressable onPress={onTriggerPress}>
          {triggerElement || (
            <View style={styles.defaultTrigger}>
              <AppText text={btnText} style={styles.defaultTriggerText} />
            </View>
          )}
        </Pressable>
      )}

      {/* High-Performance Image Previewer */}
      <ImageLightbox 
        uri={previewUri} 
        onClose={() => setPreviewUri(null)} 
      />

      {/* Selection Source Modal */}
      <Modal 
        isVisible={isVisible} 
        onBackdropPress={() => setIsVisible(false)}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        backdropOpacity={0.4}
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
      >
        <View style={styles.container}>
          <View style={styles.handle} />
          {sources.map((sourceKey) => {
            const config = SOURCE_MAP[sourceKey];
            return (
              <ActionRow 
                key={config.id}
                label={config.label} 
                iconName={config.icon as keyof typeof icons} 
                onPress={() => handleAction(config.id)} 
              />
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrapper: { 
    width: '100%',
  },
  list: { 
    marginBottom: theme.spacing?.md || 8, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: theme.spacing?.sm || 8,
  },
  modal: { 
    justifyContent: 'flex-end', 
    margin: 0 
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 8,
  },
  handle: {
    width: 38,
    height: 5,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12
  },
  defaultTrigger: {
    padding: 14,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: theme.colors.primaryBrand,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  defaultTriggerText: { 
    color: theme.colors.primaryBrand, 
    fontSize: 15,
  }
}));

export default FilePicker;      