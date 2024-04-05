type Find = (_: {
  documentElement: HTMLElement

  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  onNext: (_: { value: Range[]; done: boolean }) => void
}) => Stop

type Stop = () => void

export const find: Find = () => {
  let isStopped = false
  const stop = () => {
    isStopped = true
  }

  return stop
}
