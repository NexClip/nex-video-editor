import { isEditorImageElement, isEditorVideoElement } from '@utils/fabric-utils'
import { EffectResource } from '../entity/EffectResource'
import { useVideoEditState } from '../state'

export const EffectsPanel = () => {
  const selectedElement = useVideoEditState((i) => i.selectedElement)

  return (
    <>
      <div className="text-sm px-[16px] pt-[16px] pb-[8px] font-semibold">
        Effects
      </div>
      {selectedElement &&
      (isEditorImageElement(selectedElement) ||
        isEditorVideoElement(selectedElement)) ? (
        <EffectResource editorElement={selectedElement} />
      ) : null}
    </>
  )
}
