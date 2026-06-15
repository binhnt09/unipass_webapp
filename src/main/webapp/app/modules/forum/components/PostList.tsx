import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, reset } from 'app/entities/community-post/community-post.reducer';
import { PostCard } from './PostCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const PostList = () => {
  const dispatch = useAppDispatch();
  const postList = useAppSelector(state => state.communityPost.entities);
  // const loading = useAppSelector(state => state.communityPost.loading);
  // const totalItems = useAppSelector(state => state.communityPost.totalItems);
  const links = useAppSelector(state => state.communityPost.links);
  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    itemsPerPage: 10,
    sort: 'createdAt,desc',
  });

  const loadMore = () => {
    if (links.next) {
      setPaginationState({ ...paginationState, activePage: paginationState.activePage + 1 });
    }
  };

  useEffect(() => {
    dispatch(reset());
    setPaginationState({ ...paginationState, activePage: 1 });
  }, []);

  useEffect(() => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: paginationState.sort,
      }),
    );
  }, [paginationState.activePage]);

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={postList ? postList.length : 0}
        next={loadMore}
        hasMore={paginationState.activePage - 1 < links.next}
        loader={
          <div className="flex justify-center p-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        }
        endMessage={<div className="text-center p-4 text-gray-500 text-sm">Bạn đã xem hết các bài viết!</div>}
      >
        <div className="space-y-6">
          <AnimatePresence>
            {postList && postList.map((post, i) => <PostCard key={`post-${post.id}-${i}`} post={post} reactions={[]} />)}
          </AnimatePresence>
        </div>
      </InfiniteScroll>
    </div>
  );
};
