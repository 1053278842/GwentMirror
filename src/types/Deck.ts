import type { Card } from '@/types/Card'
export type Deck = {
    id1: number;
    deckAuthor: string;
    deckName: string;
    sortCtIds: number[];
    time: number;
    allCard: Card[];
    groupCardsByType: Map<string, any>;
    factionRatio: Map<string, string>;
    // 展示的重要卡牌
    displayCards: Card[];
    displayLeaderCid: number;
    displayStratagemCid: number;
    deckWebId: number;
    fromPlayerId: number;
    factionId: number;
};