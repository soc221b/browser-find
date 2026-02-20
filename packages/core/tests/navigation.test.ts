import {
  createSearchNavigator,
  planNextNavigation,
  planPreviousNavigation,
  resolveHighlightIndexOnComplete,
  type SearchMatch,
} from "@/navigation";

describe("navigation helpers", () => {
  it("plans next navigation and wraps at end", () => {
    const matches: SearchMatch[] = [
      { id: 1, ranges: [] },
      { id: 2, ranges: [] },
      { id: 3, ranges: [] },
    ];

    expect(
      planNextNavigation({
        matches,
        currentId: 2,
      }),
    ).toEqual({
      currentIndex: 1,
      nextIndex: 2,
      nextId: 3,
      isWrappingAround: false,
      shouldReSearch: false,
    });

    expect(
      planNextNavigation({
        matches,
        currentId: 3,
      }),
    ).toEqual({
      currentIndex: 2,
      nextIndex: 0,
      nextId: 1,
      isWrappingAround: true,
      shouldReSearch: true,
    });
  });

  it("plans previous navigation and wraps at start", () => {
    const matches: SearchMatch[] = [
      { id: 1, ranges: [] },
      { id: 2, ranges: [] },
      { id: 3, ranges: [] },
    ];

    expect(
      planPreviousNavigation({
        matches,
        currentId: 2,
      }),
    ).toEqual({
      currentIndex: 1,
      nextIndex: 0,
      nextId: 1,
      isWrappingAround: false,
      shouldReSearch: false,
    });

    expect(
      planPreviousNavigation({
        matches,
        currentId: 1,
      }),
    ).toEqual({
      currentIndex: 0,
      nextIndex: 2,
      nextId: 3,
      isWrappingAround: true,
      shouldReSearch: true,
    });
  });

  it("search navigator mutates current id across operations", () => {
    const matches: SearchMatch[] = [
      { id: 10, ranges: [] },
      { id: 20, ranges: [] },
      { id: 30, ranges: [] },
    ];

    const navigator = createSearchNavigator({
      matches,
      currentId: null,
    });

    expect(navigator.getCurrentId()).toBeNull();
    expect(navigator.next().nextId).toBe(10);
    expect(navigator.getCurrentId()).toBe(10);
    expect(navigator.next().nextId).toBe(20);
    expect(navigator.previous().nextId).toBe(10);
  });

  it("resolves initial highlight index from selection and pending navigation", () => {
    const root = document.createElement("div");
    const a = document.createTextNode("alpha");
    const b = document.createTextNode("beta");
    const c = document.createTextNode("gamma");
    root.append(a, b, c);
    document.body.append(root);

    const makeRange = (node: Text, start: number, end: number) => {
      const range = new Range();
      range.setStart(node, start);
      range.setEnd(node, end);
      return range;
    };

    const matches: SearchMatch[] = [
      {
        id: 1,
        ranges: [
          makeRange(a, 0, 1),
        ],
      },
      {
        id: 2,
        ranges: [
          makeRange(b, 0, 1),
        ],
      },
      {
        id: 3,
        ranges: [
          makeRange(c, 0, 1),
        ],
      },
    ];

    expect(
      resolveHighlightIndexOnComplete({
        matches,
        selection: {
          focusNode: b,
          focusOffset: 0,
        },
        pendingNavigation: null,
      }),
    ).toBe(1);

    expect(
      resolveHighlightIndexOnComplete({
        matches,
        selection: {
          focusNode: b,
          focusOffset: 0,
        },
        pendingNavigation: "next",
      }),
    ).toBe(2);

    expect(
      resolveHighlightIndexOnComplete({
        matches,
        selection: {
          focusNode: b,
          focusOffset: 0,
        },
        pendingNavigation: "previous",
      }),
    ).toBe(0);
  });
});
