'use babel'

import path from 'path'
import fs from 'fs-plus'
import temp from 'temp'

import { unsplittedParagraphs, splittedParagraphs } from './texts'
const { it, fit, ffit, beforeEach } = require('./async-spec-helpers') // eslint-disable-line no-unused-vars

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
      const translatom = atom.packages.getActivePackage('translatom').mainModule
      expect(translatom.subscriptions.disposables.size).toBe(2)

      await atom.packages.deactivatePackage('translatom')
      expect(translatom.subscriptions.disposables).toBeNull()
    })
  })

  describe("when the 'translatom:split-paragraphs' command is run", () => {
    it('splits paragraph with LF and CRLF', () => {
      buffer.setText(unsplittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:split-paragraphs')
      expect(buffer.getText()).toBe(splittedParagraphs)

      buffer.setText(unsplittedParagraphs.replace('\n', '\r\n'))
      atom.commands.dispatch(workspaceElement, 'translatom:split-paragraphs')
      expect(buffer.getText()).toBe(splittedParagraphs.replace('\n', '\r\n'))
    })
  })

  describe("when the 'translatom:revert-paragraphs' command is run", () => {
    it('reverts paragraph with LF and CRLF', () => {
      buffer.setText(splittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:revert-paragraphs')
      expect(buffer.getText()).toBe(unsplittedParagraphs)

      buffer.setText(splittedParagraphs.replace('\n', '\r\n'))
      atom.commands.dispatch(workspaceElement, 'translatom:revert-paragraphs')
      expect(buffer.getText()).toBe(unsplittedParagraphs.replace('\n', '\r\n'))
    })
  })
})
