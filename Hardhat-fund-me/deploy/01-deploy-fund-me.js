
const {networkConfig}=require("../helper-hardhat-config")
const {network}=require("hardhat")
const {developmentChains}=require("../helper-hardhat-config")
const{verify}=require("../utils/verify")


 module.exports=async ({getNamedAccounts ,deployments})=>{

    // const {getNameAccounts ,deployments}=hre
    const {deploy,log}=deployments
    const{deployer}=await getNamedAccounts()
    const chainId=network.config.chainId

   // const ethUsdFriceFeedAddress=networkConfig[chainId]["ethUsdPriceFeed"]
   let ethUsdFriceFeedAddress
   if(developmentChains.includes(network.name))
   {
         const ethUSDAggregator=await deployments.get("MockV3Aggregator")
         ethUsdFriceFeedAddress=ethUSDAggregator.address
   }else{
    ethUsdFriceFeedAddress=networkConfig[chainId]["ethUsdPriceFeed"]
   }
    //if the contract doesn't exixt,we deploy a minimal version of
    //for our local testing


    //well what happens when we want to change chains?
    //when goimg for localhost or hardhat network we want to use a mock
    const args=[ethUsdFriceFeedAddress]
    const fundme=await deploy("FundMe",{
        //list of override
        from:deployer,
        args:args,//put price feed address
        log:true, 
        waitConfirmation:network.config.blockConfirmation || 1,



    })
    if(!developmentChains.includes(network.name)&& process.env.ETHERSCAN_API_KEY)
    {
        await verify(fundme.address,args)
    }
    log("-----------------")

}

module.exports.tags=["all","fundme"]