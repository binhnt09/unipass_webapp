import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, ListOrdered } from 'lucide-react';
import { useAppSelector } from 'app/config/store';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, categoryId?: number) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const account = useAppSelector(state => state.authentication.account);
  const categories = useAppSelector(state => state.postCategory.entities);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    ul: false,
    ol: false,
  });

  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleToolbarClick = (action: string) => {
    const editor = document.getElementById('post-content');
    if (!editor) return;

    if (action === 'image') {
      fileInputRef.current?.click();
      return;
    }

    if (action === 'bold') {
      document.execCommand('bold', false);
      checkFormats();
      return;
    }

    if (action === 'italic') {
      document.execCommand('italic', false);
      checkFormats();
      return;
    }

    const selection = window.getSelection();
    const text = selection ? selection.toString() : '';

    if (action === 'link') {
      document.execCommand('insertText', false, `[${text || 'text'}](url)`);
      return;
    }

    if (action === 'ul') {
      document.execCommand('insertUnorderedList', false);
      checkFormats();
      return;
    }

    if (action === 'ol') {
      document.execCommand('insertOrderedList', false);
      checkFormats();
      return;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      document.execCommand('insertText', false, `\n![${file.name}](uploading...)\n`);
    }
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

          {/* User & Category Info */}
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                {account?.login?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-base">{account?.login || 'Người dùng'}</div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {categories.map(cat => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(isSelected ? undefined : cat.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pb-4 overflow-y-auto flex-1">
            <div
              id="post-content"
              contentEditable
              onInput={e => {
                setContent(e.currentTarget.innerHTML);
                checkFormats();
              }}
              onKeyUp={checkFormats}
              onMouseUp={checkFormats}
              onBlur={checkFormats}
              data-placeholder="Bạn đang nghĩ gì? Chia sẻ với cộng đồng..."
              className="w-full min-h-[200px] text-lg text-gray-800 dark:text-gray-200 bg-transparent border border-gray-100 dark:border-white/5 rounded-2xl p-4 outline-none resize-none font-sans focus:ring-2 focus:ring-[#00F5FF]/30 transition-shadow empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 dark:empty:before:text-gray-600 cursor-text whitespace-pre-wrap"
            />
          </div>

          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {/* Footer & Toolbar */}
          <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('image');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Thêm hình ảnh</span>
              </button>
              <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-2"></div>
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('bold');
                }}
                className={`p-2 rounded-lg transition-colors ${activeFormats.bold ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                title="In đậm"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('italic');
                }}
                className={`p-2 rounded-lg transition-colors ${activeFormats.italic ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                title="In nghiêng"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('link');
                }}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                title="Chèn Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('ul');
                }}
                className={`p-2 rounded-lg transition-colors ${activeFormats.ul ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                title="Danh sách"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onMouseDown={e => {
                  e.preventDefault();
                  handleToolbarClick('ol');
                }}
                className={`p-2 rounded-lg transition-colors ${activeFormats.ol ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
                title="Danh sách số"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onSubmit('', content, selectedCategoryId);
                  setContent('');
                  const editor = document.getElementById('post-content');
                  if (editor) editor.innerHTML = '';
                  setSelectedCategoryId(undefined);
                  onClose();
                }}
                disabled={!content.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)' }}
              >
                <span>Đăng bài</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
