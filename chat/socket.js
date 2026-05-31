import { getConversation, getMessages, saveMessage, setSeenMsg } from "../repositories/chat.repository.js"
import { listF } from "../repositories/friends.repository.js"
import { getUserById } from "../repositories/user.repository.js"

const onlineUsers = {}
export function initSocket(io) {
    io.on("connection", async (socket) => {
        const user_id = socket.request.session.userId
        if (!user_id) return socket.disconnect()

        const user = await getUserById(user_id)
        const username = user.username
        const friends = await listF(user_id)

        onlineUsers[user_id] = socket.id
        console.log(`[LiveServer] Connection established for user ${user_id}!`)

        const OnlineInter = setInterval(() => {
            if (friends) {
                friends.forEach(friend => {
                    const friendSocket_id = onlineUsers[friend.id]
                    if (friendSocket_id) {
                        socket.to(friendSocket_id).emit("friendOnline", { userId: user_id })
                        socket.emit("friendOnline", { userId: friend.id })
                    } else {
                        socket.emit("friendOffline", { userId: friend.id })
                    }
                })
            }
        }, 10000);

        socket.on("disconnect", () => {

            if (friends) {
                friends.forEach(friend => {
                    const friendSocket_id = onlineUsers[friend.id]
                    if (friendSocket_id)
                        socket.to(friendSocket_id).emit("friendOffline", { userId: user_id })
                })
            }

            clearInterval(OnlineInter)

            delete onlineUsers[user_id]
            console.log("[LiveServer] Disconnected " + user_id)
        })

        socket.on("joinroom", async (roomName) => {
            socket.join(roomName)

            const [user1_id, user2_id] = roomName.split("_")
            const conversation_id = (await getConversation(user1_id, user2_id)).id

            if (!conversation_id)
                return

            socket.conversation_id = conversation_id

            const messages = await getMessages(conversation_id)
            socket.emit("loadMessages", { messages })
        })

        socket.on("messageSend", async ({ roomName, content }) => {
            if (!socket.conversation_id || socket.conversation_id == undefined) {
                const [user1_id, user2_id] = roomName.split("_")
                const conversation_id = (await getConversation(user1_id, user2_id)).id
                if (!conversation_id)
                    return

                socket.conversation_id = conversation_id
            }
            
            let { id = null } = await saveMessage(socket.conversation_id, user_id, content)
            socket.to(roomName).emit("messageRecieve", { content, username, id })
            socket.emit("loadMSG", { content, username, id })
        })

        socket.on("readMessage", async ({ roomName, message_id }) => {
            await setSeenMsg(message_id);
            socket.to(roomName).emit("messageSeen", { message_id })
            socket.emit("MarkMessageSeen", { message_id })
        })

        socket.on("writing", ({ roomName }) => {
            socket.to(roomName).emit("friendWriting", { username })
        })

        socket.on("stopWriting", ({ roomName }) => {
            socket.to(roomName).emit("friendStopWriting", { username })
        })
    })
}