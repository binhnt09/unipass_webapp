import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PostCard } from './components/PostCard';
import { CommentSection } from './components/CommentSection';
import { ICommunityPost } from 'app/shared/model/community-post.model';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<ICommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch post details (mocking for now, could be real API)
    const fetchPost = async () => {
      try {
        const result = await axios.get(`/api/community-posts/${id}`);
        setPost(result.data);
      } catch (e) {
        console.error(e);
        // Fallback mock
        setPost({
          id: Number(id),
          title: 'Làm sao để pass Đồ án Web?',
          content: 'Mọi người cho em xin kinh nghiệm với ạ.',
          author: { login: 'student123' },
        } as any);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen pt-24 text-center">Không tìm thấy bài viết</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090418] pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Forum
        </button>

        <PostCard post={post} reactions={[]} />
        <CommentSection postId={id} comments={[]} />
      </div>
    </div>
  );
};
