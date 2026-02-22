import { CommitHistory } from "../../action/commit-history";
import initialState, { State } from "../../state";
import reducer from "../index";

describe("commit-history reducer", () => {
  it("should push lastCommittedText to history and update it to current text", () => {
    let state: State = {
      ...initialState,
      text: "hello",
      lastCommittedText: "",
      history: [
        { text: "" },
      ],
      historyIndex: 0,
    };

    const action: CommitHistory = { type: "CommitHistory" };
    state = reducer(state, action);

    expect(state.history).toEqual([
      { text: "" },
      { text: "hello" },
    ]);
    expect(state.historyIndex).toBe(1);
    expect(state.lastCommittedText).toBe("hello");
  });

  it("should clear future history on new commit", () => {
    let state: State = {
      ...initialState,
      text: "hello world",
      lastCommittedText: "hello",
      history: [
        { text: "" },
        { text: "hello" },
        { text: "hello world!!!" },
      ],
      historyIndex: 1, // We undid from "hello world!!!" to "hello"
    };

    const action: CommitHistory = { type: "CommitHistory" };
    state = reducer(state, action);

    expect(state.history).toEqual([
      { text: "" },
      { text: "hello" },
      { text: "hello world" },
    ]);
    expect(state.historyIndex).toBe(2);
    expect(state.lastCommittedText).toBe("hello world");
  });

  it("should enforce history limit of 100", () => {
    const history = Array.from({ length: 100 }, (_, i) => ({ text: `${i}` }));
    let state: State = {
      ...initialState,
      text: "100",
      lastCommittedText: "99",
      history: history,
      historyIndex: 99,
    };

    const action: CommitHistory = { type: "CommitHistory" };
    state = reducer(state, action);

    expect(state.history.length).toBe(100);
    expect(state.history[0]).toEqual({ text: "1" });
    expect(state.history[99]).toEqual({ text: "100" });
  });

  it("should do nothing if current text is same as lastCommittedText", () => {
    let state: State = {
      ...initialState,
      text: "hello",
      lastCommittedText: "hello",
      history: [
        { text: "" },
        { text: "hello" },
      ],
      historyIndex: 1,
    };

    const action: CommitHistory = { type: "CommitHistory" };
    const newState = reducer(state, action);
    expect(newState).toEqual(state);
  });
});
