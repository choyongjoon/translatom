'use babel'

export const unsplittedParagraphs = `
First paragraph. Second contains e.g. this and a.k.a. that. Is it third sentence? Fourth sentence! (We have parentheses. How do we handle that? )

Second paragraph has an empty line above.
  Third paragraph has no empty line above.
1. numbered list.
`

export const splittedParagraphs = `
First paragraph.
Second contains e.g. this and a.k.a. that.
Is it third sentence?
Fourth sentence!
(We have parentheses. How do we handle that? )


Second paragraph has an empty line above.

  Third paragraph has no empty line above.

1. numbered list.
`
