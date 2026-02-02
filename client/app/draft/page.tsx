'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './draft.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchQuestionsThunk,
  upvoteQuestionThunk,
  downvoteQuestionThunk,
  publishQuestion
} from '../redux/features/questions/questionSlice';
import AddQuestion from '../addquestion/AddQuestion';
import { fetchTagsThunk } from '../redux/features/tags/tagSlice';
import UpdateQuesion from '../updateQuestion/UpdateQuestion';

const LIMIT = 5;

const DraftPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.users.currentUser);
  const questions = useAppSelector(state => state.questions.questions);
  const loading = useAppSelector(state => state.questions.loading);
  const searchValue = useAppSelector(state => state.search.searchValue);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<'newest' | 'score'>('newest');

  const listRef = useRef<HTMLDivElement | null>(null);
  const fetchTags = async () => {
    await dispatch(fetchTagsThunk());
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    dispatch(
      fetchQuestionsThunk({
        page: 1,
        limit: LIMIT,
        search: searchValue,
        tags: selectedTags,
        sort,
      })
    );
  }, [dispatch, searchValue, selectedTags, sort]);

  useEffect(() => {
    if (page === 1) return;
    if (!hasMore) return;

    dispatch(
      fetchQuestionsThunk({
        page,
        limit: LIMIT,
        search: searchValue,
        tags: selectedTags,
        sort,
      })
    ).then((res: any) => {
      if (!res.payload || res.payload.data.length < LIMIT) {
        setHasMore(false);
      }
    });
  }, [page, dispatch, searchValue, hasMore, selectedTags, sort]);

  const handleScroll = useCallback(() => {
    if (!listRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const handleUpdateQuestion = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsModalOpen(true);
    }


  const handlePublish = async (id) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const userId=user.id;
    await dispatch(publishQuestion({id, userId}));
    dispatch(
      fetchQuestionsThunk({
        page: 1,
        limit: LIMIT,
        search: searchValue,
        tags: selectedTags,
        sort,
      }))
  };

  const publicQuestions = questions?.filter(
    q => q.type.toLowerCase() === 'draft'
  );

  return (
    <div className="main-container">
      <div className="container">

        <div className="top-bar">
          <h1 className="main-heading">Draft Questions</h1>
        </div>

        <div
          ref={listRef}
          className="question-list"
          onScroll={handleScroll}
          style={{ height: '600px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {publicQuestions?.map(q => (
            <div
              className="question-row"
              key={q.id}
            >
              <div className="question-content" onClick={() => router.push(`/question/${q.id}`)}>
                <h3 className="question-title">{q.title}</h3>
                <div
                  className="question-desc"
                  dangerouslySetInnerHTML={{ __html: q.description }}
                />

                <div className="question-footer">
                  <div className="tags">
                    {q.tags.map(tag => (
                      <span key={tag.id} className="tag">{tag.name}</span>
                    ))}
                  </div>
                  <div className="author">
                    asked by <strong>{q.user.displayName}</strong>
                  </div>
                </div>
              </div>
              <div><button className='publish' onClick={()=> handlePublish(q.id)}>Publish </button><button className='publish' style={{marginLeft:"5px"}} onClick={() => { handleUpdateQuestion(q.id) }}>Update</button></div>
              {isModalOpen && <UpdateQuesion id={q.id} onClose={() => setIsModalOpen(false)} />}
            </div>
          ))}

          {loading && (
            <p style={{ textAlign: 'center', padding: 12 }}>
              Loading more…
            </p>
          )}

          {!hasMore && !loading && publicQuestions.length === 0 && (
            <p style={{ textAlign: 'center', padding: 12 }}>
              No questions found.
            </p>
          )}
        </div>
      </div>

      
    </div >
  );
};

export default DraftPage;
