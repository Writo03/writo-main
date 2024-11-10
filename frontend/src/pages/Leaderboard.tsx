import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya Sharma', score: 95, time: '25:30' },
  { rank: 2, name: 'Rahul Kumar', score: 92, time: '27:15' },
  { rank: 3, name: 'Amit Patel', score: 88, time: '28:45' },
  { rank: 4, name: 'Sneha Gupta', score: 85, time: '29:20' },
  { rank: 5, name: 'Raj Malhotra', score: 82, time: '26:10' },
];

const Leaderboard = () => {
  const location = useLocation();
  const userScore = location.state?.score || 0;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Your Result</h2>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <p className="text-gray-600">Score</p>
              <p className="text-4xl font-bold text-indigo-600">{userScore}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Rank</p>
              <p className="text-4xl font-bold text-indigo-600">#4</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              Leaderboard
            </h1>
          </div>

          <div className="p-6">
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {mockLeaderboard.slice(0, 3).map((entry, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg ${
                    index === 0
                      ? 'bg-yellow-50'
                      : index === 1
                      ? 'bg-gray-50'
                      : 'bg-orange-50'
                  }`}
                >
                  {index === 0 ? (
                    <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-8 w-8 mx-auto text-gray-500" />
                  ) : (
                    <Award className="h-8 w-8 mx-auto text-orange-500" />
                  )}
                  <p className="font-semibold mt-2">{entry.name}</p>
                  <p className="text-gray-600">{entry.score}%</p>
                </div>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockLeaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{entry.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {entry.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{entry.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;