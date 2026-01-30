'use client'
import { getQuestionById } from '@/app/redux/features/questions/questionSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { Box, Button, Snackbar } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useActionState, useEffect, useRef, useState } from 'react'
import './question.css'
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { MenuButtonBold, MenuButtonItalic, MenuControlsContainer, MenuDivider, MenuSelectHeading, RichTextEditor, RichTextEditorRef } from 'mui-tiptap';
import { createAnswerThunk, fetchAnswerThunk, getAnswerById } from '@/app/redux/features/answers/answerSlice';
import StarterKit from '@tiptap/starter-kit';
import TextEditor from '@/app/addquestion/tiptap';

const answerSchema = z.object({
    answer: z.string().trim().min(50, "Answer must be at least 50 characters").max(2000, "Answer must be at least 2000 characters"),
});
type AnswerFormData = z.infer<typeof answerSchema>;

const page = () => {
    const id = useParams();
    const newId = id.id;
    const dispatch = useAppDispatch();
    const question = useAppSelector(state => state.questions.currentQuestion);
    const err = useAppSelector(state => state.answers.error);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const fetchData = async (id: any) => {
        await dispatch(getQuestionById(id));
    }

    const user = useSelector((state: RootState
    ) => state.users.currentUser);

    const answers = useSelector((state: RootState
    ) => state.answers.answers);

    const rteRef = useRef<RichTextEditorRef>(null);

    const fetchAnswers = async (id: any) => {
        await dispatch(getAnswerById(id));
    }

    useEffect(() => {
        fetchData(newId);
        fetchAnswers(newId);
    }, [])

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<AnswerFormData>({
        resolver: zodResolver(answerSchema),
        defaultValues: { answer: "" },
    });

    const onSubmit = async (data: AnswerFormData) => {
        if (!user) return;

        const payload = {
            answer: data.answer,
            userId: user.id,
            questionId: question?.id,
        };

        try {
            await dispatch(createAnswerThunk(payload)).unwrap();
            setSnackbarMessage("Answer added successfully!");
            setSnackbarOpen(true);
            reset();
        } catch (error: any) {
            setSnackbarMessage(err || "Error in adding Answer");
            setSnackbarOpen(true);
        }
    };


    return (
        <div className='main-container'>
            <div className='container'>
                <div className='heading'>
                    <h1 className='main-heading'>Question {id.id}</h1>
                    {/* <button className='button' onClick={handleAdd}>Ask Question</button> */}
                </div>

                <div className='question-list'>
                    <div>
                        <Box className='question-item' sx={{ p: 2, mb: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                            <h3>{question?.title}</h3>
                            <div dangerouslySetInnerHTML={{ __html: question?.description }} />
                            {/* <p>{question?.description}</p> */}
                            <p>
                                <strong>Author:</strong> {question?.user?.displayName}
                            </p>
                            <p>
                                <strong>Tags:</strong> {question?.tags?.map(tag => tag.name).join(', ')}
                            </p>
                        </Box>

                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: 1030, gap: 1 }}>


                                    <Controller
                                        name="answer"
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <RichTextEditor
                                                sx={{
                                                    mt: 2,
                                                    mb: 2,
                                                    border: error ? "1px solid red" : "inherit"
                                                }}
                                                immediatelyRender={false}
                                                extensions={[StarterKit]}
                                                content={value || "<p></p>"}
                                                onUpdate={({ editor }) => onChange(editor.getHTML())}
                                                renderControls={() => (
                                                    <MenuControlsContainer>
                                                        <MenuSelectHeading />
                                                        <MenuDivider />
                                                        <MenuButtonBold />
                                                        <MenuButtonItalic />
                                                    </MenuControlsContainer>
                                                )}
                                            />
                                        )}
                                    />

                                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                        <Button variant="contained" type="submit" sx={{ flex: 1 }}>
                                            Reply
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </div>

                        <div className='question-list' style={{ marginTop: "15px" }}>
                            {answers && answers.length > 0 ? (
                                answers.map(q => (
                                    <Box key={q.id} className='question-item' sx={{ p: 2, mb: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                                        <div dangerouslySetInnerHTML={{ __html: q?.answer }} />
                                       
                                        <p>
                                            {/* <strong>Author:</strong> {q.user.displayName} */}
                                        </p>
                                        <p>
                                            {/* <strong>Tags:</strong> {q.tags.map(tag => tag.name).join(', ')} */}
                                        </p>
                                    </Box>
                                ))
                            ) : (
                                <p>No Answers available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                message={snackbarMessage}
            />
        </div>
    )
}

export default page
