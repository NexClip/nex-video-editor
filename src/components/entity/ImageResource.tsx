import { useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useVideoEditState } from '../state'

interface ImageResourceProps {
  image: string
  index: number
}
export const ImageResource = ({ image, index }: ImageResourceProps) => {
  const addImage = useVideoEditState((i) => i.addImage)

  const ref = useRef<HTMLImageElement>(null)
  const [resolution, setResolution] = useState({ w: 0, h: 0 })

  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">
      <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
        {resolution.w}x{resolution.h}
      </div>
      <button
        className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
        onClick={() => addImage(index)}
      >
        <MdAdd size="25" />
      </button>
      <img
        onLoad={() => {
          setResolution({
            w: ref.current?.naturalWidth ?? 0,
            h: ref.current?.naturalHeight ?? 0,
          })
        }}
        ref={ref}
        className="max-h-[100px] max-w-[150px]"
        src={image}
        height={200}
        width={200}
        id={`image-${index}`}
      />
    </div>
  )
}
