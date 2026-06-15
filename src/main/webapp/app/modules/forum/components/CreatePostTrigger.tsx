import React from 'react';
import { useAppSelector } from 'app/config/store';
import { PenSquare, Image, Link as LinkIcon, Smile } from 'lucide-react';

interface CreatePostTriggerProps {
  onClick: () => void;
}

export const CreatePostTrigger: React.FC<CreatePostTriggerProps> = ({ onClick }) => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
          {account?.login?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <button
          onClick={onClick}
          className="flex-1 bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors text-left px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 text-sm"
        >
          {account?.login || 'Bạn'} ơi, bạn đang nghĩ gì thế?
        </button>
      </div>
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors text-sm font-medium"
        >
          <Image className="w-4 h-4" />
          <span className="hidden sm:inline">Ảnh/Video</span>
        </button>
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors text-sm font-medium"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Đính kèm link</span>
        </button>
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-500 transition-colors text-sm font-medium"
        >
          <Smile className="w-4 h-4" />
          <span className="hidden sm:inline">Cảm xúc</span>
        </button>
        <button
          onClick={onClick}
          className="ml-auto bg-gradient-to-r from-[#FF2D78] to-[#9B4DFF] hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <PenSquare className="w-4 h-4" />
          Đăng bài
        </button>
      </div>
    </div>
  );
};
