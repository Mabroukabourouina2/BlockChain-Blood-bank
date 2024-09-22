// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Verif {
    // Struct pour représenter un bénévole
    struct Volunteer {
        address volunteerAddress;
        string name;
        string contactInfo;
        bool isRegistered;
    }

    // Mapping des adresses des bénévoles à leurs détails
    mapping(address => Volunteer) public volunteers;

    // Événement pour l'enregistrement d'un nouveau bénévole
    event VolunteerRegistered(address indexed volunteerAddress, string name);

    // Événement pour confirmer la participation à un événement
    event ParticipationConfirmed(address indexed volunteerAddress, string eventName);

    // Fonction pour enregistrer un bénévole
    function registerVolunteer(string memory _name, string memory _contactInfo) public {
        require(!volunteers[msg.sender].isRegistered, "Volunteer already registered");
        
        volunteers[msg.sender] = Volunteer({
            volunteerAddress: msg.sender,
            name: _name,
            contactInfo: _contactInfo,
            isRegistered: true
        });

        emit VolunteerRegistered(msg.sender, _name);
    }

    // Fonction pour confirmer la participation à un événement
    function confirmParticipation(string memory _eventName) public {
        require(volunteers[msg.sender].isRegistered, "Volunteer not registered");
        
        emit ParticipationConfirmed(msg.sender, _eventName);
    }

    // Fonction pour vérifier si une adresse est enregistrée
    function isRegistered(address _volunteerAddress) public view returns (bool) {
        return volunteers[_volunteerAddress].isRegistered;
    }
}