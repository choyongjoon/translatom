'use babel'

import { unsplittedParagraphs, splittedParagraphs } from './texts'
const { it, fit, ffit, beforeEach } = require('./async-spec-helpers') // eslint-disable-line no-unused-vars

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Translatom', () => {
  let editor, buffer, workspaceElement

  beforeEach(async () => {
    workspaceElement = atom.views.getView(atom.workspace)
    editor = await atom.workspace.open('')
    buffer = editor.getBuffer()
    await atom.packages.activatePackage('translatom')
  })

  describe('when the editor is destroyed', () => {
    beforeEach(() => editor.destroy())

    it('does not leak subscriptions', async () => {
      const translatom = atom.packages.getActivePackage('translatom').mainModule
      expect(translatom.subscriptions.disposables.size).toBe(3)

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

    it('should be not splitted if it is already splitted', () => {
      buffer.setText(splittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:split-paragraphs')
      expect(buffer.getText()).toBe(splittedParagraphs)
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

    it('should be not reverted if it is already reverted', () => {
      buffer.setText(splittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:split-paragraphs')
      expect(buffer.getText()).toBe(splittedParagraphs)
    })
  })

  describe("when the 'translatom:toggle-translatom' command is run", () => {
    it('open a new pane at right', () => {
      buffer.setText(unsplittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:toggle-translatom')
      atom.commands.onDidDispatch(() => {
        const panes = atom.workspace.getCenter().getPanes()
        expect(panes.length).toBe(2)
      })
    })

    it('cannot open translation more than once', () => {
      buffer.setText(unsplittedParagraphs)
      atom.commands.dispatch(workspaceElement, 'translatom:toggle-translatom')
      atom.commands.dispatch(workspaceElement, 'translatom:toggle-translatom')
      atom.commands.onDidDispatch(() => {
        const panes = atom.workspace.getCenter().getPanes()
        expect(panes.length).toBe(2)
      })
    })
  })
})
