import React, { useState } from 'react';
import { Video } from 'lucide-react';
import VideoCall from './VideoCall';

function App() {
  const [roomId, setRoomId] = useState('');
  const [isInCall, setIsInCall] = useState(false);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      setIsInCall(true);
    }
  };

  if (isInCall) {
    return (
      <div className="min-h-screen bg-gray-900">
        <VideoCall channelName={roomId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Video className="text-blue-500 w-12 h-12" />
          <h1 className="text-3xl font-bold text-white ml-3">CutTuCut</h1>
        </div>
        <form onSubmit={joinRoom} className="space-y-6">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID or create new one"
              className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-blue-500 focus:bg-gray-900 focus:ring-0 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;