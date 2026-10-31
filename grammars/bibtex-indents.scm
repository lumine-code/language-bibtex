; Quotes identify field text even when an unfinished value loses its wrapper.
; Braced entry/value delimiters retain their existing indentation policy.
(ERROR "\"" [(_) "{" "}" "(" ")"] @preserve
  (#is? indent.reindent true)
  (#set! indent.force true))

(ERROR "\"" ["{" "}" "(" ")"] @match.next
  (#set! indent.match startPosition)
  (#set! capture.final true))

(ERROR "\"" @match.next
  (#set! indent.match startPosition))

; Preserve the exact contents of multiline literals during explicit reindent.
([(value) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; A braced value spanning several lines indents the same way an entry does, so
; both are covered by the delimiters rather than by the node types.
["{" "("] @indent

["}" ")"] @dedent
