import {
  createRegex,
  createSearchStringList,
  getNodeWithInnerTextList,
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

describe('getAllNodeInnerText', () => {
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
  ]

  suits.forEach((suit) => {
    it(suit.name, () => {
      expect(getNodeWithInnerTextList(suit.param)).toEqual(suit.returnValue)
    })
  })

  function createElementBody(innerHTML: string): HTMLBodyElement {
    const body = document.createElement('body')
    body.innerHTML = innerHTML
    return body
  }
})
