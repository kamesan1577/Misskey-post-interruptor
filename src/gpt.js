const Completion = class {
  constructor() {
    this.END_POINT = "https://api.openai.com/v1";
  }

  async moderateNote(prompt, user_id) {
    const BASE_URL =
      "https://b0861yd058.execute-api.us-east-1.amazonaws.com/dev/";
    const END_POINT = BASE_URL + "moderations";
    console.log(prompt, user_id);
    const response = await fetch(END_POINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        user_id: user_id,
      }),
    });

    const data = await response.json();
    console.log(data);
    return data.response;
  }
  async moderateReply(prompt, user_id) {
    //リプライの修正機能を書く
  }
};

class ModerateWithLlmButton {
  constructor(textArea) {
    this.textArea = textArea;
    this.button = document.createElement("button");
    this.buttonName = "修正";
    this.button.textContent = this.buttonName;
    this.button.className = "exButton";
    this.button.disabled = true;

  }

  async init() {
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("public/parrot.gif");
    img.style.display = "none";
    img.style.width = "20px";
    img.style.height = "20px";
    this.button.appendChild(img); // 初期化

    const userId = await this.setUser();
    this.button.addEventListener("click", async () => {
      this.textArea.disabled = true;
      this.button.disabled = true;
      this.button.textContent = "";
      img.style.display = "block";
      this.button.appendChild(img);

      try {
        const completion = new Completion();
        const newText = await completion.moderateNote(this.textArea.value, userId);
        this.textArea.value = newText;
      } catch (error) {
        console.log(error);
      }

      this.textArea.dispatchEvent(new Event("input", { bubbles: true }));
      this.textArea.disabled = false;
      this.button.disabled = false;
      this.button.textContent = this.buttonName;
      img.style.display = "none";
    });
  }

  async setUser() {
    const userId = await chrome.storage.local.get(["jisshu-user-id"]);
    console.log(userId);
    if (userId === undefined) {
      const uuid = crypto.randomUUID();
      await chrome.storage.local.set({ "jisshu-user-id": uuid });
      return this.setUser();
    } else {
      return userId["jisshu-user-id"];
    }
  }

  setButtonDisabled(isDisabled) {
    this.button.disabled = isDisabled;
  }
}
