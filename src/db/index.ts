import Users from './model'
import { UnregistredUserException } from '../errors'

const generateUsername = () => Math.random().toString(36).substring(2, 8)
const generateFloatNumber = () => Math.random() * 69

// export const fuck = async () => {
//   const users = await Users.find()
//   for (let user of users) {
//     user.username = generateUsername()
//     user.burned = generateFloatNumber()

//     await user.save()
//   }
// }

export const create = async (
  id: string,
  privateKey: number[],
  publicKey: string,
  username: string
) => {
  const user = new Users()
  user.id = id
  user.privateKey = privateKey
  user.publicKey = publicKey
  user.username = username
  await user.save()
  return user
}

export const getAllSorted = async (page: number, take: number) => {
  // console.log(
  //   await Users.delete({
  //     id: '208527206966755329',
  //   })
  // )

  return Users.find({
    where: 'burned > 0',
    order: {
      burned: 'DESC',
    },
    skip: page * take,
    take,
  })
}

export const getUser = async (id: string) => {
  const user = await Users.findOne({
    where: {
      id,
    },
  })
  if (!user) throw new UnregistredUserException()
  return user
}

export const getUserOrNull = async (id: string) => {
  const user = await Users.findOne({
    where: {
      id,
    },
  })
  return user
}

export const burn = async (id: string, amount: number) => {
  const user = await getUser(id)
  user.burned += amount
  await user.save()
  return user
}
