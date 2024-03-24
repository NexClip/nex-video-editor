import '@utils/fabric-utils'

import { fabric } from 'fabric'
import { useEffect } from 'react'

import { Menu } from './Menu'
import { ElementsPanel } from './panels/ElementsPanel'
import { Resources } from './Resources'
import { useVideoEditState } from './state'
import { TimeLine } from './TimeLine'

export default function NexEditor() {
  const setSelectedElement = useVideoEditState((i) => i.setSelectedElement)
  const setCanvas = useVideoEditState((i) => i.setCanvas)

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      height: 500,
      width: 800,
      backgroundColor: '#ededed',
    })
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = '#00a0f5'
    fabric.Object.prototype.cornerStyle = 'circle'
    fabric.Object.prototype.cornerStrokeColor = '#0063d8'
    fabric.Object.prototype.cornerSize = 10
    canvas.on('mouse:down', function (e) {
      if (!e.target) {
        setSelectedElement(null)
      }
    })

    setCanvas(canvas)
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll()
      fabric.util.requestAnimFrame(render)
    })
    return () => {
      canvas.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="grid grid-rows-[500px_1fr_20px] grid-cols-[72px_300px_1fr_250px] h-[100svh]">
      <div className="tile row-span-2 flex flex-col">
        <Menu />
      </div>
      <div className="row-span-2 flex flex-col overflow-scroll">
        <Resources />
      </div>
      <div
        id="grid-canvas-container"
        className="col-start-3 bg-slate-100 flex justify-center items-center"
      >
        <canvas id="canvas" className="h-[500px] w-[800px] row" />
      </div>
      <div className="col-start-4 row-start-1">
        <ElementsPanel />
      </div>
      <div className="col-start-3 row-start-2 col-span-2 relative px-[10px] py-[4px] overflow-scroll">
        <TimeLine />
      </div>
    </div>
  )
}
