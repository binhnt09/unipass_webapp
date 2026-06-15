import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Send } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleToolbarClick = (action: string) => {
    const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let newCursorPos = start;

    switch (action) {
      case 'bold':
        replacement = `**${selectedText || 'text'}**`;
        newCursorPos = start + 2 + (selectedText ? selectedText.length + 2 : 0);
        break;
      case 'italic':
        replacement = `*${selectedText || 'text'}*`;
        newCursorPos = start + 1 + (selectedText ? selectedText.length + 1 : 0);
        break;
      case 'link':
        replacement = `[${selectedText || 'text'}](url)`;
        newCursorPos = start + 1 + (selectedText ? selectedText.length + 3 : 0);
        break;
      case 'image':
        replacement = `![${selectedText || 'alt'}](image_url)`;
        newCursorPos = start + 2 + (selectedText ? selectedText.length + 3 : 0);
        break;
      case 'ul':
        replacement = `\n- ${selectedText || 'item'}`;
        newCursorPos = start + 3 + (selectedText ? selectedText.length : 0);
        break;
      case 'ol':
        replacement = `\n1. ${selectedText || 'item'}`;
        newCursorPos = start + 4 + (selectedText ? selectedText.length : 0);
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setContent(newText);

    // Set focus back after state updates
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-[24px] bg-white dark:bg-[#090418] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tạo bài viết mới</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto flex-1">
            <input
              type="text"
              placeholder="Tiêu đề (không bắt buộc)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-lg font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none mb-4 placeholder-gray-400 dark:placeholder-gray-500"
            />

            <textarea
              id="post-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn (hỗ trợ Markdown)..."
              className="w-full min-h-[200px] text-gray-800 dark:text-gray-200 bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 font-sans"
            />
          </div>

          {/* Footer & Toolbar */}
          <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <button
                onClick={() => handleToolbarClick('bold')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="In đậm"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToolbarClick('italic')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="In nghiêng"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToolbarClick('link')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Chèn Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToolbarClick('image')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Chèn Ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
              <button
                onClick={() => handleToolbarClick('ul')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Danh sách"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToolbarClick('ol')}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Danh sách số"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                onSubmit(title, content);
                setTitle('');
                setContent('');
                onClose();
              }}
              disabled={!content.trim()}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)' }}
            >
              <span>Đăng</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
