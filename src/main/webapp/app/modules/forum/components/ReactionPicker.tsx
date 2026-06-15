import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactionType } from 'app/shared/model/reaction-type.model';

const reactions = [
  { type: ReactionType.LIKE, icon: '👍', label: 'Thích' },
  { type: ReactionType.HEART, icon: '❤️', label: 'Yêu thích' },
  { type: ReactionType.LAUGH, icon: '😂', label: 'Haha' },
  { type: ReactionType.DISLIKE, icon: '👎', label: 'Không thích' },
];

interface ReactionPickerProps {
  onReact: (type: ReactionType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onReact, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[#090418] border border-gray-200 dark:border-white/10 rounded-[20px] shadow-xl p-1.5 flex items-center gap-1 z-50"
          onMouseLeave={onClose}
        >
          {reactions.map((reaction, index) => (
            <motion.button
              key={reaction.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.3, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onReact(reaction.type);
                onClose();
              }}
              className="w-10 h-10 flex items-center justify-center text-2xl rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative group"
              title={reaction.label}
            >
              {reaction.icon}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                {reaction.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
