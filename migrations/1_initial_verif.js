var verif= artifacts.require("./verif.sol");

module.exports = function(deployer) {
  deployer.deploy(verif);
};