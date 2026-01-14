import { Redo } from "../../action/redo";
import initialState, { State } from "../../state";
import reducer from "../index";

describe("redo reducer", () => {
  it("should do nothing if history is at the end", () => {
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

    const action: Redo = { type: "Redo" };
    const newState = reducer(state, action);
    expect(newState).toEqual(state);
  });

  it("should redo to the next state", () => {
    let state: State = {
      ...initialState,
      text: "",
      history: [
        { text: "" },
        { text: "hello" },
      ],
      historyIndex: 0,
      lastCommittedText: "",
    };

    const action: Redo = { type: "Redo" };
    state = reducer(state, action);

    expect(state.text).toBe("hello");
    expect(state.historyIndex).toBe(1);
  });

  it("should redo multiple times", () => {
    let state: State = {
      ...initialState,
      text: "",
      history: [
        { text: "" },
        { text: "hello" },
        { text: "hello world" },
      ],
      historyIndex: 0,
      lastCommittedText: "",
    };

    const action: Redo = { type: "Redo" };

    // First redo: "" -> "hello"
    state = reducer(state, action);
    expect(state.text).toBe("hello");
    expect(state.historyIndex).toBe(1);

    // Second redo: "hello" -> "hello world"
    state = reducer(state, action);
    expect(state.text).toBe("hello world");
    expect(state.historyIndex).toBe(2);
  });

  it("should not redo beyond the end of history", () => {
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

    const action: Redo = { type: "Redo" };
    state = reducer(state, action);
    expect(state.text).toBe("hello");
    expect(state.historyIndex).toBe(1);
  });
});
