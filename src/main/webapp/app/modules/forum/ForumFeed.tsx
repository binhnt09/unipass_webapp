import React, { useState } from 'react';
import { ForumSidebar } from './components/ForumSidebar';
import { ForumWidgets } from './components/ForumWidgets';
import { PostList } from './components/PostList';
import { CreatePostTrigger } from './components/CreatePostTrigger';
import { CreatePostModal } from './components/CreatePostModal';

export const ForumFeed = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePost = (title: string, content: string) => {
    // TODO: dispatch action to create post
    console.warn('Create post:', { title, content });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090418] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <ForumSidebar />
          </div>
          <div className="col-span-1 md:col-span-6 lg:col-span-6">
            <CreatePostTrigger onClick={() => setIsCreateModalOpen(true)} />
            <PostList />
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
