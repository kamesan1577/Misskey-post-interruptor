//FIXME ハードコーディングじゃなくてmanifest.jsonから取得するようにする
const MOCHI_URL = "https://omochifestival.com/api/";
const IO_URL = "https://misskey.io/api/";

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "time-line");

    // webRequest のリスナーを登録
    chrome.webRequest.onCompleted.addListener(
        async (details) => {
            console.log(details);
            port.postMessage({ message: 'ex-note-fetched' });
        }, { urls: [`${MOCHI_URL}*/*timeline`] }
    );
});
