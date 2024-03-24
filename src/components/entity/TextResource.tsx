import { MdAdd } from 'react-icons/md'
import { useVideoEditState } from '../state'

interface TextResourceProps {
  fontSize: number
  fontWeight: number
  sampleText: string
}
export const TextResource = ({
  fontSize,
  fontWeight,
  sampleText,
}: TextResourceProps) => {
  const addText = useVideoEditState((i) => i.addText)
  return (
    <div className="items-center m-[15px] flex flex-row">
      <div
        className="flex-1 text-black px-2 py-1"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: `${fontWeight}`,
        }}
      >
        {sampleText}
      </div>
      <button
        className="h-[32px] w-[32px] hover:bg-black bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 flex items-center justify-center"
        onClick={() =>
          addText({
            text: sampleText,
            fontSize: fontSize,
            fontWeight: fontWeight,
          })
        }
      >
        <MdAdd size="25" />
      </button>
    </div>
  )
}
