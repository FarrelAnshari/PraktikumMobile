import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { globalStyles } from '../styles';

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'Mahasiswa' | 'Dosen' | 'Petugas'>('Mahasiswa');
  const [identifier, setIdentifier] = useState('20211003287');
  const [fullName, setFullName] = useState('Izuku Midoriya');
  const [password, setPassword] = useState('123456');

  const handleSelectRole = (selectedRole: 'Mahasiswa' | 'Dosen' | 'Petugas') => {
    setRole(selectedRole);
    if (selectedRole === 'Mahasiswa') {
      setIdentifier('20211003287');
      setFullName('Izuku Midoriya');
    } else if (selectedRole === 'Dosen') {
      setIdentifier('198503152010121002');
      setFullName('Shota Aizawa');
    } else {
      setIdentifier('PETUGAS-07');
      setFullName('Endeavor');
    }
  };

  const handleLoginSubmit = () => {
    if (!identifier.trim() || !fullName.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Mohon lengkapi ID, Nama, dan Kata Sandi.');
      return;
    }


    router.replace('/');
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={globalStyles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: 'center' }}>
        { }
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          { }
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: '#2563EB',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: '900', color: '#FFFFFF' }}>P</Text>
          </View>
          <Text style={[globalStyles.title, { fontSize: 24, marginTop: 2 }]}>PARKIN SMART</Text>
          <Text style={globalStyles.subtitle}>Sistem Monitoring &amp; Akses Parkir Kampus</Text>
        </View>

        { }
        <View style={[globalStyles.card, { marginHorizontal: 0 }]}>
          <Text style={[globalStyles.title, { marginBottom: 12 }]}>Pilih Peran Akun</Text>

          { }
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            {(['Mahasiswa', 'Dosen', 'Petugas'] as const).map((r) => {
              const active = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => handleSelectRole(r)}

                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: active ? '#2563EB' : '#F1F5F9',
                    borderWidth: 1,
                    borderColor: active ? '#1D4ED8' : '#E2E8F0',
                  }}
                >
                  <Text

                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: active ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[globalStyles.subtitle, { marginBottom: 4, fontWeight: '700' }]}>
            Nomor Identitas ({role}):
          </Text>
          <TextInput
            style={[globalStyles.input, { marginBottom: 12 }]}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="NIM / NIP / ID"
          />

          <Text style={[globalStyles.subtitle, { marginBottom: 4, fontWeight: '700' }]}>
            Nama Lengkap:
          </Text>
          <TextInput
            style={[globalStyles.input, { marginBottom: 12 }]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nama lengkap pengguna"
          />

          <Text style={[globalStyles.subtitle, { marginBottom: 4, fontWeight: '700' }]}>
            Kata Sandi:
          </Text>
          <TextInput
            style={[globalStyles.input, { marginBottom: 18 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Kata sandi akun"
          />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={handleLoginSubmit}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.primaryButtonText}>Masuk ke Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
