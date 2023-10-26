const TimeLineEditor = class {
    constructor(timeLine) {
        this.timeLine = timeLine;
        this.notes = [];
        chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }

    handleMessage(request, sender, sendResponse) {
        console.log("Message received:", request);

        if (request.message === "Note fetched") {
            console.log("Note fetched");
            if (this.isTimeLineChanged(request.details)) {
                this.updateTimeLine();
            }
        }
    }

    async updateTimeLine() {
        const buf = this.timeLine.querySelectorAll("div.xcSej");
        if (buf) {
            this.notes = buf;
            // とりあえずMFMがないやつだけ
            // planeNotes = note.querySelectorAll("div.x48yH > span");
            // const reductedNotes = await this.redact(planeNotes);

        }
    }

    isTimeLineChanged(fetchedNote) {
        if (JSON.stringify(this.notes) != JSON.stringify(fetchedNote)) {
            return true;
        }
    }

    async redact(notes) {
        try {
            const res = [];
            response = await getTimeLineRedaction(notes, await fetchUser());
            console.log(response);
            for (const [key, value] of Object.entries(response)) {
                const regex = new RegExp(value, "g");
                res.push(key.replace(regex, "🐥"));
            }
            console.log(res);
            return res;
        }
        catch (error) {
            alert("エラーが発生しました。しばらくしてから再度お試しください。");
        }
    }
}

const Note = class {
    constructor(note, originalText, redactedText) {
        this.note = note;
        this.noteText = note.querySelector("div.x48yH > span");
        this.originalText = this.text.textContent;
        this.redactedText = "";

    }


}
