const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (node.querySelector) {
                    const textArea = node.querySelector(
                        "textarea[data-cy-post-form-text]"
                    );
                    // console.log(textArea);
                    if (textArea) {
                        // console.log(node);
                        const suggestBox = new SuggestBox(textArea);
                        const originalNoteButton = node.querySelector("button._button.xBTsK");
                        if (originalNoteButton) {
                            const noteButton = new NoteButton(originalNoteButton, textArea, suggestBox);
                            suggestBox.setNoteButton(noteButton);
                        }

                        const form = node.querySelector("div.xpDI4");
                        if (form) {
                            form.insertBefore(suggestBox.box, textArea.parentNode);
                        }
                        const buttonWrapper = document.createElement("div");
                        buttonWrapper.className = "button-wrapper";
                        const buttons = [new ModerateWithLlmButton(textArea)];
                        for (const button of buttons) {
                            button.init();
                            buttonWrapper.appendChild(button.button);
                        }
                        const footer = node.querySelector("footer[class=xkr7J]");
                        // console.log(footer);
                        if (footer) {
                            footer.appendChild(buttonWrapper);
                        }

                        // テキストエリアに文字が入力された時にボタンを活性化
                        textArea.addEventListener("input", () => {
                            buttons.forEach((button) => {
                                button.setButtonDisabled(!textArea.value.trim()); // テキストが空でない場合は活性化
                            });
                        });
                    }
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
});

chrome.storage.local.get(["misskey-token"], (result) => {
    if (!result["misskey-token"]) {
        const account = JSON.parse(localStorage.getItem("account"));
        const token = account["token"];
        chrome.storage.local.set({ "misskey-token": token });
    }
});
