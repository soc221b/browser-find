export type State = {
  subscribing: boolean

  focusing: boolean

  highlightId: null | number

  found: { id: number; ranges: Range[] }[]

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
  subscribing: false,

  focusing: false,

  highlightId: null,

  found: [],

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
