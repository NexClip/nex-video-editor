import { useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { formatTimeToMinSec } from '@utils/index'
import { useVideoEditState } from '../state'

export interface AudioResourceProps {
  audio: string
  index: number
}
export const AudioResource = ({ audio, index }: AudioResourceProps) => {
  const addAudio = useVideoEditState((i) => i.addAudio)

  const ref = useRef<HTMLAudioElement>(null)
  const [formatedAudioLength, setFormatedAudioLength] = useState('00:00')

  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative min-h-[100px]">
      <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
        {formatedAudioLength}
      </div>
      <button
        className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
        onClick={() => addAudio(index)}
      >
        <MdAdd size="25" />
      </button>
      <audio
        onLoadedData={() => {
          const audioLength = ref.current?.duration ?? 0
          setFormatedAudioLength(formatTimeToMinSec(audioLength))
        }}
        ref={ref}
        className="max-h-[100px] max-w-[150px] min-h-[50px] min-w-[100px]"
        // controls
        src={audio}
        id={`audio-${index}`}
      />
    </div>
  )
}
