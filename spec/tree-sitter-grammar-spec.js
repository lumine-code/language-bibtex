const path = require("path");

// Asserts the scopes the grammar actually produces, using the fixture beside
// this file. `runGrammarTests` reads `<- scope` and `^ scope` assertions out of
// the fixture's own comments, so the fixture is the readable spec.
//
// A fixture whose assertions never run still reports green, so break one
// expected scope and confirm this fails before trusting it.

describe("BibTeX Tree-sitter grammar", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-bibtex");
  });

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.bib"), /%/);
  });

  // The grammar used to live in language-latex. Consumers such as ide-texlab
  // and navigation-panel compare this scope as an exact string rather than as
  // a selector, so moving packages must not have changed either the scope or
  // which grammar wins for a .bib file.
  it("keeps the text.bibtex scope for .bib files", () => {
    for (const filePath of ["references.bib", "references.bibtex"]) {
      expect(atom.grammars.selectGrammar(filePath, "").scopeName).toBe("text.bibtex");
    }
    expect(atom.grammars.grammarForScopeName("text.bibtex")).toBeTruthy();
  });
});
