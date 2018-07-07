'use babel'

const getTwoPanes = async () => {
  const panes = atom.workspace.getCenter().getPanes()
  if (panes.length === 0) {
    await atom.workspace.open('', { split: 'right' })
    await atom.workspace.open('', { split: 'right' })
  } else if (panes.length === 1) {
    const leftEditor = panes[0].getActiveItem()
    const rightEditor = await atom.workspace.open('', { split: 'right' })
    const leftText = leftEditor.getBuffer().getText()
    rightEditor.getBuffer().setText(leftText)
  }
  const twoPanes = atom.workspace.getCenter().getPanes().slice(0, 2)
  return twoPanes
}

export default getTwoPanes
