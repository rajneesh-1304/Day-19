'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './delques.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchQuestionsThunk,
  deleteQuestionThunk
} from '../../redux/features/questions/questionSlice';
import { fetchTagsThunk } from '../../redux/features/tags/tagSlice';

const LIMIT = 5;

const AdminPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.users.currentUser);
  const questions = useAppSelector(state => state.questions.questions);
  const loading = useAppSelector(state => state.questions.loading);
  const searchValue = useAppSelector(state => state.search.searchValue);
  const tagAll = useAppSelector(state => state.tags.tags);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<'newest' | 'score'>('newest');

  const listRef = useRef<HTMLDivElement | null>(null);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
    setPage(1);
    setHasMore(true);
  };

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

  const handleDelete = async (id: any) => {
    if (!user) {
      router.push('/login');
      return;
    }
    await dispatch(deleteQuestionThunk(id));
    dispatch(
      fetchQuestionsThunk({
        page: 1,
        limit: LIMIT,
        search: searchValue,
        tags: selectedTags,
        sort,
      })
    );
  };

  
  const publicQuestions = questions?.filter(
    question => (
      (question.type.toLowerCase() === 'public') && (question.isDeleted === true))
    );

  return (
    <div className="main-container">
      <div className="container">

        <div className="top-bar">
          <h1 className="main-heading">Questions</h1>

          <div>
            <button className='manage' onClick={()=>router.push('user')}>Manage User</button>
          </div>
        </div>

        <div className="sub-bar">
          <div className="tabs">
            <button
              className={`tab ${sort === 'newest' ? 'active' : ''}`}
              onClick={() => setSort('newest')}
            >
              Newest
            </button>
            <button
              className={`tab ${sort === 'score' ? 'active' : ''}`}
              onClick={() => setSort('score')}
            >
              Score
            </button>
          </div>

          <div className="tag-filter-dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              Tags {selectedTags.length > 0 && `(${selectedTags.length})`} ▾
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {tagAll.map(tag => (
                  <label key={tag.id} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => toggleTag(tag.name)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>

        <div
          ref={listRef}
          className="question-listt"
          onScroll={handleScroll}
          style={{ height: '600px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {publicQuestions?.map(q => (
            <div
              className="question-roww"
              key={q.id}
            >
              <div className="question-contentt" >
                <h3 className="question-titlee">{q.title}</h3>
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
              <button className='deleteBtnn' onClick={()=> handleDelete(q.id)}>Undeleted</button>
              </div>
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

export default AdminPage;
