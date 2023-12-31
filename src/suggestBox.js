// 提案時の情報を表示する要素
const SuggestBox = class {
    constructor(textArea, noteButton) {
        this.noteButton = noteButton;
        // 親のdiv
        this.box = document.createElement("div");
        this.box.className = "suggest-box";

        // 提案情報のdiv
        this.info = document.createElement("div");
        this.info.className = "suggest-info";
        this.box.appendChild(this.info);

        // ラベル
        this.label = document.createElement("div");
        this.label.className = "suggest-announce-text";
        this.label.textContent = "修正提案があります";
        this.info.appendChild(this.label);

        // 提案受け入れボタン
        this.acceptButton = document.createElement("button");
        this.acceptButton.className = "exButton";
        this.acceptButton.textContent = "受け入れる";
        this.acceptButton.addEventListener("click", async () => {
            if (this.value) {
                if (this.noteButton) {
                    if (this.value != this.textBox.value) {
                        this.value = this.textBox.value;
                        const suggestions = this.noteButton.getSuggestions();
                        console.log("Send suggestion acceptance: edited by user");
                        sendSuggestAcceptance(true, await fetchUser(), textArea.value, suggestions, true);
                    }
                    else {
                        const suggestions = this.noteButton.getSuggestions();
                        console.log("Send suggestion acceptance: not edited by user");
                        sendSuggestAcceptance(true, await fetchUser(), textArea.value, suggestions);
                    }
                }
            }
            textArea.value = this.value;
            textArea.dispatchEvent(new Event("input", { bubbles: true }));
            this.noteButton.setCanPost(true);
            this.hideSuggestion();
            textArea.focus();
        });
        this.info.appendChild(this.acceptButton);

        // 提案拒否ボタン
        this.rejectButton = document.createElement("button");
        this.rejectButton.className = "exButton";
        this.rejectButton.textContent = "拒否する";
        this.rejectButton.addEventListener("click", async () => {
            this.noteButton.setCanPost(true);
            if (this.value) {
                if (this.noteButton) {
                    const suggestions = this.noteButton.getSuggestions();
                    console.log("Send suggestion rejection");
                    sendSuggestAcceptance(false, await fetchUser(), textArea.value, suggestions);
                }
            }
            console.log(NoteButton.canPost);
            this.hideSuggestion();
            textArea.focus();
        });
        this.info.appendChild(this.rejectButton);

        // 提案テキスト
        this.textBox = document.createElement("textarea");
        this.textBox.className = "suggest-text";
        this.box.appendChild(this.textBox);

        // 初期化
        this.box.style.display = "none";
        this.value = "";
    }
    setSuggestion(value) {
        this.value = value;
        this.textBox.value = value;
        this.box.style.display = "block";
    }
    hideSuggestion() {
        this.box.style.display = "none";
    }

    setNoteButton(noteButton) {
        this.noteButton = noteButton;
    }

}
