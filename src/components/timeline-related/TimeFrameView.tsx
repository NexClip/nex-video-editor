import type { EditorElement } from '../state'
import { useVideoEditState } from '../state'
import DragableView from './DragableView'

export const TimeFrameView = (props: { element: EditorElement }) => {
  const selectedElement = useVideoEditState((i) => i.selectedElement)
  const updateEditorElementTimeFrame = useVideoEditState(
    (i) => i.updateEditorElementTimeFrame,
  )
  const maxTime = useVideoEditState((i) => i.maxTime)
  const setSelectedElement = useVideoEditState((i) => i.setSelectedElement)

  const { element } = props
  const disabled = element.type === 'audio'
  const isSelected = selectedElement?.id === element.id
  const bgColorOnSelected = isSelected ? 'bg-slate-800' : 'bg-slate-600'
  const disabledCursor = disabled ? 'cursor-no-drop' : 'cursor-ew-resize'

  return (
    <div
      onClick={() => {
        setSelectedElement(element)
      }}
      key={element.id}
      className={`relative width-full h-[25px] my-2 ${
        isSelected ? 'border-2 border-indigo-600 bg-slate-200' : ''
      }`}
    >
      <DragableView
        className="z-10"
        value={element.timeFrame.start}
        total={maxTime}
        disabled={disabled}
        onChange={(value) => {
          updateEditorElementTimeFrame(element, {
            start: value,
          })
        }}
      >
        <div
          className={`bg-white border-2 border-blue-400 w-[10px] h-[10px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        />
      </DragableView>

      <DragableView
        className={disabled ? 'cursor-no-drop' : 'cursor-col-resize'}
        value={element.timeFrame.start}
        disabled={disabled}
        style={{
          width: `${
            ((element.timeFrame.end - element.timeFrame.start) / maxTime) * 100
          }%`,
        }}
        total={maxTime}
        onChange={(value) => {
          const { start, end } = element.timeFrame
          updateEditorElementTimeFrame(element, {
            start: value,
            end: value + (end - start),
          })
        }}
      >
        <div
          className={`${bgColorOnSelected} h-full w-full text-white text-xs min-w-[0px] px-2 leading-[25px]`}
        >
          {element.name}
        </div>
      </DragableView>
      <DragableView
        className="z-10"
        disabled={disabled}
        value={element.timeFrame.end}
        total={maxTime}
        onChange={(value) => {
          updateEditorElementTimeFrame(element, {
            end: value,
          })
        }}
      >
        <div
          className={`bg-white border-2 border-blue-400 w-[10px] h-[10px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        />
      </DragableView>
    </div>
  )
}
