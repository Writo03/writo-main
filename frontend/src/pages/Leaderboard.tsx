import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Adjust based on your project structure

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: string;
}

const Leaderboard = () => {
  const location = useLocation();
  const userScore = location.state?.scorePercentage || 0;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { quizId } = useParams<{ quizId: string }>();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axiosInstance.get(`/result/get-leaderboard/${quizId}`);
        const data = response.data.data;
        console.log(data)

        // Map leaderboard data to the required format
        const formattedLeaderboard = data.leaderboard.map((entry: any, index: number) => ({
          rank: index + 1,
          name: entry.student.fullName,
          score: entry.score,
          time: `${Math.floor(entry.timeTaken / 60)}:${(entry.timeTaken % 60).toString().padStart(2, '0')}`,
        }));

        setLeaderboard(formattedLeaderboard);
        setUserRank(data.studentRank + 1); // Add 1 for 0-based index
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

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
              <p className="text-4xl font-bold text-indigo-600">
                {userRank ? `#${userRank}` : 'N/A'}
              </p>
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
              {leaderboard.slice(0, 3).map((entry, index) => (
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
                  <p className="text-gray-600">{entry.score}</p>
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
                  {leaderboard.map((entry, index) => (
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
                        <span className="text-sm text-gray-900">{entry.score}</span>
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
