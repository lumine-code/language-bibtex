describe("Conservative bibtex indentation", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-bibtex");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.bibtex"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });

  afterEach(() => editor?.destroy());

  for (const [name, source, row, columns] of [
    ["an entry header", "@misc{item,\n}", 0, 4],
    ["a closed entry", "@misc{item, title={Example}}", 0, 0],
    ["a title", "@misc{item,\n    title = {Example},\n}", 1, 4],
  ]) {
    it(`keeps the intended level after ${name}`, async () => {
      editor.setText(source);
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([row, Infinity]);
      editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(row + 1)).toBe(" ".repeat(columns));
      expect(editor.getCursorBufferPosition().column).toBe(columns);
    });
  }

  it("preserves multiline literal contents during explicit reindent", async () => {
    const source = "@misc{item,\n    title = {first\n\tkeep this tab\n  keep these spaces\n},\n}\n";
    editor.setText(source);
    await editor.whenGrammarSettled();
    editor.getBuffer().clearUndoStack();
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe(source);
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    expect(editor.getText()).toBe(source);
  });
});
