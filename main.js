const { ApiPromise, WsProvider } = require("@polkadot/api");

const network = "wss://rpc.polkadot.io";

async function main() {
  let count = 0;
  let max = 10;
  let latestblock = null;

  console.log(`This will subscribe to ${network} and show ${max} blocks\n`);
  console.log(`connecting...`);

  provider = new WsProvider(network);
  try {
    api = await ApiPromise.create({
      provider: provider,
    });
  } catch (error) {
    console.log("Can't connect!");
    return;
  }
  console.log("connected!\n");

  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    if (latestblock != header.number) {
      latestblock = header.number;
      const blockHash = await api.rpc.chain.getBlockHash(latestblock);
      const blockHeader = await api.derive.chain.getHeader(blockHash);

      console.log(`Block Height:\t ${latestblock}`);
      console.log(`Block Hash:\t ${blockHash}`);
      console.log(`Author\t ${blockHeader.author.toString()}`);

      console.log("---------------------\n");

      if (++count === 10) {
        unsubscribe();
        process.exit(0);
      }
    }
  });
}

main().catch(console.error);
