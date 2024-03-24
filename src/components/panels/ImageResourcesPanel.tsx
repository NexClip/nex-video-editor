import React from 'react'
import { ImageResource } from '../entity/ImageResource'
import { UploadButton } from '../shared/UploadButton'
import { useVideoEditState } from '../state'

export const ImageResourcesPanel = () => {
  const images = useVideoEditState((i) => i.images)
  const addImageResource = useVideoEditState((i) => i.addImageResource)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    addImageResource(URL.createObjectURL(file))
  }
  return (
    <>
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold">
        Images
      </div>
      <UploadButton
        accept="image/*"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-center mx-2 py-2 px-4 rounded cursor-pointer"
        onChange={handleFileChange}
      />
      <div>
        {images.map((image, index) => {
          return <ImageResource key={image} image={image} index={index} />
        })}
      </div>
    </>
  )
}
