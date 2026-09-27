import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
