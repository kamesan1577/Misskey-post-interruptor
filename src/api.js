let BASE_URL = "https://b0861yd058.execute-api.us-east-1.amazonaws.com/dev/";
chrome.storage.local.get(["endpoint"], (result) => {
    if (result.endpoint) {
        BASE_URL = result.endpoint;
        console.log("endpoint: ", BASE_URL);
    }
})

// const BASE_URL = "http://localhost:8000/";

//TODO クラスにまとめる

// 投稿の修正を行う
async function moderatePost(prompt, user_id) {
    const END_POINT = BASE_URL + "moderations";
    console.log(prompt, user_id);
    try {
        const response = await fetch(END_POINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                user_id: user_id,
            }),
        });
        const data = await response.json();
        console.log(data);
        return data.response;
    } catch (error) {
        alert("エラーが発生しました。しばらくしてから再度お試しください。");
        console.log(error);
        return prompt;
    }

}

// リプライの修正を行う
async function moderateReply(prompt, user_id) {
    //頑張って書く
}


// 修正が必要かどうかを判定する
function isRequiredModeration(words) {
    return words.length > 0;
}

// 修正が必要な単語を取得する
async function getSuggestions(text, user_id) {
    const base_text = text.replace(/\n/g, "");
    const END_POINT = BASE_URL + "moderations/suggestions";
    try {
        const response = await fetch(END_POINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: base_text,
                user_id: user_id,
            }),
        });
        const data = await response.json();
        console.log(data);
        return data.suggestions;
    } catch (error) {
        alert("エラーが発生しました。しばらくしてから再度お試しください。");
        console.log(error);
        return [];
    }
}

async function sendSuggestAcceptance(is_accepted, user_id, original_text, hidden_texts, is_edited_by_user = false) {
    const END_POINT = BASE_URL + "poc/suggest-acceptance-collection";
    try {
        const response = await fetch(END_POINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                is_accepted: is_accepted,
                is_edited_by_user: is_edited_by_user,
                original_text: original_text,
                hidden_texts: hidden_texts,
            }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        alert("エラーが発生しました。しばらくしてから再度お試しください。");
        console.log(error);
    }
}
