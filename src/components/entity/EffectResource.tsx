import type {
  EffecType,
  ImageEditorElement,
  VideoEditorElement,
} from '../state'
import { useVideoEditState } from '../state'

const EFFECT_TYPE_TO_LABEL: Record<string, string> = {
  blackAndWhite: 'Black and White',
  none: 'None',
  saturate: 'Saturate',
  sepia: 'Sepia',
  invert: 'Invert',
}
export interface EffectResourceProps {
  editorElement: VideoEditorElement | ImageEditorElement
}
export const EffectResource = (props: EffectResourceProps) => {
  const updateEffect = useVideoEditState((i) => i.updateEffect)
  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative min-h-[100px] p-2">
      <div className="flex flex-row justify-between w-full">
        <div className="text-white py-1 text-base text-left w-full">
          {EFFECT_TYPE_TO_LABEL[props.editorElement.properties.effect.type]}
        </div>
      </div>
      {/* Select effect from drop down */}
      <select
        className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
        value={props.editorElement.properties.effect.type}
        onChange={(e) => {
          const type = e.target.value
          updateEffect(props.editorElement.id, {
            type: type as EffecType,
          })
        }}
      >
        {Object.keys(EFFECT_TYPE_TO_LABEL).map((type) => {
          return (
            <option key={type} value={type}>
              {EFFECT_TYPE_TO_LABEL[type]}
            </option>
          )
        })}
      </select>
    </div>
  )
}
