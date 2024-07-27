export type State = {
  finding: boolean

  focusing: boolean

  matchId: null | number

  matches: { id: number; ranges: Range[] }[]

  open: boolean

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  text: string
}

const initialState: State = {
  finding: false,

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
