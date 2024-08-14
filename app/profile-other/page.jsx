'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [posts, setPosts] = useState([]);

    const creatorId = searchParams.get('id');
    const creatorName = searchParams.get('name');

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${creatorId}/posts`);
            const data = await response.json();
            setPosts(data);
        }

        if (creatorId) fetchPosts();
    }, [])

    return (
        session?.user && session?.user.name.replace(" ", "").toLowerCase() === creatorName ? (
            router.push(`/profile`)
        )
            : (
                <Profile
                    name={creatorName}
                    desc=""
                    data={posts}
                    handleEdit={() => { }}
                    handleDelete={() => { }}
                />
            )
    )
}

export default UserProfile;