// 投稿ボタンに機能を追加する
const NoteButton = class {
    constructor(button, textArea, suggestBox) {
        this.button = button;
        this.isProcessing = false;
        this.canPost = false;
        this.textArea = textArea;
        this.suggestBox = suggestBox;
        console.log("NoteButton constructor called");
        // 投稿前に実行する処理
        this.clickHandler = this.clickHandler.bind(this);
        this.button.addEventListener("click", this.clickHandler, true);
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
        const targetElement = event.target.closest("button._button.xBTsK");
        if (targetElement) {
            this.isProcessing = true;
            console.log("noteButton clicked");

            const baseText = this.textArea.value;
            const userId = await fetchUser();

            if (await isRequiredModeration(baseText, userId)) {
                const newText = await moderatePost(baseText, userId);
                console.log("修正提案があります");
                this.suggestBox.setSuggestion(newText);
                this.isProcessing = false;
            }
            else {
                this.suggestBox.hideSuggestion();
                console.log("修正提案はありませんでした");

                // イベントリスナーを殺してからクリックする(無限ループするので)
                this.button.removeEventListener("click", this.clickHandler, true);

                targetElement.click();

                this.button.addEventListener("click", this.clickHandler, true);

                this.isProcessing = false;
            }
        }
    }
    setCanPost(canPost) {
        this.button.disabled = false;
        this.canPost = canPost;
    }

}
