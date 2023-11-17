//FIXME ハードコーディングじゃなくてmanifest.jsonから取得するようにする
const MOCHI_URL = "https://omochifestival.com/api/";
const IO_URL = "https://misskey.io/api/";
let webSocket = null;
let port = null;

chrome.runtime.onConnect.addListener((connectedPort) => {
    console.assert(connectedPort.name === "time-line");
    port = connectedPort;

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        setupMessageHandler();
    }
    // webRequest のリスナーを登録
    chrome.webRequest.onCompleted.addListener(
        async (details) => {
            console.log(details);
            port.postMessage({ message: 'ex-note-fetched' });
        }, { urls: [`${MOCHI_URL}*/*timeline`] }
    );
});

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.type === "websocket") {
            //FIXME ハードコーディング！！！！！！！！！！！！！！！！！！
            if (details.url.includes("wss://omochifestival.com/streaming")) {
                console.log("websocket intercepted: ", details.url);
                connect(details.url);
            }
        }
    },
    { urls: ["<all_urls>"] },
);

function setupMessageHandler() {
    webSocket.onmessage = (event) => {
        console.log(`websocket received message: ${event.data}`);
        if (port) {
            port.postMessage({ message: 'ex-note-fetched' });
        }
    };
}

function connect(url) {
    webSocket = new WebSocket(url);

    webSocket.onopen = (event) => {
        console.log('websocket open');
        setupMessageHandler();

        const generateId = () => { return Math.floor(Math.random() * 1000000000000000000) };

        webSocket.send(JSON.stringify({ "type": "connect", "body": { "channel": "homeTimeline", "id": generateId(), "params": { "withReplies": false } } }));
        webSocket.send(JSON.stringify({ "type": "connect", "body": { "channel": "localTimeline", "id": generateId(), "params": { "withReplies": false } } }));
        webSocket.send(JSON.stringify({ "type": "connect", "body": { "channel": "hybridTimeline", "id": generateId(), "params": { "withReplies": false } } }));
        webSocket.send(JSON.stringify({ "type": "connect", "body": { "channel": "globalTimeline", "id": generateId(), "params": { "withReplies": false } } }));

        keepAlive();
    };

    // webSocket.onmessage = (event) => {
    //     console.log(`websocket received message: ${event.data}`);
    // };

    webSocket.onclose = (event) => {
        console.log('websocket connection closed');
        webSocket = null;
    };
}

function disconnect() {
    if (webSocket == null) {
        return;
    }
    webSocket.close();
}

function keepAlive() {
    const keepAliveIntervalId = setInterval(
        () => {
            if (webSocket) {
                webSocket.send('keepalive');
            } else {
                clearInterval(keepAliveIntervalId);
            }
        },
        // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
        20 * 1000
    );
}
