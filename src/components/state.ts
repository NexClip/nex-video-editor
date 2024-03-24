import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import anime from 'animejs'
import { fabric } from 'fabric'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  FabricUitls,
  getTextObjectsPartitionedByCharacters,
  getUid,
  isEditorAudioElement,
  isEditorImageElement,
  isEditorVideoElement,
  isHtmlAudioElement,
  isHtmlImageElement,
  isHtmlVideoElement,
} from '@utils/fabric-utils'

export interface EditorElementBase<T extends string, P> {
  readonly id: string
  fabricObject?: fabric.Object
  name: string
  readonly type: T
  placement: Placement
  timeFrame: TimeFrame
  properties: P
}
export type VideoEditorElement = EditorElementBase<
  'video',
  { src: string; elementId: string; imageObject?: fabric.Image; effect: Effect }
>
export type ImageEditorElement = EditorElementBase<
  'image',
  {
    src: string
    elementId: string
    imageObject?: fabric.Object
    effect: Effect
  }
>

export type AudioEditorElement = EditorElementBase<
  'audio',
  { src: string; elementId: string }
>
export type TextEditorElement = EditorElementBase<
  'text',
  {
    text: string
    fontSize: number
    fontWeight: number
    splittedTexts: fabric.Text[]
  }
>

export type EditorElement =
  | VideoEditorElement
  | ImageEditorElement
  | AudioEditorElement
  | TextEditorElement

export interface Placement {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

export interface TimeFrame {
  start: number
  end: number
}

export interface EffectBase<T extends string> {
  type: T
}

export type BlackAndWhiteEffect =
  | EffectBase<'none'>
  | EffectBase<'blackAndWhite'>
  | EffectBase<'sepia'>
  | EffectBase<'invert'>
  | EffectBase<'saturate'>
export type Effect = BlackAndWhiteEffect
export type EffecType = Effect['type']

export interface AnimationBase<T, P = {}> {
  id: string
  targetId: string
  duration: number
  type: T
  properties: P
}

export type FadeInAnimation = AnimationBase<'fadeIn'>
export type FadeOutAnimation = AnimationBase<'fadeOut'>

export type BreatheAnimation = AnimationBase<'breathe'>

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom'
export type SlideTextType = 'none' | 'character'
export type SlideInAnimation = AnimationBase<
  'slideIn',
  {
    direction: SlideDirection
    useClipPath: boolean
    textType: 'none' | 'character'
  }
>

export type SlideOutAnimation = AnimationBase<
  'slideOut',
  {
    direction: SlideDirection
    useClipPath: boolean
    textType: SlideTextType
  }
>

export type Animation =
  | FadeInAnimation
  | FadeOutAnimation
  | SlideInAnimation
  | SlideOutAnimation
  | BreatheAnimation

export type MenuOption =
  | 'Video'
  | 'Audio'
  | 'Text'
  | 'Image'
  | 'Export'
  | 'Animation'
  | 'Effect'
  | 'Fill'

interface VideoEditState {
  canvas: fabric.Canvas | null
  currentTimeInMs: number
  backgroundColor: string

  selectedMenuOption: MenuOption
  audios: string[]
  videos: string[]
  images: string[]
  editorElements: EditorElement[]
  selectedElement: EditorElement | null

  maxTime: number
  animations: Animation[]
  animationTimeLine: anime.AnimeTimelineInstance
  playing: boolean

  currentKeyFrame: number
  fps: number

