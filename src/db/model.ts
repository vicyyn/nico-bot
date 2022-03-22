import { Keypair, PublicKey } from '@solana/web3.js'
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
class Users extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({
    nullable: true,
  })
  username: string

  @Column('smallint', { array: true })
  privateKey: number[]

  @Column()
  publicKey: string

  @Column({
    type: 'decimal',
    default: 0,
  })
  burned: number

  getKeyPair() {
    return Keypair.fromSecretKey(new Uint8Array(this.privateKey))
  }

  getPublicKey() {
    return new PublicKey(this.publicKey)
  }
}

export default Users
