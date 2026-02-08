import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, WalletIcon, TrendingUpIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AppState } from '../types';
interface OnboardingWizardProps {
  onComplete: (data: Partial<AppState>) => void;
  currency: string;
}
type Step = 'income' | 'invest-ask' | 'invest-amount' | 'summary-categories';
export function OnboardingWizard({
  onComplete,
  currency
}: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>('income');
  const [income, setIncome] = useState('');
  const [investAmount, setInvestAmount] = useState('');
  const [direction, setDirection] = useState(1);
  const handleNext = (nextStep: Step) => {
    setDirection(1);
    setStep(nextStep);
  };
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0
    })
  };
  const parsedIncome = parseFloat(income) || 0;
  const parsedInvest = parseFloat(investAmount) || 0;
  const spendable = parsedIncome - parsedInvest;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-xl w-full bg-white md:rounded-3xl md:shadow-sm md:border md:border-[#1C1C1C]/5 p-6 md:p-12 min-h-[60vh] md:min-h-0 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: INCOME */}
            {step === 'income' &&
            <motion.div
              key="income"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="space-y-8">

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#1C1C1C]">
                    Monthly Income
                  </h1>
                  <p className="text-[#1C1C1C]/60 text-lg">
                    How much do you earn each month?
                  </p>
                </div>

                <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0"
                prefix={currency}
                className="text-4xl font-bold py-4"
                autoFocus />


                <Button
                fullWidth
                size="lg"
                disabled={!income || parsedIncome <= 0}
                onClick={() => handleNext('invest-ask')}>

                  Continue <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            }

            {/* STEP 2: INVEST ASK */}
            {step === 'invest-ask' &&
            <motion.div
              key="invest-ask"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="space-y-8">

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#1C1C1C]">
                    Investments
                  </h1>
                  <p className="text-[#1C1C1C]/60 text-lg">
                    Do you invest money monthly?
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                  onClick={() => handleNext('invest-amount')}
                  className="p-6 rounded-2xl bg-[#FAFAF7] border-2 border-transparent hover:border-[#6B8F71] shadow-sm text-left transition-all group">

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-[#1C1C1C]">
                        Yes, I invest
                      </span>
                      <TrendingUpIcon className="w-6 h-6 text-[#6B8F71]" />
                    </div>
                    <p className="text-[#1C1C1C]/60">
                      I set aside money for the future
                    </p>
                  </button>

                  <button
                  onClick={() => {
                    setInvestAmount('0');
                    handleNext('summary-categories');
                  }}
                  className="p-6 rounded-2xl bg-[#FAFAF7] border-2 border-transparent hover:border-[#1C1C1C]/20 shadow-sm text-left transition-all">

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-[#1C1C1C]">
                        No, not right now
                      </span>
                      <WalletIcon className="w-6 h-6 text-[#1C1C1C]/40" />
                    </div>
                    <p className="text-[#1C1C1C]/60">
                      I'll just track my spending
                    </p>
                  </button>
                </div>
              </motion.div>
            }

            {/* STEP 2b: INVEST AMOUNT */}
            {step === 'invest-amount' &&
            <motion.div
              key="invest-amount"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="space-y-8">

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#1C1C1C]">
                    Investment Amount
                  </h1>
                  <p className="text-[#1C1C1C]/60 text-lg">
                    How much do you invest monthly?
                  </p>
                </div>

                <Input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="0"
                prefix={currency}
                className="text-4xl font-bold py-4"
                autoFocus
                error={
                parsedInvest > parsedIncome ?
                'Investment cannot exceed income' :
                undefined
                } />


                <Button
                fullWidth
                size="lg"
                disabled={!investAmount || parsedInvest > parsedIncome}
                onClick={() => handleNext('summary-categories')}>

                  Continue <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            }

            {/* STEP 3: SUMMARY & CATEGORIES */}
            {step === 'summary-categories' &&
            <motion.div
              key="summary-categories"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="space-y-8">

                <div className="bg-[#6B8F71]/10 p-8 rounded-2xl text-center space-y-2">
                  <p className="text-[#1C1C1C]/60 font-medium">
                    Available to spend
                  </p>
                  <p className="text-5xl font-bold text-[#6B8F71]">
                    {currency}
                    {spendable.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-[#1C1C1C]">
                    Categorize spending?
                  </h2>
                  <p className="text-[#1C1C1C]/60">
                    Would you like to organize your budget?
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() =>
                  onComplete({
                    monthlyIncome: parsedIncome,
                    monthlyInvestment: parsedInvest,
                    spendableAmount: spendable,
                    useCategories: true,
                    isOnboarded: false // Still need to setup categories
                  })
                  }>

                    Yes, categorize
                  </Button>

                  <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() =>
                  onComplete({
                    monthlyIncome: parsedIncome,
                    monthlyInvestment: parsedInvest,
                    spendableAmount: spendable,
                    useCategories: false,
                    isOnboarded: true // Done!
                  })
                  }>

                    No, go with flow
                  </Button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}