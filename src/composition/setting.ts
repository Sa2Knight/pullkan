import Repository from '@/models/repository'
import { inject, provide, reactive } from 'vue'

export const key = Symbol()

export const provideSetting = () => {
  return provide(key, createSetting())
}

export const useSetting = () => {
  return inject(key) as Store
}

export type Setting = {
  ignoreWipPRs: Boolean
  repositories: Repository[]
}

export type Store = {
  state: Setting
  save: (setting: Setting) => void
  load: () => void
}

export const createSetting = () => {
  const state = reactive({
    ignoreWipPRs: true,
    repositories: []
  } as Setting)

  const save = (setting: Setting) => {
    state.ignoreWipPRs = setting.ignoreWipPRs
    state.repositories = setting.repositories
    localStorage.setItem('setting', JSON.stringify(setting))
  }

  const load = () => {
    const rawSetting = localStorage.getItem('setting')
    if (rawSetting) {
      const parsedSetting = JSON.parse(rawSetting) as Setting
      state.ignoreWipPRs = parsedSetting.ignoreWipPRs
      state.repositories = parsedSetting.repositories.map(r => new Repository(r.id, r.ownerId, r.name))
    }
  }

  return { state, save, load }
}
