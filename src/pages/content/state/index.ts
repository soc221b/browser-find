export type State = {
  focusing: boolean

  matchId: null | string

  matches: { id: string; scrollIntoView: () => void }[]

  open: boolean

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  text: string
}

const initialState: State = {
  focusing: false,

  matchId: null,

  matches: [],

  open: false,

  shouldMatchCase: false,

  shouldMatchWholeWord: false,

  shouldUseRegularExpression: false,

  text: '',
}

export default initialState
