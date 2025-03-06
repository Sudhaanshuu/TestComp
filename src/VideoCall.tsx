import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import { Video, Mic, MicOff, VideoOff } from 'lucide-react';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

interface VideoCallProps {
  channelName: string;
}

const VideoCall = ({ channelName }: VideoCallProps) => {
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
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="relative h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {localVideoTrack && (
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <div ref={node => node && localVideoTrack.play(node)} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 text-white font-semibold">You</div>
          </div>
        )}
        {users.map(user => (
          <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <div
              ref={node => node && user.videoTrack?.play(node)}
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 text-white font-semibold">
              User {user.uid}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleVideo}
          className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          onClick={toggleAudio}
          className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;