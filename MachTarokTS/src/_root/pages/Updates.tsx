import React from 'react'

const Updates = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">News and Updates</h2>
                <div className='flex flex-col gap-2 items-start justify-center'>
                    <div className="block">
                        <h3 className='h3'>April 2024</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Added two new decks to choose from in the User Preferences page</li>
                            <li>Added 31 avatars, which are currently visible in your nav bar but will soon be visible to everyone</li>
                            <li>Finished initial work on the Users Preference page, including the ability to turn off the chat and edit room settings</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>March 2024</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Added the Daily Challenge, accessible to all players who are signed</li>
                            <li>Click on "Daily" from the main page and play the same hand as everyone else to see who can do best each day</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>October 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Added updates page (Hi!)</li>
                            <li>Revamped the Room Entry page to include more information, join codes, and an invite screen</li>
                            <li>Added join codes</li>
                            <li>Added a chat box (sign in to send chat messages!)</li>
                            <li>Made the main game mobile friendly by fixing table overflow issues and resizing the hand and chat</li>
                            <li>Revamped the layout of the hand, chat, table, round info, and just about everything in-game</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>September 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Revamped custom room options to include weighted hand generation</li>
                            <li>To try it out, click "Custom Room" then drag that bar all the way up, click the generate button, and enjoy!</li>
                            <li>Bug fixes including server crash, point miscalculation, and glitched text</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>July 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Added return to game, an option to easily continue a game after leaving without losing your progress</li>
                            <li>Revamped the discard system to make it easy to see which cards you drew</li>
                            <li>Added settings saves, so you can easily reuse settings (Sign in to test it out!)</li>
                            <li>Created deep learning hooks so AI can start learning soon (hopefully!)</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>June 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Added a database, to store player information like default settings and ELO rating</li>
                            <li>Created a donation page (Be sure to check it out)</li>
                            <li>Some bug fixes for passing the talon cards</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>May 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Created a fullscreen mode, accessible by click the fullscreen button from the navigation bar</li>
                            <li>Revamped the table</li>
                            <li>Made the bots much better</li>
                            <li>Fixed many, many server crash bugs</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>April 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Completed a ton of work on Artificial Intelligence bots (coming soon, hopefully!)</li>
                            <li>Added the audience, which you can join by right-clicking on a room!</li>
                            <li>Made the bots much better</li>
                            <li>Fixed many, many server crash bugs</li>
                            <li>Created Taroky Notation, a simple way to replay games whenever you want</li>
                            <li>Began work on AI, which will (hopefully) be usable soon</li>
                            <li>Completed a ton of back-end work, including log files, server infrastructure, and, again, fixing server crashes</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>March 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Made the table actually usable (You should've seen the old design! Good luck knowing who played what)</li>
                            <li>Finished game play, including prever talon, 12s choice, and playing cards</li>
                            <li>Added auto-reconnect, in case you press reload during a game or get disconnected</li>
                            <li>Made the room cards look decent (The old ones were... something you didn't want to see)</li>
                            <li>More bug fixes than can be counted, from paying 1/3rd of a chip, to server crashes, to text glitching, to disappearing cards, to missing information, to more server crashes</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>July 2022 - Febuary 2023</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Created the original version of MachTarok on July 15, 2022</li>
                            <li>Created nearly everything you have come to know and love, one step at a time</li>
                        </ul>
                    </div>
                    <div className="block">
                        <h3 className='h3'>Planned Updates</h3>
                        <ul className="bullet-list list-inside pl-4">
                            <li>Artificial Intelligence players</li>
                            <li>Mobile-friendly hand and chat design</li>
                            <li>User preferences and spelling variations</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <br />
                    <br />
                    <div className='text-sm'>
                        <p>
                            <span>Don't see an update you want added? Email us at </span>
                            <span><a href="mailto:webmaster@smach.us" target='_blank' className='red-link'>webmaster@smach.us </a>or add an issue on <a href="https://github.com/coder0987/Taroky/issues" target='_blank' className='red-link'>GitHub </a></span>
                        </p>
                        <br />
                        <p>
                            <span>For a full list of changes, view the <a href="https://github.com/coder0987/Taroky/commits/master" target='_blank' className='red-link'>GitHub changelog</a></span>
                        </p>
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Updates