  possibleVideoFormats: string[]
  selectedVideoFormat: 'mp4' | 'webm'
  startedTime: number
  startedTimePlay: number
}

interface VideoEditActions {
  setCurrentTimeInMs: (time: number) => void
  setSelectedMenuOption: (selectedMenuOption: MenuOption) => void
  setCanvas: (canvas: fabric.Canvas | null) => void
  setBackgroundColor: (backgroundColor: string) => void
  updateEffect: (id: string, effect: Effect) => void
  setVideos: (videos: string[]) => void
  addVideoResource: (video: string) => void
  addImageResource: (image: string) => void
  addAudioResource: (audio: string) => void
  addAnimation: (animation: Animation) => void
  updateAnimation: (id: string, animation: Animation) => void
  refreshAnimations: () => void
  removeAnimation: (id: string) => void
  setSelectedElement: (selectedElement: EditorElement | null) => void
  updateSelectedElement: () => void
  setEditorElements: (editorElements: EditorElement[]) => void
  updateEditorElement: (editorElement: EditorElement) => void
  updateEditorElementTimeFrame: (
    editorElement: EditorElement,
    timeFrame: Partial<TimeFrame>,
  ) => void
  addEditorElement: (editorElement: EditorElement) => void
  removeEditorElement: (id: string) => void
  setMaxTime: (maxTime: number) => void
  setPlaying: (playing: boolean) => void
  playFrames: () => void
  updateTimeTo: (newTime: number) => void
  handleSeek: (seek: number) => void
  addVideo: (index: number) => void
  addImage: (index: number) => void
  addAudio: (index: number) => void
  addText: (options: {
    text: string
    fontSize: number
    fontWeight: number
  }) => void
  updateVideoElements: () => void
  updateAudioElements: () => void
  setVideoFormat: (format: 'mp4' | 'webm') => void
  saveCanvasToVideoWithAudio: () => void
  saveCanvasToVideoWithAudioWebmMp4: () => void
  refreshElements: () => void
}

const DefaultState: VideoEditState = {
  canvas: null,
  videos: [],
  images: [],
  audios: [],
  editorElements: [],
  backgroundColor: '#111111',
  maxTime: 30 * 1000,
  playing: false,
  currentKeyFrame: 0,
  selectedElement: null,
  fps: 60,
  animations: [],
  animationTimeLine: anime.timeline(),
  selectedMenuOption: 'Video',
  selectedVideoFormat: 'mp4',
  possibleVideoFormats: ['mp4', 'webm'],
  startedTime: 0,
  startedTimePlay: 0,
  currentTimeInMs: 0,
}

export type VideoStore = VideoEditState & VideoEditActions

const VideoEditStore = create<VideoStore>()(
  immer((set, get) => ({
    ...DefaultState,
    updateSelectedElement() {
      set({
        selectedElement:
          get().editorElements.find(
            (element) => element.id === get().selectedElement?.id,
          ) ?? null,
      })
    },
    setEditorElements(editorElements) {
      const { updateSelectedElement, refreshElements } = get()
      set({
        editorElements,
      })
      updateSelectedElement()
      refreshElements()
    },
    updateEditorElement(editorElement) {
      const { setEditorElements, editorElements } = get()
      setEditorElements(
        editorElements.map((element) =>
          element.id === editorElement.id ? editorElement : element,
        ),
      )
    },
    setSelectedElement(selectedElement: EditorElement | null) {
      const { canvas } = get()
      set({
        selectedElement,
      })
      if (canvas) {
        if (selectedElement?.fabricObject)
          canvas.setActiveObject(selectedElement.fabricObject)
        else canvas.discardActiveObject()
      }
    },
    updateTimeTo(newTime: number) {
      const store = get()
      store.setCurrentTimeInMs(newTime)
      store.animationTimeLine.seek(newTime)
      if (store.canvas) {
        store.canvas.backgroundColor = store.backgroundColor
      }
      get().editorElements.forEach((e) => {
        if (!e.fabricObject) return
        const isInside =
          e.timeFrame.start <= newTime && newTime <= e.timeFrame.end
        e.fabricObject.visible = isInside
      })
    },
    removeAnimation(id: string) {
      get().animations = get().animations.filter(
        (animation) => animation.id !== id,
      )
      get().refreshAnimations()
    },
    updateVideoElements() {
      const store = get()
      store.editorElements
        .filter(
          (element): element is VideoEditorElement => element.type === 'video',
        )
        .forEach((element) => {
          const video = document.getElementById(element.properties.elementId)
          if (isHtmlVideoElement(video)) {
            const videoTime =
              (store.currentTimeInMs - element.timeFrame.start) / 1000
            video.currentTime = videoTime
            if (store.playing) {
              video.play()
            } else {
              video.pause()
            }
          }
        })
    },
    updateAudioElements() {
      const store = get()
      store.editorElements
        .filter(
          (element): element is AudioEditorElement => element.type === 'audio',
        )
        .forEach((element) => {
          const audio = document.getElementById(element.properties.elementId)
          if (isHtmlAudioElement(audio)) {
            const audioTime =
              (store.currentTimeInMs - element.timeFrame.start) / 1000
            audio.currentTime = audioTime
            if (store.playing) {
              audio.play()
            } else {
              audio.pause()
            }
          }
        })
    },
    addEditorElement(editorElement: EditorElement) {
      get().setEditorElements([...get().editorElements, editorElement])
      get().refreshElements()
      get().setSelectedElement(
        get().editorElements[get().editorElements.length - 1],
      )
    },

    removeEditorElement(id: string) {
      get().setEditorElements(
        get().editorElements.filter((editorElement) => editorElement.id !== id),
      )
      get().refreshElements()
    },

    setMaxTime(maxTime: number) {
      set({
        maxTime,
      })
    },
    // saveCanvasToVideo() {
    //   const video = document.createElement("video");
    //   const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    //   const stream = canvas.captureStream();
    //   video.srcObject = stream;
    //   video.play();
    //   const mediaRecorder = new MediaRecorder(stream);
    //   const chunks: Blob[] = [];
    //   mediaRecorder.ondataavailable = function (e) {
    //     console.log("data available");
    //     console.log(e.data);
    //     chunks.push(e.data);
    //   };
    //   mediaRecorder.onstop = function (e) {
    //     const blob = new Blob(chunks, { type: "video/webm" });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "video.webm";
    //     a.click();
    //   };
    //   mediaRecorder.start();
    //   setTimeout(() => {
    //     mediaRecorder.stop();
    //   }, this.maxTime);

    // }

    setVideoFormat(format: 'mp4' | 'webm') {
      set({
        selectedVideoFormat: format,
      })
    },

    saveCanvasToVideoWithAudio() {
      get().saveCanvasToVideoWithAudioWebmMp4()
    },

    saveCanvasToVideoWithAudioWebmMp4() {
      const mp4 = get().selectedVideoFormat === 'mp4'
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const stream = canvas.captureStream(30)
      const audioElements = get().editorElements.filter(isEditorAudioElement)
      const audioStreams: MediaStream[] = []
      audioElements.forEach((audio) => {
        const audioElement = document.getElementById(
          audio.properties.elementId,
        ) as HTMLAudioElement
        const ctx = new AudioContext()
        const sourceNode = ctx.createMediaElementSource(audioElement)
        const dest = ctx.createMediaStreamDestination()
        sourceNode.connect(dest)
        sourceNode.connect(ctx.destination)
        audioStreams.push(dest.stream)
      })
      audioStreams.forEach((audioStream) => {
        stream.addTrack(audioStream.getAudioTracks()[0])
      })
      const video = document.createElement('video')
      video.srcObject = stream
      video.height = 500
      video.width = 800
      // video.controls = true;
      // document.body.appendChild(video);
      video.play().then(() => {
        const mediaRecorder = new MediaRecorder(stream)
        const chunks: Blob[] = []
        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data)
        }
        mediaRecorder.onstop = async function () {
          const blob = new Blob(chunks, { type: 'video/webm' })

          if (mp4) {
            // lets use ffmpeg to convert webm to mp4
            const data = new Uint8Array(await blob.arrayBuffer())
            const ffmpeg = new FFmpeg()
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
            await ffmpeg.load({
              coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                'text/javascript',
              ),
              wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                'application/wasm',
              ),
              // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            })
            await ffmpeg.writeFile('video.webm', data)
            await ffmpeg.exec([
              '-y',
              '-i',
              'video.webm',
              '-c',
              'copy',
              'video.mp4',
            ])
            // await ffmpeg.exec(["-y", "-i", "video.webm", "-c:v", "libx264", "video.mp4"]);

            const output = await ffmpeg.readFile('video.mp4')
            const outputBlob = new Blob([output], { type: 'video/mp4' })
            const outputUrl = URL.createObjectURL(outputBlob)
            const a = document.createElement('a')
            a.download = 'video.mp4'
            a.href = outputUrl
            a.click()
          } else {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'video.webm'
            a.click()
          }
        }
        mediaRecorder.start()
        setTimeout(() => {
          mediaRecorder.stop()
        }, get().maxTime)
        video.remove()
      })
    },

    handleSeek(seek: number) {
      const store = get()
      if (store.playing) {
        store.setPlaying(false)
      }
      store.updateTimeTo(seek)
      store.updateVideoElements()
      store.updateAudioElements()
    },

    addVideo(index: number) {
      const videoElement = document.getElementById(`video-${index}`)
      if (!isHtmlVideoElement(videoElement)) {
        return
      }
      const videoDurationMs = videoElement.duration * 1000
      const aspectRatio = videoElement.videoWidth / videoElement.videoHeight
      const id = getUid()
      get().addEditorElement({
        id,
        name: `Media(video) ${index + 1}`,
        type: 'video',
        placement: {
          x: 0,
          y: 0,
          width: 100 * aspectRatio,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeFrame: {
          start: 0,
          end: videoDurationMs,
        },
        properties: {
          elementId: `video-${id}`,
          src: videoElement.src,
          effect: {
            type: 'none',
          },
        },
      })
    },

    addImage(index: number) {
      const imageElement = document.getElementById(`image-${index}`)
      if (!isHtmlImageElement(imageElement)) {
        return
      }
      const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight
      const id = getUid()
      get().addEditorElement({
        id,
        name: `Media(image) ${index + 1}`,
        type: 'image',
        placement: {
          x: 0,
          y: 0,
          width: 100 * aspectRatio,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeFrame: {
          start: 0,
          end: get().maxTime,
        },
        properties: {
          elementId: `image-${id}`,
          src: imageElement.src,
          effect: {
            type: 'none',
          },
        },
      })
    },

    addAudio(index: number) {
      const audioElement = document.getElementById(`audio-${index}`)
      if (!isHtmlAudioElement(audioElement)) {
        return
      }
      const audioDurationMs = audioElement.duration * 1000
      const id = getUid()
      get().addEditorElement({
        id,
        name: `Media(audio) ${index + 1}`,
        type: 'audio',
        placement: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeFrame: {
          start: 0,
          end: audioDurationMs,
        },
        properties: {
          elementId: `audio-${id}`,
          src: audioElement.src,
        },
      })
    },
    addText(options: { text: string; fontSize: number; fontWeight: number }) {
      const id = getUid()
      const index = get().editorElements.length
      get().addEditorElement({
        id,
        name: `Text ${index + 1}`,
        type: 'text',
        placement: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeFrame: {
          start: 0,
          end: get().maxTime,
        },
        properties: {
          text: options.text,
          fontSize: options.fontSize,
          fontWeight: options.fontWeight,
          splittedTexts: [],
        },
      })
    },

    setPlaying(playing: boolean) {
      set({
        playing,
      })
      get().updateVideoElements()
      get().updateAudioElements()
      if (playing) {
        set({
          startedTime: Date.now(),
          startedTimePlay: get().currentTimeInMs,
        })

        requestAnimationFrame(() => {
          get().playFrames()
        })
      }
    },

    playFrames() {
      if (!get().playing) {
        return
      }
      const elapsedTime = Date.now() - get().startedTime
      const newTime = get().startedTimePlay + elapsedTime
      get().updateTimeTo(newTime)
      if (newTime > get().maxTime) {
        set({
          currentKeyFrame: 0,
        })
        get().setPlaying(false)
      } else {
        requestAnimationFrame(() => {
          get().playFrames()
        })
      }
    },
    updateEditorElementTimeFrame(
      editorElement: EditorElement,
      timeFrame: Partial<TimeFrame>,
    ) {
      if (timeFrame.start !== undefined && timeFrame.start < 0) {
        timeFrame.start = 0
      }
      if (timeFrame.end !== undefined && timeFrame.end > get().maxTime) {
        timeFrame.end = get().maxTime
      }
      const newEditorElement = {
        ...editorElement,
        timeFrame: {
          ...editorElement.timeFrame,
          ...timeFrame,
        },
      }
      get().updateVideoElements()
      get().updateAudioElements()
      get().updateEditorElement(newEditorElement)
      get().refreshAnimations()
    },
    refreshElements() {
      const store = get()
      if (!store.canvas) return
      const canvas = store.canvas
      store.canvas.remove(...store.canvas.getObjects())
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < get().editorElements.length; index++) {
        const element = get().editorElements[index]
        switch (element.type) {
          case 'video': {
            if (document.getElementById(element.properties.elementId) === null)
              continue
            const videoElement = document.getElementById(
              element.properties.elementId,
            )

            if (!isHtmlVideoElement(videoElement)) continue

            // const filters = [];
            // if (element.properties.effect?.type === "blackAndWhite") {
            //   filters.push(new fabric.Image.filters.Grayscale());
            // }
            const videoObject = new fabric.CoverVideo(videoElement, {
              name: element.id,
              left: element.placement.x,
              top: element.placement.y,
              width: element.placement.width,
              height: element.placement.height,
              scaleX: element.placement.scaleX,
              scaleY: element.placement.scaleY,
              angle: element.placement.rotation,
              hasControls: true,
              objectCaching: false,
              selectable: true,
              lockUniScaling: false,
              // @ts-ignore
              customFilter: element.properties.effect.type,
            })

            element.fabricObject = videoObject
            element.properties.imageObject = videoObject
            videoElement.width = 100
            videoElement.height =
              (videoElement.videoHeight * 100) / videoElement.videoWidth
            canvas.add(videoObject)
            canvas.on('object:modified', function (e) {
              if (!e.target) return
              const target = e.target
              if (target !== videoObject) return
              const placement = element.placement
              const newPlacement: Placement = {
                ...placement,
                x: target.left ?? placement.x,
                y: target.top ?? placement.y,
                rotation: target.angle ?? placement.rotation,
                width:
                  target.width && target.scaleX
                    ? target.width * target.scaleX
                    : placement.width,
                height:
                  target.height && target.scaleY
                    ? target.height * target.scaleY
                    : placement.height,
                scaleX: 1,
                scaleY: 1,
              }
              const newElement = {
                ...element,
                placement: newPlacement,
              }
              get().updateEditorElement(newElement)
            })
            break
          }
          case 'image': {
            if (document.getElementById(element.properties.elementId) === null)
              continue
            const imageElement = document.getElementById(
              element.properties.elementId,
            )
            if (!isHtmlImageElement(imageElement)) continue
            // const filters = [];
            // if (element.properties.effect?.type === "blackAndWhite") {
            //   filters.push(new fabric.Image.filters.Grayscale());
            // }
            const imageObject = new fabric.CoverImage(imageElement, {
              name: element.id,
              left: element.placement.x,
              top: element.placement.y,
              angle: element.placement.rotation,
              objectCaching: false,
              selectable: true,
              lockUniScaling: true,
              // filters
              // @ts-ignore
              customFilter: element.properties.effect.type,
            })
            // imageObject.applyFilters();
            element.fabricObject = imageObject
            element.properties.imageObject = imageObject
            const image = {
              w: imageElement.naturalWidth,
              h: imageElement.naturalHeight,
            }

            imageObject.width = image.w
            imageObject.height = image.h
            imageElement.width = image.w
            imageElement.height = image.h
            imageObject.scaleToHeight(image.w)
            imageObject.scaleToWidth(image.h)
            const toScale = {
              x: element.placement.width / image.w,
              y: element.placement.height / image.h,
            }
            imageObject.scaleX = toScale.x * element.placement.scaleX
            imageObject.scaleY = toScale.y * element.placement.scaleY
            canvas.add(imageObject)
            canvas.on('object:modified', function (e) {
              if (!e.target) return
              const target = e.target
              if (target !== imageObject) return
              const placement = element.placement
              let fianlScale = 1
              if (target.scaleX && target.scaleX > 0) {
                fianlScale = target.scaleX / toScale.x
              }
              const newPlacement: Placement = {
                ...placement,
                x: target.left ?? placement.x,
                y: target.top ?? placement.y,
                rotation: target.angle ?? placement.rotation,
                scaleX: fianlScale,
                scaleY: fianlScale,
              }
              const newElement = {
                ...element,
                placement: newPlacement,
              }
              get().updateEditorElement(newElement)
            })
            break
          }
          case 'audio': {
            break
          }
          case 'text': {
            const textObject = new fabric.Textbox(element.properties.text, {
              name: element.id,
              left: element.placement.x,
              top: element.placement.y,
              scaleX: element.placement.scaleX,
              scaleY: element.placement.scaleY,
              width: element.placement.width,
              height: element.placement.height,
              angle: element.placement.rotation,
              fontSize: element.properties.fontSize,
              fontWeight: element.properties.fontWeight,
              objectCaching: false,
              selectable: true,
              lockUniScaling: true,
              fill: '#ffffff',
            })
            element.fabricObject = textObject
            canvas.add(textObject)
            canvas.on('object:modified', function (e) {
              if (!e.target) return
              const target = e.target
              if (target !== textObject) return
              const placement = element.placement
              const newPlacement: Placement = {
                ...placement,
                x: target.left ?? placement.x,
                y: target.top ?? placement.y,
                rotation: target.angle ?? placement.rotation,
                width: target.width ?? placement.width,
                height: target.height ?? placement.height,
                scaleX: target.scaleX ?? placement.scaleX,
                scaleY: target.scaleY ?? placement.scaleY,
              }
              const newElement = {
                ...element,
                placement: newPlacement,
                properties: {
                  ...element.properties,
                  // @ts-ignore
                  text: target?.text,
                },
              }
              get().updateEditorElement(newElement)
            })
            break
          }
          default: {
            throw new Error('Not implemented')
          }
        }
        if (element.fabricObject) {
          element.fabricObject.on('selected', function () {
            get().setSelectedElement(element)
          })
        }
      }
      const selectedEditorElement = store.selectedElement

      if (selectedEditorElement && selectedEditorElement.fabricObject) {
        canvas.setActiveObject(selectedEditorElement.fabricObject)
      }

      get().refreshAnimations()
      get().updateTimeTo(get().currentTimeInMs)
      store.canvas.renderAll()
    },
    setCurrentTimeInMs: (time) => {
      const { fps } = get()
      const times = Math.floor((time / 1000) * fps)
      set({
        currentKeyFrame: times,
        currentTimeInMs: (times * 1000) / fps,
      })
    },
    setSelectedMenuOption: (selectedMenuOption) => {
      set({ selectedMenuOption })
    },
    setCanvas: (canvas) => {
      const { backgroundColor } = get()
      if (canvas) {
        canvas.backgroundColor = backgroundColor
      }
      set({ canvas })
    },
    setBackgroundColor: (backgroundColor) => {
      const { canvas } = get()
      if (canvas) {
        if (canvas) {
          canvas.backgroundColor = backgroundColor
        }
      }
      set({ backgroundColor })
    },
    updateEffect: (id, effect) => {
      const { editorElements, refreshElements } = get()
      const index = get().editorElements.findIndex(
        (element) => element.id === id,
      )
      const element = editorElements[index]
      if (isEditorVideoElement(element) || isEditorImageElement(element)) {
        element.properties.effect = effect
        set({
          editorElements,
        })
      }
      refreshElements()
    },
    setVideos: (videos) => {
      set({ videos })
    },
    addVideoResource: (video) => {
      const { videos } = get()
      set({ videos: [...videos, video] })
    },
    addAudioResource: (audio) => {
      const { audios } = get()
      set({ audios: [...audios, audio] })
    },
    addImageResource: (image) => {
      const { images } = get()
      set({ images: [...images, image] })
    },
    addAnimation: (animation) => {
      const { animations, refreshAnimations } = get()
      set({ animations: [...animations, animation] })
      refreshAnimations()
    },
    updateAnimation: (id, animation) => {
      const { animations, refreshAnimations } = get()
      const index = animations.findIndex((element) => element.id === id)
      animations[index] = animation
      refreshAnimations()
      set({ animations })
    },
    // eslint-disable-next-line complexity
    refreshAnimations: () => {
      const store = get()
      // eslint-disable-next-line import/no-named-as-default-member
      anime.remove(store.animationTimeLine)
      set({
        // eslint-disable-next-line import/no-named-as-default-member
        animationTimeLine: anime.timeline({
          duration: store.maxTime,
          autoplay: false,
        }),
      })
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < store.animations.length; i++) {
        const animation = store.animations[i]
        const editorElement = store.editorElements.find(
          (element) => element.id === animation.targetId,
        )
        const fabricObject = editorElement?.fabricObject
        if (!editorElement || !fabricObject) {
          continue
        }
        fabricObject.clipPath = undefined
        switch (animation.type) {
          case 'fadeIn': {
            store.animationTimeLine.add(
              {
                opacity: [0, 1],
                duration: animation.duration,
                targets: fabricObject,
                easing: 'linear',
              },
              editorElement.timeFrame.start,
            )
            break
          }
          case 'fadeOut': {
            store.animationTimeLine.add(
              {
                opacity: [1, 0],
                duration: animation.duration,
                targets: fabricObject,
                easing: 'linear',
              },
              editorElement.timeFrame.end - animation.duration,
            )
            break
          }
          case 'slideIn': {
            const direction = animation.properties.direction
            const targetPosition = {
              left: editorElement.placement.x,
              top: editorElement.placement.y,
            }
            const startPosition = {
              left:
                direction === 'left'
                  ? -editorElement.placement.width
                  : direction === 'right'
                  ? store.canvas?.width
                  : editorElement.placement.x,
              top:
                direction === 'top'
                  ? -editorElement.placement.height
                  : direction === 'bottom'
                  ? store.canvas?.height
                  : editorElement.placement.y,
            }
            if (animation.properties.useClipPath) {
              const clipRectangle = FabricUitls.getClipMaskRect(
                editorElement,
                50,
              )
              fabricObject.set('clipPath', clipRectangle)
            }
            if (
              editorElement.type === 'text' &&
              animation.properties.textType === 'character'
            ) {
              store.canvas?.remove(...editorElement.properties.splittedTexts)
              // @ts-ignore
              editorElement.properties.splittedTexts =
                getTextObjectsPartitionedByCharacters(
                  editorElement.fabricObject as fabric.Textbox,
                  editorElement,
                )
              editorElement.properties.splittedTexts.forEach((textObject) => {
                store.canvas!.add(textObject)
              })
              const duration = animation.duration / 2
              const delay =
                duration / editorElement.properties.splittedTexts.length
              for (
                // eslint-disable-next-line @typescript-eslint/no-shadow
                let i = 0;
                i < editorElement.properties.splittedTexts.length;
                i++
              ) {
                const splittedText = editorElement.properties.splittedTexts[i]
                const offset = {
                  left: splittedText.left! - editorElement.placement.x,
                  top: splittedText.top! - editorElement.placement.y,
                }
                store.animationTimeLine.add(
                  {
                    left: [
                      startPosition.left! + offset.left,
                      targetPosition.left + offset.left,
                    ],
                    top: [
                      startPosition.top! + offset.top,
                      targetPosition.top + offset.top,
                    ],
                    delay: i * delay,
                    duration: duration,
                    targets: splittedText,
                  },
                  editorElement.timeFrame.start,
                )
              }
              store.animationTimeLine.add(
                {
                  opacity: [1, 0],
                  duration: 1,
                  targets: fabricObject,
                  easing: 'linear',
                },
                editorElement.timeFrame.start,
              )
              store.animationTimeLine.add(
                {
                  opacity: [0, 1],
                  duration: 1,
                  targets: fabricObject,
                  easing: 'linear',
                },
                editorElement.timeFrame.start + animation.duration,
              )

              store.animationTimeLine.add(
                {
                  opacity: [0, 1],
                  duration: 1,
                  targets: editorElement.properties.splittedTexts,
                  easing: 'linear',
                },
                editorElement.timeFrame.start,
              )
              store.animationTimeLine.add(
                {
                  opacity: [1, 0],
                  duration: 1,
                  targets: editorElement.properties.splittedTexts,
                  easing: 'linear',
                },
                editorElement.timeFrame.start + animation.duration,
              )
            }
            store.animationTimeLine.add(
              {
                left: [startPosition.left, targetPosition.left],
                top: [startPosition.top, targetPosition.top],
                duration: animation.duration,
                targets: fabricObject,
                easing: 'linear',
              },
              editorElement.timeFrame.start,
            )
            break
          }
          case 'slideOut': {
            const direction = animation.properties.direction
            const startPosition = {
              left: editorElement.placement.x,
              top: editorElement.placement.y,
            }
            const targetPosition = {
              left:
                direction === 'left'
                  ? -editorElement.placement.width
                  : direction === 'right'
                  ? store.canvas?.width
                  : editorElement.placement.x,
              top:
                direction === 'top'
                  ? -100 - editorElement.placement.height
                  : direction === 'bottom'
                  ? store.canvas?.height
                  : editorElement.placement.y,
            }
            if (animation.properties.useClipPath) {
              const clipRectangle = FabricUitls.getClipMaskRect(
                editorElement,
                50,
              )
              fabricObject.set('clipPath', clipRectangle)
            }
            store.animationTimeLine.add(
              {
                left: [startPosition.left, targetPosition.left],
                top: [startPosition.top, targetPosition.top],
                duration: animation.duration,
                targets: fabricObject,
                easing: 'linear',
              },
              editorElement.timeFrame.end - animation.duration,
            )
            break
          }
          case 'breathe': {
            const itsSlideInAnimation = store.animations.find(
              (a) => a.targetId === animation.targetId && a.type === 'slideIn',
            )
            const itsSlideOutAnimation = store.animations.find(
              (a) => a.targetId === animation.targetId && a.type === 'slideOut',
            )
            const timeEndOfSlideIn = itsSlideInAnimation
              ? editorElement.timeFrame.start + itsSlideInAnimation.duration
              : editorElement.timeFrame.start
            const timeStartOfSlideOut = itsSlideOutAnimation
              ? editorElement.timeFrame.end - itsSlideOutAnimation.duration
              : editorElement.timeFrame.end
            if (timeEndOfSlideIn > timeStartOfSlideOut) {
              continue
            }
            const duration = timeStartOfSlideOut - timeEndOfSlideIn
            const easeFactor = 4
            const suitableTimeForHeartbeat = ((1000 * 60) / 72) * easeFactor
            const upScale = 1.05
            const currentScaleX = fabricObject.scaleX ?? 1
            const currentScaleY = fabricObject.scaleY ?? 1
            const finalScaleX = currentScaleX * upScale
            const finalScaleY = currentScaleY * upScale
            const totalHeartbeats = Math.floor(
              duration / suitableTimeForHeartbeat,
            )
            if (totalHeartbeats < 1) {
              continue
            }
            const keyframes = []
            // eslint-disable-next-line @typescript-eslint/no-shadow
            for (let i = 0; i < totalHeartbeats; i++) {
              keyframes.push({ scaleX: finalScaleX, scaleY: finalScaleY })
              keyframes.push({ scaleX: currentScaleX, scaleY: currentScaleY })
            }

            store.animationTimeLine.add(
              {
                duration: duration,
                targets: fabricObject,
                keyframes,
                easing: 'linear',
                loop: true,
              },
              timeEndOfSlideIn,
            )

            break
          }
        }
      }
    },
  })),
)
export const useVideoEditState = VideoEditStore

export default VideoEditStore
