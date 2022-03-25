<p align="center">
  <img src=https://user-images.githubusercontent.com/55297234/159432446-03bd1ad2-9ecf-4ef7-aa1b-4b57f610b365.gif>
</p>

<h1 align="center">Nico</h1>
<p align="center"><strong>Blockchain Discord Bot</strong></p>

<div align="center">
  
  <a href="https://opensource.org/licenses/Apache-2.0">![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)</a>  
  
</div>

Nico is a Discord Bot that was made to interact with Solana Blockchain. Has many features:
- Get Tokens Prices
- Send and Receive Money
- Trade and Escrow NFTs
- Interact with Solana Programs

## Todo
- View NFT metadata command (can use https://github.com/vicyyn/MetaplexMetadata-js)

## Note
- **Storing private keys on a database is not secure. Use at your own risk.**
- **Nico is in active development, so all APIs are subject to change.**
- **This code is unaudited.**


## Setup
- Create a Discord App and get the ID, Public Key and Token
- Setup a PostgreSQL Database (we prefer Docker, you can run `npm run db:create && npm run db:start` if you have it)
- Create a `.env` File that matches the `.env.example` file (the following)

```
DISCORD_APP_ID=
DISCORD_PUBLIC_KEY=
DISCORD_TOKEN=
PREFIX=

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=postgres
DB_IS_SSL=false
```

## Examples

**1) Tip another User 💰** 
```
? tip @vicyyn 1
```
<img width="631" alt="image" src="https://user-images.githubusercontent.com/55297234/159430920-03ea1652-5d7c-4a96-9421-ff833e2c23b4.png">


**2) Escrow 1:1 NFT. NFT gets transfered when User Accepts ✅**
```
? escrow 1 1 AueLEzF28GhVMzP7f6CJkFwBecTKgiAoJNTrta53YU6y 3R1W9piZnuudTncSUCYuo3d1nPH5ktFgAEMCUxLJGr5d
```
<img width="625" alt="image" src="https://user-images.githubusercontent.com/55297234/159429761-486eccce-3c99-49db-bb02-2c268bafcb86.png">




## License
Nico is licensed under Apache 2.0.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in Nico by you, as defined in the Apache-2.0 license, shall be licensed as above, without any additional terms or conditions.

## Contributions
- <a href="https://twitter.com/NiemandRs">NiemandRs</a>
- <a href="https://twitter.com/cyrii_MM">Cyrii</a>

and the COPE community
