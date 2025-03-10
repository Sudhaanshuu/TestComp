// VideoCall.tsx
import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

interface VideoCallProps {
  channelName: string;
  onLeave: () => void;
}

const VideoCall = ({ channelName, onLeave }: VideoCallProps) => {
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await client.join(
          import.meta.env.VITE_AGORA_APP_ID,
          channelName,
          null,
          null
        );

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
        await client.publish([audioTrack, videoTrack]);

        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setUsers(prevUsers => [...prevUsers, user]);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user) => {
          setUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        });
      } catch (error) {
        console.error('Error initializing video call:', error);
      }
    };

    init();

    return () => {
      localAudioTrack?.close();
      localVideoTrack?.close();
      client.leave();
    };
  }, [channelName]);

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleLeave = () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    client.leave();
    onLeave();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
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

      <div className="relative z-10 h-screen flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-grow">
          {localVideoTrack && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gray-800/50 rounded-xl overflow-hidden border-2 border-gray-700 backdrop-blur-sm"
            >
              <div ref={node => node && localVideoTrack.play(node)} className="w-full h-full aspect-video" />
              <div className="absolute bottom-4 left-4 text-white font-semibold bg-gray-900/50 px-3 py-1 rounded-lg">
                You {!isVideoEnabled && "(Video Off)"}
              </div>
            </motion.div>
          )}
          
          {users.map(user => (
            <motion.div
              key={user.uid}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gray-800/50 rounded-xl overflow-hidden border-2 border-gray-700 backdrop-blur-sm"
            >
              <div
                ref={node => node && user.videoTrack?.play(node)}
                className="w-full h-full aspect-video"
              />
              <div className="absolute bottom-4 left-4 text-white font-semibold bg-gray-900/50 px-3 py-1 rounded-lg">
                User {user.uid} {!user.videoTrack && "(Video Off)"}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center gap-4 pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`p-4 rounded-full ${isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} transition-all`}
          >
            {isVideoEnabled ? (
              <Video size={24} className="text-white" />
            ) : (
              <VideoOff size={24} className="text-white" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAudio}
            className={`p-4 rounded-full ${isAudioEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} transition-all`}
          >
            {isAudioEnabled ? (
              <Mic size={24} className="text-white" />
            ) : (
              <MicOff size={24} className="text-white" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLeave}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          >
            <PhoneOff size={24} className="text-white" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCall;