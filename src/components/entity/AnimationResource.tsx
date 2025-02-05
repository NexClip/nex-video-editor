import { MdDelete } from 'react-icons/md'
import type {
  Animation,
  FadeInAnimation,
  FadeOutAnimation,
  SlideDirection,
  SlideInAnimation,
  SlideOutAnimation,
  SlideTextType,
} from '../state'
import { useVideoEditState } from '../state'
// import { formatTimeToMinSec } from "@/utils";

const ANIMATION_TYPE_TO_LABEL: Record<string, string> = {
  fadeIn: 'Fade In',
  fadeOut: 'Fade Out',
  slideIn: 'Slide In',
  slideOut: 'Slide Out',
  breath: 'Breath',
}
export interface AnimationResourceProps {
  animation: Animation
}
export const AnimationResource = (props: AnimationResourceProps) => {
  const removeAnimation = useVideoEditState((i) => i.removeAnimation)

  return (
    <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative min-h-[100px] p-2">
      <div className="flex flex-row justify-between w-full">
        <div className="text-white py-1 text-base text-left w-full">
          {ANIMATION_TYPE_TO_LABEL[props.animation.type]}
        </div>
        <button
          className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 text-lg"
          onClick={() => removeAnimation(props.animation.id)}
        >
          <MdDelete size="25" />
        </button>
      </div>
      {props.animation.type === 'fadeIn' ||
      props.animation.type === 'fadeOut' ? (
        <FadeAnimation
          animation={props.animation as FadeInAnimation | FadeOutAnimation}
        />
      ) : null}
      {props.animation.type === 'slideIn' ||
      props.animation.type === 'slideOut' ? (
        <SlideAnimation
          animation={props.animation as SlideInAnimation | SlideOutAnimation}
        />
      ) : null}
    </div>
  )
}

export const FadeAnimation = (props: {
  animation: FadeInAnimation | FadeOutAnimation
}) => {
  const updateAnimation = useVideoEditState((i) => i.updateAnimation)

  return (
    <div className="flex flex-col w-full items-start">
      {/* duration */}
      <div className="flex flex-row items-center justify-between my-1">
        <div className="text-white text-xs">Duration(s)</div>
        <input
          className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
          type="number"
          value={props.animation.duration / 1000}
          onChange={(e) => {
            const duration = Number(e.target.value) * 1000
            const isValidDuration = duration > 0
            let newDuration = isValidDuration ? duration : 0
            if (newDuration < 10) {
              newDuration = 10
            }
            updateAnimation(props.animation.id, {
              ...props.animation,
              duration: newDuration,
            })
          }}
        />
      </div>
    </div>
  )
}

export const SlideAnimation = (props: {
  animation: SlideInAnimation | SlideOutAnimation
}) => {
  const updateAnimation = useVideoEditState((i) => i.updateAnimation)
  return (
    <div className="flex flex-col w-full items-start">
      {/* duration */}
      <div className="flex flex-row items-center justify-between my-1">
        <div className="text-white text-xs">Duration(s)</div>
        <input
          className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
          type="number"
          value={props.animation.duration / 1000}
          onChange={(e) => {
            const duration = Number(e.target.value) * 1000
            const isValidDuration = duration > 0
            let newDuration = isValidDuration ? duration : 0
            if (newDuration < 10) {
              newDuration = 10
            }
            updateAnimation(props.animation.id, {
              ...props.animation,
              duration: newDuration,
            })
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between my-1">
        <div className="text-white text-xs">Direction</div>
        <select
          className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
          value={props.animation.properties.direction}
          onChange={(e) => {
            updateAnimation(props.animation.id, {
              ...props.animation,
              properties: {
                ...props.animation.properties,
                direction: e.target.value as SlideDirection,
              },
            })
          }}
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>
      <div className="flex flex-row items-center justify-between my-1">
        <div className="text-white text-xs">Use Mask</div>
        <input
          className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
          type="checkbox"
          checked={props.animation.properties.useClipPath}
          onChange={(e) => {
            updateAnimation(props.animation.id, {
              ...props.animation,
              properties: {
                ...props.animation.properties,
                useClipPath: e.target.checked,
              },
            })
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between my-1">
        <div className="text-white text-xs">Type</div>
        <select
          className="bg-slate-100 text-black rounded-lg px-2 py-1 ml-2 w-16 text-xs"
          value={props.animation.properties.textType}
          onChange={(e) => {
            updateAnimation(props.animation.id, {
              ...props.animation,
              properties: {
                ...props.animation.properties,
                textType: e.target.value as SlideTextType,
              },
            })
          }}
        >
          <option value="none">None</option>
          <option value="character">Character</option>
        </select>
      </div>
    </div>
  )
}
