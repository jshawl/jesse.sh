---
title: HTTP Authentication via SSH
---

- [Demo](#demo)
- [Background and motivation](#background-and-motivation)
- [How it works](#how-it-works)
  - [Generate a session secret](#generate-a-session-secret)
  - [Poll for the SSH connection](#poll-for-the-ssh-connection)
  - [SSH in with the session secret](#ssh-in-with-the-session-secret)
  - [Map the session secret to the user's public key](#map-the-session-secret-to-the-users-public-key)
  - [Redirect to an authenticated page](#redirect-to-an-authenticated-page)
- [Next steps](#next-steps)
- [Other projects worth checking out](#other-projects-worth-checking-out)

## Demo

Visit <https://auths.sh/> and follow the command line instructions, or [browse the
source code](https://github.com/jshawl/auths.sh), specifically:

- [ssh.go](https://github.com/jshawl/auths.sh/blob/main/ssh.go) - the SSH server
- [http.go](https://github.com/jshawl/auths.sh/blob/main/http.go) - the HTTP server

## Background and motivation

I've been working on <https://proof.im/> and thinking about cooler ways
to authenticate, as if authenticating with SSH private key signatures weren't
cool enough already. The signature generation part still felt a little too
geeky for me and I often have to reference the arcane `ssh-keygen` syntax
to generate a signature.

It occurred to me that I could take advantage of the Diffie-Hellman key
exchange to authenticate users without asking them to manually generate their
own signatures and send them over HTTP.

## How it works

Here's a super high level overview with more detail below:

1. The web server generates a session secret and stores it in a cookie.
2. The web server provides SSH instructions, passing the session secret as a command
3. The ssh server handles the key exchange and stores the session secret with the user's public key
4. The web server polls for the SSH connection with the session secret
5. The web server sets a cookie and redirects to an authenticated page.

### Generate a session secret

Nothing special here. Every request to https://auths.sh/ will generate a uuid and store
the value in a cookie.

The web server tells the user to ssh in with the provided uuid as the SSH command, like:

```txt
ssh auths.sh 00000000-0000-0000-0000-000000000000
```

The cookie serves no purpose other than storing the session secret for
subsequent requests. It's possible to skip the cookie entirely,
but a cookie based session allows user-friendlier URLs like:
`https://auths.sh/session` instead of something like

```txt
https://auths.sh/session?secret=00000000-0000-0000-0000-000000000000
```

As an extra bonus, the session secret won't show up in the web server logs.

### Poll for the SSH connection

It will probably take some time for the user to make the SSH connection, so the
browser polls for the status of the SSH connection with the secret:

```js
const int = setInterval(() => {
  fetch("/status")
}, 1000)
```

When the HTTP server responds with a 200, we know that the user has connected
via SSH with the session secret and can now redirect them to an authenticated page.

The `/status` endpoint attempts to serve a file named `/tmp/00000000-0000-0000-0000-000000000000` and responds with a 200 once the SSH server
generates that file.

### SSH in with the session secret

```txt
ssh auths.sh 00000000-0000-0000-0000-000000000000
```

The ssh server will know a couple of things at this point:

1. The username - [`s.User()`](https://pkg.go.dev/github.com/gliderlabs/ssh#Session.User)
2. The user's public key - [`s.PublicKey()`](https://pkg.go.dev/github.com/gliderlabs/ssh#Session.PublicKey)
3. The session secret - [`s.Command()[0]`](https://pkg.go.dev/github.com/gliderlabs/ssh#Session.Command)

In addition, the SSH server can infer that the user is the original owner
of the public key because - how else would they have completed the key exchange?.

Lastly, it's possible for someone to guess the session secret and use a different
public key, but the session is relatively short-lived and UUIDs are hard to guess.

### Map the session secret to the user's public key

The SSH server stores the session secret with the user's public key. In this demo,
it looks like this:

```go
type User struct {
	Name      string
	PublicKey string
}

authorizedKey := gossh.MarshalAuthorizedKey(s.PublicKey())
d := User{Name: s.User(), PublicKey: strings.TrimSpace(string(authorizedKey))}
file, _ := json.MarshalIndent(d, "", " ")
os.WriteFile(fmt.Sprintf("/tmp/%s", s.Command()[0]), file, 0644)
```

That is... write a json file named `/tmp/00000000-0000-0000-0000-000000000000`
with the contents:

```json
{
  "Name": "jesse",
  "PublicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGaGowvVxI4t5W+w6TCCxD4pEBHA3cb0wR63EGy3r4AI"
}
```

### Redirect to an authenticated page

Remember the polling from before? A 200 status indicates the public key
has been stored with the session secret, so we can safely redirect to a
page that requires authentication.

```js
if(response.status === 200){
  response.json().then(d => {
    window.location = '/session'
  })
}
```

The web browser sends the session secret with the GET request, so the web
server is able to identify the SSH user. Pretty cool.

## Next steps

This is more or less a proof of concept for authenticating an HTTP session
via SSH. I'm curious about updating the sign up process for <https://proof.im/>
to offer this auth mechanism.

I also want to read the following books to make sure my understanding of
the key exchange doesn't leave a loophole where ssh'ers can forge a public
key:

- [SSH, The Secure Shell: The Definitive Guide](https://www.oreilly.com/library/view/ssh-the-secure/0596008953/)
- [SSH Mastery](https://www.tiltedwindmillpress.com/product/ssh-mastery-2nd-edition/)

I'm also beginning to think about how other clients might integrate SSH-based HTTP
authentication into their applications: right now, the public key is the unique identifier
for a user, but I'm not sure there's anything I can send over HTTP that would be cryptographically
verifiable. e.g. the SSH server knows the public key but doesn't expose anything that _only_
the user could have provided, like a private key or signature. [`crypto/ssh`](https://pkg.go.dev/golang.org/x/crypto/ssh#Signature) has types for `Signature` but I think that's only used for signatures
generated with the host private key.

## Other projects worth checking out

- [Wish](https://github.com/charmbracelet/wish) - Make SSH apps, just like that! 💫
- [gliderlabs/ssh](https://github.com/gliderlabs/ssh) - Easy SSH servers in Golang
- [https://proof.im/](https://proof.im/) - Zero-trust proof of identity
