// Dosya: app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { GitBranch, Home, MessageSquare, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { COLORS } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const strokeWidth = focused ? 2.5 : 2;
          if (route.name === 'index') {
            return <Home size={size} color={color} strokeWidth={strokeWidth} />;
          } else if (route.name === 'explore') {
            return <GitBranch size={size} color={color} strokeWidth={strokeWidth} />;
          } else if (route.name === 'progress') {
            return <TrendingUp size={size} color={color} strokeWidth={strokeWidth} />;
          } else if (route.name === 'support') { // YENİ EKLENDİ
            return <MessageSquare size={size} color={color} strokeWidth={strokeWidth} />;
          }
          return <Home size={size} color={color} />;
        },
      })}
    >
      {/* 1. Ana Sayfa */}
      <Tabs.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      {/* 2. Sürecim */}
      <Tabs.Screen name="explore" options={{ title: 'Sürecim' }} />
      {/* 3. Gelişimim */}
      <Tabs.Screen name="progress" options={{ title: 'Gelişimim' }} />

      {/* 4. YENİ SEKMEYİ EKLE */}
      <Tabs.Screen
        name="support" // Dosya adı 'support.tsx' olacak
        options={{ title: 'Destek' }}
      />
    </Tabs>
  );
}