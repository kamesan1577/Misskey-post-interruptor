// 投稿修正ボタン
class ModerateWithLlmButton {
    constructor(textArea) {
        this.textArea = textArea;
        this.button = document.createElement("button");
        this.buttonName = "修正";
        this.button.textContent = this.buttonName;
        this.button.className = "exButton";
        this.button.disabled = true;

        this.END_POINT = "https://api.openai.com/v1";
    }

    async init() {
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("public/parrot.gif");
        img.style.display = "none";
        img.style.width = "20px";
        img.style.height = "20px";
        this.button.appendChild(img); // 初期化

        this.button.addEventListener("click", async () => {
            this.textArea.disabled = true;
            this.button.disabled = true;
            this.button.textContent = "";
            img.style.display = "block";
            this.button.appendChild(img);
            const userId = await fetchUser();
            const newText = await moderatePost(this.textArea.value, userId);
            this.textArea.value = newText;

            this.textArea.dispatchEvent(new Event("input", { bubbles: true }));
            this.textArea.disabled = false;
            this.button.disabled = false;
            this.button.textContent = this.buttonName;
            img.style.display = "none";
        });
    }


    setButtonDisabled(isDisabled) {
        this.button.disabled = isDisabled;
    }
}
