export async function onRequest(context) {

    const requestUrl =
        new URL(context.request.url);

    const isProtectedPage =
        requestUrl.pathname.startsWith("/fridge");

    const isProtectedApi =
        requestUrl.pathname.startsWith("/api/foods");

    if (
        !isProtectedPage &&
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