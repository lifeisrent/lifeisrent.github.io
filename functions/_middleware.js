
export async function onRequest(context) {

    const requestUrl =
        new URL(context.request.url);

    const isSignedLinkPage =
        requestUrl.pathname.startsWith("/fridge");

    const isOwnerPage =
        requestUrl.pathname.startsWith("/dev");

    const isProtectedApi =
        requestUrl.pathname.startsWith("/api/foods") ||
        requestUrl.pathname.startsWith("/api/posts");

    if (
        !isSignedLinkPage &&
        !isOwnerPage &&
        !isProtectedApi
    ) {
        return context.next();
    }

    const cookieHeader =
        context.request.headers.get("Cookie");

    if (
        cookieHeader &&
        cookieHeader.includes("owner=true")
    ) {
        return context.next();
    }

    if (isOwnerPage) {
        return Response.redirect(
            new URL(
                "/owner-login.html?redirect=" +
                encodeURIComponent(requestUrl.pathname),
                requestUrl.origin
            ),
            302
        );
    }

    if (isProtectedApi) {
        return new Response(
            "Unauthorized",
            {
                status: 401
            }
        );
    }

    const expires =
        requestUrl.searchParams.get("expires");

    const signature =
        requestUrl.searchParams.get("signature");

    if (!expires || !signature) {
        return new Response(
            "Missing signed link",
            {
                status: 403
            }
        );
    }

    const currentTime =
        Math.floor(Date.now() / 1000);

    const expireTime =
        Number(expires);

    if (expireTime < currentTime) {
        return new Response(
            "Link expired",
            {
                status: 403
            }
        );
    }

    const message =
        requestUrl.pathname + ":" + expires;

    const expectedSignature =
        await createSignature(
            message,
            context.env.SIGNING_SECRET
        );

    if (signature !== expectedSignature) {
        return new Response(
            "Invalid signature",
            {
                status: 403
            }
        );
    }

    return context.next();
}

async function createSignature(message, secretKey) {
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );

  const signatureBytes = Array.from(new Uint8Array(signatureBuffer));

  const signatureText = signatureBytes
    .map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    })
    .join("");

  return signatureText;
}
