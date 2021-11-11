var dotenv = require('dotenv').config(),
  faunadb = require('faunadb'),
  bcrypt = require('bcrypt'),
  q = faunadb.query;
  
let Client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.createUser = async (email, username, password) => {
  password = await bcrypt.hash(password, 10) // generates a hash for the password
  let data
  try {
    data= await Client.query(   
      q.Create(
        q.Collection('users'),
        {
          data: {email, username, password}
        }
      )
    )
    if (data.username === 'BadRequest') return // if there's an error in the data creation it should return null
  } catch (error) {
    console.log(error.message)
    return 
  }
  const user = data.data
  user.id = data.ref.value.id // attaches the ref id as the user id in the client, it will be easy to fetch and you can guarantee that it's unique
  return user
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