import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Sparkles, Users, Wallet } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { RootRoutes } from '@/navigation/routes';
import {
  addMember as addMemberDb,
  setPrimaryMember as setPrimaryMemberDb,
} from '@/services/database';
import { setOnboardingCompleted } from '@/services/onboarding';
import { showSuccessToast } from '@/services/toast/toast.service';
import { addMember, setPrimaryMemberId } from '@/store/memberSlice';
import { RootState } from '@/store/store';
import { Member } from '@/types';

import { PaginationDots } from './components/PaginationDots';
import { PrimaryUserSetupSlide } from './components/PrimaryUserSetupSlide';
import { SlideItem } from './components/SlideItem';
import { styles } from './styles';
import { OnboardingSlide } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTRO_SLIDES: OnboardingSlide[] = [
  {
    id: 'personal',
    badge: 'PERSONAL FINANCE',
    title: 'Track Solo Expenses',
    description:
      'Record your daily solo spending with custom categories and notes in an offline-first, private ledger.',
    Icon: Wallet,
    gradientColors: ['#10B981', '#059669'],
  },
  {
    id: 'group',
    badge: 'GROUP SPLITTING',
    title: 'Split Bills Easily',
    description:
      'Divide dining, trips, and utilities seamlessly with equal, exact, shares, or itemized receipt splitting.',
    Icon: Users,
    gradientColors: ['#1CC29F', '#0D9488'],
  },
  {
    id: 'debts',
    badge: 'SMART SETTLEMENT',
    title: 'Zero-Stress Paybacks',
    description:
      'EquiSplit calculates who owes whom and simplifies the debts to reduce the number of payments needed.',
    Icon: Sparkles,
    gradientColors: ['#6366F1', '#4F46E5'],
  },
];

const TOTAL_SLIDES = INTRO_SLIDES.length + 1; // 3 intro slides + 1 setup slide
const SETUP_INDEX = INTRO_SLIDES.length;

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const members = useSelector((s: RootState) => s.members.members);

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setup state
  const [name, setName] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      if (index >= 0 && index < TOTAL_SLIDES && index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [currentIndex],
  );

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < TOTAL_SLIDES) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  }, []);

  const handleSkip = useCallback(() => {
    goToSlide(SETUP_INDEX);
  }, [goToSlide]);

  const handleNext = useCallback(() => {
    if (currentIndex < SETUP_INDEX) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  const handleSelectMember = useCallback((member: Member) => {
    setSelectedMemberId(member.id);
    setName(member.name);
    setError(undefined);
  }, []);

  const handleChangeName = useCallback((val: string) => {
    setName(val);
    setSelectedMemberId(null);
    if (val.trim()) {
      setError(undefined);
    }
  }, []);

  const handleFinish = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue.');
      return;
    }

    setSubmitting(true);
    try {
      let primaryId: string;

      if (selectedMemberId) {
        primaryId = selectedMemberId;
      } else {
        const existing = members.find(
          m => m.name.toLowerCase() === trimmed.toLowerCase(),
        );
        if (existing) {
          primaryId = existing.id;
        } else {
          const newMember: Member = {
            id: Date.now().toString(),
            name: trimmed,
            isPrimary: true,
          };
          await addMemberDb(newMember);
          dispatch(addMember(newMember));
          primaryId = newMember.id;
        }
      }

      await setPrimaryMemberDb(primaryId);
      dispatch(setPrimaryMemberId(primaryId));
      await setOnboardingCompleted();

      showSuccessToast(`Welcome, ${trimmed}!`);
      navigation.replace(RootRoutes.MainTabs);
    } catch (err) {
      console.error('[Onboarding] Error saving primary user:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [name, selectedMemberId, members, dispatch, navigation]);

  const isSetupSlide = currentIndex === SETUP_INDEX;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with App Brand and Skip Action */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <AppText style={styles.brandText}>{'EquiSplit'}</AppText>
        </View>

        {!isSetupSlide && (
          <Pressable
            onPress={handleSkip}
            style={styles.skipBtn}
            hitSlop={8}
            accessibilityLabel="Skip intro"
          >
            <AppText style={styles.skipText}>{'Skip'}</AppText>
          </Pressable>
        )}
      </View>

      {/* Horizontally Slidable Paging List */}
      <FlatList
        ref={flatListRef}
        data={[...INTRO_SLIDES, { id: 'setup' } as any]}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
        style={styles.slider}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item, index }) => {
          if (index === SETUP_INDEX) {
            return (
              <PrimaryUserSetupSlide
                name={name}
                onChangeName={handleChangeName}
                members={members}
                selectedMemberId={selectedMemberId}
                onSelectMember={handleSelectMember}
                error={error}
              />
            );
          }
          return <SlideItem slide={item as OnboardingSlide} />;
        }}
      />

      {/* Footer with Dots and Action Controls */}
      <View style={styles.footer}>
        <PaginationDots
          total={TOTAL_SLIDES}
          currentIndex={currentIndex}
          onDotPress={goToSlide}
        />

        <View style={styles.buttonRow}>
          {currentIndex > 0 && (
            <AppButton
              label="Back"
              variant="ghost"
              style={styles.prevBtn}
              onPress={handlePrev}
            />
          )}

          {isSetupSlide ? (
            <AppButton
              label="Get Started"
              variant="primary"
              style={styles.nextBtn}
              loading={submitting}
              onPress={handleFinish}
            />
          ) : (
            <AppButton
              label="Next"
              variant="primary"
              style={styles.nextBtn}
              onPress={handleNext}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
