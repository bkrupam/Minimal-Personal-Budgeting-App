import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { OnboardingWizard } from './components/OnboardingWizard';
import { CategorySetup } from './components/CategorySetup';
import { HomeScreen } from './components/HomeScreen';
import { AppState, Category } from './types';
export function App() {
  const {
    state,
    isLoaded,
    updateState,
    addExpense,
    resetOnboarding,
    remainingBalance,
    getCategoryRemaining
  } = useAppState();
  const [tempOnboardingData, setTempOnboardingData] = useState<
    Partial<AppState>>(
    {});
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6B8F71] border-t-transparent rounded-full animate-spin" />
      </div>);

  }
  // Wrapper for consistent background and font
  const AppWrapper = ({ children }: {children: React.ReactNode;}) =>
  <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] font-sans antialiased">
      {children}
    </div>;

  // Flow 1: Onboarding Wizard
  if (!state.isOnboarded && !tempOnboardingData.monthlyIncome) {
    return (
      <AppWrapper>
        <OnboardingWizard
          currency={state.currency}
          onComplete={(data) => {
            if (data.useCategories) {
              // Go to category setup
              setTempOnboardingData(data);
            } else {
              // Finish immediately
              updateState({
                ...data,
                isOnboarded: true
              });
            }
          }} />

      </AppWrapper>);

  }
  // Flow 2: Category Setup (Intermediate Step)
  if (!state.isOnboarded && tempOnboardingData.useCategories) {
    return (
      <AppWrapper>
        <CategorySetup
          spendableAmount={tempOnboardingData.spendableAmount || 0}
          currency={state.currency}
          onComplete={(categories) => {
            updateState({
              ...tempOnboardingData,
              categories,
              isOnboarded: true
            });
          }} />

      </AppWrapper>);

  }
  // Flow 3: Home Screen (Main App)
  return (
    <AppWrapper>
      <HomeScreen
        state={state}
        onAddExpense={(amount, categoryId, note) => {
          addExpense({
            amount,
            categoryId,
            note,
            date: new Date().toISOString()
          });
        }}
        onReset={resetOnboarding}
        remainingBalance={remainingBalance}
        getCategoryRemaining={getCategoryRemaining} />

    </AppWrapper>);

}