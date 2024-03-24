/* eslint-disable */
import {
  AudioEditorElement,
  EditorElement,
  EffecType,
  ImageEditorElement,
  TextEditorElement,
  VideoEditorElement,
} from '@components/state'
import { fabric } from 'fabric'

declare module 'fabric' {
  namespace fabric {
    class CoverVideo extends Image {
      type: 'coverVideo'
      disableCrop: boolean
      cropWidth: number
      cropHeight: number
    }
    class CoverImage extends Image {
      type: 'coverImage'
      disableCrop: boolean
      cropWidth: number
      cropHeight: number
    }
  }
}

export function isEditorAudioElement(
  element: EditorElement,
): element is AudioEditorElement {
  return element.type === 'audio'
}
export function isEditorVideoElement(
  element: EditorElement,
): element is VideoEditorElement {
  return element.type === 'video'
}

export function isEditorImageElement(
  element: EditorElement,
): element is ImageEditorElement {
  return element.type === 'image'
}

export function getUid() {
  return Math.random().toString(36).substring(2, 9)
}

export function isHtmlVideoElement(
  element:
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | null
    | HTMLElement,
): element is HTMLVideoElement {
  if (!element) return false
  return element.tagName === 'VIDEO'
}
export function isHtmlImageElement(
  element:
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | null
    | HTMLElement,
): element is HTMLImageElement {
  if (!element) return false
  return element.tagName === 'IMG'
}

export function isHtmlAudioElement(
  element:
    | HTMLVideoElement
    | HTMLImageElement
    | HTMLCanvasElement
    | null
    | HTMLElement,
): element is HTMLAudioElement {
  if (!element) return false
  return element.tagName === 'AUDIO'
}

