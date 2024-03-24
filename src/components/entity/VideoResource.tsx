import { useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { formatTimeToMinSec } from '@utils/index'
import { useVideoEditState } from '../state'

interface VideoResourceProps {
  video: string
  index: number
}
export const VideoResource = ({ video, index }: VideoResourceProps) => {
  const addVideo = useVideoEditState((i) => i.addVideo)

  const ref = useRef<HTMLVideoElement>(null)
  const [formatedVideoLength, setFormatedVideoLength] = useState('00:00')

  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">
      <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
        {formatedVideoLength}
      </div>
      <button
        className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
        onClick={() => {
          addVideo(index)
        }}
      >
        <MdAdd size="25" />
      </button>
      <video
        onLoadedData={() => {
          const videoLength = ref.current?.duration ?? 0
          setFormatedVideoLength(formatTimeToMinSec(videoLength))
        }}
        ref={ref}
        className="max-h-[100px] max-w-[150px]"
        src={video}
        height={200}
        width={200}
        id={`video-${index}`}
      />
    </div>
  )
}
