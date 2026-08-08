# Framework Target

This export targets **React**. The components in `sdn` are
React components.

Seldon exports these frameworks today: React and Vue.

## Warn on a mismatch

A framework mismatch is different from an architecture question. The view layer
is framework-specific, so check the framework of the app you are working in and
compare it to the target.

- If the app is not React, warn the user. React components do
  not run in a different framework's app. Do not try to convert the generated
  files. Tell the user to re-export for their framework.
- If the app framework is none of React and Vue, warn the user that Seldon does
  not export their framework yet, so these components will not run as-is.

Seldon can also export Vue. If the user wants a
Vue app, tell them to re-export with that target rather
than porting these files by hand.
