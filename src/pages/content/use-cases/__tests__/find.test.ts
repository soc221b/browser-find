import {
  createRangesList,
  createRegex,
  createSearchStringList,
  createNodeWithInnerTextList,
} from '../find-v2'

describe('createRegex', () => {
  const suits: {
    name: string
    param: {
      shouldMatchCase: boolean
      shouldMatchWholeWord: boolean
      shouldUseRegularExpression: boolean
      text: string
    }
    returnValue: RegExp
  }[] = [
    {
      name: 'basic',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        text: 'abc?',
      },
      returnValue: /abc\?/gim,
    },
    {
      name: 'match case',
      param: {
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        text: 'abc?',
      },
      returnValue: /abc\?/gm,
    },
    {
      name: 'match whole word',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: true,
        shouldUseRegularExpression: false,
        text: 'abc?',
      },
      returnValue: /\babc\?\b/gim,
    },
    {
      name: 'use regular expression',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: true,
        text: 'abc?',
      },
      returnValue: /abc?/gim,
    },
    {
      name: 'ignore invalid regular expression',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: true,
        text: '(',
      },
      returnValue: /^\b$/,
    },
  ]

  suits.forEach((suit) => {
    it(suit.name, () => {
      expect(createRegex(suit.param).toString()).toBe(String(suit.returnValue))
    })
  })
})

describe('createSearchStringList', () => {
  const suits: {
    name: string
    param: {
      innerText: string
      regex: RegExp
    }
    returnValue: string[]
  }[] = [
    {
      name: 'basic',
      param: {
        innerText: 'abc? ABC?D',
        regex: /abc\?/gim,
      },
      returnValue: ['abc?', 'ABC?'],
    },
    {
      name: 'match case',
      param: {
        innerText: 'abc? ABC? abc? ABC?',
        regex: /abc\?/gm,
      },
      returnValue: ['abc?', 'abc?'],
    },
    {
      name: 'match whole word',
      param: {
        innerText: 'abc? ABc?abc? ABC?',
        regex: /\babc\?\b/gim,
      },
      returnValue: ['ABc?'],
    },
    {
      name: 'should match multiple line',
      param: {
        innerText: '\nabc',
        regex: /\w/gim,
      },
      returnValue: ['a', 'b', 'c'],
    },
    {
      name: 'should break early if match nothing',
      param: {
        innerText: 'abc',
        regex: /^/gim,
      },
      returnValue: [],
    },
  ]

  suits.forEach((suit) => {
    it(suit.name, () => {
      expect(createSearchStringList(suit.param)).toEqual(suit.returnValue)
    })
  })
})

