# language-bibtex

BibTeX language support.

Bibliography databases used to be covered by a TextMate grammar inside
`language-latex` that could not parse `@preamble` and treated every value as one
undifferentiated blob. This package replaces it with a Tree-sitter grammar and
keeps the `text.bibtex` scope, so anything already keyed on it keeps working.

## Features

- **Grammars**: provides Tree-sitter grammars.
- **Entries**: scopes entry types, citation keys, field names and values, including `@string` constants and `@preamble`.
- **Values**: distinguishes quoted from braced values, numbers from constant references, and highlights concatenation with `#`.
- **Commands**: recognises TeX commands appearing inside field values.
- **Folding**: folds each entry from the parse tree rather than by indentation.
- **Symbols**: lists citation keys and `@string` names for symbol navigation.

## Installation

To install `language-bibtex` search for _language-bibtex_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-bibtex`.

## Usage

The grammar is built from [tree-sitter-bibtex](https://github.com/latex-lsp/tree-sitter-bibtex).

BibTeX has no comment syntax. `@Comment` marks only itself, and everything the reader does not recognise — including text between entries — is ignored; both are scoped as comments here, which is what they behave like.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
