import { getAllNodeInnerText } from '../find-v2'

describe('getAllNodeInnerText', () => {
  it('should ignore <noscript>', () => {
    const body = document.createElement('body')
    const noscript = document.createElement('noscript')
    noscript.textContent = 'abc'
    body.appendChild(noscript)

    const result = getAllNodeInnerText({ body })

    expect(result).toHaveLength(0)
  })

  it('should ignore display: none', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'abc'
    div.style.display = 'none'
    body.appendChild(div)

    const result = getAllNodeInnerText({ body })

    expect(result).toHaveLength(0)
  })

  it('should ignore visibility: hidden', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'abc'
    div.style.visibility = 'hidden'
    body.appendChild(div)

    const result = getAllNodeInnerText({ body })

    expect(result).toHaveLength(0)
  })

  it('should works with textTransform: uppercase', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'ABc'
    div.style.textTransform = 'uppercase'
    body.appendChild(div)

    const result = getAllNodeInnerText({ body })

    expect(result.length).toBe(1)
    expect(result[0].innerText).toBe('ABC')
  })

  it('should works with textTransform: lowercase', () => {
    const body = document.createElement('body')
    const div = document.createElement('span')
    div.textContent = 'ABc'
    div.style.textTransform = 'lowercase'
    body.appendChild(div)

    const result = getAllNodeInnerText({ body })

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

    const result = getAllNodeInnerText({ body })

    expect(result.length).toBe(2)
    expect(result[0].innerText).toBe('abc\n')
    expect(result[1].innerText).toBe('abc')
  })

  it.skip('should works with white-space', () => {
    // TODO: https://stackoverflow.com/a/19032002
  })
})
