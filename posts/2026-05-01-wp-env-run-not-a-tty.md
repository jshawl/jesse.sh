---
title: wp-env run not a tty
---

I test my wordpress plugins with:

```
wp-env run tests-cli vendor/bin/phpunit
```

and I put this in a `bin/test.sh` script.

If I add a `.git/hooks/pre-push` script:

```
#!/bin/bash

./bin/test.sh
```

and `git push`, I see this error:

```
the input device is not a TTY
✖ Command failed with exit code 1
Command failed with exit code 1
error: failed to push some refs
```

Docker checks whether stdin is a TTY before executing.

I don't have the ability to change the `docker compose exec` flags invoked
by `wp-env run` (like adding `-T`). 

Surprisingly, `wp-env` checks this case [(source)](https://github.com/WordPress/gutenberg/blob/e4fcfecee9271267101a15ebda121374c7410fed/packages/env/lib/runtime/docker/index.js#L790-L792) and adds the `-T`:

```js
if ( ! process.stdout.isTTY ) {
	composeCommand.push( '-T' );
}
```

If I add `tty` to my git hook, it prints `not a tty`.

If I check the process with node:

```bash
node -e "console.log('stdin isTTY:', process.stdin.isTTY, 'stdout isTTY:', process.stdout.isTTY)"
```

I see:

```
stdin isTTY: undefined stdout isTTY: true
```

seems like `wp-env` should also check `stdin.isTTY`. Why are git hooks' stdin not a tty but stdout is? Question for another day.

I don't even need stdin so I spawn
a subprocess with [python's pseudo TTY](https://docs.python.org/3/library/pty.html#pty.spawn):

```bash
#!/bin/bash

faketty() {
    python3 -c "
import pty, os, sys
status = pty.spawn(['/bin/bash', '-c', sys.argv[1]])
exit(os.waitstatus_to_exitcode(status))
" "$*"
}

faketty wp-env run tests-cli vendor/bin/phpunit
```

Now I can push straight to `main`, guarded by the test suite.
