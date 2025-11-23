---
title: Static SSL Nim Binaries
---

The goal: a static Nim binary that can make http requests using ssl
with no dependencies or runtime configuration.

This is useful for creating single-file deployables or running in minimal
container environments like `scratch`.

## Static Binary Hello World

`nimble init` and select "binary". `nimble run` will print "Hello, World!"

To isolate the environment, build this in a docker image:

```dockerfile
FROM nimlang/nim:2.2.6-alpine-regular AS builder
WORKDIR /app
COPY . .
RUN nimble install

FROM alpine
WORKDIR /app
COPY --from=builder /app /app
```

Still works great! But swapping out `alpine` for `scratch` errors.

```diff
-FROM alpine
+FROM scratch
```

with no such file or directory. This is because the binary is trying to
load dynamic libraries that don't exist in the empty `scratch` image.

Add a `nim.cfg` with `--passL:"-static"`.

## HTTP Requests

Import `httpclient` and make a request:

```diff
+import std / [httpclient]
 when isMainModule:
+  echo newHttpClient().getContent("https://example.com")
```

There's an error!

```
httpclient.nim(1040)     newConnection
Error: unhandled exception: SSL support is not available. Cannot connect over SSL. Compile with -d:ssl to enable. [HttpRequestError]
```

Add `-d:ssl` to `nim.cfg` and rerun to see a new error:

```
could not load: libcrypto.so(.3|.1.1|.1.0.2|.1.0.1|.1.0.0|.0.9.9|.0.9.8|.48|.47|.46|.45|.44|.43|.41|.39|.38|.10|)
```

crypto is dynamically linked. To include it in the static binary, install `openssl-libs-static` in the docker image:

```diff
 FROM nimlang/nim:2.2.6-alpine-regular AS builder
+RUN apk add --no-cache openssl-libs-static
 WORKDIR /app
```

and tell the compiler in `nim.cfg` to statically link `libcrypto`:

```diff
 --passL:"-static"
 -d:ssl
+--dynlibOverride:crypto
+--passL:"/usr/lib/libcrypto.a"
```

Nice! now we're on to the next similar error about `libssl`:

```
could not load: libssl.so(.3|.1.1|.1.0.2|.1.0.1|.1.0.0|.0.9.9|.0.9.8|.48|.47|.46|.45|.44|.43|.41|.39|.38|.10|)
```

Add the linker flags for `libssl`, too:

```diff
 -d:ssl
+--dynlibOverride:ssl
 --dynlibOverride:crypto
+--passL:"/usr/lib/libssl.a"
 --passL:"/usr/lib/libcrypto.a"
```

Note: `libssl` must come before `libcrypto` in the linker flags since
`libssl` depends on `libcrypto`.

The binary no longer compiles with errors like:

```
@pnet.nim.c:(.text+0x4e7c): undefined reference to `SSL_get_peer_certificate'
```

This is because Nim defaults to OpenSSL 1.x API, but the `openssl-libs-static`
package provides OpenSSL 3.x. The version flags tell Nim's wrapper to use the
correct API.

Update `nim.cfg` to use SSLv3:

```diff
 -d:ssl
+-d:openssl3
+--define:sslVersion="3.0.0"
 --dynlibOverride:ssl
```

Onto the next error:

```
net.nim(731)             newContext
Error: unhandled exception: No SSL/TLS CA certificates found. [IOError]
```

## Embedding SSL Certificates

The SSL certificates are available with the `builder` image, so we can
read them into the binary and write them to the runtime's file system:

```nim
import std / [httpclient, net]

when isMainModule:
  const embeddedCaCerts = staticRead("/etc/ssl/certs/ca-certificates.crt")
  let certFile =  "/ca-certificates.crt"
  writeFile(certFile, embeddedCaCerts)
  let context = newContext(verifyMode=CVerifyPeer,caFile=certFile)
  echo newHttpClient(sslContext=context).getContent("https://example.com")
```

Note: in production, you should probably write this to a temporary directory
with `getTempDir()` and write once to avoid repeated disk writes.

Success!

## Everything Together

```dockerfile
# Dockerfile

FROM nimlang/nim:2.2.6-alpine-regular AS builder
RUN apk add --no-cache openssl-libs-static
WORKDIR /app
COPY . .
RUN nimble install

FROM scratch
WORKDIR /app
COPY --from=builder /app /app
```

```ini
# nim.cfg
--passL:"-static"
-d:ssl
--define:sslVersion="3.0.0"
--dynlibOverride:ssl
--dynlibOverride:crypto
--passL:"/usr/lib/libssl.a"
--passL:"/usr/lib/libcrypto.a"
```

```nim
# src/static_ssl_nim.nim
import std / [httpclient, net]

when isMainModule:
  const embeddedCaCerts = staticRead("/etc/ssl/certs/ca-certificates.crt")
  let certFile =  "/ca-certificates.crt"
  writeFile(certFile, embeddedCaCerts)
  let context = newContext(verifyMode=CVerifyPeer,caFile=certFile)
  echo newHttpClient(sslContext=context).getContent("https://example.com")
```
