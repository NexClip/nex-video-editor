import { MdPlayArrow, MdPause } from 'react-icons/md'
import { formatTimeToMinSecMili } from '@utils/index'
import { useVideoEditState } from '../state'
import { ScaleRangeInput } from './ScaleRangeInput'

const MARKINGS = [
  {
    interval: 5000,
    color: 'black',
    size: 16,
    width: 1,
  },
  {
    interval: 1000,
    color: 'black',
    size: 8,
    width: 1,
  },
]

export interface SeekPlayerProps {}

export const SeekPlayer = (_props: SeekPlayerProps) => {
  const playing = useVideoEditState((i) => i.playing)
  const currentTimeInMs = useVideoEditState((i) => i.currentTimeInMs)
  const maxTime = useVideoEditState((i) => i.maxTime)
  const setPlaying = useVideoEditState((i) => i.setPlaying)
  const handleSeek = useVideoEditState((i) => i.handleSeek)

  const Icon = playing ? MdPause : MdPlayArrow
  const formattedTime = formatTimeToMinSecMili(currentTimeInMs)
  const formattedMaxTime = formatTimeToMinSecMili(maxTime)
  return (
    <div className="seek-player flex flex-col">
      <div className="flex flex-row items-center px-2">
        <button
          className="w-[80px] rounded  px-2 py-2"
          onClick={() => {
            setPlaying(!playing)
          }}
        >
          <Icon size="40" />
        </button>
        <span className="font-mono">{formattedTime}</span>
        <div className="w-[1px] h-[25px] bg-slate-300 mx-[10px]" />
        <span className="font-mono">{formattedMaxTime}</span>
      </div>
      <ScaleRangeInput
        max={maxTime}
        value={currentTimeInMs}
        onChange={(value) => {
          handleSeek(value)
        }}
        height={30}
        markings={MARKINGS}
        backgroundColor="white"
      />
    </div>
  )
}
