//imports

const {ethers,run,network}=require("hardhat")

//async main
async function main(){
    const SimpleStorageFactory=await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract......")
    const simpleStorage=await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log(`deployed contract to:${simpleStorage.address}`)
    // console.log(network.config)
    if(network.config.chainId===5 && process.env.ETHERSCAN_API_KEY){
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address,[])
    }

    const currentFavoriteNumber = await simpleStorage.retrieve()
    console.log(`Current Favorite Number:${currentFavoriteNumber.toString()}`)

    const transactionResponse = await simpleStorage.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updateFavoriteNumber = await simpleStorage.retrieve()
    console.log(`Updated favorite number is:${updateFavoriteNumber}`)

}

async function verify(contractAddress,args)
{
    console.log("Verifying contract....")
    try{
        await run("verify:verify",{
            address:contractAddress,
            constructorArguments:args,
        })
    }catch(e){
        if(e.message.toLowerCase().include("already verified"))
        {
            console.log("Already verified")
        }else{
            console.log(e)
        }
    }
  
}

//call main


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
