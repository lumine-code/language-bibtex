const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "bibtex-highlights.scm");

describe("BibTeX Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-bibtex");
  });

  afterEach(() => editor?.destroy());

  it("keeps a large entry leaf-rooted with local tile captures", async () => {
    const lines = ["@article{benchmark,"];
    for (let index = 0; index < 6000; index++) {
      lines.push(`  field_${index} = "value"${index < 5999 ? "," : ""}`);
    }
    lines.push("}");

    editor = await lumine.workspace.open("benchmark.bib");
    editor.setText(lines.join("\r\n"));
    await editor.getBuffer().languageMode.ready;
    const delimiterColumn = editor.lineTextForBufferRow(3000).lastIndexOf(",");
    expect(
      editor.scopeDescriptorForBufferPosition([3000, delimiterColumn]).getScopesArray(),
    ).toContain("punctuation.separator.delimiter.bibtex");
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(3000, 0),
      endPosition: new Point(3006, 0),
    });

    expect(captures.length).toBeLessThanOrEqual(100);
    expect(
      captures.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);
    expect(
      captures.some(
        (capture) =>
          capture.name === "punctuation.separator.delimiter.bibtex" &&
          capture.node.startPosition.row === 3000,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).toContain("(#is? test.childOfType entry)");
    expect(query).not.toMatch(/\(entry\s+[",{(]/);
  });

  it("keeps command braces local inside a 6000-word command", async () => {
    const lines = ["@article{benchmark,", "  title = {\\decorate{"];
    for (let index = 0; index < 6000; index++) lines.push(`    word_${index}`);
    lines.push("}}", "}");

    editor = await lumine.workspace.open("large-command.bib");
    editor.setText(lines.join("\r\n"));
    await editor.getBuffer().languageMode.ready;
    const languageMode = editor.getBuffer().languageMode;
    expect(languageMode.tree.rootNode.hasError).toBe(false);

    const openingColumn = editor.lineTextForBufferRow(1).lastIndexOf("{");
    expect(editor.scopeDescriptorForBufferPosition([1, openingColumn]).getScopesArray()).toContain(
      "punctuation.definition.arguments.begin.bracket.curly.bibtex",
    );
    expect(editor.scopeDescriptorForBufferPosition([6002, 0]).getScopesArray()).toContain(
      "punctuation.definition.arguments.end.bracket.curly.bibtex",
    );

    const startRow = 2998;
    const endRow = startRow + 6;
    const layer = languageMode.rootLanguageLayer;
    const captures = layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
    expect(captures.length).toBeLessThanOrEqual(24);
    expect(
      captures.every(
        ({ node }) => node.startPosition.row >= startRow && node.startPosition.row < endRow,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).not.toMatch(/\(command\s+"\{"/);
    expect(query.match(/#is\? test\.childOfType command/g)?.length).toBe(2);
  });
});