describe('createNodeWithInnerTextList', () => {
  const suits: {
    name: string
    param: {
      documentElement: HTMLElement
    }
    returnValue: { node: Node; innerText: string }[]
  }[] = [
    {
      name: 'should ignore <script>',
      param: {
        documentElement: createDocumentElement(`<script>123</script>`),
      },
      returnValue: [],
    },
    {
      name: 'should ignore <noscript>',
      param: {
        documentElement: createDocumentElement(`<noscript>abc</noscript>`),
      },
      returnValue: [],
    },
    {
      name: 'should ignore <style>',
      param: {
        documentElement: createDocumentElement(
          `<style>* { all: unset; }</style>`,
        ),
      },
      returnValue: [],
    },
    {
      name: 'should ignore <select>',
      param: {
        documentElement: createDocumentElement(
          `<select><option>Option1</option></select>`,
        ),
      },
      returnValue: [],
    },
    {
      name: 'should ignore .sr-only (conventional class for screen readers)',
      param: {
        documentElement: createDocumentElement(
          `<span class="sr-only">abc</span>`,
        ),
      },
      returnValue: [],
    },
    {
      name: 'should ignore <datalist>',
      param: {
        documentElement: createDocumentElement(
          [
            `<label for="ice-cream-choice">Choose a flavor:</label>`,
            `<input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice"/>`,
            `<datalist id="ice-cream-flavors"><option value="Chocolate"></option></datalist>`,
          ].join(''),
        ),
      },
      returnValue: [
        {
          node: document.createTextNode('Choose a flavor:'),
          innerText: 'Choose a flavor:',
        },
      ],
    },
    {
      name: 'should ignore display: none',
      param: {
        documentElement: createDocumentElement(
          `<span style="display: none;">abc</span>`,
        ),
      },
      returnValue: [],
    },
    {
      name: 'should ignore visibility: hidden',
      param: {
        documentElement: createDocumentElement(
          `<span style="visibility: hidden;">abc</span>`,
        ),
      },
      returnValue: [],
    },
    {
      name: 'should do text transform: uppercase',
      param: {
        documentElement: createDocumentElement(
          `<span style="text-transform: uppercase;">abc</span>`,
        ),
      },
      returnValue: [{ node: document.createTextNode('abc'), innerText: 'ABC' }],
    },
    {
      name: 'should do text transform: lowercase',
      param: {
        documentElement: createDocumentElement(
          `<span style="text-transform: lowercase;">ABC</span>`,
        ),
      },
      returnValue: [{ node: document.createTextNode('ABC'), innerText: 'abc' }],
    },
    {
      name: 'should trim leading spaces for first child node',
      param: {
        documentElement: createDocumentElement(`\n a`),
      },
      returnValue: [{ node: document.createTextNode('\n a'), innerText: 'a' }],
    },
    {
      name: '"a\\n<span>b</span>"',
      param: {
        documentElement: createDocumentElement(`a\n<span>b</span>`),
      },
      returnValue: [
        { node: document.createTextNode('a\n'), innerText: 'a ' },
        { node: document.createTextNode('b'), innerText: 'b' },
      ],
    },
    {
      name: 'should insert an empty node to consume space if there is no trailing space on non-last child node and next sibling is not a text node',
      param: {
        documentElement: createDocumentElement(`<span>a</span>b`),
      },
      returnValue: [
        { node: document.createTextNode('a'), innerText: 'a' },
        { node: document.createTextNode('b'), innerText: 'b' },
      ],
    },
    {
      name: '"<span>a</span>b "',
      param: {
        documentElement: createDocumentElement(`<span>a</span>b `),
      },
      returnValue: [
        { node: document.createTextNode('a'), innerText: 'a' },
        { node: document.createTextNode('b '), innerText: 'b' },
      ],
    },
    {
      name: '"<br>\\na"',
      param: {
        documentElement: createDocumentElement(`<br>\na`),
      },
      returnValue: [{ node: document.createTextNode('\na'), innerText: 'a' }],
    },
    {
      name: '"<span>a</span> b"',
      param: {
        documentElement: createDocumentElement(`<span>a</span> b`),
      },
      returnValue: [
        { node: document.createTextNode('a'), innerText: 'a' },
        { node: document.createTextNode(' b'), innerText: ' b' },
      ],
    },
    {
      name: '"<span>a</span> <span>b</span> <span>c</span>"',
      param: {
        documentElement: createDocumentElement(
          `<span>a</span> <span>b</span> <span>c</span>`,
        ),
      },
      returnValue: [
        { node: document.createTextNode('a'), innerText: 'a' },
        { node: document.createTextNode(' '), innerText: ' ' },
        { node: document.createTextNode('b'), innerText: 'b' },
        { node: document.createTextNode(' '), innerText: ' ' },
        { node: document.createTextNode('c'), innerText: 'c' },
      ],
    },
    {
      name: '"<span>a</span><span>b</span><span>c</span>"',
      param: {
        documentElement: createDocumentElement(
          `<span>a</span><span>b</span><span>c</span>`,
        ),
      },
      returnValue: [
        { node: document.createTextNode('a'), innerText: 'a' },
        { node: document.createTextNode('b'), innerText: 'b' },
        { node: document.createTextNode('c'), innerText: 'c' },
      ],
    },
    {
      name: '(<span>){512}abc(</span>{512})',
      param: {
        documentElement: createDocumentElement(
          `<span>`.repeat(512) + 'abc' + `</span>`.repeat(512),
        ),
      },
      returnValue: [{ node: document.createTextNode('abc'), innerText: 'abc' }],
    },
    {
      name: '(<span>abc</span>){1_024}',
      param: {
        documentElement: createDocumentElement(
          `<span>abc</span>`.repeat(1_024),
        ),
      },
      returnValue: Array(1_024)
        .fill(null)
        .map(() => ({
          node: document.createTextNode('abc'),
          innerText: 'abc',
        })),
    },

    // TODO: shadow DOM

    // TODO: https://kangax.github.io/jstests/innerText/
  ]

  suits.forEach((suit) => {
    it(suit.name, async () => {
      expect(await createNodeWithInnerTextList(suit.param)).toEqual(
        suit.returnValue,
      )
    })
  })

  function createDocumentElement(bodyInnerHTML: string): HTMLElement {
    const body = document.createElement('body')
    body.innerHTML = bodyInnerHTML
    const documentElement = document.createElement('html')
    documentElement.appendChild(body)
    return documentElement
  }
})

