'use client';

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfileContent = () => {
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
    }, [creatorId]);

    if (!creatorId || !creatorName) {
        return <div>Loading...</div>;
    }

    if (session?.user && session?.user.name.replace(" ", "").toLowerCase() === creatorName) {
        router.push(`/profile`);
        return null; // Prevent rendering anything if redirecting
    }

    return (
        <Profile
            name={creatorName}
            desc=""
            data={posts}
            handleEdit={() => { }}
            handleDelete={() => { }}
        />
    );
};

const UserProfile = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserProfileContent />
        </Suspense>
    );
};

export default UserProfile;