const TimeLineEditor = class {
    constructor(timeLine) {
        this.timeLine = timeLine;
        this.notes = [];
        this.prevNotes = [];
        // chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
        console.log("TimeLineEditor constructor called");
    }

    // handleMessage(request, sender, sendResponse) {
    //     console.log("Message received:", request);
    //     if (request.message === "ex-note-fetched") {
    //         console.log("Note fetched");
    //         if (this.isTimeLineChanged(request.details)) {
    //             this.updateTimeLine();
    //         }
    //     }
    //     return;
    // }

    async updateTimeLine() {
        try {
            // console.log("notes:", this.notes);
            const notesElements = this.timeLine.querySelectorAll("div.x48yH > span");
            const newNotesHTML = [...notesElements].map(element => element.innerHTML);

            // 更新されたノートのみを抽出
            const diffNotes = newNotesHTML.filter((note, index) => !this.prevNotes[index] || this.prevNotes[index] !== note);

            this.prevNotes = newNotesHTML;

            if (diffNotes.length > 0) {
                const redactedNotes = await this.redact(diffNotes);

                diffNotes.forEach((originalNote, index) => {
                    const correspondingNoteElementIndex = newNotesHTML.indexOf(originalNote);
                    if (correspondingNoteElementIndex !== -1) {
                        const noteElement = notesElements[correspondingNoteElementIndex];
                        const redactedNote = redactedNotes[index];
                        this.notes.push(new Note(noteElement, originalNote, redactedNote));
                        // if (noteElement) {
                        //     noteElement.innerHTML = redactedNote;
                        // }
                    }
                });

                // notes.forEach((note, index) => {
                //     const originalHTML = note.innerHTML;
                //     const modifiedHTML = redactedNotes[index];
                //     this.notes = [...this.notes, new Note(note, originalHTML, modifiedHTML)];
                // });
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }


    async redact(notes) {
        try {
            const res = [];
            const response = await getTimeLineRedaction(notes);
            // console.log(response);

            for (const item of response) {
                // key: string, value: [string]
                // console.log(item);
                if (item["hidden"].length === 0) {
                    // console.log("item:", item["original"]);
                    res.push(item["original"]);
                    continue;
                }
                let redacted = "";
                item["hidden"].forEach((hidden) => {
                    // console.log(hidden);
                    const regex = new RegExp(hidden, "g");
                    const redactedString = "🐥".repeat(hidden.length);
                    redacted = item["original"].replace(regex, redactedString);
                });
                res.push(redacted);
            }
            // console.log(res);
            return res;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}

const Note = class {
    constructor(note, original, redacted) {
        this.note = note;
        // console.log("note: ", note);
        this.original = original;
        this.redacted = redacted;
        this.revealed = false;

        if (this.note && this.original && this.redacted) {
            console.log("note redacted");
            if (this.note.innerHTML !== undefined) {
                this.note.innerHTML = this.redacted;
                this.note.addEventListener("click", this.handleReveal.bind(this));
            }
        }
        else {
            console.log("note is null");
        }

    }

    handleReveal() {
        this.revealed = !this.revealed;
        if (this.revealed) {
            this.note.innerHTML = this.original;
        }
        else {
            this.note.innerHTML = this.redacted;
        }
    }

}
