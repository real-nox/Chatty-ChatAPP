let current_room;

let writingTimeout = null
let writingInterval = null

window.addEventListener("load", async (ev) => {
    const { success, error, friends } = await getListFriends()
    const container = document.getElementById("listFriendsDMs")

    if (!success)
        return container.innerHTML = `<p>${error}</p>`

    let div = ""
    for (const friend of friends) {
        div += `<div class="friendItem" id="friendItem" data-id="${friend.id}">
                    <button class="friendChannelBTN" id="friendChannelBTN" data-id="${friend.id}">${friend.username}</button>
                    <div class="presence red"></div>
                </div>`
    }

    return container.innerHTML = div
})

const current_user_id = document.getElementById("settings").dataset.id
const current_user_username = document.getElementById("settings").dataset.username

document.addEventListener("submit", async (ev) => {

    if (ev.target.classList.contains("addFriendForm")) {
        ev.preventDefault()

        const input_Username = document.getElementById("usernameInp").value
        const label = document.getElementById("labelFriendInp")

        if (!SanitizeInput(input_Username) || SanitizeInput(input_Username)?.length == 0) {
            label.textContent = "Fill in the form"
            return
        }

        try {
            const result = await fetch("/friends/requests/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendUsername: SanitizeInput(input_Username) })
            })

            const data = await result.json()

            if (!data.success) {
                label.style.color = "red"
                label.textContent = data.error
            } else {
                label.style.color = "green"
                label.textContent = `Friend request sent to ${SanitizeInput(input_Username)}`
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (ev.target.classList.contains("messagesend")) {
        ev.preventDefault()

        clearInterval(writingInterval)
        clearTimeout(writingTimeout)

        document.getElementById("writingp").innerText = ""

        const content = document.getElementById("msg").value
        if (!content) return

        socket.emit("messageSend", {
            roomName: current_room,
            content: SanitizeInput(content)
        })

        socket.emit("stopWriting", { roomName: current_room })

        document.getElementById("msg").value = ""
    }
})

document.addEventListener("click", async (ev) => {
    if (ev.target.classList.contains("requestsBTN")) {
        const list = document.getElementById("friendsReqList")

        if (list.style.display == "none" || list.style.display == "") {
            list.style.display = "flex";

            const listFriendsReq = await getPendingFReq()

            if (listFriendsReq == null)
                return document.getElementById("listFriends").innerHTML = "No friend request"

            document.getElementById("listFriends").innerHTML = ""

            let div = "<h3>Friend Requests</h3>"

            for (const friend of (listFriendsReq)) {

                div += `<div class="friendtemplate">
                    <div class="avatarUser">
                        <img src="" alt="avatar">
                    </div>
                    <div class="info">
                        <p>${friend.username}</p>
                    </div>`

                if (friend.sender_id != current_user_id) {
                    div +=
                        `<div class="actions">
                        <span class="material-symbols-outlined check checkBTN" data-id="${friend.request_id}">check</span>
                        <span class="material-symbols-outlined close cancelBTN" data-id="${friend.request_id}">close</span>
                    </div>`
                }
                div += "</div>"
            }
            document.getElementById("listFriends").innerHTML = div

            return
        } else
            return list.style.display = ""
    }

    if (ev.target.classList.contains("checkBTN")) {
        try {
            const req_id = ev.target.dataset.id
            await acceptPendingFReq(req_id)
            window.location.reload()
        } catch (err) {
            console.error(err);
        }
    }

    if (ev.target.classList.contains("cancelBTN")) {
        try {
            const req_id = ev.target.dataset.id
            await declinePendingFReq(req_id)

        } catch (err) {
            console.error(err);
        }
    }

    if (ev.target.classList.contains("friendChannelBTN")) {
        try {
            const room = document.getElementById("friendChannel")

            const top = document.getElementById("top")
            const center = document.getElementById("chat")
            const msgsend = document.getElementById("msgsend")

            top.classList.add("load")
            center.classList.add("load")
            msgsend.classList.add("load")

            const friend_id = ev.target.dataset.id

            const { success, error, friend } = await getFriendInfo(friend_id)

            if (!success)
                return console.warn(error);

            top.innerHTML = `<p>${friend.id} - ${friend.username}</p>`
            msgsend.innerHTML = `<div class="writingDiv">
                                    <p id="writingp"></p>
                                </div>
                                <div class="formsend">
                                    <form id="messagesend" class="messagesend">
                                        <input type="text" class="msg" name="messages" id="msg" autocomplete="false">
                                        <button type="button" id="emojiToggle">😊</button>
                                        <button type="submit"><span class="material-symbols-outlined">send</span></button>
                                    </form>
                                    <emoji-picker id="picker" style="display:none;"></emoji-picker>
                                </div>`

            current_room = [current_user_id, friend_id].sort().join("_")
            socket.emit("joinroom", current_room)


            //Emojis
            const picker = document.getElementById('picker')
            const toggle = document.getElementById("emojiToggle")

            if (toggle) {
                toggle.addEventListener("click", () => {
                    picker.style.display = picker.style.display === "none" ? "block" : "none"
                })
            }

            if (picker) {
                picker.addEventListener('emoji-click', (event) => {
                    console.log("here")
                    document.getElementById('msg').value += event.detail.unicode
                    picker.style.display = "none"
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
})

document.addEventListener("input", async (ev) => {
    if (ev.target.classList.contains("msg"))
        socket.emit("writing", { roomName: current_room })
})

// Friend Status

socket.on("friendOnline", ({ userId }) => {

    document.querySelectorAll(".friendItem").forEach(friend => {
        if (friend.dataset.id == userId) {
            friend.querySelector(".presence").classList.remove("red")
            friend.querySelector(".presence").classList.add("green")
        }
    })
})

socket.on("friendOffline", ({ userId }) => {

    document.querySelectorAll(".friendItem").forEach(friend => {
        if (friend.dataset.id == userId) {
            friend.querySelector(".presence").classList.remove("green")
            friend.querySelector(".presence").classList.add("red")
        }
    })
})

// Friend writing states

socket.on("friendWriting", ({ username }) => {
    const writingp = document.getElementById("writingp")
    if (writingp) writingp.innerText = `${username} is Writing...`

    clearInterval(writingInterval)
    clearTimeout(writingTimeout)

    let dots = 3
    writingInterval = setInterval(() => {
        dots = (dots % 3) + 1
        if (writingp)
            writingp.innerText = `${username} is Writing${".".repeat(dots)}`
    }, 500);

    writingTimeout = setTimeout(() => {
        if (writingp) writingp.innerText = ""
    }, 7000)
})

socket.on("friendStopWriting", ({ username }) => {
    const writingp = document.getElementById("writingp")
    if (writingp) writingp.innerText = ""

    clearInterval(writingInterval)
    clearTimeout(writingTimeout)
})

// Messages

socket.on("loadMessages", async ({ messages }) => {
    const room = document.getElementById("friendChannel")

    const top = document.getElementById("top")
    const center = document.getElementById("chat")
    const msgsend = document.getElementById("msgsend")

    center.innerHTML = ""

    if (!messages || messages.length == 0) {
        return center.innerHTML = ""
    }

    for (const { id, sender_id, username, content, created_at, seen } of messages) {
        let div = ""
        let downdiv = seen ? "Seen" : "Not seen"
        if (sender_id == current_user_id) {
            if (!seen)
                div = `<div class='messagebubble right' data-id="${id}">`
            else
                div = `<div class='messagebubble right seen' data-id="${id}">`
        } else {
            if (!seen) {
                div = `<div class='messagebubble left' data-id="${id}">`
                socket.emit("readMessage", { roomName: current_room, message_id: id })
            } else {
                div = `<div class='messagebubble left seen' data-id="${id}">`
            }
        }

        div += `
            <div class="messageContainer">
                    <div class="msgUser">
                        <p><strong>${username}</strong></p>
                    </div>
                    <div class="msgContent" id="msgContent">
                        <p>${SanitizeInput(content)}</p>
                    </div >
                    <div class="msgTIME">
                        <p>${new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: '2-digit' })}- ${downdiv}</p>
                    </div>
            </div >
        </div >`

        center.innerHTML += div
    }
})

socket.on("messageRecieve", ({ content, username, id }) => {
    const center = document.getElementById("chat")

    let div = `<div class='messagebubble left' data-id='${id}'>
                    <div class="messageContainer">
                        <div class="msgUser">
                            <p><strong>${username}</strong></p>
                        </div>
                        <div class="msgContent" id="msgContent">
                            <p>${SanitizeInput(content)}</p>
                        </div >
                        <div class="msgTIME">
                            <p>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: '2-digit' })} - Not seen</p>
                        </div>
                    </div >
                </div >`

    center.innerHTML += div

    if (current_room)
        socket.emit("readMessage", { roomName: current_room, message_id: id })
})

socket.on("loadMSG", ({ content, username, id }) => {
    const center = document.getElementById("chat")

    let div = `<div class='messagebubble right' data-id='${id}'>
                    <div class="messageContainer">
                        <div class="msgUser">
                            <p><strong>${current_user_username}</strong></p>
                        </div>
                        <div class="msgContent" id="msgContent">
                            <p>${SanitizeInput(content)}</p>
                        </div >
                        <div class="msgTIME">
                            <p>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: '2-digit' })} - Not seen</p>
                        </div>
                    </div >
                </div >`

    center.innerHTML += div
})

// Seen

socket.on("messageSeen", ({ message_id }) => {
    const message = document.querySelector(`.messagebubble[data-id="${message_id}"]`)

    if (message) {
        message.classList.add("seen")
        const down = message.querySelector(".msgTIME p")
        down.innerText = down.innerText.replace("Not seen", "Seen")
    }
})

socket.on("MarkMessageSeen", ({ message_id }) => {
    const message = document.querySelector(`.messagebubble[data-id="${message_id}"]`)

    if (message) {
        message.classList.add("seen")
        const down = message.querySelector(".msgTIME p")
        down.innerText = down.innerText.replace("Not seen", "Seen")
    }
})

async function getListFriends() {
    try {
        const result = await fetch("/friends/list", { method: "GET" })

        const data = await result.json()

        return data
    } catch (err) {
        console.error(err);
    }
}

async function getPendingFReq() {
    try {
        const result = await fetch("/friends/requests/pending", { method: "GET" })

        const data = await result.json()

        if (!data)
            return null

        return data
    } catch (err) {
        console.error(err)
    }
}

async function acceptPendingFReq(req_id) {
    try {
        await fetch(`/friends/requests/${req_id}/accept`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        })
    } catch (err) {
        console.error(err);
    }
}

async function declinePendingFReq(req_id) {
    try {
        await fetch(`/friends/requests/${req_id}/decline`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        })
    } catch (err) {
        console.error(err);
    }
}

async function getFriendInfo(friend_id) {
    try {
        const result = await fetch(`/friends/${friend_id}`, { method: "GET" })

        const data = await result.json()

        return data
    } catch (err) {
        console.error(err);
    }
}