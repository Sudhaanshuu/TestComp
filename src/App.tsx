// App.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {isInCall ? (
        <VideoCall 
          channelName={roomId} 
          onLeave={() => {
            setIsInCall(false);
            setRoomId('');
          }} 
        />
      ) : (
        <div className="relative min-h-screen flex items-center justify-center">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-red-600/20 via-pink-500/20 to-orange-500/20"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                  ],
                  scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 1, Math.random() * 0.5 + 0.5],
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  filter: 'blur(40px)',
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-center mb-8 gap-3">
              <Video className="text-red-500 w-12 h-12" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                HealthConnect
              </h1>
            </div>
            <form onSubmit={joinRoom} className="space-y-6">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Session ID
                </label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter your unique session ID"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg transition-all hover:opacity-90"
              >
                Start Consultation
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;