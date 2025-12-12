// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {IMarketResolver} from "../interfaces/IMarketResolver.sol";
import {IBlindBetMarket} from "../interfaces/IBlindBetMarket.sol";

/**
 * @title Resolvable
 * @notice Abstract contract providing resolution logic for prediction markets
 * @dev Handles self-relaying public decryption, outcome setting, and resolution verification
 * @dev Uses FHEVM v0.9 self-relaying model - no oracle callbacks
 */
abstract contract Resolvable is IMarketResolver {

    error InvalidOutcome();
    error AlreadyResolved();
    error NotInResolvingState();
    error InvalidDecryptionProof();
    error UnauthorizedResolver();

    event PublicDecryptionEnabled(
        uint256 indexed marketId,
        bytes32 yesAmountHandle,
        bytes32 noAmountHandle,
        uint256 timestamp
    );

    event DecryptionVerified(
        uint256 indexed marketId,
        uint64 totalYes,
        uint64 totalNo,
        uint256 timestamp
    );

    event OutcomeProposed(
        uint256 indexed marketId,
        IBlindBetMarket.Outcome proposedOutcome,
        address indexed proposer
    );

    /// @notice Mapping: marketId => decrypted totals available
    mapping(uint256 => bool) internal decryptionCompleted;

    /// @notice Mapping: marketId => decrypted Yes total
    mapping(uint256 => uint64) internal decryptedYesTotal;

    /// @notice Mapping: marketId => decrypted No total
    mapping(uint256 => uint64) internal decryptedNoTotal;

    /**
     * @notice Ensure caller is authorized resolver for the market
     * @param marketId Market ID to check
     */
    modifier onlyAuthorizedResolver(uint256 marketId) {
        if (!isAuthorizedResolver(marketId, msg.sender)) {
            revert UnauthorizedResolver();
        }
        _;
    }

    /**
     * @notice Enable public decryption for market totals (v0.9 self-relaying model)
     * @param marketId Market ID
     * @param totalYesAmount Encrypted Yes total
     * @param totalNoAmount Encrypted No total
     * @dev This makes the encrypted values publicly decryptable
     * @dev Off-chain: Use @zama-fhe/relayer-sdk publicDecrypt() to get cleartext + proof
     * @dev Then call submitDecryptedTotals() with the result
     */
    function _enablePublicDecryption(
        uint256 marketId,
        euint64 totalYesAmount,
        euint64 totalNoAmount
    ) internal {
        // Make encrypted values publicly decryptable (v0.9 API)
        FHE.makePubliclyDecryptable(totalYesAmount);
        FHE.makePubliclyDecryptable(totalNoAmount);

        emit PublicDecryptionEnabled(
            marketId,
            FHE.toBytes32(totalYesAmount),
            FHE.toBytes32(totalNoAmount),
            block.timestamp
        );
    }

    /**
     * @notice Submit decrypted totals with KMS proof (v0.9 self-relaying model)
     * @param marketId Market ID
     * @param handlesList Array of handles [yesAmountHandle, noAmountHandle]
     * @param cleartexts ABI-encoded decrypted values (uint64, uint64)
     * @param decryptionProof KMS signatures and proof
     * @dev Called by anyone after off-chain publicDecrypt()
     * @dev Verifies KMS signatures before accepting decrypted values
     */
    function submitDecryptedTotals(
        uint256 marketId,
        bytes32[] memory handlesList,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public virtual {
        // Verify KMS signatures
        FHE.checkSignatures(handlesList, cleartexts, decryptionProof);

        // Decode decrypted totals
        (uint64 totalYes, uint64 totalNo) = abi.decode(
            cleartexts,
            (uint64, uint64)
        );

        // Store decrypted values
        decryptedYesTotal[marketId] = totalYes;
        decryptedNoTotal[marketId] = totalNo;
        decryptionCompleted[marketId] = true;

        emit DecryptionVerified(marketId, totalYes, totalNo, block.timestamp);

        // Call hook for subclasses to handle completion
        _onDecryptionCompleted(marketId, totalYes, totalNo);
    }

    /**
     * @notice Hook called when decryption is completed
     * @param marketId Market ID
     * @param totalYes Decrypted Yes total
     * @param totalNo Decrypted No total
     * @dev Override in derived contracts to implement custom logic
     */
    function _onDecryptionCompleted(
        uint256 marketId,
        uint64 totalYes,
        uint64 totalNo
    ) internal virtual {}

    /**
     * @notice Validate outcome before setting
     * @param outcome Outcome to validate
     * @return isValid Whether outcome is valid
     */
    function _validateOutcome(IBlindBetMarket.Outcome outcome)
        internal
        pure
        returns (bool isValid)
    {
        return
            outcome == IBlindBetMarket.Outcome.Yes ||
            outcome == IBlindBetMarket.Outcome.No ||
            outcome == IBlindBetMarket.Outcome.Invalid;
    }

    /**
     * @notice Propose an outcome for the market
     * @param marketId Market ID
     * @param outcome Proposed outcome
     * @dev Can be called by resolver after decryption completes
     */
    function _proposeOutcome(
        uint256 marketId,
        IBlindBetMarket.Outcome outcome
    ) internal onlyAuthorizedResolver(marketId) {
        if (!_validateOutcome(outcome)) {
            revert InvalidOutcome();
        }

        emit OutcomeProposed(marketId, outcome, msg.sender);
    }

    /**
     * @notice Get decrypted market totals
     * @param marketId Market ID
     * @return totalYes Decrypted Yes total
     * @return totalNo Decrypted No total
     * @return completed Whether decryption is completed
     */
    function getDecryptedTotals(uint256 marketId)
        external
        view
        returns (
            uint64 totalYes,
            uint64 totalNo,
            bool completed
        )
    {
        return (
            decryptedYesTotal[marketId],
            decryptedNoTotal[marketId],
            decryptionCompleted[marketId]
        );
    }

    /**
     * @notice Check if decryption is completed for a market
     * @param marketId Market ID
     * @return Whether decryption is completed
     */
    function isDecryptionCompleted(uint256 marketId)
        public
        view
        returns (bool)
    {
        return decryptionCompleted[marketId];
    }

    /**
     * @inheritdoc IMarketResolver
     * @dev Must be implemented by derived contracts
     */
    function setResolution(uint256 marketId, IBlindBetMarket.Outcome outcome)
        external
        virtual
        override;

    /**
     * @inheritdoc IMarketResolver
     * @dev Must be implemented by derived contracts
     */
    function isAuthorizedResolver(uint256 marketId, address resolver)
        public
        view
        virtual
        override
        returns (bool);

    /**
     * @inheritdoc IMarketResolver
     * @dev Must be implemented by derived contracts
     */
    function getResolver(uint256 marketId)
        external
        view
        virtual
        override
        returns (address);
}
