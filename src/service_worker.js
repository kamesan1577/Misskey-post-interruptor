const BASE_URL = "https://omochifestival.com/api/";
chrome.webRequest.onCompleted.addListener(
    async (details) => {
        console.log("Request completed: ", details);
        const re = new RegExp(`${BASE_URL}.*?/timeline`);
        const url = details.url.match(re)[0];
        console.log(url);
        // サービスワーカーはlocal storageがつかえないらしい（終わり？）
        // const token = await chrome.storage.local.get(["account"]);
        console.log(token);
    }, { urls: [`${BASE_URL}*/timeline`] }
);


