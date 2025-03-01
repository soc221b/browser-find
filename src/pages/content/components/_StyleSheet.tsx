import { useEffect } from 'react'
import useStore from '../store'
import { theOthersKey, thisKey } from '../constants/highlight'

export default function _StyleSheet(): JSX.Element {
  const open = useStore((state) => state.open)

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
        top: 0px;
        right: 0px;
        margin: 20px;
        width: 500px;
        padding: 8px 12px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
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

      #browser-find-top-layer button.icon:disabled {
        color: #C4C4C4;
      }

      #browser-find-top-layer button.icon:hover:not(:disabled),
      #browser-find-top-layer button.icon:focus:not(:disabled) {
        background-color: #f4f4f4;
      }

      #browser-find-top-layer button.icon[data-active='true'] {
        background-color: #e5e5e5 !important;
      }

      #browser-find-top-layer .result {
        color: #474747;
      }

      #browser-find-top-layer .spin {
        width: 24px;
        height: 24px;
        animation-name: browser-find-spin;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      @keyframes browser-find-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
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

        #browser-find-top-layer button.icon:disabled {
          color: #535353;
        }

        #browser-find-top-layer button.icon:hover:not(:disabled),
        #browser-find-top-layer button.icon:focus:not(:disabled) {
          background-color: #313131;
        }

        #browser-find-top-layer button.icon[data-active='true'] {
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
    if (open === false) {
      return
    }

    const removeAllChildren = getAllDocuments(document).map((document) => {
      const topLayerStyleSheet = document.createElement('style')
      topLayerStyleSheet.textContent = `
        ::highlight(${theOthersKey}) {
          background-color: #FEFF03;
          color: #000000;
        }

        ::highlight(${thisKey}) {
          background-color: #FF9632 !important;
          color: #000000 !important;
        }
      `
      document.head.appendChild(topLayerStyleSheet)
      return () => {
        document.head.removeChild(topLayerStyleSheet)
      }
    })

    return () => {
      removeAllChildren.forEach((removeChild) => removeChild())
    }
  }, [open])

  return <></>
}

function getAllDocuments(document: Document): Document[] {
  return [
    document,
    ...Array.from(document.querySelectorAll('iframe'))
      .map((iframe) => {
        if (iframe.contentDocument) {
          return getAllDocuments(iframe.contentDocument)
        } else {
          return []
        }
      })
      .flat(),
  ]
}
