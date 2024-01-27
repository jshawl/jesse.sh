---
title: diy jwt signatures
---

I recently had a need to create a jwt with a valid signature in a
browser without using a library.

## Creating a JWT

The header and the payload

```js
const header = {
    "typ": "JWT",
    "alg": "ES256"
}

const payload = {
    "iss": "joe",
    "exp": 1300819380,
    "http://example.com/is_root": true
}
```

are base 64 encoded

```js
const base64UrlEncode = (object) => {
    return btoa(JSON.stringify(object))
}
```

to

```js
base64UrlEncode(header)
// eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9
```

and

```js
base64UrlEncode(payload)
// eyJpc3MiOiJqb2UiLCJleHAiOjEzMDA4MTkzODAsImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ==
```

but the padding should be removed ([rfc7515](https://datatracker.ietf.org/doc/html/rfc7515#appendix-C))

```diff
const base64UrlEncode = (object) => {
    return btoa(JSON.stringify(object))
+      .replace(/=/g,"")
+      .replace(/\//g,"_")
+      .replace(/\+/g,"-")
}
```

and joined with `"."` to form a jwt

```js
const jwt = [
    base64UrlEncode(header),
    base64UrlEncode(payload)
].join(".")
// eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJqb2UiLCJleHAiOjEzMDA4MTkzODAsImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ
```

## Signing the JWT

Generate an asymmetric keypair

```js
const {publicKey, privateKey} = await crypto.subtle.generateKey(
    {
        name: "ECDSA",
        namedCurve: "P-256",
    },
    false, // non-extractable private key
    ["sign", "verify"]
)
```

I picked `ECDSA` using `P-256` because of the `Recommended+` label in
[rfc7518](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1)

Sign the jwt with the private key

```js
const signature = await crypto.subtle.sign({
    name: "ECDSA",
    hash: { name: "SHA-256" }
},
    privateKey, 
    jwt
)
```

but that throws an error

```txt
Uncaught (in promise) TypeError: SubtleCrypto.sign: 
Argument 3 could not be converted to any of: 
ArrayBufferView, ArrayBuffer.
```

so the data must be encoded as a `Uint8Array`

```js
const encodedJwt = new TextEncoder().encode(jwt)
```

and re-signed

```js
const signature = await crypto.subtle.sign({
    name: "ECDSA",
    hash: { name: "SHA-256" }
},
    privateKey, 
    encodedJwt
)
```

convert the signature's `ArrayBuffer` to a `Uint8Array`

```js
const encodedSignature = new Uint8Array(signature)
```

and base64 encode the signature as a binary string 

```diff
const base64UrlEncode = (object) => {
+    let string
+    if( object instanceof Uint8Array ) {
+        string = String.fromCharCode(...object)
+    } else {
+        string = JSON.stringify(object)
+    }
-    return btoa(JSON.stringify(object))    
+    return btoa(string)
        .replace(/=/g,"")
        .replace(/\//g,"_")
        .replace(/\+/g,"-")
}
```

```js
const base64UrlEncodedSignature = base64UrlEncode(encodedSignature)
// rF6SuHTRcYWeGOkkgQ0QMGHomW_5e4s7dYKtU5Gvteiy_qmy8fEnpLFuIRfP0J4hIiYWCEftfWOFMUeEpXl_Qw
```

and add it to the existing jwt

```js
const signedJwt = `${jwt}.${base64UrlEncodedSignature}`
```

and now I can see that it is verifiable in 
[the jwt.io debugger](https://jwt.io/#debugger-io?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJqb2UiLCJleHAiOjEzMDA4MTkzODAsImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.rF6SuHTRcYWeGOkkgQ0QMGHomW_5e4s7dYKtU5Gvteiy_qmy8fEnpLFuIRfP0J4hIiYWCEftfWOFMUeEpXl_Qw&publicKey=%7B%22alg%22%3A%22ES256%22%2C%22crv%22%3A%22P-256%22%2C%22ext%22%3Atrue%2C%22key_ops%22%3A%5B%22verify%22%5D%2C%22kty%22%3A%22EC%22%2C%22x%22%3A%22j2jaePi0nnRXfd7Nz1YqyiDyD1fYL9cfSEWbBt_buHY%22%2C%22y%22%3A%2246FnOBf4iV62BQdxISktM_kgH_jPnABCpOXp7ABLr3U%22%7D)
🥳 but also 🔐

## Verifying the JWT Signature

split up the signed jwt

```js
const [encodedHeader, encodedPayload, encodedSignature] = 
    signedJwt.split(".")
```

decode the signature

```js
const decodedSignatureFromJwt = atob(encodedSignature)
// Uncaught (in promise) DOMException: String contains an invalid character
```

put back the url unsafe characters

```js
const decodedSignatureFromJwt = atob(
    encodedSignature.replace(/-/g,"+").replace(/_/g,"/")
)
```

but this is a binary string

```js
console.log(decodedSignatureFromJwt)
// ¬^�¸tÑq���é$��0aè�où{�;u�­S�¯µè²þ©²ññ'¤±n!�ÏÐ�!"&��Gí}c�1G�¥y�C
```

convert it to a `Uint8Array`

```js
const decodedSignatureFromJwtAsUint8Array = Uint8Array
    .from(decodedSignatureFromJwt, c => c.charCodeAt(0))
// new Uint8Array([172,94,146,184,116,209,113,133,158,24,233,36,129,13,16,48,97,232,153,111,249,123,139,59,117,130,173,83,145,175,181,232,178,254,169,178,241,241,39,164,177,110,33,23,207,208,158,33,34,38,22,8,71,237,125,99,133,49,71,132,165,121,127,67])
```

and verify the signature

```js
const verified = await crypto.subtle.verify({
    name: "ECDSA",
    hash: { name: "SHA-256" },
},
    publicKey,
    decodedSignatureFromJwtAsUint8Array,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
)
// true
```

Pretty cool. Here's all the code I used in copy-paste format:

```js
(async () => {

    const header = {
        "typ": "JWT",
        "alg": "ES256"
    }

    const payload = {
        "iss": "joe",
        "exp": 1300819380,
        "http://example.com/is_root": true
    }

    const base64UrlEncode = (object) => {
        let string
        if (object instanceof Uint8Array) {
            string = String.fromCharCode(...object)
        } else {
            string = JSON.stringify(object)
        }

        return btoa(string)
            .replace(/=/g, "")
            .replace(/\//g, "_")
            .replace(/\+/g, "-")
    }

    const jwt = [
        base64UrlEncode(header),
        base64UrlEncode(payload)
    ].join(".")

    // sign
    const encodedJwt = new TextEncoder().encode(jwt)
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false,
        ["sign", "verify"]
    )
    
    const signature = await crypto.subtle.sign({
        name: "ECDSA",
        hash: { name: "SHA-256" }
    },
        privateKey,
        new TextEncoder().encode(jwt)
    )
    const encodedSignature = new Uint8Array(signature)
    const jwtWithSignature = `${jwt}.${base64UrlEncode(encodedSignature)}`

    const jwk = await crypto.subtle.exportKey("jwk", publicKey)

    console.log("jwt.io debugger url:")
    console.log(`https://jwt.io/#debugger-io?token=${jwtWithSignature}&publicKey=${encodeURIComponent(JSON.stringify(jwk))}`)

    // verify
    const importedPublicKey = await crypto.subtle.importKey("jwk", jwk, {
        name: "ECDSA",
        namedCurve: "P-256",
    }, false, ["verify"])
    const [encodedHeaderFromJwt, encodedPayloadFromJwt, encodedSignatureFromJwt] = jwtWithSignature.split(".")
    const decodedHeaderFromJwt = atob(encodedHeaderFromJwt)
    const decodedPayloadFromJwt = atob(encodedPayloadFromJwt)
    const decodedSignatureFromJwt = atob(encodedSignatureFromJwt.replace(/-/g, "+").replace(/_/g, "/"))
    const decodedSignatureFromJwtAsUint8Array = Uint8Array.from(decodedSignatureFromJwt, c => c.charCodeAt(0))
    const verified = await crypto.subtle.verify({
        name: "ECDSA",
        hash: { name: "SHA-256" },
    },
        publicKey,
        decodedSignatureFromJwtAsUint8Array,
        new TextEncoder().encode(`${encodedHeaderFromJwt}.${encodedPayloadFromJwt}`)
    )
})()
```

## Further Reading

- [JSON Web Signature rfc7515](https://datatracker.ietf.org/doc/html/rfc7515)
- [JSON Web Algorithms rfc7518](https://datatracker.ietf.org/doc/html/rfc7518)
- [SubtleCrypto API docs](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)