; Preserve the exact contents of multiline literals during explicit reindent.
([(value) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; A braced value spanning several lines indents the same way an entry does, so
; both are covered by the delimiters rather than by the node types.
["{" "("] @indent

["}" ")"] @dedent
