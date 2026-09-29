import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasCompletedOnboarding,
  setOnboardingCompleted,
  resetOnboarding,
} from '../src/services/onboarding';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Onboarding Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns false when onboarding key is not present', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await hasCompletedOnboarding();
    expect(result).toBe(false);
  });

  it('returns true when onboarding key is "true"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
    const result = await hasCompletedOnboarding();
    expect(result).toBe(true);
  });

  it('sets onboarding key to true', async () => {
    await setOnboardingCompleted();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@equisplit_onboarding_completed_v1',
      'true',
    );
  });

  it('resets onboarding key', async () => {
    await resetOnboarding();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@equisplit_onboarding_completed_v1',
    );
  });
});