export function formatTimeToMinSec(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${appendZero(seconds, 2)}`
}

export function formatTimeToMinSecMili(time: number) {
  const mili = Math.floor((time % 1000) / 10)
  return formatTimeToMinSec(time / 1000) + `.${appendZero(mili, 2)}`
}

function appendZero(value: number, minDigits: number = 2) {
  return value.toString().padStart(minDigits, '0')
}

export function getTextObjectsPartitionedByCharacters(
  textObject: fabric.Text,
  element: TextEditorElement,
): fabric.Text[] {
  let copyCharsObjects: fabric.Text[] = []
  // replace all line endings with blank
  const characters = (textObject.text ?? '').split('').filter((m) => m !== '\n')
  const charObjects = textObject.__charBounds
  if (!charObjects) return []
  const charObjectFixed = charObjects
    .map((m, index) => m.slice(0, m.length - 1).map((m) => ({ m, index })))
    .flat()
  const lineHeight = textObject.getHeightOfLine(0)
  for (let i = 0; i < characters.length; i++) {
    if (!charObjectFixed[i]) continue
    const { m: charObject, index: lineIndex } = charObjectFixed[i]
    const char = characters[i]
    const scaleX = textObject.scaleX ?? 1
    const scaleY = textObject.scaleY ?? 1
    const charTextObject = new fabric.Text(char, {
      left: charObject.left * scaleX + element.placement.x,
      scaleX: scaleX,
      scaleY: scaleY,
      top: lineIndex * lineHeight * scaleY + element.placement.y,
      fontSize: textObject.fontSize,
      fontWeight: textObject.fontWeight,
      fill: '#fff',
    })
    copyCharsObjects.push(charTextObject)
  }
  return copyCharsObjects
}

export const CoverImage = fabric.util.createClass(fabric.Image, {
  type: 'coverImage',

  customFilter: 'none',
  disableCrop: false,
  cropWidth: 0,
  cropHeight: 0,

  initialize(element: HTMLImageElement | HTMLVideoElement, options: any) {
    options = options || {}

    options = {
      cropHeight: this.height,
      cropWidth: this.width,
      ...options,
    }
    this.callSuper('initialize', element, options)
  },

  getCrop(
    image: { width: number; height: number },
    size: { width: number; height: number },
  ) {
    const width = size.width
    const height = size.height
    const aspectRatio = width / height

    let newWidth
    let newHeight

    const imageRatio = image.width / image.height

    if (aspectRatio >= imageRatio) {
      newWidth = image.width
      newHeight = image.width / aspectRatio
    } else {
      newWidth = image.height * aspectRatio
      newHeight = image.height
    }
    const x = (image.width - newWidth) / 2
    const y = (image.height - newHeight) / 2
    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    }
  },

  _render(ctx: CanvasRenderingContext2D) {
    if (this.disableCrop) {
      this.callSuper('_render', ctx)
      return
    }
    const width = this.width
    const height = this.height
    const crop = this.getCrop(this.getOriginalSize(), {
      width: this.getScaledWidth(),
      height: this.getScaledHeight(),
    })
    const { cropX, cropY, cropWidth, cropHeight } = crop
    ctx.save()
    const customFilter: EffecType = this.customFilter
    ctx.filter = getFilterFromEffectType(customFilter)
    ctx.drawImage(
      this._element,
      Math.max(cropX, 0),
      Math.max(cropY, 0),
      Math.max(1, cropWidth),
      Math.max(1, cropHeight),
      -width / 2,
      -height / 2,
      Math.max(0, width),
      Math.max(0, height),
    )
    ctx.filter = 'none'
    ctx.restore()
  },
})

export const CoverVideo = fabric.util.createClass(fabric.Image, {
  type: 'coverVideo',
  customFilter: 'none',
  disableCrop: false,
  cropWidth: 0,
  cropHeight: 0,

  initialize(element: HTMLVideoElement, options: any) {
    options = options || {}

    options = {
      cropHeight: this.height,
      cropWidth: this.width,
      ...options,
    }
    this.callSuper('initialize', element, options)
  },

  getCrop(
    image: { width: number; height: number },
    size: { width: number; height: number },
  ) {
    const width = size.width
    const height = size.height
    const aspectRatio = width / height
    let newWidth
    let newHeight

    const imageRatio = image.width / image.height

    if (aspectRatio >= imageRatio) {
      newWidth = image.width
      newHeight = image.width / aspectRatio
    } else {
      newWidth = image.height * aspectRatio
      newHeight = image.height
    }
    const x = (image.width - newWidth) / 2
    const y = (image.height - newHeight) / 2
    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    }
  },

  _render(ctx: CanvasRenderingContext2D) {
    if (this.disableCrop) {
      this.callSuper('_render', ctx)
      return
    }
    const width = this.width
    const height = this.height
    const crop = this.getCrop(this.getOriginalSize(), {
      width: this.getScaledWidth(),
      height: this.getScaledHeight(),
    })
    const { cropX, cropY, cropWidth, cropHeight } = crop

    const video = this._element as HTMLVideoElement
    const videoScaledX = video.width / video.videoWidth
    const videoScaledY = video.height / video.videoHeight

    ctx.save()
    const customFilter: EffecType = this.customFilter
    ctx.filter = getFilterFromEffectType(customFilter)
    ctx.drawImage(
      this._element,
      Math.max(cropX, 0) / videoScaledX,
      Math.max(cropY, 0) / videoScaledY,
      Math.max(1, cropWidth) / videoScaledX,
      Math.max(1, cropHeight) / videoScaledY,
      -width / 2,
      -height / 2,
      Math.max(0, width),
      Math.max(0, height),
    )
    ctx.filter = 'none'
    ctx.restore()
  },
})

function getFilterFromEffectType(effectType: EffecType) {
  switch (effectType) {
    case 'blackAndWhite':
      return 'grayscale(100%)'
    case 'sepia':
      return 'sepia(100%)'
    case 'invert':
      return 'invert(100%)'
    case 'saturate':
      return 'saturate(100%)'
    default:
      return 'none'
  }
}

fabric.CoverImage = CoverImage
fabric.CoverVideo = CoverVideo

export class FabricUitls {
  static getClipMaskRect(editorElement: EditorElement, extraOffset: number) {
    const extraOffsetX = extraOffset / editorElement.placement.scaleX
    const extraOffsetY = extraOffsetX / editorElement.placement.scaleY
    const clipRectangle = new fabric.Rect({
      left: editorElement.placement.x - extraOffsetX,
      top: editorElement.placement.y - extraOffsetY,
      width: editorElement.placement.width + extraOffsetX * 2,
      height: editorElement.placement.height + extraOffsetY * 2,
      scaleX: editorElement.placement.scaleX,
      scaleY: editorElement.placement.scaleY,
      absolutePositioned: true,
      fill: 'transparent',
      stroke: 'transparent',
      opacity: 0.5,
      strokeWidth: 0,
    })
    return clipRectangle
  }
}
