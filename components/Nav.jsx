"use client"

import Link from "next/link"; //allow us to move to the other pages of our application
import Image from "next/image"; //automatically optimize the images for us
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
    const { data: session } = useSession();//从 useSession 钩子中解构出 data 属性，并重命名为 session
    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await getProviders();
                setProviders(response);
            }
            catch (error) {
                console.error('Error fetching providers:', error);
            }
        }
        fetchProviders();
    }, [])

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            {/*显示左边的橙色logo和Promptopia*/}
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    src="/assets/images/logo.svg"
                    alt="Promptopia Logo"
                    width={30}
                    height={30}
                    className="object-contain"
                />
                <p className="logo_text">Promptopia</p>
            </Link>

            {/* Desktop Navigtaion */}
            <div className="sm:flex hidden">
                {session?.user
                    ? (
                        <div className="flex gap-3 md:gap-5">

                            <Link href="/create-prompt" className="black_btn">
                                Create Post
                            </Link>

                            <button type="button" onClick={signOut} className="outline_btn">
                                Sign Out
                            </button>

                            <Link href="/profile">
                                <Image
                                    src={session?.user.image}
                                    width={37}
                                    height={37}
                                    className="rounded-full"
                                    alt="profile"
                                />
                            </Link>

                            {/*我加的代码 - start*/}
                            <p>
                                Welcome, {session.user.name}
                            </p>
                            {/*我加的代码 - end*/}

                        </div>)

                    : (<>
                        {providers &&
                            Object.values(providers).map((element) =>
                            (<button
                                type="button"
                                key={element.name}
                                onClick={() => signIn(element.id)}
                                className="black_btn">
                                Sign In with {element.id}
                            </button>
                            ))}
                    </>
                    )}
            </div>

            {/* Mobile Navigtaion */}
            <div className="sm:hidden flex relative">
                {session?.user ? (
                    <div className="flex">
                        <Image
                            src={session?.user.image}
                            width={37}
                            height={37}
                            className="rounded-full"
                            alt="profile"
                            onClick={() => setToggleDropdown((prev) => !prev)}
                        />

                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link
                                    href="/profile"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    href="/create-prompt"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    Create Prompt
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToggleDropdown(false);
                                        signOut();
                                    }}
                                    className="mt-5 w-full black_btn">
                                    Sign Out
                                </button>

                            </div>
                        )}
                    </div>
                ) : (<>
                    {providers &&
                        Object.values(providers).map((provider) =>
                        (<button
                            type="button"
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="black_btn">
                            Sign In
                        </button>
                        ))}
                </>
                )}
            </div>

        </nav>
    )
}

export default Nav