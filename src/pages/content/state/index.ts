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

  selection: {
    focusNode: Node

    focusOffset: number
  }
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

  selection: {
    focusNode: document.body,

    focusOffset: 0,
  },
}

export default initialState
