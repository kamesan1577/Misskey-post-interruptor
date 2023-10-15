async function fetchUser() {
    const userId = await chrome.storage.local.get(["jisshu-user-id"]);
    console.log(userId);
    if (typeof userId["jisshu-user-id"] === "undefined") {
        const uuid = crypto.randomUUID();
        await chrome.storage.local.set({ "jisshu-user-id": uuid });
        return this.fetchUser();
    } else {
        return userId["jisshu-user-id"];
    }
}
