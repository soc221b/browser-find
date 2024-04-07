import { find } from '../find'

type Suit = {
  documentElement: HTMLElement

  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  expected: '<snapshot>' | Range[][]
}

const suits: Suit[] = []

{
  const documentElement = createDocumentElement(`<div id="browser-find-top-layer">a</div>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}

// === element start ====
{
  const documentElement = createDocumentElement(`<script>"a"</script>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<noscript>a</noscript>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<style>a {}</style>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<select><option>a</option></select>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
// {
//   // TODO: we cannot highlight input value, because its textContent is empty, but is there a workaround
//   const documentElement = createDocumentElement(`<input value="a">`)
//   suits.push({
//     documentElement,
//     text: 'a',
//     shouldMatchCase: false,
//     shouldMatchWholeWord: false,
//     shouldUseRegularExpression: false,
//     expected: [],
//   })
// }
// === element end ====

// === class start ====
{
  const documentElement = createDocumentElement(`<span class="sr-only">a</span>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
// === class end ====

// === style start ====
{
  const documentElement = createDocumentElement(`<span style="display: none;">a</span>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<span style="visibility: hidden;">a</span>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  // https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
  {
    const documentElement = createDocumentElement(
      `<span style="text-transform: none;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
    )
    suits.push({
      documentElement,
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit…',
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        Array(57)
          .fill(null)
          .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
      ],
    })
  }
  {
    {
      const documentElement = createDocumentElement(
        `<span style="text-transform: capitalize;">(this) "is" [a] –short– -test- «for» *the* _css_ ¿capitalize? ?¡transform!</span>`,
      )
      suits.push({
        documentElement,
        text: '(This) "Is" [A] –Short– -Test- «For» *The* _css_ ¿Capitalize? ?¡Transform!',
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(74)
            .fill(null)
            .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
        ],
      })
    }
    // TODO:
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
      )
      suits.push({
        documentElement,
        text: 'The Dutch Word: "Ijsland" Starts With A Digraph.',
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(48)
            .fill(null)
            .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
        ],
      })
    }
  }
  {
    {
      const documentElement = createDocumentElement(
        `<span style="text-transform: uppercase;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
      )
      suits.push({
        documentElement,
        text: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISICING ELIT…',
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(57)
            .fill(null)
            .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
        ],
      })
    }
    // TODO:
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
  }
  {
    {
      const documentElement = createDocumentElement(
        `<span style="text-transform: lowercase;">Lorem ipsum dolor sit amet, consectetur adipisicing elit…</span>`,
      )
      suits.push({
        documentElement,
        text: 'lorem ipsum dolor sit amet, consectetur adipisicing elit…',
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(57)
            .fill(null)
            .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
        ],
      })
    }
    // TODO:
    // {
    //   const documentElement = createDocumentElement(
    //     `<span style="text-transform: lowercase;">Σ IS A greek LETTER that appears SEVERAL TIMES IN ΟΔΥΣΣΕΥΣ.</span>`,
    //   )
    //   suits.push({
    //     documentElement,
    //     text: 'σ is a greek letter that appears several times in οδυσσευς.',
    //     shouldMatchCase: true,
    //     shouldMatchWholeWord: false,
    //     shouldUseRegularExpression: false,
    //     expected: [
    //       Array(59)
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
        `<span style="text-transform: lowercase;">Ĩ is a Lithuanian LETTER as is J́</span>`,
      )
      suits.push({
        documentElement,
        text: 'ĩ is a lithuanian letter as is j́',
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          Array(33)
            .fill(null)
            .map((_, i) => createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], i, i + 1)),
        ],
      })
    }
  }
}
// TODO:
// https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
/* white-space */ {
  /* normal */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: normal;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: normal;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: normal;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: normal;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
  /* nowrap */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: nowrap;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: nowrap;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: nowrap;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: nowrap;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
  /* pre */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a ',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a  b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 2, 3),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre;"> a</span>`)
        suits.push({
          documentElement,
          text: '  a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
  /* pre-wrap */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a ',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a  b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 2, 3),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;">a\n</span>\nb`)
      suits.push({
        documentElement,
        text: ' b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre-wrap;"> a</span>`)
        suits.push({
          documentElement,
          text: '  a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
  /* pre-line */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre-line;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a ',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: pre-line;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre-line;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: pre-line;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
  /* break-spaces */ {
    {
      const documentElement = createDocumentElement(`<span style="white-space: break-spaces;">a\n</span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a ',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [],
      })
    }
    {
      const documentElement = createDocumentElement(`<span style="white-space: break-spaces;">a  </span><span>b</span>`)
      suits.push({
        documentElement,
        text: 'a  b',
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        expected: [
          [
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 2, 3),
            createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
          ],
        ],
      })
    }
    {
      {
        const documentElement = createDocumentElement(`<span style="white-space: break-spaces;"> a</span>`)
        suits.push({
          documentElement,
          text: 'a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [[createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2)]],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: break-spaces;"> a</span>`)
        suits.push({
          documentElement,
          text: ' a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [
            [
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
              createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
            ],
          ],
        })
      }
      {
        const documentElement = createDocumentElement(`<span style="white-space: break-spaces;"> a</span>`)
        suits.push({
          documentElement,
          text: '  a',
          shouldMatchCase: false,
          shouldMatchWholeWord: false,
          shouldUseRegularExpression: false,
          expected: [],
        })
      }
    }
  }
}
// === style end ====

// === match case start ====
{
  const documentElement = createDocumentElement(`a`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [[createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)]],
  })
}
{
  const documentElement = createDocumentElement(`a`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: true,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`A`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: true,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [[createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)]],
  })
}
// === match case end ====

