import React, { FC } from 'react';
import { Image, View } from 'react-native';
import {
  Coins,
  FileSpreadsheet,
  FileUp,
  Layers,
  Moon,
  Share2,
  Sun,
  Trash2,
  Wallet,
} from 'lucide-react-native';

import { assets } from '@/assets';
import { AppConfirmDialog, CategoryManagerModal } from '@/components/common';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

import { ExportDataModal } from './components/ExportDataModal';
import { ImportDataModal } from './components/ImportDataModal';
import { CurrencyPickerModal } from './components/CurrencyPickerModal';
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
    expenses,
    personalExpenses,
    primaryMember,
    selectedCurrency,
    trackOutOfPocket,
    switchModalVisible,
    setSwitchModalVisible,
    categoryManagerVisible,
    setCategoryManagerVisible,
    exportModalVisible,
    setExportModalVisible,
    importModalVisible,
    setImportModalVisible,
    clearDialogVisible,
    setClearDialogVisible,
    currencyModalVisible,
    setCurrencyModalVisible,
    exporting,
    clearing,
    switching,
    handleSelectPrimary,
    handleToggleTheme,
    handleExport,
    handleShareBalances,
    handleConfirmClearData,
    handleSelectCurrency,
    handleToggleTrackOutOfPocket,
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
          subtitle={selectedCurrency.name}
          type="badge"
          badgeText={`${selectedCurrency.symbol} ${selectedCurrency.code}`}
          showDivider={true}
          onPress={() => setCurrencyModalVisible(true)}
        />
        <SettingItem
          icon={<Wallet size={20} color="#10B981" />}
          iconBg="rgba(16, 185, 129, 0.14)"
          title="Track Out-of-Pocket"
          subtitle={
            trackOutOfPocket
              ? 'Include all out-of-pocket & settlements'
              : 'Only include personal consumption share'
          }
          type="switch"
          switchValue={trackOutOfPocket}
          onSwitchChange={handleToggleTrackOutOfPocket}
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
          onPress={handleShareBalances}
        />
        <SettingItem
          icon={<FileSpreadsheet size={20} color="#34D399" />}
          iconBg="rgba(52, 211, 153, 0.14)"
          title="Export Data"
          subtitle="Backup personal & group records"
          type="chevron"
          onPress={() => setExportModalVisible(true)}
        />
        <SettingItem
          icon={<FileUp size={20} color="#818CF8" />}
          iconBg="rgba(129, 140, 248, 0.14)"
          title="Import Data"
          subtitle="Merge expenses from JSON or CSV"
          type="chevron"
          onPress={() => setImportModalVisible(true)}
        />
        <SettingItem
          icon={<Trash2 size={20} color={themeColors.debt} />}
          title="Clear Data"
          subtitle="Reset transaction histories"
          type="chevron"
          isDestructive
          showDivider={false}
          onPress={() => setClearDialogVisible(true)}
        />
      </SettingSection>

      {/* App Branding & Version Footer */}
      <View style={styles.appInfoSection}>
        <Image
          source={assets.icons.ic_app_logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <AppText style={[styles.appName, { color: themeColors.textPrimary }]}>
          {'EquiSplit'}
        </AppText>
        <AppText
          style={[styles.appVersion, { color: themeColors.textSecondary }]}
        >
          {'Version 1.0'}
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

      {/* Export Data Modal */}
      <ExportDataModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExport}
        personalCount={personalExpenses.length}
        groupCount={expenses.length}
        exporting={exporting}
      />

      {/* Import Data Modal */}
      <ImportDataModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
      />

      {/* Clear Data Confirmation Dialog */}
      <AppConfirmDialog
        visible={clearDialogVisible}
        title="Clear Transaction Data?"
        message="This will permanently delete all group and personal expense records. Your members and categories will be kept."
        confirmLabel="Clear All"
        confirmVariant="danger"
        loading={clearing}
        onConfirm={handleConfirmClearData}
        onCancel={() => setClearDialogVisible(false)}
      />

      {/* Currency Picker Modal */}
      <CurrencyPickerModal
        visible={currencyModalVisible}
        currentCurrencyCode={selectedCurrency.code}
        onSelect={handleSelectCurrency}
        onClose={() => setCurrencyModalVisible(false)}
      />
    </AppScreen>
  );
};
