export async function onRequest(context) {
  const request = context.request;
  const requestUrl = new URL(request.url);

  const token = requestUrl.searchParams.get("token");

  if (token !== "mysecret") {
    return new Response("Forbidden", {
      status: 403
    });
  }

  return context.next();
}