// SPDX-License-Identifier: MIT

//pragma
pragma solidity ^0.8.7;

//import

import "./PriceConverter.sol";

//Error handler
error FundMe_NotOwner();

//Interface,Libraries,Contracts

contract FundMe {
    //type declarations
    using PriceConverter for uint256;
    // event Funded(address indexed from, uint256);

    //State Variables
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50*1e18;
    AggregatorV3Interface private s_priceFeed;

    //modifier
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    //functions

    constructor(address priceFeedAddress) {
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
    }

   
    function fund() public payable{
        //want to able to set a minimum fund amount
        //1. How do we send eth to this contract?

        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,"Didn't send enough");
        //18 decimals
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender]+=msg.value;
    }
   

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    receive() external payable{
        fund();
    }
    
    fallback() external payable{
        fund();
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function getOwner () public view returns(address){
        return i_owner;

    }

    function getFunder(uint256 index) public view returns(address)
    {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns(AggregatorV3Interface)
    {
        return s_priceFeed;

    }
}
