import { useVideoEditState } from '../state'

export const ExportVideoPanel = () => {
  const maxTime = useVideoEditState((i) => i.maxTime)
  const setMaxTime = useVideoEditState((i) => i.setMaxTime)
  const setVideoFormat = useVideoEditState((i) => i.setVideoFormat)
  const selectedVideoFormat = useVideoEditState((i) => i.selectedVideoFormat)
  const handleSeek = useVideoEditState((i) => i.handleSeek)
  const setSelectedElement = useVideoEditState((i) => i.setSelectedElement)
  const setPlaying = useVideoEditState((i) => i.setPlaying)
  const saveCanvasToVideoWithAudio = useVideoEditState(
    (i) => i.saveCanvasToVideoWithAudio,
  )

  return (
    <>
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold">
        Export
      </div>
      {/* Set max time from number input */}
      <div className="px-[16px]">
        <div className="flex flex-row items-center my-2">
          <div className="text-xs font-semibold mr-2">Video Length:</div>
          <input
            type="number"
            className="rounded text-center border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 max-w-[50px] mr-2"
            value={maxTime / 1000}
            onChange={(e) => {
              const value = e.target.value
              setMaxTime(Number(value) * 1000)
            }}
          />
          <div>secs</div>
        </div>
        <div className="flex flex-row items-center my-2">
          <div className="text-xs font-semibold mr-2">Canvas Resolution:</div>
          <div className="text-xs mr-2">Todo</div>
        </div>
      </div>
      {/*  Format selection with radio button */}
      <div className="px-[16px]">
        <div className="text-xs font-semibold mr-2">Video Format:</div>
        <div className="flex flex-row items-center my-2">
          <input
            type="radio"
            className="mr-2"
            name="video-format"
            value="mp4"
            checked={selectedVideoFormat === 'mp4'}
            onChange={() => {
              setVideoFormat('mp4')
            }}
          />
          <div className="text-xs mr-2">MP4</div>
          <input
            type="radio"
            className="mr-2"
            name="video-format"
            value="gif"
            checked={selectedVideoFormat === 'webm'}
            onChange={() => {
              setVideoFormat('webm')
            }}
          />
          <div className="text-xs mr-2">webm</div>
        </div>
      </div>

      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-1 rounded-lg m-4"
        onClick={() => {
          handleSeek(0)
          setSelectedElement(null)
          setTimeout(() => {
            setPlaying(true)
            saveCanvasToVideoWithAudio()
          }, 1000)
        }}
      >
        Export Video ({maxTime / 1000} secs){' '}
        {selectedVideoFormat === 'mp4' ? 'ALPHA' : ''}
      </button>
    </>
  )
}
