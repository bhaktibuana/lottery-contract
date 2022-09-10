pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;

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
        uint256 index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
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
