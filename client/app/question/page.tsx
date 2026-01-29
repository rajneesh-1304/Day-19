'use client'
import React, { useState } from 'react'
import './question.css'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../redux/hooks'
import AddQuestion from '../addquestion/AddQuestion'

const page = () => {
    const router = useRouter();
    const user=useAppSelector(state => state.users.currentUser);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAdd = () =>{
        console.log(user)
        if(!user){
            router.push('/login');
        }
        router.push('/addquestion');
    }
    return (
        <div className='main-container'>
            <div className='container'>
                <div className='heading'>
                    <h1 className='main-heading'>Newest Questions</h1>
                    <button className='button' onClick={() => setIsModalOpen(true)}>Ask Question</button>
                </div>

                <div className='question'>

                </div>
            </div>
            {isModalOpen && <AddQuestion onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}

export default page
