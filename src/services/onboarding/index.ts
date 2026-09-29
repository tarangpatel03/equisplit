import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@equisplit_onboarding_completed_v1';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (err) {
    console.warn('[Onboarding] Failed to persist completion flag:', err);
  }
}

export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (err) {
    console.warn('[Onboarding] Failed to reset completion flag:', err);
  }
}
