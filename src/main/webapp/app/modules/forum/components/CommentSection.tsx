import React, { useState } from 'react';
import { IPostComment } from 'app/shared/model/post-comment.model';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

import axios from 'axios';

interface CommentSectionProps {
  postId: string;
  comments: IPostComment[];
  onCommentAdded?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const maxLength = 500;

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post('/api/post-comments', {
        content: newComment,
        post: { id: Number(postId) },
      });
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (e) {
      console.error('Failed to post comment', e);
    }
  };

  return (
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/20 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Bình luận ({comments.length})</h3>

      <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
          U
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            maxLength={maxLength}
            placeholder="Viết bình luận của bạn..."
            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-3 pr-12 outline-none focus:ring-2 focus:ring-[#00F5FF] transition-all text-sm resize-none min-h-[80px] text-gray-800 dark:text-gray-200"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-[10px] ${newComment.length >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
              {newComment.length}/{maxLength}
            </span>
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#9B4DFF] text-white disabled:opacity-50 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map(comment => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm shrink-0">
              {comment.author?.login?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-3 inline-block">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.author?.login || 'Anonymous'}</span>
                  <span className="text-[10px] text-gray-500">1h</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 ml-2">
                <button
                  onClick={() => {
                    axios
                      .post('/api/comment-reactions', {
                        reactionType: 'LIKE',
                        comment: { id: comment.id },
                      })
                      .then(() => alert('Đã thích bình luận!'))
                      .catch(e => console.error(e));
                  }}
                  className="text-[11px] font-medium text-gray-500 hover:text-[#FF6B35] transition-colors"
                >
                  Thích
                </button>
                <button className="text-[11px] font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Phản hồi
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
        )}
      </div>
    </div>
  );
};
