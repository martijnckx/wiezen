export async function onRequest({ passThroughOnException, request}) {
    passThroughOnException();
    const proxiedRequest = new Request(request);
    proxiedRequest.headers.delete('cookie');
    return await fetch("https://plausible.io/api/event", proxiedRequest);
}