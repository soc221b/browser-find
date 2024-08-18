import { create } from 'zustand'
import { redux } from 'zustand/middleware'
import reducer from '../reducer'
import initialState from '../state'
import { logger } from '../middleware/logger'

const useStore = create(logger(redux(reducer, initialState)))

export default useStore
