import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'state',
  state: () => ({
    state: 'begin',
    difficulty: 'normal',
  }),
  actions: {
    addItem(name: string) {
        this.state = name
    },
  }
})