import { Element } from '../entity/Element'
import { useVideoEditState } from '../state'

export const ElementsPanel = (_props: {}) => {
  const editorElements = useVideoEditState((i) => i.editorElements)

  return (
    <div className="bg-slate-200 h-full overflow-scroll">
      <div className="flex flex-row justify-between">
        <div className="text-sm px-[16px] py-[7px] font-semibold">Elements</div>
      </div>
      <div className="flex flex-col">
        {editorElements.map((element) => {
          return <Element key={element.id} element={element} />
        })}
      </div>
    </div>
  )
}
