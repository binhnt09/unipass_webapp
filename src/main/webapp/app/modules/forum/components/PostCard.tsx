import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2, CornerDownRight } from 'lucide-react';
import { ICommunityPost } from 'app/shared/model/community-post.model';
import { IPostReaction } from 'app/shared/model/post-reaction.model';
import { ReactionPicker } from './ReactionPicker';
import { ReactionType } from 'app/shared/model/reaction-type.model';

interface PostCardProps {
  post: ICommunityPost;
  reactions: IPostReaction[];
}

export const PostCard: React.FC<PostCardProps> = ({ post, reactions }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reactions?.length || 0);
  const [showReactions, setShowReactions] = useState(false);

  const handleReact = (type: ReactionType) => {
    setIsLiked(true);
    setLikeCount(likeCount + 1);
    console.warn('Reacted with:', type);
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
              <span className="text-xs text-gray-500">2h</span>
            </div>
            {post.category && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400">
                <CornerDownRight className="w-3 h-3" />
                {post.category.name}
              </span>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        {post.title && <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>}
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
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
