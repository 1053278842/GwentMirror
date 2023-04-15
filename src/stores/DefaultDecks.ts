import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Deck } from '@/types/Deck'

export const useDefaultDecksStore = defineStore('DefaultDecks', () => {
    // 返回参数
    const deckData = reactive([] as Deck[])

    function initCardData() {
        for (let index = 0; index < 200; index++) {
            const deck: Deck = {
                deckAuthor: "3423",
                deckName: "deckJson.deckName",
                sortCtIds: [152309,152308,152309,152309,152310],
                time: 1600405,
                allCard: [],
                groupCardsByType: new Map(),
                factionRatio: new Map(),
                displayCards: [],
                displayLeaderCid: 152309,
                displayStratagemCid: 152309,
                deckWebId: 152309,
                fromPlayerId: 152309,
                factionId: 32,
                id1: index,
            }
            // 应该由后台传来，现在的规则是：p值最高的3~4个
            
            deckData.push(deck)
        }
        
    }


    function jsonDataToCards(data: any) {
        // const data = res.data
        

    }

    return { deckData, initCardData }
})