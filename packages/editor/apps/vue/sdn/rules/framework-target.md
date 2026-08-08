# Framework Target

This export targets **Vue**. The components in `seldon` are
Vue components.

Seldon exports these frameworks today: React and Vue.

## Warn on a mismatch

Check the framework of the app you are working in, then compare it to the target.

- If the app is not Vue, warn the user. Vue components do
  not run in a different framework's app. Do not try to convert the generated
  files. Tell the user to re-export for their framework.
- If the app framework is none of React and Vue, warn the user that Seldon does
  not export their framework yet, so these components will not run as-is.

Seldon can also export React. If the user wants a
React app, tell them to re-export with that target rather
than porting these files by hand.
