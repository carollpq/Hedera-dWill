async function main() {
  const [deployer] = await ethers.getSigners();
  const DeadManSwitch = await ethers.getContractFactory("DeadManSwitch", deployer);
  const contract = await DeadManSwitch.deploy();
  console.log("Contract deployed at:", contract.target);
}
main().catch(console.error);