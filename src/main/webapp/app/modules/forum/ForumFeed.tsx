import React, { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/config/store';
import { getEntities as getCategories } from 'app/entities/post-category/post-category.reducer';
import { createEntity } from 'app/entities/community-post/community-post.reducer';
import { ForumSidebar } from './components/ForumSidebar';
import { ForumWidgets } from './components/ForumWidgets';
import { PostList } from './components/PostList';
import { CreatePostTrigger } from './components/CreatePostTrigger';
import { CreatePostModal } from './components/CreatePostModal';
import { ForumHeader } from './components/ForumHeader';

export const ForumFeed = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    dispatch(getCategories({ page: 0, size: 20, sort: 'id,asc' }));
  }, [dispatch]);

  const handleCreatePost = (title: string, content: string, categoryId?: number) => {
    dispatch(
      createEntity({
        title: title || 'Bài viết từ Cộng đồng',
        content,
        category: categoryId ? { id: categoryId } : null,
      } as any),
    ).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        setRefreshTrigger(prev => prev + 1);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090418] pt-5 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ForumHeader onCreatePost={() => setIsCreateModalOpen(true)} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mt-6">
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <ForumSidebar />
          </div>
          <div className="col-span-1 md:col-span-6 lg:col-span-6">
            <CreatePostTrigger onClick={() => setIsCreateModalOpen(true)} />
            <PostList refreshTrigger={refreshTrigger} />
          </div>
          <div className="hidden lg:block lg:col-span-3">
            <ForumWidgets />
          </div>
        </div>
      </div>
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePost} />
    </div>
  );
};
