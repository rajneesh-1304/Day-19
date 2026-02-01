'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  upvoteAnswerThunk,
  downvoteAnswerThunk,
  replyAnswerThunk,
  fetchRepliesThunk,
} from '@/app/redux/features/answers/answerSlice';

interface AnswerItemProps {
  answer: any;
  level?: number;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, level = 0 }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.users.currentUser);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Fetch replies when component mounts
  useEffect(() => {
    if (!answer.replies || answer.replies.length === 0) {
      dispatch(fetchRepliesThunk(answer.id));
    }
  }, [answer.id, dispatch]);

  const handleReplySubmit = async () => {
    if (!user || !replyText.trim()) return;

    await dispatch(
      replyAnswerThunk({
        answerId: answer.id,
        payload: { answer: replyText, userId: user.id },
      })
    );

    setReplyText('');
    setShowReply(false);

    // Refetch replies after posting
    dispatch(fetchRepliesThunk(answer.id));
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        border: '1px solid #dcdcdc',
        borderRadius: 2,
        ml: level * 4,
        backgroundColor: '#fff',
      }}
    >
      {/* Answer content */}
      <div dangerouslySetInnerHTML={{ __html: answer.content }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Button size="small" onClick={() => dispatch(upvoteAnswerThunk(answer.id))}>
          ▲
        </Button>
        <span>{answer.score || 0}</span>
        <Button size="small" onClick={() => dispatch(downvoteAnswerThunk(answer.id))}>
          ▼
        </Button>
        <Button size="small" onClick={() => setShowReply(!showReply)}>Reply</Button>
      </Box>

      {/* Reply box */}
      {showReply && (
        <Box sx={{ mt: 1 }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write your reply…"
            style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={handleReplySubmit}>
            Submit Reply
          </Button>
        </Box>
      )}

      {/* Nested replies */}
      {answer.replies && answer.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 1 }} />
          {answer.replies.map((reply: any) => (
            <AnswerItem key={reply.id} answer={reply} level={level + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AnswerItem;
