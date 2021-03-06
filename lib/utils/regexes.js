'use babel'
/* eslint-disable no-multi-spaces */

export const splitCheckRegex    = /([^\n.][^\s])(?!\s\.)+[。.?!]+[ ]/g
export const splitEndRegex      = /([^\n.][^\s])(?!\s\.)+[。.?!]+[\s)]/g
export const revertEndRegex     = /([^\n.][^\s])(?!\s\.)+[。.?!]+[\s)]?\r?\n/g
export const trailingSpaceRegex = / (\r?\n)/g
