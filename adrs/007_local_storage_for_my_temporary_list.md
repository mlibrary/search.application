# Using `localStorage` for My Temporary List

## Context

Original Search used `sessionStorage` for Temporary List. This was so users who
created a temporary list on public devices would not have to worry about their
lists never being cleared for the next person as it clears when the tab closes.

During user testing, people wished they were able to open `My Temporary List` in
a separate tab while they continued searching. This is possible if `localStorage`
is used instead. The downside to `localStorage` is that the list can only be
cleared by either clearing the browser's cache or by manually removing all records.

Having a personal device while using Search has become increasingly common,
lessening the concern about the list being cleared. Messaging as also been
added to inform users about clearing their list after they are done if using
a public device.

## Decision

We will change `My Temporary List` from using `sessionStorage` to `localStorage`.

## Status

| Date       | Summary |
|------------|---------|
| 2026-11-09 | Approved  |

## Consequences

1. `localStorage` does not clear when the tab or browser closes.
2. Clearing `localStorage` requires clearing the browser cache or manually removing all records.