describe('createRangesList', () => {
  const node1 = document.createTextNode('abcd')
  const innerText1 = 'abcd'
  const node2 = document.createTextNode('efg')
  const innerText2 = 'efg'
  const node3 = document.createTextNode('hi')
  const innerText3 = 'hi'
  const suits: {
    name: string
    param: {
      nodeWithInnerTextList: {
        node: Node
        innerText: string
      }[]
      searchStringList: string[]
      shouldMatchWholeWord: boolean
    }
    returnValue: Range[][]
  }[] = [
    {
      name: '__abcd,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: [],
        shouldMatchWholeWord: false,
      },
      returnValue: [],
    },
    {
      name: '_a_bcd,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['a'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 0, endOffset: 1 })],
      ],
    },
    {
      name: '_abc_d,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abc'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 0, endOffset: 3 })],
      ],
    },
    {
      name: '_abcd_,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcd'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 0, endOffset: 4 })],
      ],
    },
    {
      name: '_abcd,e_fg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcde'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 0, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 1 }),
        ],
      ],
    },
    {
      name: '_abcd,ef_g,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcdef'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 0, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 2 }),
        ],
      ],
    },
    {
      name: '_abcd,efg_,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcdefg'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 0, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
        ],
      ],
    },
    {
      name: '_abcd,efg,h_i',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcdefgh'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 0, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
          createRange({ node: node3, startOffset: 0, endOffset: 1 }),
        ],
      ],
    },
    {
      name: '_abcd,efg,hi_',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['abcdefghi'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 0, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
          createRange({ node: node3, startOffset: 0, endOffset: 2 }),
        ],
      ],
    },
    {
      name: 'a_b_cd,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['b'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 1, endOffset: 2 })],
      ],
    },
    {
      name: 'a_bc_d,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bc'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 1, endOffset: 3 })],
      ],
    },
    {
      name: 'a_bcd_,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bcd'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 1, endOffset: 4 })],
      ],
    },
    {
      name: 'a_bcd,ef_g,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bcdef'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 1, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 2 }),
        ],
      ],
    },
    {
      name: 'a_bcd,efg_,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bcdefg'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 1, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
        ],
      ],
    },
    {
      name: 'a_bcd,efg,h_i',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bcdefgh'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 1, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
          createRange({ node: node3, startOffset: 0, endOffset: 1 }),
        ],
      ],
    },
    {
      name: 'a_bcd,efg,hi_',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['bcdefghi'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 1, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 3 }),
          createRange({ node: node3, startOffset: 0, endOffset: 2 }),
        ],
      ],
    },
    {
      name: 'abc_d_,efg,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['d'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node1, startOffset: 3, endOffset: 4 })],
      ],
    },
    {
      name: 'abc_d,ef_g,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['def'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [
          createRange({ node: node1, startOffset: 3, endOffset: 4 }),
          createRange({ node: node2, startOffset: 0, endOffset: 2 }),
        ],
      ],
    },
    {
      name: 'abcd,_ef_g,hi',
      param: {
        nodeWithInnerTextList: [
          { node: node1, innerText: innerText1 },
          { node: node2, innerText: innerText2 },
          { node: node3, innerText: innerText3 },
        ],
        searchStringList: ['ef'],
        shouldMatchWholeWord: false,
      },
      returnValue: [
        [createRange({ node: node2, startOffset: 0, endOffset: 2 })],
      ],
    },
    (() => {
      const nodeWithInnerTextList = ['abc', 'ab'].map((textContent, index) => {
        const node = document.createTextNode(textContent)
        const innerText = textContent + (index === 0 ? ' ' : '')
        return { node, innerText }
      })
      const searchStringList = ['ab']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 0,
            endOffset: 2,
          }),
        ],
      ]
      return {
        name: 'abc,_ab_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: true,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = ['abc', 'bc'].map((textContent, index) => {
        const node = document.createTextNode(textContent)
        const innerText = textContent + (index === 0 ? ' ' : '')
        return { node, innerText }
      })
      const searchStringList = ['bc']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 0,
            endOffset: 2,
          }),
        ],
      ]
      return {
        name: 'abc,_bc_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: true,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = ['a', ' ', 'b'].map((textContent) => {
        const node = document.createTextNode(textContent)
        const innerText = textContent
        return { node, innerText }
      })
      const searchStringList = ['a b']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[0].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[2].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '_a, ,b_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = Array(10)
        .fill('b')
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      nodeWithInnerTextList[0].innerText = 'a'
      nodeWithInnerTextList[0].node.textContent = 'a'
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText = 'c'
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].node.textContent =
        'c'
      const searchStringList = ['a', 'c']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[0].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[nodeWithInnerTextList.length - 1].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '_a_,b,b,b,b,b,b,b,b,_c_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const node = document.createTextNode('aaa')
      const nodeWithInnerTextList = [{ node, innerText: 'aaa' }]
      const searchStringList = ['a', 'a', 'a']
      const returnValue = [
        [createRange({ node, startOffset: 0, endOffset: 1 })],
        [createRange({ node, startOffset: 1, endOffset: 2 })],
        [createRange({ node, startOffset: 2, endOffset: 3 })],
      ]
      return {
        name: '_a_a_a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = Array(3)
        .fill('a')
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      const searchStringList = Array(3).fill('a')
      const returnValue = nodeWithInnerTextList.map(({ node }) => {
        return [
          createRange({
            node,
            startOffset: 0,
            endOffset: 1,
          }),
        ]
      })
      return {
        name: '(_a_,){3}',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = Array(8)
        .fill('a')
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      const searchStringList = Array(4).fill('aa')
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[0].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[2].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[3].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[4].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[5].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[6].node,
            startOffset: 0,
            endOffset: 1,
          }),
          createRange({
            node: nodeWithInnerTextList[7].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '(_a,a_),{4}',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = Array(10_000)
        .fill('b')
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      nodeWithInnerTextList[0].innerText = 'a'
      nodeWithInnerTextList[0].node.textContent = 'a'
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText = 'a'
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].node.textContent =
        'a'
      const searchStringList = Array(2).fill('a')
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[0].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[nodeWithInnerTextList.length - 1].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '_a_,(b,){10_000},_a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const textContent = 'a'
      const searchStringLength = 500
      const searchStringListLength = 20
      const nodeWithInnerTextList = Array(
        searchStringListLength * searchStringLength,
      )
        .fill(textContent)
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      const searchStringList = Array(searchStringListLength).fill(
        textContent.repeat(searchStringLength),
      )
      const returnValue = nodeWithInnerTextList
        .map(({ node }) => {
          return [
            createRange({
              node,
              startOffset: 0,
              endOffset: textContent.length,
            }),
          ]
        })
        .reduce((acc, ranges) => {
          if (acc[acc.length - 1] === undefined) {
            acc.push([])
          }
          if (acc[acc.length - 1].length === searchStringLength) {
            acc.push([])
          }
          acc[acc.length - 1].push(...ranges)
          return acc
        }, [] as Range[][])
      return {
        name: '(_(a){20}_,){500}',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const textContent = 'a'
      const searchStringLength = 2
      const searchStringListLength = 5_000
      const nodeWithInnerTextList = Array(
        searchStringListLength * searchStringLength,
      )
        .fill(textContent)
        .map((textContent) => {
          const node = document.createTextNode(textContent)
          const innerText = textContent
          return { node, innerText }
        })
      const searchStringList = Array(searchStringListLength).fill(
        textContent.repeat(searchStringLength),
      )
      const returnValue = nodeWithInnerTextList
        .map(({ node }) => {
          return [
            createRange({
              node,
              startOffset: 0,
              endOffset: textContent.length,
            }),
          ]
        })
        .reduce((acc, ranges) => {
          if (acc[acc.length - 1] === undefined) {
            acc.push([])
          }
          if (acc[acc.length - 1].length === searchStringLength) {
            acc.push([])
          }
          acc[acc.length - 1].push(...ranges)
          return acc
        }, [] as Range[][])
      return {
        name: '(_(a,){2}_,){5_000}',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const node1 = document.createTextNode('abc')
      const node2 = document.createTextNode('d')
      const node3 = document.createTextNode('b')
      const nodeWithInnerTextList = [node1, node2, node3].map((node, index) => {
        return { node, innerText: node.textContent }
      })
      const searchStringList = Array(2).fill('b')
      const returnValue = [
        [
          createRange({
            node: node1,
            startOffset: 1,
            endOffset: 2,
          }),
        ],
        [
          createRange({
            node: node3,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: 'a_b_c,d,_b_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodes: Node[] = []
      nodes.push(document.createTextNode('abc'))
      nodes.push(document.createTextNode('bca'))
      nodes.push(document.createTextNode('cab'))
      nodes.push(document.createTextNode('bca'))
      nodes.push(document.createTextNode('abc'))
      const nodeWithInnerTextList = nodes.map((node) => {
        return {
          node,
          innerText: node.textContent!,
        }
      })
      const searchStringList = ['a', 'a', 'a', 'a', 'a']
      const returnValue = [
        [
          createRange({
            node: nodes[0],
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodes[1],
            startOffset: 2,
            endOffset: 3,
          }),
        ],
        [
          createRange({
            node: nodes[2],
            startOffset: 1,
            endOffset: 2,
          }),
        ],
        [
          createRange({
            node: nodes[3],
            startOffset: 2,
            endOffset: 3,
          }),
        ],
        [
          createRange({
            node: nodes[4],
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '_a_bc,bc_a_,c_a_b,bc_a_,_a_bc',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const node = document.createTextNode(' a')
      const nodeWithInnerTextList = [{ node, innerText: 'a' }]
      const searchStringList = ['a']
      const returnValue = [
        [
          createRange({
            node: node,
            startOffset: 1,
            endOffset: 2,
          }),
        ],
      ]
      return {
        name: ' _a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const node = document.createTextNode('\n a')
      const nodeWithInnerTextList = [{ node, innerText: 'a' }]
      const searchStringList = ['a']
      const returnValue = [
        [
          createRange({
            node: node,
            startOffset: 2,
            endOffset: 3,
          }),
        ],
      ]
      return {
        name: '\\n _a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = [
        { node: document.createTextNode(' '), innerText: ' ' },
        { node: document.createTextNode(' a'), innerText: 'a' },
        { node: document.createTextNode('a'), innerText: 'a' },
      ]
      const searchStringList = ['a', 'a']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 1,
            endOffset: 2,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[2].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: ' _a_,_a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = [
        { node: document.createTextNode(' '), innerText: ' ' },
        { node: document.createTextNode('  a '), innerText: 'a ' },
        { node: document.createTextNode('a'), innerText: 'a' },
      ]
      const searchStringList = ['a', 'a']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 2,
            endOffset: 3,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[2].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '  _a_ ,_a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
    (() => {
      const nodeWithInnerTextList = [
        { node: document.createTextNode('a\n'), innerText: 'a\n' },
        { node: document.createTextNode('a'), innerText: 'a' },
      ]
      const searchStringList = ['a', 'a']
      const returnValue = [
        [
          createRange({
            node: nodeWithInnerTextList[0].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
        [
          createRange({
            node: nodeWithInnerTextList[1].node,
            startOffset: 0,
            endOffset: 1,
          }),
        ],
      ]
      return {
        name: '_a_\\n,_a_',
        param: {
          nodeWithInnerTextList,
          searchStringList,
          shouldMatchWholeWord: false,
        },
        returnValue,
      }
    })(),
  ]

  suits.forEach((suit) => {
    it(suit.name, async () => {
      const expectedRangesList = suit.returnValue
      const actualRangesList = await createRangesList(suit.param)
      expect(actualRangesList.length).toBe(expectedRangesList.length)
      actualRangesList.forEach((actualRanges, rangesListIndex) => {
        const expectedRanges = expectedRangesList[rangesListIndex]
        expect(actualRanges.length).toBe(expectedRanges.length)
        actualRanges.forEach((actualRange, rangesIndex) => {
          const expectedRange = expectedRanges[rangesIndex]
          expect(actualRange.startContainer).toBe(expectedRange.startContainer)
          expect(actualRange.startOffset).toBe(expectedRange.startOffset)
          expect(actualRange.endContainer).toBe(expectedRange.endContainer)
          expect(actualRange.endOffset).toBe(expectedRange.endOffset)
        })
      })
    })
  })

  function createRange({
    node,
    startOffset,
    endOffset,
  }: {
    node: Node
    startOffset: number
    endOffset: number
  }): Range {
    const range = new Range()
    range.setStart(node, startOffset)
    range.setEnd(node, endOffset)
    return range
  }
})
