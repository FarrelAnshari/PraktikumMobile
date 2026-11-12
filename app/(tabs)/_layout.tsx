import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View, Platform } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout =
        typeof window !== 'undefined'
          ? window.confirm('Apakah Anda yakin ingin keluar dari akun?')
          : true;
      if (confirmLogout) {

        router.replace('/login');
      }
      return;
    }

    router.replace('/login');
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 16,
          color: '#0F172A',
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 8,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FEE2E2',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              marginRight: 14,
              borderWidth: 1,
              borderColor: '#FECACA',
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#DC2626' }}>Keluar</Text>
          </TouchableOpacity>
        ),
      }}
    >
      {}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Monitoring',
          headerTitle: 'PARKIN - Monitoring Real-Time',
          tabBarLabel: 'Monitoring',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: focused ? '#2563EB' : 'transparent',
                marginBottom: 2,
              }}
            />
          ),
        }}
      />

      {}
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check-In',
          headerTitle: 'Gerbang Masuk & Tiket Parkir',
          tabBarLabel: 'Check-In',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: focused ? '#2563EB' : 'transparent',
                marginBottom: 2,
              }}
            />
          ),
        }}
      />

      {}
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Kendaraan API',
          headerTitle: 'Katalog Kendaraan External API',
          tabBarLabel: 'Kendaraan API',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: focused ? '#2563EB' : 'transparent',
                marginBottom: 2,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
