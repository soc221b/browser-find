import { createRoot } from 'react-dom/client'
import _StyleSheet from './components/_StyleSheet'
import Input from './components/Input'
import ToggleMatchCase from './components/ToggleMatchCase'
import ToggleMatchWholeWord from './components/ToggleMatchWholeWord'
import ToggleUseRegularExpression from './components/ToggleUseRegularExpression'
import _Find from './components/_Find'
import _HotKey from './components/_HotKey'
import _ActionIcon from './components/_ActionIcon'
import FindPrevious from './components/FindPrevious'
import FindNext from './components/FindNext'
import Close from './components/Close'
import Result from './components/Result'
import Tooltip from './components/Tooltip'

function App(): JSX.Element {
  return (
    <div className="root">
      <Input></Input>
      <Result></Result>
      <ToggleMatchCase></ToggleMatchCase>
      <ToggleMatchWholeWord></ToggleMatchWholeWord>
      <ToggleUseRegularExpression></ToggleUseRegularExpression>
      <FindPrevious></FindPrevious>
      <FindNext></FindNext>
      <Close></Close>

      <Tooltip></Tooltip>

      <_HotKey></_HotKey>
      <_ActionIcon></_ActionIcon>
      <_StyleSheet></_StyleSheet>
      <_Find></_Find>
    </div>
  )
}

function init() {
  const topLayerContainer = document.createElement('div')
  topLayerContainer.id = 'browser-find-top-layer'
  // TODO: remove any
  ;(topLayerContainer as any).popover = 'manual'
  document.body.appendChild(topLayerContainer)

  const root = createRoot(topLayerContainer)
  root.render(<App />)
}

document.addEventListener('DOMContentLoaded', init)
