import { BlockPicker } from 'react-color'
import { useVideoEditState } from '../state'

const professionalVideoColors = [
  '#000000', // Black
  '#FFFFFF', // White
  '#404040', // Dark Gray
  '#808080', // Gray
  '#C0C0C0', // Silver
  '#E0E0E0', // Light Gray
  '#003366', // Dark Blue
  '#336699', // Medium Blue
  '#6699CC', // Blue
  '#99CCFF', // Light Blue
  '#990000', // Dark Red
  '#CC3333', // Red
  '#FF6666', // Light Red
  '#663300', // Dark Brown
  '#996633', // Brown
  '#CC9966', // Light Brown
  '#006600', // Dark Green
  '#339933', // Green
  '#66CC99', // Light Green
  '#FFFF00', // Yellow
]

export const FillPanel = () => {
  const backgroundColor = useVideoEditState((i) => i.backgroundColor)
  const setBackgroundColor = useVideoEditState((i) => i.setBackgroundColor)

  // Color Picker
  return (
    <>
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold">
        Background Colour
      </div>
      <div className="flex items-center justify-center">
        <BlockPicker
          colors={professionalVideoColors}
          color={backgroundColor}
          onChangeComplete={(color: any) => {
            setBackgroundColor(color.hex)
          }}
        />
      </div>
    </>
  )
}
