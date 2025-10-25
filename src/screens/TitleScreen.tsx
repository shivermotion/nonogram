import React from 'react';
import { SafeAreaView, ImageBackground } from 'react-native';
import { Image } from 'react-native';
import { View, Text, Button, Box, VStack, HStack } from '@gluestack-ui/themed';
import { playClick } from '../utils/audio';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenSettings }) => {
  return (
    <Box flex={1} bg="$backgroundLight50">
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <VStack flex={1} alignItems="center" justifyContent="center" p="$6" space="md">
          <Image
            source={require('../../assets/icons/tile042.png')}
            style={{ width: 64, height: 64 }}
          />
          
          <VStack space="sm" alignItems="center">
            <Text
              size="4xl"
              fontWeight="$extrabold"
              color="$textLight900"
              fontFamily="$kenney"
            >
              Nonogram
            </Text>
            <Text
              size="md"
              color="$textLight600"
              fontFamily="$kenney"
            >
              Logic Puzzles
            </Text>
          </VStack>

          <VStack space="md" w="$full" mt="$6">
            <Button
              onPress={async () => {
                await playClick();
                onStart();
              }}
              action="primary"
              variant="solid"
              size="lg"
              w="$full"
              h={56}
              bg="$primary500"
              borderRadius="$lg"
            >
              <HStack space="sm" alignItems="center">
                <Image
                  source={require('../../assets/icons/button_a.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  size="md"
                  fontWeight="$semibold"
                  color="$white"
                  fontFamily="$kenney"
                >
                  Play
                </Text>
              </HStack>
            </Button>

            <Button
              onPress={async () => {
                await playClick();
                onOpenSettings();
              }}
              action="secondary"
              variant="outline"
              size="lg"
              w="$full"
              h={56}
              borderColor="$primary500"
              borderRadius="$lg"
            >
              <HStack space="sm" alignItems="center">
                <Image
                  source={require('../../assets/icons/settings.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  size="md"
                  fontWeight="$semibold"
                  color="$primary500"
                  fontFamily="$kenney"
                >
                  Settings
                </Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </SafeAreaView>
    </Box>
  );
};

export default TitleScreen;
