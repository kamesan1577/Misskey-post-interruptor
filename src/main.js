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
                        const originalNoteButton = node.querySelector("button._button.xBTsK");
                        if (originalNoteButton) {
                            const noteButton = new NoteButton(originalNoteButton, textArea);
                        }
                        const buttonWrapper = document.createElement("div");
                        buttonWrapper.className = "button-wrapper";
                        const buttons = [new ModerateWithLlmButton(textArea)];
                        for (const button of buttons) {
                            button.init();
                        }
                        for (const button of buttons) {
                            buttonWrapper.appendChild(button.button);
                        }
                        const form = node.querySelector("footer[class=xkr7J]");
                        // console.log(form);
                        if (form) {
                            form.appendChild(buttonWrapper);
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
