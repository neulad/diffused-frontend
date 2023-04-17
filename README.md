<h3 align="center">Diffused Frontend</h3>

---

<p align="center"> This is a frontend of the DiffusedMarket project
    <br>
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)

## 🧐 About <a name = "about"></a>
Basically, the way the frontend is designed is with the goal of keeping everything spread out and not centralized. We're using this thing called Apollo to grab all the data from TheGraph protocol.

## 🏁 Getting Started <a name = "getting_started"></a>
Pull repo from the gitlab

```sh
git clone git@gitlab.com:diffusedmarket/frontend.git
```


### Prerequisites
Please follow these steps to prepare your system.

Install nodejs
```
pacman -S nodejs-lts-hydrogen
```
Install yarn
```
pacman -S yarn
```

Create .env.local file with the following fields
```
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUBGRAPH_URL=ASK_ADMIN_FOR_THIS_FIELD
NEXTAUTH_SECRET=ASK_ADMIN_FOR_THIS_FIELD
NEXT_SECRET=ASK_ADMIN_FOR_THIS_FIELD
NEXT_PINATA_API_KEY=ASK_ADMIN_FOR_THIS_FIELD
NEXT_PINATA_API_SECRET=ASK_ADMIN_FOR_THIS_FIELD
NEXT_REPLICATE_TOKEN=ASK_ADMIN_FOR_THIS_FIELD
NEXT_JSON_RPC_URL=ASK_ADMIN_FOR_THIS_FIELD
```


### Installing
Here you can see what you need to install to make your repo up and running.

Install dependencies
```
yarn
```

## 🎈 Usage <a name="usage"></a>
Run the frontend.
```
yarn dev
```

## ⛏️ Built Using <a name = "built_using"></a>
- [Next.js](https://nextjs.org/) - Frontend metaframework
- [Typescript](https://www.typescriptlang.org/) - The main language
- [Tailwind](https://tailwindcss.com/) - CSS framework
- [Wagmi](https://wagmi.sh/) - Ethereum react hooks
- [Rainbow](https://github.com/rainbow-me/rainbowkit) - Wallet connector
- [Apollo Client](https://www.apollographql.com/docs/react/) - Queries for TheGraph
