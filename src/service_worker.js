//FIXME ハードコーディングじゃなくてmanifest.jsonから取得するようにする
const MOCHI_URL = "https://omochifestival.com/api/";
const IO_URL = "https://misskey.io/api/";

console.log("Hello from service worker");
chrome.webRequest.onCompleted.addListener(
    async (details) => {
        console.log(details);
        chrome.runtime.sendMessage({ type: "Note fetched", details: details }, function (response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
        });
    }, { urls: [`${MOCHI_URL}*/timeline`] }
);
