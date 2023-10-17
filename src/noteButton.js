// 投稿ボタンに機能を追加する
const NoteButton = class {
    constructor(button, textArea, suggestBox) {
        this.button = button;
        this.isProcessing = false;
        this.canPost = false;
        this.textArea = textArea;
        this.suggestBox = suggestBox;
        this.suggestions = [];
        console.log("NoteButton constructor called");
        // 投稿前に実行する処理
        this.clickHandler = this.clickHandler.bind(this);
        this.ctlEnterHandler = this.ctlEnterHandler.bind(this);
        this.button.addEventListener("click", this.clickHandler, true);
        this.textArea.addEventListener("keydown", this.ctlEnterHandler, true);
    }

    async clickHandler(event) {
        console.log(this.canPost);
        if (this.isProcessing) {
            return;
        }
        if (this.canPost) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        this.button.disabled = true;
        const targetElement = this.button;
        if (targetElement) {
            this.isProcessing = true;
            console.log("noteButton clicked");

            const baseText = this.textArea.value;
            const userId = await fetchUser();

            this.setSuggestions(await getSuggestions(baseText, userId));
            if (isRequiredModeration(this.getSuggestions())) {
                const newText = await moderatePost(baseText, userId);
                console.log("修正提案があります");
                this.suggestBox.setSuggestion(newText);
                this.isProcessing = false;
            }
            else {
                this.suggestBox.hideSuggestion();
                console.log("修正提案はありませんでした");
                this.setCanPost(true);

                // イベントリスナーを殺してからクリックする(無限ループするので)
                this.button.removeEventListener("click", this.clickHandler, true);

                targetElement.click();

                this.button.addEventListener("click", this.clickHandler, true);

                this.isProcessing = false;
            }
        }
    }
    async ctlEnterHandler(event) {
        if (event.ctrlKey && event.key === "Enter") {
            console.log("Ctrl + Enter detected.");
            if (this.isProcessing | this.textArea.value.trim() === "") {
                event.stopPropagation();
                event.preventDefault();
            }
            else {
                await this.clickHandler(event);
            }
        }
    }
    setCanPost(canPost) {
        this.button.disabled = false;
        this.canPost = canPost;
    }
    setSuggestions(suggestions) {
        this.suggestions = suggestions;
    }
    getSuggestions() {
        return this.suggestions;
    }

}
