/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, TransactionContext } from 'frog'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import img from "../../../public/degen.png"

import { baseSepolia, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, createWalletClient, http, parseEther, parseAbi, Address } from "viem";

import abi from './abi.json';

import { ZeroXSwapQuote } from './types'

type FrogOptions = {
  Bindings: { ZEROX_API_KEY?: string }
}

export type CustomTransactionContext = TransactionContext<FrogOptions>

const assets = [
  {
    name: '$HIGHER',
    network: 'base',
    image: 'https://i.imgur.com/bdQcnVI.png',
    address: '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe',
  },
  {
    name: '$DEGEN',
    network: 'base',
    image:
      'https://pbs.twimg.com/profile_images/1751028059325501440/9jrvP_yG_400x400.jpg',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  },
]

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
})

// const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "");

// const walletClient = createWalletClient({
//   account: "",
//   chain: baseSepolia,
//   transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_APY}`),
// });

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          mint your $PAADA token 👇
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Value (ETH)" />,
      <Button.Transaction target={`/mint`}>
        Mint
      </Button.Transaction>,
    ],
  })
})

app.transaction("/mint", async (c) => {
  const { inputText } = c


  return c.contract({ 
    abi,
    chainId: 'eip155:84532',
    functionName: 'mint',
    args: [BigInt(69420)],
    to: '0x984796A8e0433eFF116Af927B5C4D28dA806a9f8', 
    value: parseEther(inputText || '0.01'),
  }) 
});


export const GET = handle(app)
export const POST = handle(app)
