export type SearchSnapshot = {
  text: string;
};

export type State = {
  subscribing: boolean;

  focusing: boolean;

  highlightId: null | number;

  found: { id: number; ranges: Range[] }[];

  open: boolean;

  shouldMatchCase: boolean;

  shouldMatchWholeWord: boolean;

  shouldUseRegularExpression: boolean;

  text: string;

  selection: {
    focusNode: Node;

    focusOffset: number;
  };

  searchVersion: number;

  pendingNavigation: "next" | "previous" | null;

  history: SearchSnapshot[];

  historyIndex: number;

  lastCommittedText: string;
};

const initialState: State = {
  subscribing: false,

  focusing: false,

  highlightId: null,

  found: [],

  open: false,

  shouldMatchCase: false,

  shouldMatchWholeWord: false,

  shouldUseRegularExpression: false,

  text: "",

  selection: {
    focusNode: document.body,

    focusOffset: 0,
  },

  searchVersion: 0,

  pendingNavigation: null,

  history: [
    { text: "" },
  ],

  historyIndex: 0,

  lastCommittedText: "",
};

export default initialState;
