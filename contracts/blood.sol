// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Blood {
    // Struct pour représenter un donneur
    struct Donor {
        address donorAddress;
        string bloodType;
    }

    // Mapping pour associer une adresse au type de sang d'un donneur
    mapping(address => Donor) public donors;

    // Tableau pour stocker les adresses des donneurs
    address[] public donorAddresses;

    // Événement pour l'enregistrement du type de sang
    event BloodTypeRegistered(address indexed donorAddress, string bloodType);

    // Fonction pour enregistrer un donneur
    function registerBlood(string memory _bloodType) public {
        require(bytes(donors[msg.sender].bloodType).length == 0, "Blood type already registered");

        donors[msg.sender] = Donor({
            donorAddress: msg.sender,
            bloodType: _bloodType
        });

        // Ajout de l'adresse au tableau des donneurs
        donorAddresses.push(msg.sender);

        emit BloodTypeRegistered(msg.sender, _bloodType);
    }

    // Fonction pour obtenir le type de sang d'un donneur
    function getBloodType(address _donorAddress) public view returns (string memory) {
        require(bytes(donors[_donorAddress].bloodType).length > 0, "Blood type not registered");
        return donors[_donorAddress].bloodType;
    }

    // Fonction pour obtenir le nombre total de donneurs
    function getDonorCount() public view returns (uint) {
        return donorAddresses.length;
    }

    // Fonction pour obtenir l'adresse d'un donneur par index
    function getDonorAddress(uint index) public view returns (address) {
        require(index < donorAddresses.length, "Index out of bounds");
        return donorAddresses[index];
    }
}
