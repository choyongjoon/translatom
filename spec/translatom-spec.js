'use babel'

import path from 'path'
import fs from 'fs'
import temp from 'temp'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Translatom', () => {
  let editor, buffer, workspaceElement

  beforeEach(async () => {
    const directory = temp.mkdirSync()
    atom.project.setPaths([directory])
    workspaceElement = atom.views.getView(atom.workspace)
    const filePath = path.join(directory, 'atom-whitespace.txt')
    fs.writeFileSync(filePath, '')
    fs.writeFileSync(path.join(directory, 'sample.txt'), 'Some text.\n')

    editor = await atom.workspace.open(filePath)
    buffer = editor.getBuffer()
    await atom.packages.activatePackage('translatom')
  })

  describe('when the editor is destroyed', () => {
    beforeEach(() => editor.destroy())

    it('does not leak subscriptions', async () => {
      const { translatom } = atom.packages.getActivePackage('translatom').mainModule
      expect(translatom.subscriptions.disposables.size).toBe(2)

      await atom.packages.deactivatePackage('translatom')
      expect(translatom.subscriptions.disposables).toBeNull()
    })
  })
})
