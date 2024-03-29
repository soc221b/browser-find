import { create } from 'zustand'
import { redux } from 'zustand/middleware'
import reducer from '../reducer'
import initialState from '../state'

const useStore = create(redux(reducer, initialState))

export default useStore
