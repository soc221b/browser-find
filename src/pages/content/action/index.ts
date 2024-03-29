import { FindNext } from './find-next'
import { FindPrevious } from './find-previous'
import { Match } from './match'
import { ToggleFocus } from './toggle-focus'
import { ToggleOpen } from './toggle-open'
import { ToggleShouldMatchCase } from './toggle-should-match-case'
import { ToggleShouldMatchWholeWord } from './toggle-should-match-whole-word'
import { ToggleShouldUseRegularExpression } from './toggle-should-use-regular-expression'
import { Type } from './type'

export type Action =
  | FindNext
  | FindPrevious
  | Match
  | ToggleFocus
  | ToggleOpen
  | ToggleShouldMatchCase
  | ToggleShouldMatchWholeWord
  | ToggleShouldUseRegularExpression
  | Type
