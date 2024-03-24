import {
  MdAudiotrack,
  MdDownload,
  MdImage,
  MdMovieFilter,
  MdOutlineFormatColorFill,
  MdTitle,
  MdTransform,
  MdVideoLibrary,
} from 'react-icons/md'

import type { VideoStore } from './state'
import { useVideoEditState } from './state'

export const Menu = () => {
  const store = useVideoEditState()

  return (
    <ul className="bg-white h-full">
      {MENU_OPTIONS.map((option) => {
        const isSelected = store.selectedMenuOption === option.name
        return (
          <li
            key={option.name}
            className={`h-[72px] w-[72px] flex flex-col items-center justify-center ${
              isSelected ? 'bg-slate-200' : ''
            }`}
          >
            <button
              onClick={() => option.action(store)}
              className="flex flex-col items-center"
            >
              <option.icon size="20" color={isSelected ? '#000' : '#444'} />
              <div
                className={`text-[0.6rem] hover:text-black ${
                  isSelected ? 'text-black' : 'text-slate-600'
                }`}
              >
                {option.name}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
const MENU_OPTIONS = [
  {
    name: 'Video',
    icon: MdVideoLibrary,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Video')
    },
  },
  {
    name: 'Audio',
    icon: MdAudiotrack,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Audio')
    },
  },
  {
    name: 'Image',
    icon: MdImage,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Image')
    },
  },
  {
    name: 'Text',
    icon: MdTitle,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Text')
    },
  },
  {
    name: 'Animation',
    icon: MdTransform,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Animation')
    },
  },
  {
    name: 'Effect',
    icon: MdMovieFilter,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Effect')
    },
  },
  {
    name: 'Fill',
    icon: MdOutlineFormatColorFill,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Fill')
    },
  },
  {
    name: 'Export',
    icon: MdDownload,
    action: (store: VideoStore) => {
      store.setSelectedMenuOption('Export')
    },
  },
]
