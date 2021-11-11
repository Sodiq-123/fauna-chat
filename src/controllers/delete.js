var { deleteUserAccount } = require('../utils/fauna')

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await deleteUserAccount(userId)
    console.log('User: ', user)
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

exports.deleteRoomById = async (req, res) => {
  try {
    // const 
  } catch (error) {
    return
  }
}

exports.deleteMessageById = async (req, res) => {
  try {
    // const 
  } catch (error) {
    return
  }
}