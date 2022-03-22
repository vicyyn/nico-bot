// export function NullException(message: string) {
// 	this.message = message;
// 	this.name = 'UserException';
// }

// define error
export class UnregistredUserException extends Error {
  code: string
  constructor() {
    super('You are not registred')
    this.code = 'UNREGISTED_USER'
    this.name = 'UnregistredUserException'
  }
}

export class UserRegistrationException extends Error {
  code: string
  constructor() {
    super('You are already registred')
    this.code = 'REGISTED_USER'
    this.name = 'UserRegistrationException'
  }
}
