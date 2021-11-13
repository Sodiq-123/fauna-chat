
var makeValidation = require('@withvoid/make-validation')
var { getAllUsers, getUserById, createUser, getUserByEmail } = require('../utils/fauna')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
require('dotenv').config()


exports.createUser = async (req, res) => {
  try {
    let { email, username, password } = req.body
    const validate = makeValidation(types => ({
      payload: req.body,
      checks: {
        email: { type: types.string },
        username: { type: types.string },
        password: { type: types.string },
        // type: { type: types.enum, options: { enum: USER_TYPES } },
      }
    }))
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: validate.errors
      })
    }
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'user already exists',
      })
    }
    const user = await createUser(email, username, password)
    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Successfully created user',
        user: user
      })
    } 
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'User not succcessfully created'
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const validate = makeValidation(types => ({
      payload: req.body,
      checks: {
        email: { type: types.string },
        password: { type: types.string },
      }
    }))
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: validate.errors
      })
    }
    const user = await getUserByEmail(email)
    if (user && await bcrypt.compare(password, user.data.password)) {
      const token = await jwt.sign(user.ref.id, process.env.SECRET_KEY)
      delete user.data.password
      return res.status(200).json({
        success: true,
        message: 'Successfully logged in',
        data: { ...user.data, token }
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers()
    if (users) {
      return res.status(200).json({
        success: true,
        message: 'Successfully fetched users',
        data: users.map(user => ({ ...user.data, id: user.ref.id }))
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Could not get users'
    })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await getUserById(userId)
    delete user.password
    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Successfully fetched user',
        user: user
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'User not found'
    })
  }
}

