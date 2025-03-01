import { Blur } from './blur'
import { Close } from './close'
import { Complete } from './complete'
import { FindNext } from './find-next'
import { FindPrevious } from './find-previous'
import { Focus } from './focus'
import { Input } from './input'
import { MakeSelection } from './make-selection'
import { Next } from './next'
import { Show } from './show'
import { Subscribe } from './subscribe'
import { ToggleShouldMatchCase } from './toggle-should-match-case'
import { ToggleShouldMatchWholeWord } from './toggle-should-match-whole-word'
import { ToggleShouldUseRegularExpression } from './toggle-should-use-regular-expression'

export type Action =
  | Blur
  | Close
  | Complete
  | FindNext
  | FindPrevious
  | Focus
  | Input
  | MakeSelection
  | Next
  | Show
  | Subscribe
  | ToggleShouldMatchCase
  | ToggleShouldMatchWholeWord
  | ToggleShouldUseRegularExpression
