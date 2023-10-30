let timeLineEditors = [];

const documentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (node.querySelector) {

                    // 書き手機能のDOM取得
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


                    const timeLines = node.querySelectorAll("div.xzSZs.xwehs");
                    if (timeLines && timeLines.length > 0) {
                        console.log(timeLines);
                        // timelineの数が変わっていたら
                        if (timeLines.length !== timeLineEditors.length) {
                            timeLineEditors = [];
                            timeLines.forEach((timeLine) => {
                                timeLineEditors.push(new TimeLineEditor(timeLine));
                            });
                            console.log(timeLineEditors);
                        }
                    }
                }
            });
        }
    });
});


documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
});



const port = chrome.runtime.connect({ name: "time-line" });
// タイムラインの更新を検知
port.onMessage.addListener((msg) => {
    if (msg.message === "ex-note-fetched") {
        console.log("Note fetched");
        if (timeLineEditors.length > 0) {
            timeLineEditors.forEach((timeLineEditor) => {
                timeLineEditor.updateTimeLine();
            });
        }
    }
});

//FIXME 初期化時にタイムラインの更新を検知できない
setTimeout(() => {
    if (timeLineEditors.length > 0) {
        timeLineEditors.forEach((timeLineEditor) => {
            timeLineEditor.updateTimeLine();
        });
    }
}, 1000);
