import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { FileService, FileData } from '../../../../services/FileService';
import { stylesheet } from './FormFilePicker.styles';

interface FormFilePickerProps {
  onFileSelect: (file: FileData) => void;
  triggerElement?: React.ReactNode;
}

export const FormFilePicker: React.FC<FormFilePickerProps> = ({ onFileSelect, triggerElement }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleAction = async (action: 'camera' | 'gallery' | 'document') => {
    setIsVisible(false);
    
    // Slight delay to prevent UI jitter between modal close and picker open
    setTimeout(async () => {
      const result = action === 'document' 
        ? await FileService.pickDocument() 
        : await FileService.pickImage(action);

      if (result) onFileSelect(result);
    }, 400);
  };

  return (
    <>
      <Pressable onPress={() => setIsVisible(true)} style={stylesheet.trigger}>
        {triggerElement || <Text>Select File</Text>}
      </Pressable>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection={['down']}
        style={stylesheet.modal}
        backdropOpacity={0.4}
        useNativeDriverForBackdrop
      >
        <View style={stylesheet.container}>
          <View style={stylesheet.handle} />
          
          <TouchableOpacity style={stylesheet.option} onPress={() => handleAction('camera')}>
            <Text style={stylesheet.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesheet.option} onPress={() => handleAction('gallery')}>
            <Text style={stylesheet.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesheet.option} onPress={() => handleAction('document')}>
            <Text style={stylesheet.optionText}>Attach Document</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};