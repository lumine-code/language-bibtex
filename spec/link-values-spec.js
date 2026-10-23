describe("BibTeX link value classification", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-bibtex");
    editor = await lumine.workspace.open("links.bib");
  });
  afterEach(() => editor.destroy());

  it("classifies quoted and braced URL or DOI fields without treating titles as links", async () => {
    editor.setText(
      '@article{example,\nURL = {https://example.org/article},\ndoi = "10.1000/example",\nurl = "https://example.org/other",\nDOI = {10.1000/other},\ntitle = {https://example.org/title}\n}',
    );
    expect(await editor.whenGrammarSettled()).toBe(true);
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    for (const row of [1, 2, 3, 4]) {
      const col = editor.lineTextForBufferRow(row).indexOf("/");
      expect(editor.scopeDescriptorForBufferPosition([row, col]).getScopesArray()).toContain(
        "string.other.link.bibtex",
      );
    }
    expect(editor.scopeDescriptorForBufferPosition([5, 17]).getScopesArray()).not.toContain(
      "string.other.link.bibtex",
    );
  });
});
