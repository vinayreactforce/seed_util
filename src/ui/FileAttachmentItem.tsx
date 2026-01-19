import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { FileData } from '../services/FileService';
import AppText from './AppText'; 
import CloseBtn from './CloseBtn';
import Icon from './Icon';
interface FileAttachmentItemProps {
    file: FileData;
    onRemove: (id: string) => void;
    onPreview: (uri: string) => void;
  }
  
const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ 
  file, 
  onRemove, 
  onPreview 
}) => {
  const isImage = file.type.startsWith('image/');
  const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <View style={styles.outerWrapper}>
      {/* The Image/Doc Container */}
      <TouchableOpacity 
        onPress={() => isImage && onPreview(file.uri)} 
        disabled={!isImage}
        activeOpacity={0.8}
        style={styles.imageContainer}
      >
        {isImage ? (
          <Image source={{ uri: file.uri }} style={styles.image} />
        ) : (
          <View style={styles.docPlaceholder}>
            <Icon name="FileText" size={20} color="#8E8E93" />
            <AppText text={extension} style={styles.extensionText} />
          </View>
        )}
      </TouchableOpacity>

      {/* Floating Close Button - Anchored to the container */}
      <View style={styles.deleteAction}>
        <CloseBtn 
          onPress={() => onRemove(file.id)}
          circular={true}
          size="small"
          variant="grey"
          btnContainerStyle={styles.customCloseBtn}
          iconStyle={{ width: 8, height: 8, tintColor: 'white' }} 
        />
      </View>
    </View>
  );
};

export default React.memo(FileAttachmentItem);

const styles = StyleSheet.create((theme) => ({
  outerWrapper: {
    // This defines the total hit-area and space for one item
    marginRight: 16,
    marginTop: 10,
    width: 70, // Fixed size ensures it doesn't take full width
    position: 'relative', 
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: theme.colors.grey50 || '#F2F2F7',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  docPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extensionText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.grey450,
    marginTop: 2,
  },
  deleteAction: {
    // Absolute positioning anchors it to the top-right of the outerWrapper
    position: 'absolute',
    top: -8,
    right: -2,
    zIndex: 10,
  },
  customCloseBtn: {
    backgroundColor: '#000000', // Dark background so it's visible on any image
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // White border creates "separation" from the image
  },
}));