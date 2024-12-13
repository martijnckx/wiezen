export async function onRequestGet({passThroughOnException, waitUntil, request}) {
    passThroughOnException();
    let response = await caches.default.match(request);
    if (!response) {
        const pathname = new URL(request.url).pathname
        const [_, ...extensions] = pathname.split('.')
        response = await fetch("https://plausible.io/js/plausible." + extensions.join("."));
        waitUntil(caches.default.put(request, response.clone()));
    }
    return response;
}