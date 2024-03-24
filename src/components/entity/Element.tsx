import { MdOutlineTextFields, MdMovie } from 'react-icons/md'
import type { EditorElement } from '../state'
import { useVideoEditState } from '../state'

export interface ElementProps {
  element: EditorElement
}

export const Element = (props: ElementProps) => {
  const setSelectedElement = useVideoEditState((i) => i.setSelectedElement)
  const refreshElements = useVideoEditState((i) => i.refreshElements)
  const selectedElement = useVideoEditState((i) => i.selectedElement)
  const removeEditorElement = useVideoEditState((i) => i.removeEditorElement)
  const { element } = props
  const Icon = element.type === 'video' ? MdMovie : MdOutlineTextFields
  const isSelected = selectedElement?.id === element.id
  const bgColor = isSelected ? 'rgba(0, 160, 245, 0.1)' : ''
  return (
    <div
      style={{
        backgroundColor: bgColor,
      }}
      className={`flex mx-2 my-1 py-2 px-1 flex-row justify-start items-center ${bgColor}`}
      key={element.id}
      onClick={() => {
        setSelectedElement(element)
      }}
    >
      <Icon size="20" color="gray" />
      <div className="truncate text-xs ml-2 flex-1 font-medium">
        {element.name}
      </div>
      <div>
        {element.type === 'video' ? (
          <video
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoadedData={() => {
              refreshElements()
            }}
            height={20}
            width={20}
            id={element.properties.elementId}
          />
        ) : null}
        {element.type === 'image' ? (
          <img
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoad={() => {
              refreshElements()
            }}
            height={20}
            width={20}
            id={element.properties.elementId}
          />
        ) : null}
        {element.type === 'audio' ? (
          <audio
            className="opacity-0 max-w-[20px] max-h-[20px]"
            src={element.properties.src}
            onLoadedData={() => {
              refreshElements()
            }}
            id={element.properties.elementId}
          />
        ) : null}
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white mr-2 text-xs py-0 px-1 rounded"
        onClick={(e) => {
          removeEditorElement(element.id)
          refreshElements()
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        X
      </button>
    </div>
  )
}
