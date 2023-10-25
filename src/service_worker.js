let internalRequest = false;
//FIXME ハードコーディングじゃなくてmanifest.jsonから取得するようにする
const MOCHI_URL = "https://omochifestival.com/api/";
const IO_URL = "https://misskey.io/api/";

// internalRequestつくってからそもそもイベントをキャッチしてくれない
chrome.webRequest.onBeforeRequest.addListener(
    async (details) => {
        console.log(internalRequest);
        if (internalRequest) {
            internalRequest = false;
            return;
        }
        console.log("Request completed: ", details);
        const bodyArrayBuffer = details.requestBody.raw[0].bytes;
        const bodyText = new TextDecoder("utf-8").decode(new Uint8Array(bodyArrayBuffer));
        const bodyJSON = JSON.parse(bodyText);

        console.log(bodyJSON);

        const re = new RegExp(`${details.url}.*?/timeline`);
        const url = details.url.match(re)[0];
        console.log(url);

        const token = await chrome.storage.local.get(["misskey-token"]);
        console.log(token);

        internalRequest = true;

        const timeline = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token["misskey-token"],
            },
            body: JSON.stringify({
                limit: bodyJSON.limit,
                sinceId: bodyJSON.sinceId,
                untilId: bodyJSON.untilId,
                sinceDate: bodyJSON.sinceDate,
                untilDate: bodyJSON.untilDate,
            }),
        });
        const timelineJSON = await timeline.json();
        console.log(timelineJSON);
    }, { urls: [`${MOCHI_URL}*/timeline`, `${IO_URL}*/timeline`] }, ["requestBody"]
);
