import { find } from "@/find";

type Suit = {
  documentElement: HTMLElement;

  text: string;

  shouldMatchCase: boolean;

  shouldMatchWholeWord: boolean;

  shouldUseRegularExpression: boolean;

  expected: "<snapshot>" | Range[][];
};

const suits: Suit[] = [];

(function addIdSuits() {
  (function browserFindTopLayer() {
    const documentElement = createDocumentElement(`<div id="browser-find-top-layer">a</div>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();
})();

//
(function addElementSuits() {
  (function script() {
    const documentElement = createDocumentElement(`<script>"a"</script>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();

  //
  (function noscript() {
    const documentElement = createDocumentElement(`<noscript>a</noscript>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();

  //
  (function style() {
    const documentElement = createDocumentElement(`<style>a {}</style>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();

  //
  (function option() {
    const documentElement = createDocumentElement(`<select><option>a</option></select>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();

  //
  (function iframe() {
    // TODO: support finding text in iframe
    // const iframe = document.createElement('iframe')
    // iframe.srcdoc = 'a'
    // const body = document.createElement('body')
    // body.appendChild(iframe)
    // const documentElement = document.createElement('html')
    // documentElement.appendChild(body)
    // suits.push({
    //   documentElement,
    //   text: 'a',
    //   shouldMatchCase: false,
    //   shouldMatchWholeWord: false,
    //   shouldUseRegularExpression: false,
    //   expected: [[expect.anything()]],
    // })
  })();

  //
  (function input() {
    // TODO: is there a workaround to simulate highlighting input value?
    // we cannot highlight input value, because its textContent is empty
    // const documentElement = createDocumentElement(`<input value="a">`)
    // suits.push({
    //   documentElement,
    //   text: 'a',
    //   shouldMatchCase: false,
    //   shouldMatchWholeWord: false,
    //   shouldUseRegularExpression: false,
    //   expected: [],
    // })
  })();

  //
  (function shadowDOM() {
    {
      const documentElement = createDocumentElement(`<div></div>`);
      const div = documentElement.querySelector("div")!;
      const shadowRoot = div.attachShadow({ mode: "open" });
      shadowRoot.textContent = "a";
      suits.push({
        documentElement,
        text: "a",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(shadowRoot.childNodes[0], 0, 1),
          ],
        ],
      });
    }
  })();
})();

//
(function addCLassSuits() {
  (function srOnly() {
    const documentElement = createDocumentElement(`<span class="sr-only">a</span>`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  })();
})();

//
(function addStyleSuits() {
  (function display() {
    (function none() {
      const documentElement = createDocumentElement(`<span style="display: none;">a</span>`);
      suits.push({
        documentElement,
        text: "a",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      });
    })();
  })();

  //
  (function visibility() {
    (function hidden() {
      const documentElement = createDocumentElement(`<span style="visibility: hidden;">a</span>`);
      suits.push({
        documentElement,
        text: "a",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      });
    })();
  })();

  //
  (function textTransform() {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform

    (function none() {
      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: none;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
        );
        suits.push({
          documentElement,
          text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit…",
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(57)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }
    })();

    //
    (function capitalize() {
      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: capitalize;">(this) "is" [a] –short– -test- «for» *the* _css_ ¿capitalize? ?¡transform!</span>`,
        );
        suits.push({
          documentElement,
          text: '(This) "Is" [A] –Short– -Test- «For» *The* _css_ ¿Capitalize? ?¡Transform!',
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(74)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }

      // TODO: support finding symbol texts
      // {
      //   const documentElement = createDocumentElement(
      //     `<span style="text-transform: capitalize;">ⓐⓑⓒ (ⓓⓔⓕ) —ⓖⓗⓘ— ⓙkl</span>`,
      //   )
      //   suits.push({
      //     documentElement,
      //     text: 'Ⓐⓑⓒ (Ⓓⓔⓕ) —Ⓖⓗⓘ— Ⓙkl',
      //     shouldMatchCase: true,
      //     shouldMatchWholeWord: false,
      //     shouldUseRegularExpression: false,
      //     expected: [
      //       Array(19)
      //         .fill(null)
      //         .map((_, i) =>
      //           createRange(
      //             documentElement.querySelector('body')!.childNodes[0]
      //               .childNodes[0],
      //             i,
      //             i + 1,
      //           ),
      //         ),
      //     ],
      //   })
      // }

      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: capitalize;">The Dutch word: "ijsland" starts with a digraph.</span>`,
        );
        suits.push({
          documentElement,
          text: 'The Dutch Word: "Ijsland" Starts With A Digraph.',
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(48)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }
    })();

    //
    (function uppercase() {
      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: uppercase;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
        );
        suits.push({
          documentElement,
          text: "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISICING ELIT…",
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(57)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }

      // TODO: support finding Greek texts
      // {
      //   const documentElement = createDocumentElement(
      //     `<span style="text-transform: uppercase;">Θα πάμε στο "Θεϊκό φαΐ" ή στη "Νεράιδα"</span>`,
      //   )
      //   suits.push({
      //     documentElement,
      //     text: 'ΘΑ ΠΆΜΕ ΣΤΟ "ΘΕΪΚΌ ΦΑΪ́" Ή ΣΤΗ "ΝΕΡΆΙΔΑ"',
      //     shouldMatchCase: true,
      //     shouldMatchWholeWord: false,
      //     shouldUseRegularExpression: false,
      //     expected: [
      //       Array(39)
      //         .fill(null)
      //         .map((_, i) =>
      //           createRange(
      //             documentElement.querySelector('body')!.childNodes[0]
      //               .childNodes[0],
      //             i,
      //             i + 1,
      //           ),
      //         ),
      //     ],
      //   })
      // }
    })();

    //
    (function lowercase() {
      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: lowercase;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
        );
        suits.push({
          documentElement,
          text: "lorem ipsum dolor sit amet, consectetur adipisicing elit…",
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(57)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: lowercase;">Σ IS A greek LETTER that appears SEVERAL TIMES IN ΟΔΥΣΣΕΥΣ.</span>`,
        );
        suits.push({
          documentElement,
          text: "σ is a greek letter that appears several times in οδυσσευς.",
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(59)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="text-transform: lowercase;">Ĩ is a Lithuanian LETTER as is J́</span>`,
        );
        suits.push({
          documentElement,
          text: "ĩ is a lithuanian letter as is j́",
          shouldMatchCase: true,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            Array(33)
              .fill(null)
              .map((_, i) =>
                createRange(
                  documentElement.querySelector("body")!.childNodes[0].childNodes[0],
                  i,
                  i + 1,
                ),
              ),
          ],
        });
      }
    })();
  })();

  // TODO: support finding text using text-wrap-mode
  // https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-mode
  (function textWrapMode() {
    //
  })();

  // TODO: support finding text using text-wrap-style
  // https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-style
  (function textWrapStyle() {
    //
  })();

  //
  (function textWrap() {
    (function wrap() {
      const documentElement = createDocumentElement(
        `<div style="text-wrap: wrap; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function nowrap() {
      const documentElement = createDocumentElement(
        `<div style="text-wrap: nowrap; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function balance() {
      const documentElement = createDocumentElement(
        `<div style="text-wrap: balance; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function pretty() {
      const documentElement = createDocumentElement(
        `<div style="text-wrap: pretty; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function stable() {
      const documentElement = createDocumentElement(
        `<div style="text-wrap: stable; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();
  })();

  //
  (function whiteSpaceCollapse() {
    //
    (function collapse() {
      const documentElement = createDocumentElement(
        `<div style="white-space-collapse: collapse; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function preserve() {
      const documentElement = createDocumentElement(
        `<div style="white-space-collapse: preserve; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function preserveBreaks() {
      const documentElement = createDocumentElement(
        `<div style="white-space-collapse: preserve-breaks; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();

    //
    (function breakSpaces() {
      const documentElement = createDocumentElement(
        `<div style="white-space-collapse: break-spaces; width: 250px"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.</p></div>`,
      );
      suits.push({
        documentElement,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut cum eum id quos est.",
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(92)
            .fill(null)
            .map((_, i) =>
              createRange(
                documentElement.querySelector("body")!.childNodes[0].childNodes[0].childNodes[0],
                i,
                i + 1,
              ),
            ),
        ],
      });
    })();
  })();

  //
  (function whiteSpace() {
    (function normal() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: normal;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: normal;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: normal;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: normal;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();

    //
    (function nowrap() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: nowrap;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: nowrap;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: nowrap;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: nowrap;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();

    //
    (function pre() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a ",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a  b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 2, 3),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`);
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`);
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`);
        suits.push({
          documentElement,
          text: "  a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();

    //
    (function preWrap() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a ",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a  b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 2, 3),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;">a\n</span>\nb`,
        );
        suits.push({
          documentElement,
          text: " b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-wrap;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "  a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();

    //
    (function preLine() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-line;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a ",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-line;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-line;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: pre-line;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();

    //
    (function breakSpaces() {
      {
        const documentElement = createDocumentElement(
          `<span style="white-space: break-spaces;">a\n</span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a ",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: break-spaces;">a  </span><span>b</span>`,
        );
        suits.push({
          documentElement,
          text: "a  b",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 2, 3),
              createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: break-spaces;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: break-spaces;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: " a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        });
      }

      {
        const documentElement = createDocumentElement(
          `<span style="white-space: break-spaces;"> a</span>`,
        );
        suits.push({
          documentElement,
          text: "  a",
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        });
      }
    })();
  })();
})();

//
(function addMatchCaseSuits() {
  {
    const documentElement = createDocumentElement(`a`);
    suits.push({
      documentElement,
      text: "A",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`a`);
    suits.push({
      documentElement,
      text: "A",
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  }

  {
    const documentElement = createDocumentElement(`A`);
    suits.push({
      documentElement,
      text: "A",
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
        ],
      ],
    });
  }
})();

//
(function addMatchWholeWordSuits() {
  {
    const documentElement = createDocumentElement(`abc`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`abc`);
    suits.push({
      documentElement,
      text: "a",
      shouldMatchCase: false,
      shouldMatchWholeWord: true,
      shouldUseRegularExpression: false,
      expected: [],
    });
  }

  {
    const documentElement = createDocumentElement(`abc`);
    suits.push({
      documentElement,
      text: "abc",
      shouldMatchCase: false,
      shouldMatchWholeWord: true,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[0], 2, 3),
        ],
      ],
    });
  }
})();

//
(function addUseRegularExpressionStart() {
  {
    const documentElement = createDocumentElement(`\\d`);
    suits.push({
      documentElement,
      text: "\\d",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`\\d`);
    suits.push({
      documentElement,
      text: "\\d",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: true,
      expected: [],
    });
  }

  {
    const documentElement = createDocumentElement(`\\d`);
    suits.push({
      documentElement,
      text: "\\\\d",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: true,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
        ],
      ],
    });
  }
})();

//
(function addOtherSuits() {
  {
    const documentElement = createDocumentElement(`a <span>b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`a\n<span>b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`a \n \n <span>b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`a \n \n b`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[0], 6, 7),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a</span> <span>b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[1], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[2].childNodes[0], 0, 1),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a </span><span> b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 1, 2),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a</span><span> b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[1].childNodes[0], 1, 2),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a</span>\n`);
    suits.push({
      documentElement,
      text: "a ",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a &nbsp; b</span>`);
    suits.push({
      documentElement,
      text: "a   b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 1, 2),
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 2, 3),
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 3, 4),
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 4, 5),
        ],
      ],
    });
  }

  {
    const documentElement = createDocumentElement(`<span>a</span>\n<span>b</span>`);
    suits.push({
      documentElement,
      text: "a b",
      shouldMatchCase: false,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(documentElement.querySelector("body")!.childNodes[0].childNodes[0], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[1], 0, 1),
          createRange(documentElement.querySelector("body")!.childNodes[2].childNodes[0], 0, 1),
        ],
      ],
    });
  }
})();

suits.forEach(
  (
    {
      documentElement,
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
      expected,
    },
    index,
  ) => {
    it(createTestName(), async () => {
      // arrange
      let onComplete = () => {};
      const onCompletePromise = new Promise<void>((resolve) => (onComplete = resolve));
      const actual: Range[][] = [];
      const onNext = (ranges: Range[]) => actual.push(ranges);

      // act
      find({
        documentElement,
        text,
        shouldMatchCase,
        shouldMatchWholeWord,
        shouldUseRegularExpression,
        onNext,
        onComplete,
      });
      await onCompletePromise;

      // assert
      try {
        if (expected === "<snapshot>") {
          expect(
            actual.map((ranges) =>
              ranges.map((range) => ({
                startOffset: range.startOffset,
                endOffset: range.endOffset,
              })),
            ),
          ).toMatchSnapshot();
        } else {
          expect(actual.length).toBe(expected.length);

          actual.forEach((actualRanges, rangesListIndex) => {
            const expectedRanges = expected[rangesListIndex];
            expect(actualRanges.length).toBe(expectedRanges.length);

            actualRanges.forEach((actualRange, rangesIndex) => {
              const expectedRange = expectedRanges[rangesIndex];
              expect(actualRange.startContainer).toBe(expectedRange.startContainer);
              expect(actualRange.startOffset).toBe(expectedRange.startOffset);
              expect(actualRange.endContainer).toBe(expectedRange.endContainer);
              expect(actualRange.endOffset).toBe(expectedRange.endOffset);
            });
          });
        }
      } catch (e) {
        throw e;
      }
    });

    function createTestName() {
      const digits = suits.length.toString().split("").length;
      const indent = " ".repeat(4 + digits + 2);
      const padMaxLength = 25;
      const testName =
        [
          index.toString().padEnd(digits, " "),
          "Match case".padEnd(padMaxLength, " "),
          "Match whole Word".padEnd(padMaxLength, " "),
          "Use regular expression".padEnd(padMaxLength, " "),
        ].join("  ") +
        `\n${indent}` +
        [
          String(shouldMatchCase).padEnd(padMaxLength, " "),
          String(shouldMatchWholeWord).padEnd(padMaxLength, " "),
          String(shouldUseRegularExpression).padEnd(padMaxLength, " "),
        ].join("  ") +
        `\n${indent}` +
        `text      : \`${text}\`` +
        `\n${indent}` +
        `innerHTML : \`${documentElement.innerHTML
          .replace(/\n/g, "\\n")
          .replace(/^<body>/, "")
          .replace(/<\/body>$/, "")}\`` +
        `\n${indent.slice(0, -1)}`;
      return testName;
    }
  },
);

function createDocumentElement(bodyInnerHTML: string): HTMLElement {
  const body = document.createElement("body");
  body.innerHTML = bodyInnerHTML;
  const documentElement = document.createElement("html");
  documentElement.appendChild(body);
  return documentElement;
}

function createRange(node: Node, startOffset: number, endOffset: number): Range {
  const range = new Range();
  range.setStart(node, startOffset);
  range.setEnd(node, endOffset);
  return range;
}
