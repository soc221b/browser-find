import { ChangeSelection } from './change-selection'
import { ClearMatch } from './clear-match'
import { FindNext } from './find-next'
import { FindPrevious } from './find-previous'
import { HighlightFollowing } from './highlight-following'
import { Match } from './match'
import { ToggleFinding } from './toggle-finding'
import { ToggleFocus } from './toggle-focus'
import { ToggleOpen } from './toggle-open'
import { ToggleShouldMatchCase } from './toggle-should-match-case'
import { ToggleShouldMatchWholeWord } from './toggle-should-match-whole-word'
import { ToggleShouldUseRegularExpression } from './toggle-should-use-regular-expression'
import { Type } from './type'

export type Action =
  | ChangeSelection
  | ClearMatch
  | FindNext
  | FindPrevious
  | HighlightFollowing
  | Match
  | ToggleFinding
  | ToggleFocus
  | ToggleOpen
  | ToggleShouldMatchCase
  | ToggleShouldMatchWholeWord
  | ToggleShouldUseRegularExpression
  | Type
