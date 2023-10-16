// const BASE_URL = "https://b0861yd058.execute-api.us-east-1.amazonaws.com/dev/";
const BASE_URL = "http://localhost:8000/";

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
async function isRequiredModeration(text, user_id) {
    const base_text = text.replace(/\n/g, "");
    //隠された単語の数を基準に判定する
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
        if (data.suggestions.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        alert("エラーが発生しました。しばらくしてから再度お試しください。");
        console.log(error);
        return false;
    }
}

async function sendSuggestAcceptance(is_accepted, original_text, hidden_texts, user_id) {
    const END_POINT = BASE_URL + "moderations/suggestions/acceptance";
    try {
        const response = await fetch(END_POINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_accepted: is_accepted,
                user_id: user_id,
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
