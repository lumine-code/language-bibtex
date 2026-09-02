; BibTeX is a data format, not a language: a file is a sequence of entries, and
; anything the reader does not recognise is silently ignored. The grammar
; mirrors that — `comment` is only the `@Comment` token itself, and every other
; unrecognised span, including the text that follows it, arrives as `junk`.
;
; Adapted from the nvim-treesitter queries for latex-lsp/tree-sitter-bibtex.


; COMMENTS
; ========

(comment) @comment.line.at-sign.bibtex
((comment) @punctuation.definition.comment.bibtex
  (#set! adjust.endAfterFirstMatchOf "^@"))

; Text between entries. BibTeX ignores it, so it reads as a comment even though
; nothing marks it as one.
(junk) @comment.block.bibtex


; ENTRY TYPES
; ===========

(entry_type) @keyword.other.entry-type.bibtex
(string_type) @keyword.other.string-constant.bibtex
(preamble_type) @keyword.other.preamble.bibtex

; The `@` that introduces every one of them.
([(entry_type) (string_type) (preamble_type)] @punctuation.definition.keyword.bibtex
  (#set! adjust.endAfterFirstMatchOf "^@"))


; CITATION KEYS
; =============

(entry
  key: [(key_brace) (key_paren)] @entity.name.type.entry-key.bibtex)


; FIELD AND CONSTANT NAMES
; ========================

(field
  name: (identifier) @variable.other.key.bibtex)

; The name bound by `@string{ name = … }`.
(string
  name: (identifier) @variable.other.constant.bibtex)

; A bare identifier inside a value refers back to such a constant.
(token
  (identifier) @variable.other.reference.bibtex)


; VALUES
; ======

(number) @constant.numeric.bibtex

(quote_word) @string.quoted.double.bibtex
(brace_word) @string.quoted.other.brace.bibtex

; Only the quotes and braces delimiting a value are string punctuation; the ones
; around an entry or a command group are structure, and are scoped further down.
(token
  .
  "\"" @punctuation.definition.string.begin.bibtex)
(token
  "\"" @punctuation.definition.string.end.bibtex
  .)
(token
  .
  "{" @punctuation.definition.string.begin.bibtex)
(token
  "}" @punctuation.definition.string.end.bibtex
  .)


; COMMANDS
; ========

; `command_name` carries its own backslash, so the whole token is scoped and the
; backslash is then narrowed to punctuation.
(command
  name: (command_name) @support.function.bibtex)
((command_name) @punctuation.definition.function.bibtex
  (#set! adjust.endAfterFirstMatchOf "^\\\\"))

(command
  "{" @punctuation.definition.arguments.begin.bracket.curly.bibtex
  "}" @punctuation.definition.arguments.end.bracket.curly.bibtex)


; OPERATORS AND PUNCTUATION
; =========================

; String concatenation: `journal = acm # " Computing Surveys"`.
(value
  "#" @keyword.operator.concatenation.bibtex)

(field
  "=" @punctuation.separator.key-value.bibtex)
(string
  "=" @punctuation.separator.key-value.bibtex)

(entry
  "," @punctuation.separator.delimiter.bibtex)

(entry
  "{" @punctuation.definition.entry.begin.bracket.curly.bibtex
  "}" @punctuation.definition.entry.end.bracket.curly.bibtex)
(entry
  "(" @punctuation.definition.entry.begin.bracket.round.bibtex
  ")" @punctuation.definition.entry.end.bracket.round.bibtex)
(string
  "{" @punctuation.definition.entry.begin.bracket.curly.bibtex
  "}" @punctuation.definition.entry.end.bracket.curly.bibtex)
(preamble
  "{" @punctuation.definition.entry.begin.bracket.curly.bibtex
  "}" @punctuation.definition.entry.end.bracket.curly.bibtex)
