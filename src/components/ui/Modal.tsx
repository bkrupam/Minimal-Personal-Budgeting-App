import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1C1C1C]/20 backdrop-blur-sm z-40" />


          {/* Modal Container - Handles positioning for both mobile and desktop */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            {/* Modal Content */}
            <motion.div
            initial={{
              y: '100%',
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{
              y: '100%',
              opacity: 0,
              scale: 0.95
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="
                pointer-events-auto
                w-full bg-[#FAFAF7] shadow-2xl
                rounded-t-3xl md:rounded-2xl
                max-h-[90vh] overflow-y-auto
                md:max-w-lg md:mx-4
              ">







              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {title &&
                <h2 className="text-xl font-semibold text-[#1C1C1C]">
                      {title}
                    </h2>
                }
                  <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-colors rounded-full hover:bg-[#1C1C1C]/5">

                    <XIcon size={24} />
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}