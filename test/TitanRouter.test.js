const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TitanRouter", function () {
  let titanRouter;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const TitanRouter = await ethers.getContractFactory("TitanRouter");
    titanRouter = await TitanRouter.deploy(
      "0x...", // Mock Uniswap V3 Router address
      "0x..." // Mock WETH address
    );
  });

  describe("Basic Functions", function () {
    it("Should set the correct owner", async function () {
      expect(await titanRouter.owner()).to.equal(owner.address);
    });

    // Add more test cases
  });
});
