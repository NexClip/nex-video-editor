import { useVideoEditState } from './state'
import { SeekPlayer } from './timeline-related/SeekPlayer'
import { TimeFrameView } from './timeline-related/TimeFrameView'

export const TimeLine = () => {
  const currentTimeInMs = useVideoEditState((i) => i.currentTimeInMs)
  const maxTime = useVideoEditState((i) => i.maxTime)
  const editorElements = useVideoEditState((i) => i.editorElements)
  const percentOfCurrentTime = (currentTimeInMs / maxTime) * 100
  return (
    <div className="flex flex-col">
      <SeekPlayer />
      <div className="flex-1 relative ">
        {editorElements.map((element) => {
          return <TimeFrameView key={element.id} element={element} />
        })}
        <div
          className="w-[2px] bg-red-400 absolute top-0 bottom-0 z-20"
          style={{
            left: `${percentOfCurrentTime}%`,
          }}
        />
      </div>
    </div>
  )
}
