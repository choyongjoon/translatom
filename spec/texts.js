'use babel'

export const unsplittedParagraphs = `
First paragraph. Second contains e.g. this and a.k.a. 1972. Is it third sentence? 네번째 문장! (We have parentheses. How do we handle that?)

Second paragraph has an empty line above?!?!
  Third paragraph has no empty line above....
1. Some language。
`

export const splittedParagraphs = `
First paragraph.
Second contains e.g. this and a.k.a. 1972.
Is it third sentence?
네번째 문장!
(We have parentheses.
How do we handle that?)


Second paragraph has an empty line above?!?!

  Third paragraph has no empty line above....

1. Some language。

`
