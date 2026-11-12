import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#0F172A',
          headerTitleStyle: {
            fontWeight: '800',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        {}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {}
        <Stack.Screen
          name="login"
          options={{
            title: 'Masuk Akun Pengguna',
            headerShown: true,
          }}
        />

        {}
        <Stack.Screen
          name="area/[id]"
          options={{
            title: 'Detail Area Parkir',
          }}
        />

        {}
        <Stack.Screen
          name="vehicles/[id]"
          options={{
            title: 'Spesifikasi Kendaraan API',
          }}
        />

        {}
        <Stack.Screen
          name="vehicles/promise-demo"
          options={{
            title: 'Demo Promise .then() / catch()',
          }}
        />

        {}
        <Stack.Screen
          name="modal/ticket"
          options={{
            title: 'E-Tiket Digital',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#1E293B' },
            headerTintColor: '#F8FAFC',
          }}
        />
      </Stack>
    </>
  );
}
