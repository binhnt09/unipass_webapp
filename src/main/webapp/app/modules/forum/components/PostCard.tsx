import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2, CornerDownRight } from 'lucide-react';
import { ICommunityPost } from 'app/shared/model/community-post.model';
import { IPostReaction } from 'app/shared/model/post-reaction.model';
import { ReactionPicker } from './ReactionPicker';
import { ReactionType } from 'app/shared/model/reaction-type.model';

import axios from 'axios';
import { useAppSelector } from 'app/config/store';

interface PostCardProps {
  post: ICommunityPost;
  reactions?: IPostReaction[];
}

export const PostCard: React.FC<PostCardProps> = ({ post, reactions }) => {
  const account = useAppSelector(state => state.authentication.account);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reactions?.length || 0);
  const [showReactions, setShowReactions] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(post.content || '');
  const [editContent, setEditContent] = useState(post.content || '');

  useEffect(() => {
    setLocalContent(post.content || '');
    setEditContent(post.content || '');
  }, [post.content]);

  const getRelativeTime = (dateString?: string | Date) => {
    if (!dateString) return '1h';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '1h';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  useEffect(() => {
    if (post.id && !reactions?.length) {
      axios.get(`/api/post-reactions?postId.equals=${post.id}`).then(res => {
        const list = res.data;
        setLikeCount(list.length);
        if (account?.login) {
          setIsLiked(list.some((r: any) => r.user?.login === account.login));
        }
      });
    }
  }, [post.id, account?.login]);

  const handleReact = async (type: ReactionType) => {
    if (isLiked) return; // Basic logic: can't react multiple times
    setIsLiked(true);
    setLikeCount(prev => prev + 1);
    try {
      await axios.post('/api/post-reactions', {
        reactionType: type,
        post: { id: post.id },
      });
    } catch (e) {
      console.error('Failed to react', e);
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            {post.author?.login?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">{post.author?.login || 'Anonymous'}</span>
              <span className="text-xs text-gray-500">{getRelativeTime(post.createdAt as any)}</span>
            </div>
            {post.category && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400">
                <CornerDownRight className="w-3 h-3" />
                {post.category.name}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-10 py-1">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 font-medium"
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        {post.title && <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>}
        {isEditing ? (
          <div className="mt-2 space-y-3">
            <div
              contentEditable
              className="w-full min-h-[100px] bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#00F5FF] text-sm text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: editContent }}
              onBlur={e => setEditContent(e.currentTarget.innerHTML)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  const oldContent = localContent;
                  // Optimistic update using local state
                  setLocalContent(editContent);
                  setIsEditing(false);

                  try {
                    await axios.patch(
                      `/api/community-posts/${post.id}`,
                      { id: post.id, content: editContent },
                      { headers: { 'Content-Type': 'application/merge-patch+json' } },
                    );
                  } catch (e) {
                    console.error('Failed to update post', e);
                    // Revert on failure
                    setLocalContent(oldContent);
                    setIsEditing(true);
                  }
                }}
                className="px-4 py-2 text-sm bg-[#00F5FF] text-gray-900 rounded-xl hover:opacity-90 transition-opacity font-bold"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-ul:my-1 prose-li:my-0"
            dangerouslySetInnerHTML={{ __html: localContent || '' }}
          />
        )}
      </div>

      <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 relative">
        <ReactionPicker isOpen={showReactions} onClose={() => setShowReactions(false)} onReact={handleReact} />
        <motion.button
          onMouseEnter={() => setShowReactions(true)}
          whileTap={{ scale: 0.8 }}
          onClick={() => handleReact(ReactionType.LIKE)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
        >
          <motion.div initial={false} animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500' : ''}`} />
          </motion.div>
          {likeCount > 0 && <span>{likeCount}</span>}
        </motion.button>

        <NavLink
          to={`/forum/post/${post.id}`}
          className="flex items-center gap-2 text-sm font-medium hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Bình luận</span>
        </NavLink>

        <button className="flex items-center gap-2 text-sm font-medium hover:text-green-500 transition-colors ml-auto">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
