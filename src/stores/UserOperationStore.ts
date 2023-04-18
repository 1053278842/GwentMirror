import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Card } from '../types/Card'

export const useSelectedCardsStore = defineStore('selectedCards', () => {
    const selectedCard = reactive([] as Card[])

    function add(card: Card) {
        selectedCard.push(card)
    }
    function remove(card: Card) {
        const index = selectedCard.findIndex(c => c.id === card.id); // 找到具有相同id的卡片对象的索引
        if (index !== -1) { // 如果找到了对应的索引
            selectedCard.splice(index, 1); // 从数组中删除该索引处的对象
        }
    }

    return { selectedCard, add, remove }
})