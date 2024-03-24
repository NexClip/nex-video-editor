import React from 'react'
import { VideoResource } from '../entity/VideoResource'
import { UploadButton } from '../shared/UploadButton'
import { useVideoEditState } from '../state'

export const VideoResourcesPanel = () => {
  const videos = useVideoEditState((i) => i.videos)
  const addVideoResource = useVideoEditState((i) => i.addVideoResource)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    addVideoResource(URL.createObjectURL(file))
  }
  return (
    <>
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold">
        Videos
      </div>
      {videos.map((video, index) => {
        return <VideoResource key={video} video={video} index={index} />
      })}
      <UploadButton
        accept="video/mp4,video/x-m4v,video/*"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-center mx-2 py-2 px-4 rounded cursor-pointer"
        onChange={handleFileChange}
      />
    </>
  )
}
