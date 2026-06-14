import { getConversation, getMessages, MarkAllMsgAsSeen, saveMessage, setSeenMsg } from "../repositories/chat.repository.js"
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
                Object.entries(friends).map((friendId, { }) => {
                    const id = friendId[0]
                    const friendSocket_id = onlineUsers[id]
                    if (friendSocket_id) {
                        console.log("ONLINE ", id)
                        socket.to(friendSocket_id).emit("friendOnline", { userId: user_id })
                        socket.emit("friendOnline", { userId: id })
                    } else {
                        socket.emit("friendOffline", { userId: id })
                    }
                })
            }
        }, 10000);

        socket.on("disconnect", () => {

            if (friends) {
                Object.entries(friends).map((id, { }) => {
                    const friendSocket_id = onlineUsers[id]
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
            const conversation = (await getConversation(user1_id, user2_id))

            let conversation_id = null
            if (conversation) {
                conversation_id = conversation.id
            } else {
                return console.log("error")
            }

            socket.conversation_id = conversation_id

            const messages = await getMessages(conversation_id)
            socket.emit("loadMessages", { messages })
        })

        socket.on("messageSend", async ({ roomName, content, userId }) => {
            if (!socket.conversation_id || socket.conversation_id == undefined) {
                const [user1_id, user2_id] = roomName.split("_")
                const conversation_id = (await getConversation(user1_id, user2_id)).id
                if (!conversation_id)
                    return

                socket.conversation_id = conversation_id
            }

            let { id = null } = await saveMessage(socket.conversation_id, userId, content)

            socket.to(roomName).emit("newMessage", { content, username, id, userId })
            socket.emit("messageSent", { content, username, id, userId })

            const [user1_id, user2_id] = roomName.split("_")
            const recipientId = String(user1_id) === String(userId) ? user2_id : user1_id
            const recipientSocketId = onlineUsers[recipientId]
            if (recipientSocketId){
                console.log(recipientSocketId, content, userId)
                io.to(recipientSocketId).emit("showMessage", { content, userId })}
        })

        socket.on("readMessage", async ({ roomName, message_id }) => {
            await setSeenMsg(message_id);
            socket.to(roomName).emit("MarkMessageSeen", { message_id })
            socket.emit("MarkMessageSeen", { message_id })
        })

        socket.on("MarkAllMsgAsSeen", async ({ roomName, friendId }) => {
            const [user1_id, user2_id] = roomName.split("_")
            const conversation = (await getConversation(user1_id, user2_id))
            const result = await MarkAllMsgAsSeen(conversation.id, friendId)
            if (result){
                const friendSocket_id = onlineUsers[friendId]
                if (friendSocket_id)
                    io.to(friendSocket_id).emit("allMessagesRead", { roomName })}
        })

        socket.on("MessagesRead", async ({ roomName, currentfriend }) => {
            const [user1_id, user2_id] = roomName.split("_")
            const conversation = (await getConversation(user1_id, user2_id))

            if (conversation)
                socket.to(roomName).emit("UpdateMessages", { roomName, currentfriend })
        })

        socket.on("writing", ({ roomName }) => {
            socket.to(roomName).emit("friendWriting", { username })
        })

        socket.on("stopWriting", ({ roomName }) => {
            console.log("sent", roomName)
            socket.to(roomName).emit("friendStopWriting", { username })
        })
    })
}