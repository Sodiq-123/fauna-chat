var { deleteUserAccount, deleteChatRoom, deleteMessage, removeUserFromChatRoom } = require('../utils/fauna')

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user
    const user = await deleteUserAccount(userId)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User Account not found'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User Account deleted successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Account not deleted'
    })
  }
}

exports.removeUserFromChatRoom = async (req, res) => {
  try {
    const { userId, roomId } = req.params
    const room = await removeUserFromChatRoom(roomId, userId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'User not found in Chat Room'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User removed from Chat Room successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

exports.deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.params
    const room = await deleteChatRoom(roomId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'Chat Room not found'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Chat Room deleted successfully',
      data: room
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Chat Room not deleted'
    })
  }
}

exports.deleteMessageById = async (req, res) => {
  try {
    const { messageId } = req.params
    const message = await deleteMessage(messageId)
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message not found'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: message
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Message not deleted'
    })
  }
}