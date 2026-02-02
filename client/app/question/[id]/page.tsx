'use client';

import { getQuestionById } from '@/app/redux/features/questions/questionSlice';
import {
    createAnswerThunk,
    fetchAnswersThunk,
} from '@/app/redux/features/answers/answerSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { Box, Button, Snackbar } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import './questions.css';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    RichTextEditorRef,
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import AnswerItem from '@/components/Answer/AnswerItem';
import { useRouter } from 'next/navigation';
import UpdateQuesion from '@/app/updateQuestion/UpdateQuestion';

const stripHtml = (html: string) =>
    html ? html.replace(/<[^>]*>/g, '').trim() : '';

const answerSchema = z.object({
    answer: z
        .string()
        .refine(v => stripHtml(v).length >= 50, 'Answer must be at least 50 characters')
        .refine(v => stripHtml(v).length <= 2000, 'Answer must be at most 2000 characters'),
});

type AnswerFormData = z.infer<typeof answerSchema>;

const Page = () => {
    const params = useParams();
    const questionId = Number(params.id);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const question = useAppSelector(s => s.questions.currentQuestion);
    const answers = useAppSelector(s => s.answers.answers);
    const error = useAppSelector(s => s.answers.error);
    const user = useAppSelector(s => s.users.currentUser);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const rteRef = useRef<RichTextEditorRef>(null);

    useEffect(() => {
        if (!questionId) return;
        dispatch(getQuestionById(questionId));
        dispatch(fetchAnswersThunk(questionId));
    }, [questionId, dispatch]);

    const { handleSubmit, control, reset } = useForm<AnswerFormData>({
        resolver: zodResolver(answerSchema),
        defaultValues: { answer: '' },
    });

    const onSubmit = async (data: AnswerFormData) => {
        if (!user || !question) return;

        try {
            await dispatch(
                createAnswerThunk({
                    content: data.answer,
                    questionId: question.id,
                    userId: user.id,
                })
            ).unwrap();

            reset();
            dispatch(fetchAnswersThunk(questionId));
            setSnackbarMessage('Answer added successfully!');
        } catch {
            setSnackbarMessage(error || 'Error adding answer');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleUpdateQuestion = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsModalOpen(true);
    }

    return (
        <div className="main-container">
            <div className="container">
                <div className="heading">
                    <h1 className="main-heading">Question</h1>
                </div>

                <Box sx={{ p: 2, mb: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                    <h3 className='quesHeading'>{question?.title}</h3>
                    <div className='quesDescription' dangerouslySetInnerHTML={{ __html: question?.description || '' }} />
                    <p className='quesAuthor'><strong>Author:</strong> {question?.user?.displayName}</p>
                    <p className='quesTag'><strong>Tags:</strong> {question?.tags?.map(t => t.name).join(', ')}</p>
                    <button className='updateBtn' onClick={() => { handleUpdateQuestion(question.id) }}>Update</button>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="answer"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {
                            const len = stripHtml(value).length;

                            return (
                                <>
                                    <RichTextEditor
                                        ref={rteRef}
                                        immediatelyRender={false}
                                        extensions={[StarterKit]}
                                        content={value || '<p></p>'}
                                        onUpdate={({ editor }) => onChange(editor.getHTML())}
                                        renderControls={() => (
                                            <MenuControlsContainer>
                                                <MenuSelectHeading />
                                                <MenuDivider />
                                                <MenuButtonBold />
                                                <MenuButtonItalic />
                                            </MenuControlsContainer>
                                        )}
                                        sx={{
                                            mt: 2,
                                            border: error ? '1px solid red' : undefined,
                                        }}
                                    />

                                    <p style={{ fontSize: 12, color: error ? '#d32f2f' : '#6b7280' }}>
                                        {error?.message ?? `${len}/2000 characters`}
                                    </p>
                                </>
                            );
                        }}
                    />

                    <Button sx={{ mt: 2 }} type="submit" variant="contained">
                        Post Answer
                    </Button>
                </form>

                <Box sx={{ mt: 3 }}>
                    {answers?.length ? (
                        answers.map((answer: any) => (
                            <AnswerItem key={answer.id} answer={answer} />
                        ))
                    ) : (
                        <p>No answers yet</p>
                    )}
                </Box>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                message={snackbarMessage}
            />

            {isModalOpen && <UpdateQuesion id={question.id} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Page;
