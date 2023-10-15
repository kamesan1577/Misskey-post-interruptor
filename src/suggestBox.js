// 提案時の情報を表示する要素
const SuggestBox = class {
    constructor(textArea) {
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
        this.acceptButton.addEventListener("click", () => {
            textArea.value = this.value;
            textArea.dispatchEvent(new Event("input", { bubbles: true }));
            this.noteButton.setCanPost(true);
            // sendSuggestAcceptance(true);
            this.hideSuggestion();
        });
        this.info.appendChild(this.acceptButton);

        // 提案拒否ボタン
        this.rejectButton = document.createElement("button");
        this.rejectButton.className = "exButton";
        this.rejectButton.textContent = "拒否する";
        this.rejectButton.addEventListener("click", () => {
            this.noteButton.setCanPost(true);
            // sendSuggestAcceptance(false);
            console.log(NoteButton.canPost);
            this.hideSuggestion();
        });
        this.info.appendChild(this.rejectButton);

        // 提案テキスト
        this.textBox = document.createElement("div");
        this.textBox.className = "suggest-text";
        this.box.appendChild(this.textBox);

        // 初期化
        this.box.style.display = "none";
        this.value = "";
    }
    setSuggestion(value) {
        this.value = value;
        this.textBox.textContent = value;
        this.box.style.display = "block";
    }
    hideSuggestion() {
        this.box.style.display = "none";
    }

    setNoteButton(noteButton) {
        this.noteButton = noteButton;
    }

}
