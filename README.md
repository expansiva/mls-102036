# 102036 · collab-messages Base Frontend

Part of **collab.codes**.

`102036` is the **base layer of the collab-messages frontend** — the small,
stable foundation that [`102025`](../mls-102025) builds on. It is a `lib`
project and a workspace dependency.

## What lives here

| file group | what it does |
|---|---|
| `environmentContract.*` | the contract that tells the messages frontend which environment it is running in (Studio vs runtime) and what it may call |
| `collabMessagesIndexedDB.*` | local IndexedDB persistence for messages/tasks |
| `designSystem.*`, `project.*` | project scaffolding |
| `l2/shared/` | pieces shared by both of the above |

Each source has its `*.test.ts` next to it, and `dist/l2/` holds the compiled
JavaScript that gets consumed by other projects.

## Notes

- Deliberately kept small: business rules belong in `102025`, not here.
