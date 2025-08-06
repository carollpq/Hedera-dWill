// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DeadMansSwitchInheritance {
    uint256 constant TWO_WEEKS = 14 days;
    uint256 constant ONE_MINUTE = 60;

    struct CIDAssignment {
        string cid;
        address beneficiary;
        bool claimed;
    }

    struct FundAssignment {
        uint256 amount;
        address beneficiary;
        bool claimed;
    }

    struct Benefactor {
        address benefactorAddress;
        address[] beneficiaries;
        bool isAlive;
        bool isSwitchTriggered;
        uint256 timeSwitchWasTriggered;
        CIDAssignment[] assignedCIDs;
        FundAssignment[] assignedFunds;
    }

    mapping(address => Benefactor) public benefactors;
    mapping(address => uint256) public totalFundsDeposited;
    address[] public benefactorList;

    modifier onlyBenefactor() {
        require(isBenefactor(msg.sender), "Not a registered benefactor");
        _;
    }

    function isBenefactor(address _addr) public view returns (bool) {
        return benefactors[_addr].benefactorAddress != address(0);
    }

    function addBenefactor() external {
        require(!isBenefactor(msg.sender), "Already registered");

        Benefactor storage b = benefactors[msg.sender];
        b.benefactorAddress = msg.sender;
        b.isAlive = true;
        b.isSwitchTriggered = false;
        b.timeSwitchWasTriggered = 0;

        benefactorList.push(msg.sender);
    }

    function isBeneficiaryOf(address _benefactor, address _beneficiary) public view returns (bool) {
        address[] storage list = benefactors[_benefactor].beneficiaries;
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == _beneficiary) {
                return true;
            }
        }
        return false;
    }

    function addBeneficiary(address _beneficiary) external onlyBenefactor {
        require(!isBeneficiaryOf(msg.sender, _beneficiary), "Already added");
        benefactors[msg.sender].beneficiaries.push(_beneficiary);
    }

    function assignCID(string memory _cid, address _beneficiary) external onlyBenefactor {
        require(isBeneficiaryOf(msg.sender, _beneficiary), "Not your beneficiary");

        benefactors[msg.sender].assignedCIDs.push(CIDAssignment({
            cid: _cid,
            beneficiary: _beneficiary,
            claimed: false
        }));
    }

    function assignFunds(uint256 _amount, address _beneficiary) external {
        require(isBeneficiaryOf(msg.sender, _beneficiary), "Not your beneficiary");
        require(_amount > 0, "Amount must be positive");

        // Pull tokens into contract
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        benefactors[msg.sender].assignedFunds.push(FundAssignment({
            amount: _amount,
            beneficiary: _beneficiary,
            claimed: false
        }));

        totalFundsDeposited[msg.sender] += _amount;
    }


    function triggerSwitch(address _benefactor) external {
        require(isBeneficiaryOf(_benefactor, msg.sender), "You're not a beneficiary");
        Benefactor storage b = benefactors[_benefactor];
        require(b.isAlive, "Benefactor already declared dead");

        b.isSwitchTriggered = true;
        b.timeSwitchWasTriggered = block.timestamp;
    }

    function checkIfAlive(address _benefactor) public returns (bool) {
        Benefactor storage b = benefactors[_benefactor];

        if (b.isSwitchTriggered && block.timestamp >= b.timeSwitchWasTriggered + ONE_MINUTE) {
            b.isAlive = false;
            return false;
        }

        return true;
    }

    function claimCID(address _benefactor) external returns (string[] memory) {
        require(!checkIfAlive(_benefactor), "Benefactor is still alive");

        Benefactor storage b = benefactors[_benefactor];
        uint256 count = 0;

        for (uint i = 0; i < b.assignedCIDs.length; i++) {
            if (b.assignedCIDs[i].beneficiary == msg.sender && !b.assignedCIDs[i].claimed) {
                count++;
            }
        }

        string[] memory result = new string[](count);
        uint256 index = 0;

        for (uint i = 0; i < b.assignedCIDs.length; i++) {
            if (b.assignedCIDs[i].beneficiary == msg.sender && !b.assignedCIDs[i].claimed) {
                result[index++] = b.assignedCIDs[i].cid;
                // not updating claimed here because view function
            }
        }

        return result;
    }

    function claimFunds(address _benefactor) external {
        require(!checkIfAlive(_benefactor), "Benefactor is still alive");

        Benefactor storage b = benefactors[_benefactor];
        uint256 totalToClaim = 0;

        for (uint i = 0; i < b.assignedFunds.length; i++) {
            if (
                b.assignedFunds[i].beneficiary == msg.sender &&
                !b.assignedFunds[i].claimed
            ) {
                totalToClaim += b.assignedFunds[i].amount;
                b.assignedFunds[i].claimed = true;
            }
        }

        require(totalToClaim > 0, "No tokens to claim");

        // Transfer tokens to the beneficiary
        require(token.transfer(msg.sender, totalToClaim), "Token transfer failed");
    }

}
