import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Category } from '../types';
interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, categoryId?: string, note?: string) => void;
  categories: Category[];
  currency: string;
}
export function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  categories,
  currency
}: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSave = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    onSave(value, selectedCategory, note);
    setShowSuccess(true);
    // Reset and close after delay
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setNote('');
      setSelectedCategory(undefined);
      onClose();
    }, 1000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      {showSuccess ?
      <div className="py-12 flex flex-col items-center justify-center text-[#6B8F71]">
          <motion.div
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}>

            <div className="w-20 h-20 rounded-full bg-[#6B8F71]/10 flex items-center justify-center mb-4">
              <CheckIcon size={40} />
            </div>
          </motion.div>
          <p className="text-xl font-medium">Expense Added!</p>
        </div> :

      <div className="space-y-6">
          <div>
            <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            prefix={currency}
            className="text-4xl font-bold py-4"
            autoFocus
            label="Amount" />

          </div>

          {categories.length > 0 &&
        <div className="space-y-2">
              <label className="block text-sm font-medium text-[#1C1C1C]/70">
                Category
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) =>
            <button
              key={cat.id}
              onClick={() =>
              setSelectedCategory(
                cat.id === selectedCategory ? undefined : cat.id
              )
              }
              className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                      ${selectedCategory === cat.id ? 'bg-[#1C1C1C] text-white' : 'bg-[#1C1C1C]/5 text-[#1C1C1C] hover:bg-[#1C1C1C]/10'}
                    `}>

                    {cat.name}
                  </button>
            )}
              </div>
            </div>
        }

          <div>
            <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            label="Note (Optional)" />

          </div>

          <Button fullWidth size="lg" onClick={handleSave} disabled={!amount}>
            Save Expense
          </Button>
        </div>
      }
    </Modal>);

}