import { AnimationsPanel } from './panels/AnimationsPanel'
import { AudioResourcesPanel } from './panels/AudioResourcesPanel'
import { EffectsPanel } from './panels/EffectsPanel'
import { ExportVideoPanel } from './panels/ExportVideoPanel'
import { FillPanel } from './panels/FillPanel'
import { ImageResourcesPanel } from './panels/ImageResourcesPanel'
import { TextResourcesPanel } from './panels/TextResourcesPanel'
import { VideoResourcesPanel } from './panels/VideoResourcesPanel'
import { useVideoEditState } from './state'

export const Resources = () => {
  const selectedMenuOption = useVideoEditState((i) => i.selectedMenuOption)
  return (
    <div className="bg-slate-200 h-full">
      {selectedMenuOption === 'Video' ? <VideoResourcesPanel /> : null}
      {selectedMenuOption === 'Audio' ? <AudioResourcesPanel /> : null}
      {selectedMenuOption === 'Image' ? <ImageResourcesPanel /> : null}
      {selectedMenuOption === 'Text' ? <TextResourcesPanel /> : null}
      {selectedMenuOption === 'Animation' ? <AnimationsPanel /> : null}
      {selectedMenuOption === 'Effect' ? <EffectsPanel /> : null}
      {selectedMenuOption === 'Export' ? <ExportVideoPanel /> : null}
      {selectedMenuOption === 'Fill' ? <FillPanel /> : null}
    </div>
  )
}
