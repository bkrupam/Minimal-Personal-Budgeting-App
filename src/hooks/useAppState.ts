import { useState, useEffect, useCallback } from 'react';
import { AppState, Category, Expense, INITIAL_STATE } from '../types';

const STORAGE_KEY = 'budget-app-state';

export function useAppState() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check for month rollover
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (parsed.currentMonth !== currentMonth) {
          // New month: reset expenses, update month
          // We keep categories and income settings
          setState({
            ...parsed,
            currentMonth,
            expenses: []
          });
        } else {
          setState(parsed);
        }
      } catch (e) {
        console.error('Failed to parse state', e);
        setState(INITIAL_STATE);
      }
    } else {
      setState(INITIAL_STATE);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const addExpense = useCallback(
    (expense: Omit<Expense, 'id' | 'month'>) => {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        month: state.currentMonth
      };
      setState((prev) => ({
        ...prev,
        expenses: [newExpense, ...prev.expenses]
      }));
    },
    [state.currentMonth]
  );

  const deleteExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id)
    }));
  }, []);

  const addCategory = useCallback(
    (category: Omit<Category, 'id' | 'order'>) => {
      setState((prev) => {
        const newCategory: Category = {
          ...category,
          id: crypto.randomUUID(),
          order: prev.categories.length
        };
        return {
          ...prev,
          categories: [...prev.categories, newCategory]
        };
      });
    },
    []
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
        )
      }));
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      // Also remove categoryId from expenses that had this category
      expenses: prev.expenses.map((e) =>
      e.categoryId === id ? { ...e, categoryId: undefined } : e
      )
    }));
  }, []);

  const reorderCategories = useCallback((newOrder: Category[]) => {
    setState((prev) => ({
      ...prev,
      categories: newOrder.map((c, index) => ({ ...c, order: index }))
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    if (
    window.confirm(
      'Are you sure you want to reset everything? This cannot be undone.'
    ))
    {
      setState({
        ...INITIAL_STATE,
        currentMonth: new Date().toISOString().slice(0, 7)
      });
    }
  }, []);

  // Calculations
  const totalSpent = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBalance = state.spendableAmount - totalSpent;

  const getCategorySpent = useCallback(
    (categoryId: string) => {
      return state.expenses.
      filter((e) => e.categoryId === categoryId).
      reduce((sum, e) => sum + e.amount, 0);
    },
    [state.expenses]
  );

  const getCategoryRemaining = useCallback(
    (categoryId: string) => {
      const category = state.categories.find((c) => c.id === categoryId);
      if (!category) return 0;
      return category.budget - getCategorySpent(categoryId);
    },
    [state.categories, getCategorySpent]
  );

  return {
    state,
    isLoaded,
    updateState,
    addExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    resetOnboarding,
    remainingBalance,
    getCategorySpent,
    getCategoryRemaining
  };
}