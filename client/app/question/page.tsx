'use client'
import React, { useEffect, useState } from 'react'
import './question.css'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import AddQuestion from '../addquestion/AddQuestion'
import { fetchQuestionsThunk } from '../redux/features/questions/questionSlice'
import { Box, Button, Stack } from '@mui/material'

const QuestionsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.users.currentUser);
    const questions = useAppSelector(state => state.questions.questions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;

    useEffect(() => {
        dispatch(fetchQuestionsThunk());
    }, [dispatch]);

    const handleAdd = () => {
        if(!user){
            router.push('/login');
            return;
        }
        setIsModalOpen(true);
    }

    const publicQuestions = questions?.filter(q => q.type.toLowerCase() === 'public');

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = publicQuestions?.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil((publicQuestions?.length || 0) / questionsPerPage);

    const handleNext = () => {
        if(currentPage < totalPages) setCurrentPage(prev => prev + 1);
    }

    const handlePrev = () => {
        if(currentPage > 1) setCurrentPage(prev => prev - 1);
    }

    return (
        <div className='main-container'>
            <div className='container'>
                <div className='heading'>
                    <h1 className='main-heading'>Newest Questions</h1>
                    <button className='button' onClick={handleAdd}>Ask Question</button>
                </div>

                <div className='question-list'>
                    {currentQuestions && currentQuestions.length > 0 ? (
                        currentQuestions.map(q => (
                           <div onClick={()=>router.push(`/question/${q.id}`)}>
                             <Box key={q.id} className='question-item' sx={{ p: 2, mb: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                                <h3>{q.title}</h3>
                                <div dangerouslySetInnerHTML={{ __html: q?.description }} />
                                {/* <p>{q.description}</p> */}
                                <p>
                                    <strong>Author:</strong> {q.user.displayName}
                                </p>
                                <p>
                                    <strong>Tags:</strong> {q.tags.map(tag => tag.name).join(', ')}
                                </p>
                            </Box>
                           </div>
                        ))
                    ) : (
                        <p>No public questions available</p>
                    )}
                </div>

                {publicQuestions && publicQuestions.length > questionsPerPage && (
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <Button variant="outlined" onClick={handleNext} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </Stack>
                )}
            </div>

            {isModalOpen && <AddQuestion onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}

export default QuestionsPage
