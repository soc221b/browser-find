import { useEffect } from 'react'
import useStore from '../store'

export default function _StyleSheet(): JSX.Element {
  const store = useStore()

  useEffect(() => {
    const topLayerStyleSheet = document.createElement('style')
    topLayerStyleSheet.textContent = `
      #browser-find-top-layer div,
      #browser-find-top-layer input,
      #browser-find-top-layer button {
        all: unset;
      }

      #browser-find-top-layer {
        padding: 0;
        border: 0;
        margin: 0;
      }

      #browser-find-top-layer .root {
        position: fixed;
        top: 20px;
        right: 40px;
        width: 500px;
        padding: 8px 12px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: Arial, Helvetica, sans-serif;
      }

      #browser-find-top-layer .input {
        line-height: 24px;
        padding: 4px;
        border-radius: 8px;
        flex: 1;
        font-weight: 450;
        transition: background-color linear 100ms;
      }

      #browser-find-top-layer .icon {
        width: 24px;
        height: 24px;
        padding: 2px;
        border-radius: 99999px;
        transition: background-color linear 200ms;
      }

      #browser-find-top-layer .result {
        user-select: none;
        height: 32px;
        display: flex;
        justify-content: end;
        align-items: center;
      }

      #browser-find-top-layer #tooltip {
        width: max-content;
        position: absolute;
        font-size: 14px;
        line-height: 1;
        padding: 2px 4px;
        z-index 9999;
        pointer-events: none;
        transition: opacity linear 200ms;
      }

      #browser-find-top-layer .root {
        background-color: #FFFFFF;
        box-shadow: 0px 3px 10px #25252564;
      }

      #browser-find-top-layer .input {
        color: #1F1F1F;
      }

      #browser-find-top-layer .input:hover:not(:focus) {
        background-color: #F2F2F2;
      }

      #browser-find-top-layer .icon {
        color: #626262;
      }

      #browser-find-top-layer .icon:disabled {
        color: #C4C4C4;
      }

      #browser-find-top-layer .icon:hover:not(:disabled),
      #browser-find-top-layer .icon:focus:not(:disabled) {
        background-color: #f4f4f4;
      }

      #browser-find-top-layer .icon[data-active='true'] {
        background-color: #e5e5e5 !important;
      }

      #browser-find-top-layer .result {
        color: #474747;
      }

      #browser-find-top-layer #tooltip {
        color: #1F1F1F;
        background-color: #FFFFFF;
        box-shadow: 0px 3px 10px #25252564;
      }

      @media (prefers-color-scheme: dark) {
        #browser-find-top-layer .root {
          background-color: #1F1F1F;
          box-shadow: 0px 2px 6px #000000;
        }

        #browser-find-top-layer .input {
          color: #e3e3e3;
        }

        #browser-find-top-layer .input:hover:not(:focus) {
          background-color: #363636;
        }

        #browser-find-top-layer .icon {
          color: #A9A9AA;
        }

        #browser-find-top-layer .icon:disabled {
          color: #535353;
        }

        #browser-find-top-layer .icon:hover:not(:disabled),
        #browser-find-top-layer .icon:focus:not(:disabled) {
          background-color: #313131;
        }

        #browser-find-top-layer .icon[data-active='true'] {
          background-color: #6C6C6B !important;
        }

        #browser-find-top-layer .result {
          color: #C7C7C7;
        }

        #browser-find-top-layer #tooltip {
          color: #EAEAEA;
          background-color: #2E2D32;
          box-shadow: 0px 2px 6px #000000;
        }
      }
    `
    document.head.appendChild(topLayerStyleSheet)

    return () => {
      document.head.removeChild(topLayerStyleSheet)
    }
  }, [])

  useEffect(() => {
    if (store.open === false) {
      return
    }

    const topLayerStyleSheet = document.createElement('style')
    topLayerStyleSheet.textContent = `
      ::highlight(browser-find) {
        background-color: #FEFF03;
        color: #000000;
      }

      ::highlight(browser-find-match) {
        background-color: #FF9632 !important;
        color: #000000 !important;
      }
    `
    document.head.appendChild(topLayerStyleSheet)

    return () => {
      document.head.removeChild(topLayerStyleSheet)
    }
  }, [store.open])

  return <></>
}
