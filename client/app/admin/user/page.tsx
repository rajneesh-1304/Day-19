'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './user.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { deleteUserThunk, fetchUsersThunk } from '@/app/redux/features/users/userSlice';

const LIMIT = 5;

const AdminPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.users.currentUser);
  const {users}= useAppSelector(state => state.users);
  const loading = useAppSelector(state => state.questions.loading);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    dispatch(
      fetchUsersThunk({
        page: 1,
        limit: LIMIT,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (page === 1) return;
    if (!hasMore) return;

    dispatch(
      fetchUsersThunk({
        page,
        limit: LIMIT,
      })
    ).then((res: any) => {
      if (!res.payload || res.payload.data.length < LIMIT) {
        setHasMore(false);
      }
    });
  }, [page, dispatch, hasMore, ]);

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
    await dispatch(deleteUserThunk(id));
    await dispatch(
      fetchUsersThunk({
        page: 1,
        limit: LIMIT,
      })
    );
  };

  
  const userAll = users?.filter(
    user => (
      user.role !== 'ADMIN'
    ));

  return (
    <div className="main-container">
      <div className="container">

        <div className="top-bar">
          <h1 className="main-heading">Users</h1>

          <button className='manage' onClick={()=>router.push('/admin')}>Manage Questions</button>
        </div>
        <hr style={{marginTop:'5px'}}/>

        <div
          ref={listRef}
          className="question-list"
          onScroll={handleScroll}
          style={{ height: '600px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {userAll?.map(user => (
            <div
              className="question-row"
              key={user.id}
            >
              <div className="question-content" >
                <div><h3 className="question-title">{user.displayName}</h3>
                <h3 className="question-title">{user.email}</h3></div>
                {user.isBanned ? <button className='deleteBtn' onClick={()=> handleDelete(user.id)} >🔓 Unban</button> : <button className='deleteBtn' onClick={()=> handleDelete(user.id)} >🚫 Ban</button>}
              </div>
            </div>
          ))}

          {loading && (
            <p style={{ textAlign: 'center', padding: 12 }}>
              Loading more…
            </p>
          )}

          {!hasMore && !loading && userAll.length === 0 && (
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
