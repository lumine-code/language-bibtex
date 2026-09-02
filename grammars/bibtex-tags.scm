; The citation key is the only name in a `.bib` file worth navigating to.
(entry
  key: [(key_brace) (key_paren)] @name) @definition.constant

; `@string{ name = … }` binds a name that later entries refer to.
(string
  name: (identifier) @name) @definition.variable
