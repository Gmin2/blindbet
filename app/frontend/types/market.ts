export enum MarketState {
    Open = 0,
    Locked = 1,
    Resolving = 2,
    Resolved = 3
}

export enum Outcome {
    NotSet = 0,
    Yes = 1,
    No = 2,
    Invalid = 3
}

export interface Market {
    id: bigint;
    address: string;
    question: string;
    state: MarketState;
    createdAt: bigint;
    bettingDeadline: bigint;
    resolutionTime: bigint;
    creator: string;
    resolver: string;
    resolvedOutcome: Outcome;

    // Visual & Metadata
    image: string;
    category: string;

    // Volume & Pools
    totalVolume: bigint;
    totalYesAmount?: bigint;
    totalNoAmount?: bigint;

    // Computed (Frontend)
    timeRemaining?: number;
    isActive?: boolean;
    canLock?: boolean;
    canResolve?: boolean;
}
