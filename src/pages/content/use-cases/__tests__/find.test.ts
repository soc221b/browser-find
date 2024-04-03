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
      returnValue: /abc\?/gi,
    },
    {
      name: 'match case',
      param: {
        shouldMatchCase: true,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: false,
        text: 'abc?',
      },
      returnValue: /abc\?/g,
    },
    {
      name: 'match whole word',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: true,
        shouldUseRegularExpression: false,
        text: 'abc?',
      },
      returnValue: /\babc\?\b/gi,
    },
    {
      name: 'use regular expression',
      param: {
        shouldMatchCase: false,
        shouldMatchWholeWord: false,
        shouldUseRegularExpression: true,
        text: 'abc?',
      },
      returnValue: /abc?/gi,
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
        regex: /abc\?/gi,
      },
      returnValue: ['abc?', 'ABC?'],
    },
    {
      name: 'match case',
      param: {
        innerText: 'abc? ABC? abc? ABC?',
        regex: /abc\?/g,
      },
      returnValue: ['abc?', 'abc?'],
    },
    {
      name: 'match whole word',
      param: {
        innerText: 'abc? ABc?abc? ABC?',
        regex: /\babc\?\b/gi,
      },
      returnValue: ['ABc?'],
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
      body: HTMLBodyElement
    }
    returnValue: { node: Node; innerText: string }[]
  }[] = [
    {
      name: 'should ignore <noscript>',
      param: {
        body: createElementBody(`<noscript>abc</noscript>`),
      },
      returnValue: [],
    },
    {
      name: 'should ignore display: none',
      param: {
        body: createElementBody(`<span style="display: none;">abc</span>`),
      },
      returnValue: [],
    },
    {
      name: 'should ignore visibility: hidden',
      param: {
        body: createElementBody(`<span style="visibility: hidden;">abc</span>`),
      },
      returnValue: [],
    },
    {
      name: 'should do text transform: uppercase',
      param: {
        body: createElementBody(
          `<span style="text-transform: uppercase;">abc</span>`,
        ),
      },
      returnValue: [{ node: document.createTextNode('abc'), innerText: 'ABC' }],
    },
    {
      name: 'should do text transform: lowercase',
      param: {
        body: createElementBody(
          `<span style="text-transform: lowercase;">ABC</span>`,
        ),
      },
      returnValue: [{ node: document.createTextNode('ABC'), innerText: 'abc' }],
    },
    {
      name: 'should trim',
      param: {
        body: createElementBody(`<span"> abc </span>`),
      },
      returnValue: [
        { node: document.createTextNode(' abc '), innerText: 'abc' },
      ],
    },
  ]

  suits.forEach((suit) => {
    it(suit.name, () => {
      expect(createNodeWithInnerTextList(suit.param)).toEqual(suit.returnValue)
    })
  })

  function createElementBody(innerHTML: string): HTMLBodyElement {
    const body = document.createElement('body')
    body.innerHTML = innerHTML
    return body
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
      name: '__abcd efg hi',
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
      name: '_a_bcd efg hi',
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
      name: '_abc_d efg hi',
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
      name: '_abcd_ efg hi',
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
      name: '_abcd e_fg hi',
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
      name: '_abcd ef_g hi',
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
      name: '_abcd efg_ hi',
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
      name: '_abcd efg h_i',
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
      name: '_abcd efg hi_',
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
      name: 'a_b_cd efg hi',
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
      name: 'a_bc_d efg hi',
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
      name: 'a_bcd_ efg hi',
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
      name: 'a_bcd ef_g hi',
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
      name: 'a_bcd efg_ hi',
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
      name: 'a_bcd efg h_i',
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
      name: 'a_bcd efg hi_',
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
      name: 'abc_d_ efg hi',
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
      name: 'abc_d ef_g hi',
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
      name: 'abcd _ef_g hi',
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
      const node = document.createTextNode('aaa')
      const nodeWithInnerTextList = [{ node, innerText: 'aaa' }]
      const searchStringList = ['a', 'a', 'a']
      const returnValue = [
        [createRange({ node, startOffset: 0, endOffset: 1 })],
        [createRange({ node, startOffset: 1, endOffset: 2 })],
        [createRange({ node, startOffset: 2, endOffset: 3 })],
      ]
      return {
        name: 'multiple matches in single node',
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
        name: 'multiple matches in multiple nodes',
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
        name: 'performance - multiple matches across multiple nodes',
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
      const searchStringListLength = 5000
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
        name: 'performance - multiple matches in multiple nodes',
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
    it(suit.name, () => {
      expect(convertRangesListToObject(createRangesList(suit.param))).toEqual(
        convertRangesListToObject(suit.returnValue),
      )
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

  function convertRangesListToObject(rangesList: Range[][]): object {
    return rangesList.map((ranges) => {
      return ranges.map((range) => {
        return {
          startContainer: {
            textContent: range.startContainer.textContent,
          },
          startOffset: range.startOffset,
          endContainer: {
            textContent: range.endContainer.textContent,
          },
          endOffset: range.endOffset,
        }
      })
    })
  }
})
