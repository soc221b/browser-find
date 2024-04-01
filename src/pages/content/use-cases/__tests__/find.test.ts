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
  it('should ignore <noscript>', () => {
    const body = document.createElement('body')
    const noscript = document.createElement('noscript')
    noscript.textContent = 'abc'
    body.appendChild(noscript)

    const result = getNodeWithInnerTextList({ body })

    expect(result).toHaveLength(0)
  })

  it('should ignore display: none', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'abc'
    div.style.display = 'none'
    body.appendChild(div)

    const result = getNodeWithInnerTextList({ body })

    expect(result).toHaveLength(0)
  })

  it('should ignore visibility: hidden', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'abc'
    div.style.visibility = 'hidden'
    body.appendChild(div)

    const result = getNodeWithInnerTextList({ body })

    expect(result).toHaveLength(0)
  })

  it('should works with textTransform: uppercase', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'ABc'
    div.style.textTransform = 'uppercase'
    body.appendChild(div)

    const result = getNodeWithInnerTextList({ body })

    expect(result.length).toBe(1)
    expect(result[0].innerText).toBe('ABC')
  })

  it('should works with textTransform: lowercase', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'ABc'
    div.style.textTransform = 'lowercase'
    body.appendChild(div)

    const result = getNodeWithInnerTextList({ body })

    expect(result.length).toBe(1)
    expect(result[0].innerText).toBe('abc')
  })

  it('should add line breaks between nodes', () => {
    const body = document.createElement('body')
    const div1 = document.createElement('div')
    div1.textContent = 'abc'
    body.appendChild(div1)
    const div2 = document.createElement('div')
    div2.textContent = 'abc'
    body.appendChild(div2)

    const result = getNodeWithInnerTextList({ body })

    expect(result.length).toBe(2)
    expect(result[0].innerText).toBe('abc\n')
    expect(result[1].innerText).toBe('abc')
  })

  it.skip('should works with white-space', () => {
    // TODO: https://stackoverflow.com/a/19032002
  })
})
