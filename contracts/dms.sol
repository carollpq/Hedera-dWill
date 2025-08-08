// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeadManSwitch {
    struct Beneficiary {
        bool exists;
        string[] fileIds;
        string beneficiaryPublicKey;
        uint256 allocatedFunds;
    }

    struct Benefactor {
        bool isActive;
        uint256 lastCheckIn;
        address[] beneficiaryAddresses;
        mapping(address => Beneficiary) beneficiaries;
    }

    mapping(address => Benefactor) public benefactors;

    uint256 public constant INACTIVITY_LIMIT = 7 days;

    modifier onlyBenefactor() {
        require(benefactors[msg.sender].isActive, "Not a registered benefactor");
        _;
    }

    modifier onlyWhenInactive(address _benefactor) {
        require(
            block.timestamp - benefactors[_benefactor].lastCheckIn >= INACTIVITY_LIMIT,
            "Benefactor is still active"
        );
        _;
    }

    // Register a benefactor
    function registerAsBenefactor() external {
        Benefactor storage benefactor = benefactors[msg.sender];
        require(!benefactor.isActive, "Already registered");

        benefactor.isActive = true;
        benefactor.lastCheckIn = block.timestamp;
    }

    // Benefactor check-in
    function checkIn() external onlyBenefactor {
        benefactors[msg.sender].lastCheckIn = block.timestamp;
    }

    // Add a beneficiary
    function addBeneficiary(address _beneficiary, string memory _publicKey, uint _funds) external onlyBenefactor {
        Benefactor storage benefactor = benefactors[msg.sender];
        require(!benefactor.beneficiaries[_beneficiary].exists, "Beneficiary already added");

        benefactor.beneficiaries[_beneficiary] = Beneficiary({
            exists: true,
            fileIds: new string[](0),
            beneficiaryPublicKey: _publicKey,
            allocatedFunds: _funds
        });

        benefactor.beneficiaryAddresses.push(_beneficiary);
    }

    // Remove a beneficiary
    function removeBeneficiary(address _beneficiary) external onlyBenefactor {
        Benefactor storage benefactor = benefactors[msg.sender];
        require(benefactor.beneficiaries[_beneficiary].exists, "Beneficiary does not exist");

        delete benefactor.beneficiaries[_beneficiary];

        // Remove from address array
        uint indexToRemove;
        bool found = false;
        for (uint i = 0; i < benefactor.beneficiaryAddresses.length; i++) {
            if (benefactor.beneficiaryAddresses[i] == _beneficiary) {
                indexToRemove = i;
                found = true;
                break;
            }
        }

        if (found) {
            benefactor.beneficiaryAddresses[indexToRemove] = benefactor.beneficiaryAddresses[benefactor.beneficiaryAddresses.length - 1];
            benefactor.beneficiaryAddresses.pop();
        }
    }

    // Upload fileId to a beneficiary
    function uploadAssetToBeneficiary(address _beneficiary, string memory _fileId) external onlyBenefactor {
        Benefactor storage benefactor = benefactors[msg.sender];
        require(benefactor.beneficiaries[_beneficiary].exists, "Beneficiary not found");

        benefactor.beneficiaries[_beneficiary].fileIds.push(_fileId);
    }

    // Assign logical funds to a beneficiary
    function assignFundsToBeneficiary(address _beneficiary, uint256 _amount) external onlyBenefactor {
        require(isBeneficiary(msg.sender, _beneficiary), "Beneficiary not found");
        benefactors[msg.sender].beneficiaries[_beneficiary].allocatedFunds = _amount;

        emit FundsAssigned(msg.sender, _beneficiary, _amount);
    }

    // Remove fund allocation from beneficiary
    function removeFundsFromBeneficiary(address _beneficiary) external onlyBenefactor {
        require(isBeneficiary(msg.sender, _beneficiary), "Beneficiary not found");
        benefactors[msg.sender].beneficiaries[_beneficiary].allocatedFunds = 0;

        emit FundsRemoved(msg.sender, _beneficiary);
    }

    // Beneficiary access inheritance after timeout
    function getAssetsFromBenefactor(address _benefactor)
        external
        view
        onlyWhenInactive(_benefactor)
        returns (string[] memory, string memory, uint256)
    {
        Benefactor storage benefactor = benefactors[_benefactor];
        Beneficiary storage beneficiary = benefactor.beneficiaries[msg.sender];

        require(beneficiary.exists, "You are not a beneficiary of this benefactor");

        return (beneficiary.fileIds, beneficiary.beneficiaryPublicKey, beneficiary.allocatedFunds);
    }

    // Internal: check if valid beneficiary
    function isBeneficiary(address _benefactor, address _beneficiary) public view returns (bool) {
        return benefactors[_benefactor].beneficiaries[_beneficiary].exists;
    }

    // View funds assigned to a beneficiary
    function getAssignedFunds(address _benefactor, address _beneficiary) external view returns (uint256) {
        require(isBeneficiary(_benefactor, _beneficiary), "Beneficiary not found");
        return benefactors[_benefactor].beneficiaries[_beneficiary].allocatedFunds;
    }

    struct BeneficiaryInfo {
        address beneficiary;
        uint256 allocatedFunds;
        string[] fileIds;
    }

    function getAllBeneficiaryInfo(address _benefactor) external view returns (BeneficiaryInfo[] memory) {
        require(msg.sender == _benefactor, "Only the benefactor can view this data");

        Benefactor storage benefactor = benefactors[_benefactor];
        uint256 length = benefactor.beneficiaryAddresses.length;

        BeneficiaryInfo[] memory result = new BeneficiaryInfo[](length);

        for (uint256 i = 0; i < length; i++) {
            address bAddr = benefactor.beneficiaryAddresses[i];
            Beneficiary storage b = benefactor.beneficiaries[bAddr];

            result[i] = BeneficiaryInfo({
                beneficiary: bAddr,
                allocatedFunds: b.allocatedFunds,
                fileIds: b.fileIds
            });
        }

        return result;
    }


    // Get fileIds of a beneficiary
    function getFileIdsForBeneficiary(address _benefactor, address _beneficiary) external view returns (string[] memory) {
        require(isBeneficiary(_benefactor, _beneficiary), "Beneficiary not found");
        return benefactors[_benefactor].beneficiaries[_beneficiary].fileIds;
    }

    // Get public key of beneficiary
    function getPublicKey(address _benefactor, address _beneficiary) external view returns (string memory) {
        require(isBeneficiary(_benefactor, _beneficiary), "Beneficiary not found");
        return benefactors[_benefactor].beneficiaries[_beneficiary].beneficiaryPublicKey;
    }

    // EVENTS
    event FundsAssigned(address indexed benefactor, address indexed beneficiary, uint256 amount);
    event FundsRemoved(address indexed benefactor, address indexed beneficiary);
}
