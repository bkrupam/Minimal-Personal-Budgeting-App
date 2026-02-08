import React, { useState } from 'react';
import { PlusIcon, SettingsIcon } from 'lucide-react';
import { AppState } from '../types';
import { Button } from './ui/Button';
import { AddExpenseModal } from './AddExpenseModal';
interface HomeScreenProps {
  state: AppState;
  onAddExpense: (amount: number, categoryId?: string, note?: string) => void;
  onReset: () => void;
  remainingBalance: number;
  getCategoryRemaining: (id: string) => number;
}
export function HomeScreen({
  state,
  onAddExpense,
  onReset,
  remainingBalance,
  getCategoryRemaining
}: HomeScreenProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Calculate balance status color
  const percentageLeft = remainingBalance / state.spendableAmount * 100;
  let balanceColor = 'text-[#6B8F71]'; // Normal (Sage)
  if (remainingBalance < 0)
  balanceColor = 'text-[#C75C5C]'; // Overspent (Coral)
  else if (percentageLeft < 20) balanceColor = 'text-[#D4A574]'; // Low (Amber)
  const currentMonthName = new Date().toLocaleString('default', {
    month: 'long'
  });
  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 relative">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Header & Main Balance Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#1C1C1C]/5 p-8 mb-8 md:mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B8F71] to-[#D4A574] opacity-20" />

          <div className="flex justify-between items-start mb-6">
            <p className="text-[#1C1C1C]/40 font-medium uppercase tracking-wider text-sm">
              {currentMonthName} Budget
            </p>
            <div className="flex gap-2">
              <button
                onClick={onReset}
                className="p-2 text-[#1C1C1C]/30 hover:text-[#1C1C1C] transition-colors rounded-full hover:bg-[#1C1C1C]/5"
                title="Reset App">

                <SettingsIcon size={20} />
              </button>
            </div>
          </div>

          <div className="text-center py-4">
            <h1
              className={`text-6xl md:text-7xl font-bold mb-2 tracking-tight ${balanceColor}`}>

              {state.currency}
              {remainingBalance.toLocaleString()}
            </h1>
            <p className="text-[#1C1C1C]/50 font-medium text-lg">
              {remainingBalance < 0 ? 'overspent this month' : 'left to spend'}
            </p>
          </div>

          {/* Desktop Add Button (Visible on md+) */}
          <div className="hidden md:flex justify-center mt-8">
            <Button
              size="lg"
              className="shadow-lg shadow-[#6B8F71]/20 rounded-full px-8 py-3"
              onClick={() => setIsAddModalOpen(true)}>

              <PlusIcon className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className={`grid gap-8 ${state.useCategories ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>

          {/* Categories Column */}
          {state.useCategories && state.categories.length > 0 &&
          <div>
              <h2 className="text-sm font-semibold text-[#1C1C1C]/40 uppercase tracking-wider mb-4 px-1">
                Categories
              </h2>
              <div className="space-y-3">
                {state.categories.map((category) => {
                const remaining = getCategoryRemaining(category.id);
                const percent = Math.max(
                  0,
                  Math.min(100, remaining / category.budget * 100)
                );
                return (
                  <div
                    key={category.id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-[#1C1C1C]/5 transition-transform hover:scale-[1.01]">

                      <div className="flex justify-between items-baseline mb-3">
                        <span className="font-medium text-[#1C1C1C] text-lg">
                          {category.name}
                        </span>
                        <span
                        className={`font-medium ${remaining < 0 ? 'text-[#C75C5C]' : 'text-[#1C1C1C]/70'}`}>

                          {state.currency}
                          {remaining.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-[#1C1C1C]/5 rounded-full overflow-hidden">
                        <div
                        className={`h-full rounded-full transition-all duration-500 ${remaining < 0 ? 'bg-[#C75C5C]' : 'bg-[#6B8F71]'}`}
                        style={{
                          width: `${percent}%`
                        }} />

                      </div>
                      <div className="mt-2 text-xs text-[#1C1C1C]/40 text-right">
                        of {state.currency}
                        {category.budget.toLocaleString()}
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }

          {/* Recent Activity Column */}
          <div>
            <h2 className="text-sm font-semibold text-[#1C1C1C]/40 uppercase tracking-wider mb-4 px-1">
              Recent Activity
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-[#1C1C1C]/5 overflow-hidden">
              {state.expenses.length === 0 ?
              <div className="text-center py-12 px-6 text-[#1C1C1C]/30 italic">
                  <div className="mb-2">No expenses yet</div>
                  <div className="text-sm">Click + to add one</div>
                </div> :

              <div className="divide-y divide-[#1C1C1C]/5">
                  {state.expenses.slice(0, 10).map((expense) => {
                  const category = state.categories.find(
                    (c) => c.id === expense.categoryId
                  );
                  return (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center p-4 hover:bg-[#FAFAF7]/50 transition-colors">

                        <div>
                          <div className="font-medium text-[#1C1C1C]">
                            {category ? category.name : 'Uncategorized'}
                          </div>
                          {expense.note &&
                        <div className="text-sm text-[#1C1C1C]/50 mt-0.5">
                              {expense.note}
                            </div>
                        }
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#1C1C1C]">
                            -{state.currency}
                            {expense.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#1C1C1C]/40 mt-0.5">
                            {new Date(expense.date).toLocaleDateString(
                            undefined,
                            {
                              day: 'numeric',
                              month: 'short'
                            }
                          )}
                          </div>
                        </div>
                      </div>);

                })}
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-8 left-0 right-0 px-6 flex justify-center z-30">
        <Button
          size="lg"
          className="shadow-xl shadow-[#6B8F71]/30 rounded-full px-8 py-4"
          onClick={() => setIsAddModalOpen(true)}>

          <PlusIcon className="w-6 h-6 mr-2" />
          Add Expense
        </Button>
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddExpense}
        categories={state.categories}
        currency={state.currency} />

    </div>);

}