'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [searchText, setSearchText] = useState('');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await fetch('/api/prompt');
        const data = await response.json();
        setPosts(data);
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        const regex = new RegExp(e.target.value, 'gi');

        const filtered = posts.filter(post =>
            regex.test(post.prompt) ||
            regex.test(post.tag) ||
            regex.test(post.creator.username)
        );

        setFilteredPosts(filtered);
    };

    const handleTagClick = (post) => {
        setSearchText(post.tag)
        const regex = new RegExp(post.tag, 'gi');

        const filtered = posts.filter(post =>
            regex.test(post.prompt) ||
            regex.test(post.tag) ||
            regex.test(post.creator.username)
        );

        setFilteredPosts(filtered);
    }

    return (
        <section className='feed'>
            <form className='relative w-full flex-center'>
                <input
                    type="text"
                    placeholder="Search for a tag or a user name"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer'
                />
            </form>

            {searchText === '' ? (<PromptCardList
                data={posts}
                handleTagClick={handleTagClick}
            />)

                : (<PromptCardList
                    data={filteredPosts}
                    handleTagClick={handleTagClick}
                />)}
        </section>
    )
}

export default Feed