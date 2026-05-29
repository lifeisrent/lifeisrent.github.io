export async function onRequestPost(context) {

    const requestBody =
        await context.request.text();

    const correctPassword =
        context.env.OWNER_PASSWORD;

    if (requestBody !== correctPassword) {

        return new Response(
            "Unauthorized",
            {
                status: 401
            }
        );
    }

    const cookieValue =
        "owner=true";

    return new Response(
        "OK",
        {
            headers: {
                "Set-Cookie":
                    cookieValue +
                    "; Path=/" +
                    "; Max-Age=2592000" +
                    "; HttpOnly" +
                    "; Secure" +
                    "; SameSite=Lax"
            }
        }
    );
}