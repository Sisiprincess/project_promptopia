'use client';

import { useState } from 'react'
import { useSession } from 'next-auth/react'; //让我们知道哪个user是logged in的
import { useRouter } from 'next/navigation';//默认是next/router，我按照练习改成了navigation
import Form from '@components/Form';

const CreatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    })

    const createPrompt = async (e) => {
        e.preventDefault();//to prevent defautl behavior of the browser when submitting a form which is to do a reload
        setSubmitting(true);//we can use as a sort of loader later on
        try {
            const response = await fetch('/api/prompt/new',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        prompt: post.prompt,
                        userId: session?.user.id,
                        tag: post.tag,
                    })
                })
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form
            type="Create"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPrompt}
        />
    )
}

export default CreatePrompt