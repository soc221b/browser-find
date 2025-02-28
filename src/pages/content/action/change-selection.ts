export type ChangeSelection = {
  type: 'ChangeSelection'

  selection: {
    focusNode: Node

    focusOffset: number
  }
}
