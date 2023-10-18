// const saveToken = () => {
//     let token = document.getElementById("token").value;

//     chrome.storage.local.set({ "token": token }, () => {
//         alert("保存しました");
//     });
//     chrome.storage.local.get(["token"], (result) => {
//         document.getElementById("display_token").innerText = result.token;
//     });
// }
const saveEndpoint = () => {
    let endpoint = document.getElementById("endpoint").value;
    if (endpoint.slice(-1) != "/") {
        endpoint += "/";
    }

    chrome.storage.local.set({ "endpoint": endpoint }, () => {
        alert("保存しました");
    });
    chrome.storage.local.get(["endpoint"], (result) => {
        document.getElementById("display_endpoint").innerText = result.endpoint;
    });
}
const setDefault = () => {
    document.getElementById("endpoint").value = "https://b0861yd058.execute-api.us-east-1.amazonaws.com/dev/";
    saveEndpoint();
}
// document.getElementById("token_save_button").addEventListener("click", saveToken);
document.getElementById("endpoint_save_button").addEventListener("click", saveEndpoint);
document.getElementById("endpoint_default_button").addEventListener("click", setDefault);


