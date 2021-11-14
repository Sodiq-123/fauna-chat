var faunadb = require('faunadb'),
  bcrypt = require('bcrypt'),
  q = faunadb.query;
require('dotenv').config()
  
let Client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.createUser = async (email, username, password) => {
  password = await bcrypt.hash(password, 10) // generates a hash for the password
  try {
    const data= await Client.query(   
      q.Create(
        q.Collection('users'),
        {
          data: {
            email, 
            username, 
            password
          }
        }
      )
    )
    const user = data.data
    user.id = data.ref.value.id // attaches the ref id as the user id in the client, it will be easy to fetch and you can guarantee that it's unique
    return user
  } catch (error) {
    console.log(error.message)
    return 
  }
}

exports.loginUser = async (email, password) => {
  try {
    const user = await Client.query(
      q.Get(
        q.Match(
          q.Index('users_by_email'), email.trim()
        )
      )
    )
    user.data.id = user.ref.value.id
    if (user.data.password === password) {
      return user.data
    } else {
      return null
    }
  } catch {
    return // return null if there is any error.
  }
}

exports.getAllUsers = async () => {
  try {
    const user = await Client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users"))),
        q.Lambda(x => q.Get(x))
      )
    )
    return user.data
  } catch {
    return // return null if there is any error.
  }
}

exports.getUserById = async (userId) => {
  try {
    const user = await Client.query(
      q.Get(
        q.Ref(q.Collection('users'), userId)
      )
    )
    return user.data
  } catch {
    return // return null if there is any error.
  }
}

exports.getUserByEmail = async (email) => {
  try {
    const user = await Client.query(
      q.Get(
        q.Match(
          q.Index('users_by_email'), email
        )
      )
    )
    return user
  } catch {
    return // return null if there is any error.
  }
}

exports.deleteUserAccount = async (userId) => {
  try {
    const user = Client.query(
      q.Delete(
        q.Ref(q.Collection('users'), userId)
      )
    )
    return user
  } catch (error) {
    console.log(error.message)
  }
}

// Helpers for the chatRoom
exports.createChatRoom = async (name, userId) => {
  try {
    const chatRoom = await Client.query(
      q.Create(
        q.Collection('chatRoom'),
        {
          data: {
            chatInitiator: name,
            users: [userId],
            createdAt: new Date().toString()
          }
        }
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.getChatRoomById = async (chatRoomId) => {
  try {
    const chatRoom = await Client.query(
      q.Get(
        q.Ref(q.Collection('chatRoom'), chatRoomId)
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.getChatRoomByUserId = async (userId) => {
  try {
    const chatRoom = await Client.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('chatRoom_by_user'), userId
          )
        ),
        q.Lambda(x => q.Get(x))
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}


exports.getAllChatRooms = async () => {
  try {
    const chatRoom = await Client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("chatRoom"))),
        q.Lambda(x => q.Get(x))
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.addUserToChatRoom = async (chatRoomId, userId) => {
  try {
    const chatRoom = await Client.query(
      q.Let(
        {
          ref: q.Ref(q.Collection("chatRoom"), chatRoomId),
          doc:q.Get(q.Var('ref')),
          array:q.Select(['data','users'],q.Var('doc'))
        },
        q.Update(q.Var('ref'),{data:{users:q.Distinct(q.Append([userId],q.Var('array')))}})
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.removeUserFromChatRoom = async (chatRoomId, userId) => {
  try {
    const chatRoom = await Client.query(
      q.Let(
        {
          ref: q.Ref(q.Collection("chatRoom"), chatRoomId),
          doc:q.Get(q.Var('ref')),
          array:q.Select(['data','users'],q.Var('doc'))
        },
        q.Update(q.Var('ref'),{data:{users:q.Distinct(q.Remove([userId],q.Var('array')))}})
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.deleteChatRoom = async (chatRoomId) => {
  try {
    const chatRoom = await Client.query(
      q.Delete(
        q.Ref(q.Collection('chatRoom'), chatRoomId)
      )
    )
    return chatRoom
  } catch (error) {
    console.log(error.message)
  }
}

exports.createMessage = async (chatRoomId, userId, message) => {
  try {
    const messageData = await Client.query(
      q.Create(
        q.Collection('chatMessage'),
        {
          data: {
            chatRoomId: q.Ref(q.Collection("chatRoom"), chatRoomId),
            user: userId,
            readBy: [userId],
            message,
            createdAt: new Date().toString()
          }
        }
      )
    )
    return messageData
  } catch (error) {
    console.log(error.message)
  }
}


exports.updateMessageReadBy = async (messageId, userId) => {
  try {
    const message = await Client.query(
      q.Let(
        {
          ref: q.Ref(q.Collection("chatMessage"), messageId),
          doc:q.Get(q.Var('ref')),
          array:q.Select(['data','readBy'],q.Var('doc'))
        },
        q.Update(q.Var('ref'),{data:{readBy:q.Distinct(q.Append([userId],q.Var('array')))}})
      )
    )
    return message
  } catch (error) {
    console.log(error.message)
  }
}

exports.getAllMessages = async (chatRoomId) => {
  try {
    const messages = await Client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("chatMessage"), {
          query: q.Match(
            q.Index('messages_by_chatRoomId'), chatRoomId
          )
        })),
        q.Lambda(x => q.Get(x))
      )
    )
    return messages
  } catch (error) {
    console.log(error.message)
  }
}

exports.deleteMessage = async (messageId) => {
  try {
    const message = await Client.query(
      q.Delete(
        q.Ref(q.Collection('chatMessage'), messageId)
      )
    )
    return message
  } catch (error) {
    console.log(error.message)
  }
}
