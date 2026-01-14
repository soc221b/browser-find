import { Undo } from "../../action/undo";
import initialState, { State } from "../../state";
import reducer from "../index";

describe("undo reducer", () => {
  it("should do nothing if history has only one state", () => {
    const action: Undo = { type: "Undo" };
    const state = reducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it("should undo to the previous state", () => {
    let state: State = {
      ...initialState,
      text: "hello",
      history: [
        { text: "" },
        { text: "hello" },
      ],
      historyIndex: 1,
      lastCommittedText: "hello",
    };

    const action: Undo = { type: "Undo" };
    state = reducer(state, action);

    expect(state.text).toBe("");
    expect(state.historyIndex).toBe(0);
  });

  it("should undo multiple times", () => {
    let state: State = {
      ...initialState,
      text: "hello world",
      history: [
        { text: "" },
        { text: "hello" },
        { text: "hello world" },
      ],
      historyIndex: 2,
      lastCommittedText: "hello world",
    };

    const action: Undo = { type: "Undo" };

    // First undo: "hello world" -> "hello"
    state = reducer(state, action);
    expect(state.text).toBe("hello");
    expect(state.historyIndex).toBe(1);

    // Second undo: "hello" -> ""
    state = reducer(state, action);
    expect(state.text).toBe("");
    expect(state.historyIndex).toBe(0);
  });

  it("should not undo beyond the start of history", () => {
    let state: State = {
      ...initialState,
      text: "",
      history: [
        { text: "" },
      ],
      historyIndex: 0,
      lastCommittedText: "",
    };

    const action: Undo = { type: "Undo" };
    state = reducer(state, action);
    expect(state.text).toBe("");
    expect(state.historyIndex).toBe(0);
  });
});
