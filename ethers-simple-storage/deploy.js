const ethers = require("ethers");
const fs = require("fs-extra");
//for compliation we will run "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol"
async function main() {
  //compile them in our code
  //http://127.0.0.1:754
  //127.0.0.1:8545
  // 0x46e3f569a75f0fdfe14ca49fe7e13bb408d437656fbaa29a5eafba073c424686
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );
  const wallet = new ethers.Wallet(
    "0xa382612d0dbb85dec46d1fc56ac73d457663aa555424c35252b457281164dfd6",
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying ,please wait...");
  const contract = await contractFactory.deploy(); //stop here!wait for contract to deploy here
  console.log(contract);
}

main()
  .then(() => ProcessingInstruction.exit(0))
  .catch((error) => {
    console.error(error);
    ProcessingInstruction.exit(1);
  });
