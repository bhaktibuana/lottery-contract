pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;
    address tempWinner;

    struct Winner {
        uint256 _timestamp;
        address player;
    }

    mapping(uint256 => Winner) winners;
    uint256[] winnerList;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.sender != manager, "Manager can not join the lottery.");
        require(
            msg.value >= 0.01 ether,
            "The amount of ether is not eligible, must enter at least 0.01 ether."
        );

        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        tempWinner = players[random() % players.length];

        payable(tempWinner).transfer(address(this).balance * 80 / 100);
        payable(manager).transfer(address(this).balance);

        players = new address[](0);
    }

    function setWinnerList() public restricted {
        require (tempWinner != address(0), "Pick a winner first before set the winner list.");
        require (players.length == 0, "Pick a winner first before set the winner list.");

        uint256 listLength = winnerList.length;
        Winner storage newWinner = winners[listLength];
        newWinner._timestamp = block.timestamp;
        newWinner.player = tempWinner;
        winnerList.push(listLength);
        tempWinner = address(0);
    }

    function getWinnerListLength() public view returns (uint256) {
        return winnerList.length;
    }

    function getWinnerInfo(uint256 index) public view returns (uint256, address) {
        Winner storage w = winners[index];
        return (w._timestamp, w.player);
    }

    modifier restricted() {
        require(
            msg.sender == manager,
            "Only manager can execute the contract."
        );
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