// === match whole word start ====
{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [[createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)]],
  })
}
{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: true,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'abc',
    shouldMatchCase: false,
    shouldMatchWholeWord: true,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[0], 2, 3),
      ],
    ],
  })
}
// === match whole word end ====

// === use regular expression start ====
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: true,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: true,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
      ],
    ],
  })
}
// === use regular expression end ====

// === spaces start ====
{
  const documentElement = createDocumentElement(`a <span>b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`a\n<span>b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`a \n \n <span>b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`a \n \n b`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[0], 6, 7),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`<span>a</span> <span>b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[1], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[2].childNodes[0], 0, 1),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`<span>a </span><span> b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 1, 2),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`<span>a</span><span> b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[1].childNodes[0], 1, 2),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`<span>a</span>\n`)
  suits.push({
    documentElement,
    text: 'a ',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<span>a &nbsp; b</span>`)
  suits.push({
    documentElement,
    text: 'a   b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 2, 3),
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 3, 4),
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 4, 5),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`<span>a</span>\n<span>b</span>`)
  suits.push({
    documentElement,
    text: 'a b',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0].childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[1], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[2].childNodes[0], 0, 1),
      ],
    ],
  })
}
// === spaces end ====

suits.forEach(
  ({ documentElement, text, shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, expected }) => {
    it(createTestName(), async () => {
      // arrange
      let onComplete = () => {}
      const promise = new Promise<void>((r) => (onComplete = r))
      const actual: Range[][] = []
      const onNext = (ranges: Range[]) => actual.push(ranges)

      // act
      find({
        documentElement,
        text,
        shouldMatchCase,
        shouldMatchWholeWord,
        shouldUseRegularExpression,
        onNext,
        onComplete,
      })
      await promise

      // assert
      try {
        if (expected === '<snapshot>') {
          expect(
            actual.map((ranges) =>
              ranges.map((range) => ({
                startOffset: range.startOffset,
                endOffset: range.endOffset,
              })),
            ),
          ).toMatchSnapshot()
        } else {
          expect(actual.length).toBe(expected.length)

          actual.forEach((actualRanges, rangesListIndex) => {
            const expectedRanges = expected[rangesListIndex]
            expect(actualRanges.length).toBe(expectedRanges.length)

            actualRanges.forEach((actualRange, rangesIndex) => {
              const expectedRange = expectedRanges[rangesIndex]
              expect(actualRange.startContainer).toBe(expectedRange.startContainer)
              expect(actualRange.startOffset).toBe(expectedRange.startOffset)
              expect(actualRange.endContainer).toBe(expectedRange.endContainer)
              expect(actualRange.endOffset).toBe(expectedRange.endOffset)
            })
          })
        }
      } catch (e) {
        throw e
      }
    })

    function createTestName() {
      const booleanPadMaxLength = 5
      const textPadMaxLength = Math.max('text'.length, text.length) + 3
      const testName =
        [
          'C'.padEnd(booleanPadMaxLength, ' '),
          'W'.padEnd(booleanPadMaxLength, ' '),
          'R'.padEnd(booleanPadMaxLength, ' '),
        ].join('  ') +
        '\n    ' +
        [
          String(shouldMatchCase).padEnd(booleanPadMaxLength, ' '),
          String(shouldMatchWholeWord).padEnd(booleanPadMaxLength, ' '),
          String(shouldUseRegularExpression).padEnd(booleanPadMaxLength, ' '),
        ].join('  ') +
        '\n    ' +
        'text      : `' +
        text +
        '`' +
        '\n    ' +
        'innerHTML : `' +
        documentElement.innerHTML.replace(/\n/g, '\\n') +
        '`' +
        '\n   '
      return testName
    }
  },
)

function createDocumentElement(bodyInnerHTML: string): HTMLElement {
  const body = document.createElement('body')
  body.innerHTML = bodyInnerHTML
  const documentElement = document.createElement('html')
  documentElement.appendChild(body)
  return documentElement
}

function createRange(node: Node, startOffset: number, endOffset: number): Range {
  const range = new Range()
  range.setStart(node, startOffset)
  range.setEnd(node, endOffset)
  return range
}
