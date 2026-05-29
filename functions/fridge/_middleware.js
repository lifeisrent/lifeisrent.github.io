const cookieHeader =
    context.request.headers.get("Cookie");

if (
    cookieHeader &&
    cookieHeader.includes("owner=true")
) {
    return context.next();
}
export async function onRequest(context) {
  const request = context.request;
  const requestUrl = new URL(request.url);

  const expires = requestUrl.searchParams.get("expires");
  const signature = requestUrl.searchParams.get("signature");

  if (!expires || !signature) {
    return new Response("Missing signed link", {
      status: 403
    });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = Number(expires);

  if (expireTime < currentTime) {
    return new Response("Link expired", {
      status: 403
    });
  }

  const message = requestUrl.pathname + ":" + expires;
  const expectedSignature = await createSignature(
    message,
    context.env.SIGNING_SECRET
  );

  if (signature !== expectedSignature) {
    return new Response("Invalid signature", {
      status: 403
    });
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