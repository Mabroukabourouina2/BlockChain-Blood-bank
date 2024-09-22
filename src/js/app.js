
// Initialise Web3 avec MetaMask ou un autre fournisseur Ethereum
export async function initWeb3() {
  if (window.ethereum) {
    // Demande l'autorisation de se connecter au portefeuille Ethereum
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new Web3(window.ethereum);
  } else if (window.web3) {
    // Pour compatibilité avec d'anciens wallets
    return new Web3(window.web3.currentProvider);
  } else {
    throw new Error("MetaMask or another Ethereum-compatible wallet is required.");
  }
}

// Charge le contrat intelligent avec son nom
export async function loadContract(web3, contractName) {
  try {
    const contractData = require(`../build/contracts/${contractName}.json`); // Charger l'ABI du contrat
    const networkId = await web3.eth.net.getId(); // Identifier le réseau
    const contractAddress = contractData.networks[networkId].address; // Adresse du contrat
    return new web3.eth.Contract(contractData.abi, contractAddress);
  } catch (error) {
    throw new Error(`Could not load contract: ${error.message}`);
  }
}

// Enregistre un bénévole avec le contrat
export async function registerVolunteer() {
  const web3 = await initWeb3(); // Initialise Web3
  const contract = await loadContract(web3, "VolunteerRegistration"); // Charge le contrat
  const accounts = await web3.eth.getAccounts(); // Obtenir les comptes Ethereum disponibles

  const volunteerName = document.getElementById("volunteerName").value; // Nom du bénévole
  const volunteerContact = document.getElementById("volunteerContact").value; // Contact du bénévole

  try {
    // Appel de la fonction d'enregistrement
    await contract.methods
      .registerVolunteer(volunteerName, volunteerContact)
      .send({ from: accounts[0] });

    alert("Volunteer registered successfully!");
  } catch (error) {
    console.error("Error registering volunteer:", error);
    alert("Failed to register volunteer.");
  }
}

// Écoute les événements du contrat
export async function listenToEvents() {
  const web3 = await initWeb3(); // Initialise Web3
  const contract = await loadContract(web3, "Blood"); // Charge le contrat

  // Écoute l'événement VolunteerRegistered
  contract.events.VolunteerRegistered({}, (error, event) => {
    if (error) {
      console.error("Error listening to event:", error);
    } else {
      console.log("Volunteer registered:", event.returnValues);
    }
  });
}

// Récupérer tous les donneurs enregistrés du contrat "Blood"
export async function getDonors() {
  console.logt("d,d,d");
  const web3 = await initWeb3(); // Initialise Web3
  const contract = await loadContract(web3, "Blood"); 
  const donorCount = await contract.methods.getDonorCount().call(); // Obtenir le nombre total de donneurs

  const donors = [];
  for (let i = 0; i < donorCount; i++) {
   
    const donorAddress = await contract.methods.getDonorAddress(i).call(); // Obtenir l'adresse du donneur par index
    const bloodType = await contract.methods.getBloodType(donorAddress).call(); // Obtenir le type de sang du donneur
    donors.push({ address: donorAddress, bloodType }); // Ajouter au tableau des donneurs
  }

  return donors;
}

