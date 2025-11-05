// Dosya: app/(photo-capture)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function PhotoCaptureLayout() {
  return (
    // Bu, (photo-capture) grubunun bir Stack Navigasyonu olduğunu tanımlar
    <Stack>
      
      {/* 1. Mod Seçim Ekranı (index.tsx) */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Yöntem Seçin',
          headerStyle: { backgroundColor: '#F8F9FA' },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}
      />
      
      {/* 2. Kamera/Galeri Ekranı ([mode].tsx) */}
      <Stack.Screen
        name="[mode]" // Dinamik rotayı burada tanımlarız
        options={{
          headerShown: false, // Kamera ekranı tam ekran olacak
        }}
      />
      
      {/* 3. İnceleme Ekranı (review.tsx) */}
      <Stack.Screen
        name="review" // İnceleme rotasını burada tanımlarız
        options={{
          title: 'Fotoğrafları İnceleyin',
          presentation: 'modal', // Bu ekranın alttan açılmasını sağlar
        }}
      />
      
    </Stack>
  );
}