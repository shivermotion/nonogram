import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface AvatarDialogProps {
  text: string;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
}

const AvatarDialog: React.FC<AvatarDialogProps> = ({ text, onNext, onSkip, nextLabel = 'Next', showSkip = true }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      <View style={{ width: 64, height: 64, marginRight: 12 }}>
        <Image
          source={require('../../assets/icons/avatar.png')}
          style={{ width: 64, height: 64, borderRadius: 32 }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{ color: '#333', fontSize: 14, lineHeight: 20, fontFamily: 'Kenney-Future' }}>{text}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
          {showSkip && (
            <TouchableOpacity onPress={onSkip} style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 }}>
              <Text style={{ color: '#666', fontSize: 12, fontFamily: 'Kenney-Future' }}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onNext}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: '#167DA8',
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#1C9FD7',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Kenney-Future' }}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AvatarDialog;


