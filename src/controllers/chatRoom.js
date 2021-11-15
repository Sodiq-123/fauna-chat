var makeValidation = require('@withvoid/make-validation')
var { createMessage, getChatRoomById, createChatRoom, addUserToChatRoom, getAllChatRooms, updateMessageReadBy, getChatRoomForUser } = require('../utils/fauna')


// create chat room
exports.createChatRoom = async (req, res) => {
  try {
    const { name } = req.body
    const users = req.user
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        name: { type: types.string },
      }
    }))
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.errors
      })
    }
    const chatRoom = await createChatRoom(name, users)
    return res.status(200).json({
      success: true,
      message: 'Chat room created',
      data: {
        RoomId: chatRoom.ref.id,
        Info: chatRoom.data
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message 
    })
  }
}

// Send message to chat room
exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, message } = req.body
    const users = req.user
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        chatRoomId: { type: types.string },
        message: { type: types.string },
      }
    }))
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.errors
      })
    }
    const messageSent = await createMessage(chatRoomId, users, message)
    if (messageSent) {
      return res.status(200).json({
        success: true,
        message: 'Message sent',
        data: {
          id: messageSent.ref.id,
          messageSent: messageSent.data
        }
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message 
    })
  }
}

// Add user to chat room
exports.addUserToChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params
    const users = req.user
    const chatRoom = await addUserToChatRoom(chatRoomId, users)
    if (chatRoom) {
      return res.status(200).json({
        success: true,
        message: 'User added to chat room',
        data: {
          id: chatRoom.ref.id,
          info: chatRoom.data
        }
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message 
    })
  }
}

exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params
    const { chatRoomId } = req.body
    const users = req.user
    const chatRoom = await getChatRoomById(chatRoomId)
    if (chatRoom) {
      // Mark message as read and add user who read it
      const message = await updateMessageReadBy(messageId, users)
      if (message) {
        return res.status(200).json({
          success: true,
          message: 'Message marked as read',
          data: message
        })
      }
    }
    return res.status(404).json({
      success: false,
      message: 'Chat room not found'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message 
    })
  }
}

exports.getChatRoomById = async (req, res) => {
  try {
    const { chatRoomId } = req.body
    const chatRoom = await getChatRoomById(chatRoomId)
    if (chatRoom) {
      return res.status(200).json({
        success: true,
        message: 'Chat room found',
        data: chatRoom.data
      })
    }
    return res.status(404).json({
      success: false,
      message: 'Chat room not found'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message 
    })
  }
}

// Get all chat rooms
exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await getAllChatRooms()
    if (chatRooms) {
      return res.status(200).json({
        success: true,
        message: 'Chat rooms found',
        data: chatRooms.data
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

exports.getChatRoomForUser = async (req, res) => {
  try {
    const { userId } = req.params
    const chatRoom = await getChatRoomForUser(userId)
    if (chatRoom) {
      return res.status(200).json({
        success: true,
        message: 'Chat room found',
        data: chatRoom.data
      })
    }
    return res.status(404).json({
      success: false,
      message: 'Chat room not found'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message 
    })
  }
}