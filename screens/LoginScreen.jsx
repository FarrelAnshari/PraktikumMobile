import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('Mahasiswa'); // 'Mahasiswa' | 'Dosen' | 'Petugas'
  const [identifier, setIdentifier] = useState('2205551010');
  const [fullName, setFullName] = useState('Izuku Midoriya');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  // Quick preset helper untuk kemudahan demo praktikum
  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Mahasiswa') {
      setIdentifier('2205551010');
      setFullName('Budi Pratama');
    } else if (selectedRole === 'Dosen') {
      setIdentifier('198503152010121002');
      setFullName('Dr. Ir. Hendra Gunawan, M.T.');
    } else {
      setIdentifier('PETUGAS-07');
      setFullName('Agus Suryanto (Pos Barat)');
    }
  };

  const handleLoginSubmit = () => {
    if (!identifier.trim() || !fullName.trim() || !password.trim()) {
      Alert.alert('Form Belum Lengkap', 'Mohon isi ID/NIM, Nama Lengkap, dan Kata Sandi.');
      return;
    }

    onLogin({
      id: identifier.trim(),
      name: fullName.trim(),
      role: role,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🚗</Text>
          </View>
          <Text style={styles.brandTitle}>PARKIN</Text>
          <Text style={styles.brandSubtitle}>Smart Campus Parking System</Text>
          <Text style={styles.brandTagline}>
            Monitoring real-time, tiket digital, & manajemen slot parkir kampus cerdas
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Masuk ke Akun</Text>
          <Text style={styles.label}>Pilih Peran Pengguna (Role):</Text>

          {/* Role Selector */}
          <View style={styles.roleContainer}>
            {[
              { id: 'Mahasiswa', icon: '🎓' },
              { id: 'Dosen', icon: '👨‍🏫' },
              { id: 'Petugas', icon: '🛡️' },
            ].map((item) => {
              const active = role === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.roleButton, active && styles.roleButtonActive]}
                  onPress={() => handleSelectRole(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.roleIcon}>{item.icon}</Text>
                  <Text style={[styles.roleText, active && styles.roleTextActive]}>
                    {item.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Input Identifier */}
          <Text style={styles.label}>
            {role === 'Mahasiswa'
              ? 'NIM Mahasiswa'
              : role === 'Dosen'
                ? 'NIP Dosen'
                : 'ID Petugas Parkir'}
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.fieldIcon}>🪪</Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'Mahasiswa' ? 'Masukkan NIM' : 'Masukkan Nomor Identitas'}
              placeholderTextColor="#94A3B8"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          {/* Input Nama */}
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.fieldIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama pengguna"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Input Password */}
          <Text style={styles.label}>Kata Sandi (Password)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.fieldIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan kata sandi"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Login */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Masuk ke Sistem</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 6 }}>➔</Text>
          </TouchableOpacity>

          {/* Quick Demo Hint */}
          <View style={styles.hintBox}>
            <Text style={{ fontSize: 14 }}>💡</Text>
            <Text style={styles.hintText}>
              Tips Praktikum: Pilih role di atas untuk otomatis mengisi data akun demo yang siap dites.
            </Text>
          </View>
        </View>

        <Text style={styles.footerNote}>© 2026 Smart Campus Parking • Versi Praktikum Lite</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  logoEmoji: {
    fontSize: 34,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  roleButtonActive: {
    backgroundColor: '#2563EB',
  },
  roleIcon: {
    fontSize: 13,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  fieldIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 4,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 11,
    color: '#0369A1',
    lineHeight: 16,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 20,
  },
});
