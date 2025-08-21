import React, { useContext } from 'react';
import { useGameContext } from '@/context/GameContext';

const chipColors = ['blue', 'red', 'white'];

const getPrevChipStyle = (index: number) => {
  const chipImgs = [
    '/assets/gameplay/chip-blue.png',
    '/assets/gameplay/chip-red.png',
    '/assets/gameplay/chip-white.png',
  ];

  return {
    backgroundImage: `url(${chipImgs[index]})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0ch',
  };
};

export const Leaderboard: React.FC = () => {
  const { leaderboard, dailyChallengeScore } = useGameContext();
  const showScores = typeof dailyChallengeScore !== 'undefined';

  if (!leaderboard || leaderboard.length === 0) {
    return null; // Don't render anything if there's no data
  }

  return (
    <section className="bg-white p-8 max-w-[90%] mx-[5%] my-[5%] shadow-md rounded-[2rem]">
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-right items-end mb-4 text-sm text-gray-500">
        {new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="pb-2">Place</th>
            <th className="pb-2">User</th>
            {showScores && <th className="pb-2">Today's Score</th>}
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.name + index} className="hover:bg-gray-100">
              {/* Place */}
              <th scope="row" className="py-2 pr-4">
                {index < 3 ? (
                  <img
                    className="mx-auto max-h-12 max-w-12"
                    src={`/assets/gameplay/chip-${chipColors[index]}.png`}
                    alt={`#${index + 1} ${chipColors[index]} chip`}
                  />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </th>

              {/* User */}
              <td className="py-2">
                <div className="h-12 bg-white shadow-md rounded-full text-left text-navy lowercase font-bold m-1 flex items-center px-2">
                  <img
                    className={`rounded-full w-12 h-12 object-cover mr-2`}
                    src={`/assets/profile-pictures/profile-${entry.avatar}.png`}
                    alt={`${entry.name}'s avatar`}
                  />
                  <span>{entry.name}</span>

                  {/* Previous Wins */}
                  {Array.isArray(entry.wins) &&
                    entry.wins.map((count, winIndex) =>
                      count > 0 ? (
                        <span
                          key={winIndex}
                          className={`text-white font-bold max-h-8 py-2 px-3 text-sm hidden sm:inline-block ml-2`}
                          style={getPrevChipStyle(winIndex)}
                        >
                          {count.toString().padStart(2, '0')}
                        </span>
                      ) : null
                    )}
                </div>
              </td>

              {/* Score */}
              {showScores && <td className="py-2">{entry.score}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Leaderboard;