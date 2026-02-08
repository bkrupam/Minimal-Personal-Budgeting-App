import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, Trash2Icon, GripVerticalIcon, CheckIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Category } from '../types';
interface CategorySetupProps {
  spendableAmount: number;
  currency: string;
  onComplete: (categories: Category[]) => void;
}
export function CategorySetup({
  spendableAmount,
  currency,
  onComplete
}: CategorySetupProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const totalAllocated = categories.reduce((sum, c) => sum + c.budget, 0);
  const remainingToAllocate = spendableAmount - totalAllocated;
  const handleAdd = () => {
    if (!newName || !newBudget) return;
    const budget = parseFloat(newBudget);
    if (budget <= 0) return;
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newName,
      budget: budget,
      order: categories.length
    };
    setCategories([...categories, newCategory]);
    setNewName('');
    setNewBudget('');
    setIsAdding(false);
  };
  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#1C1C1C]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">
              Setup Categories
            </h1>
            <p className="text-[#1C1C1C]/60">Organize your monthly spending</p>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${remainingToAllocate < 0 ? 'text-[#C75C5C]' : 'text-[#6B8F71]'}`}>

              {currency}
              {remainingToAllocate.toLocaleString()}
            </div>
            <span className="text-sm text-[#1C1C1C]/50">left to allocate</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          <AnimatePresence>
            {categories.map((category) =>
            <motion.div
              key={category.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                height: 0
              }}
              className="bg-white p-4 rounded-xl shadow-sm border border-[#1C1C1C]/5 flex items-center gap-4">

                <GripVerticalIcon className="text-[#1C1C1C]/20 w-5 h-5 cursor-grab" />
                <div className="flex-1">
                  <h3 className="font-medium text-[#1C1C1C] text-lg">
                    {category.name}
                  </h3>
                </div>
                <div className="font-medium text-[#1C1C1C]/70">
                  {currency}
                  {category.budget.toLocaleString()}
                </div>
                <button
                onClick={() => handleDelete(category.id)}
                className="p-2 text-[#C75C5C]/70 hover:text-[#C75C5C] hover:bg-[#C75C5C]/10 rounded-lg transition-colors">

                  <Trash2Icon size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {isAdding ?
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="bg-white p-6 rounded-xl shadow-sm border-2 border-[#6B8F71]/20">

              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <Input
                placeholder="Category Name (e.g. Groceries)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus />

                <Input
                type="number"
                placeholder="Monthly Budget"
                prefix={currency}
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)} />

              </div>
              <div className="flex gap-3 justify-end">
                <Button
                size="md"
                variant="secondary"
                onClick={() => setIsAdding(false)}>

                  Cancel
                </Button>
                <Button
                size="md"
                onClick={handleAdd}
                disabled={!newName || !newBudget}>

                  Add Category
                </Button>
              </div>
            </motion.div> :

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setIsAdding(true)}
            className="border-dashed border-2 py-4">

              <PlusIcon className="w-5 h-5 mr-2" />
              Add Category
            </Button>
          }
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[#1C1C1C]/10">
          {remainingToAllocate < 0 &&
          <p className="text-[#C75C5C] text-sm mb-4 text-center font-medium">
              You've allocated more than your available budget!
            </p>
          }
          <Button
            fullWidth
            size="lg"
            onClick={() => onComplete(categories)}
            disabled={remainingToAllocate < 0}>

            Finish Setup <CheckIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>);

}