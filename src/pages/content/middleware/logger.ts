import { StateCreator, StoreMutatorIdentifier } from 'zustand'

type Logger = <
  T,
  Mis extends [StoreMutatorIdentifier, unknown][],
  Mos extends [StoreMutatorIdentifier, unknown][],
  U = T,
>(
  storeInitializer: StateCreator<T, Mis, Mos, U>,
) => StateCreator<T, Mis, Mos, U>

const debug = false

export const logger: Logger = (stateCreator) => (set, get, api) => {
  if (debug) {
    setTimeout(() => {
      const originalDispatch = (api as any).dispatch
      let previousType: undefined | string
      ;(api as any).dispatch = (...a: any[]) => {
        const type = a[0].type
        if (previousType === undefined) {
          console.groupCollapsed(type)
          previousType = type
        } else if (previousType !== type) {
          console.groupEnd()
          console.groupCollapsed(type)
          previousType = type
        }
        console.log(a[0])
        return originalDispatch(...a)
      }
    })
  }

  return stateCreator(set, get, api)
}
