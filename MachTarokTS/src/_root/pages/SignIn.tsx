import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import React, { useState } from 'react'

const SignIn = () => {
    const { isAuthenticated, account } = useUserContext();
    const avatars = Array.from({ length: 58 }, (_, index) => index + 1);
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
    const [selectedDeckIndex, setSelectedDeckIndex] = useState(null);

    const deckInfo = [ 
        { key: 1, name: 'MachTarok custom deck', link: '/assets/mach-deck-thumb/trump-i-t.png' }, 
        { key: 2, name: 'Industrie und Gluck standard deck', link: '/assets/industrie-und-gluck-deck/trump-i.jpg' }, 
        { key: 3, name: 'Berghutten mountain views deck', link: '/assets/berghutten-deck/trump-i.jpg' }
    ];

    const handleSignOut = () => {
        const url = "https://sso.smach.us/?signOut=true&redirect=https://machtarok.com/";
        window.open(url, "_blank");
    };

    const handleSignIn = () => {
        const url = "https://sso.smach.us/?redirect=https://machtarok.com/";
        window.open(url, "_blank");
    };

    const handleAvatarClick = (index) => {
        setSelectedAvatarIndex(index);
    };

    const handleDeckClick = (index) => {
        setSelectedDeckIndex(index);
    };
    
    return (
        <div className='w-full'>
            {isAuthenticated &&
                <div className='w-full h-screen pb-[90px] md:pb-0 overflow-hidden'>
                    <div className='flex flex-col justify-start h-full overflow-y-auto'>
                        <div className='header-container'>
                            <h2 className='page-header'>Welcome, {(account.user || 'Guest')}!</h2>
                        </div>
                        <div className='paragraph-container flex flex-col justify-start'>
                            <p className='paragraph'>Avatar</p>
                            <div className="avatar-container">
                                {avatars.map((avatarIndex) => (
                                    <div 
                                        key={avatarIndex}
                                        className={`avatar ${selectedAvatarIndex === avatarIndex ? 'selected-avatar' : ''}`}
                                        onClick={() => handleAvatarClick(avatarIndex)}
                                    >
                                        <img src={`https://machtarok.com/assets/profile-pictures/profile-${avatarIndex-1}.png`} alt={`Avatar ${avatarIndex}`} />
                                    </div>
                                ))}
                            </div>
                            <p className='paragraph'>Deck</p>
                            <div className="deck-container">
                                {deckInfo.map((deckIndex) => (
                                    <div 
                                        key={deckIndex.key}
                                        className={`deck ${selectedDeckIndex === deckIndex.key ? 'selected-deck' : ''}`}
                                        onClick={() => handleDeckClick(deckIndex.key)}
                                    >
                                        <div className='deck-internal'>
                                            <img src={`https://machtarok.com/${deckIndex.link}`} alt={`Deck ${deckIndex.name}`} />
                                            <p className='deck-text'>{deckIndex.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-20"></div>
                    </div>
                </div>
            }
            {isAuthenticated ||
                <div className='w-full h-screen pb-[90px] md:pb-0'>
                    <div className='paragraph-container flex flex-col justify-center h-full'>
                        <div className='header-container'>
                            <h2 className='page-header'>Sign In</h2>
                        </div>
                        <Button
                            className="flex big-play-button w-full py-8 text-xl md:text-2xl"
                            onClick={handleSignIn}
                        >
                            <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center">
                                <img
                                    src="https://sso.smach.us/favicon.ico"
                                    alt="Favicon"
                                    className="w-[16px] h-[16px]"
                                />
                            </div>
                            Log in with MachSSO
                        </Button>
                    </div>
                </div>
            }
        </div>

    )
}

export default SignIn