// 投稿ボタンに機能を追加する
const NoteButton = class {
    constructor(button, textArea) {
        button.addEventListener("click", async (event) => {
            console.log(event.cancelable);
            event.preventDefault();
            const baseText = textArea.value;
            const userId = await fetchUser();
            if (await isRequiredModeration(baseText, userId)) {
                const newText = await moderatePost(baseText, userId);
                alert("修正提案があります");
                textArea.value = `修正前:${baseText}\n修正後:${newText}`;
                textArea.dispatchEvent(new Event("input", { bubbles: true }));
            }
            else {
                alert("修正提案はありませんでした");
                // event.target.click();
            }
        }, { passive: false });
    }
}
