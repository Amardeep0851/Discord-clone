import React from 'react'

interface MediaRoomProps {
  chatId:string;
  video:boolean;
  audio:boolean;
}

function MediaRoom({chatId, video, audio}:MediaRoomProps) {
  return (
    <div>MediaRoom</div>
  )
}

export default MediaRoom