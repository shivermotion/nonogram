import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../gluestack-ui.config';

interface GluestackProviderProps {
  children: React.ReactNode;
}

export const GluestackProvider: React.FC<GluestackProviderProps> = ({ children }) => {
  return (
    <GluestackUIProvider config={config}>
      {children}
    </GluestackUIProvider>
  );
};

export default GluestackProvider;
