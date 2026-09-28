import React, { FC } from 'react';
import { Image, View } from 'react-native';
import {
  Coins,
  FileSpreadsheet,
  Layers,
  Moon,
  Share2,
  Sun,
  Trash2,
} from 'lucide-react-native';

import { assets } from '@/assets';
import { CategoryManagerModal } from '@/components/common';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

import { ProfileCard } from './components/ProfileCard';
import { SettingItem } from './components/SettingItem';
import { SettingSection } from './components/SettingSection';
import { SwitchPrimaryModal } from './components/SwitchPrimaryModal';
import { useSettingsScreen } from './hooks/useSettingsScreen';
import { styles } from './styles';

export const SettingsScreen: FC = () => {
  const { isDark, colors: themeColors } = useAppTheme();

  const {
    members,
    categories,
    primaryMember,
    switchModalVisible,
    setSwitchModalVisible,
    categoryManagerVisible,
    setCategoryManagerVisible,
    switching,
    handleSelectPrimary,
    handleToggleTheme,
  } = useSettingsScreen();

  return (
    <AppScreen
      screenTitle="Settings"
      showBackButton={false}
      preset="scroll"
      contentContainerStyle={styles.container}
    >
      {/* Primary Member Profile Card */}
      <ProfileCard
        primaryMember={primaryMember}
        onSwitch={() => setSwitchModalVisible(true)}
      />

      {/* Preferences Section */}
      <SettingSection title="Preferences">
        <SettingItem
          icon={<Layers size={20} color={themeColors.primary} />}
          iconBg={themeColors.primaryLight}
          title="Categories"
          subtitle={`${categories.length} categories configured`}
          type="chevron"
          badgeText={`${categories.length}`}
          badgeVariant="primary"
          onPress={() => setCategoryManagerVisible(true)}
        />
        <SettingItem
          icon={
            isDark ? (
              <Moon size={20} color="#A78BFA" />
            ) : (
              <Sun size={20} color="#F59E0B" />
            )
          }
          iconBg={
            isDark ? 'rgba(167, 139, 250, 0.14)' : 'rgba(245, 158, 11, 0.14)'
          }
          title="Theme"
          subtitle={isDark ? 'Dark theme enabled' : 'Light theme enabled'}
          type="switch"
          switchValue={isDark}
          onSwitchChange={handleToggleTheme}
        />
        <SettingItem
          icon={<Coins size={20} color="#FBBF24" />}
          iconBg="rgba(251, 191, 36, 0.14)"
          title="Currency"
          subtitle="Indian Rupee"
          type="badge"
          badgeText="₹ INR"
          showDivider={false}
        />
      </SettingSection>

      {/* Data & Backup Section */}
      <SettingSection title="Data & Backup">
        <SettingItem
          icon={<Share2 size={20} color="#38BDF8" />}
          iconBg="rgba(56, 189, 248, 0.14)"
          title="Share Balances"
          subtitle="Share simplified debt summary"
          type="chevron"
          onPress={() => {}}
        />
        <SettingItem
          icon={<FileSpreadsheet size={20} color="#34D399" />}
          iconBg="rgba(52, 211, 153, 0.14)"
          title="Export Data"
          subtitle="Backup personal & group records"
          type="chevron"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Trash2 size={20} color={themeColors.debt} />}
          title="Clear Data"
          subtitle="Reset transaction histories"
          type="chevron"
          isDestructive
          showDivider={false}
          onPress={() => {}}
        />
      </SettingSection>

      {/* App Branding & Version Footer */}
      <View style={styles.appInfoSection}>
        <Image
          source={assets.icons.ic_app_logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <AppText
          style={[styles.appName, { color: themeColors.textPrimary }]}
        >
          {'EquiSplit'}
        </AppText>
        <AppText
          style={[styles.appVersion, { color: themeColors.textSecondary }]}
        >
          {'Version 1.0.0 (Build 1)'}
        </AppText>
        <AppText
          style={[styles.appTagline, { color: themeColors.textSecondary }]}
        >
          {'Split expenses simply · Track personal finances seamlessly'}
        </AppText>
      </View>

      {/* Switch Primary Member Modal */}
      <SwitchPrimaryModal
        visible={switchModalVisible}
        members={members}
        currentPrimaryId={primaryMember?.id}
        onSelect={handleSelectPrimary}
        onClose={() => setSwitchModalVisible(false)}
        loading={switching}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        visible={categoryManagerVisible}
        onClose={() => setCategoryManagerVisible(false)}
      />
    </AppScreen>
  );
};
