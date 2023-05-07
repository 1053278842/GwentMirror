import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Card } from '../types/Card'
import { useAllCardStore } from '@/stores/AllCards'

export const useSelectedCardsStore = defineStore('selectedCards', () => {
    const selectedCard = reactive([] as Card[])
    const allCardStore = useAllCardStore()

    function add(card: Card) {
        selectedCard.push(card)
    }
    function addByCid(cid: number) {
        selectedCard.push(allCardStore.getCardById(cid))
    }
    function remove(card: Card) {
        const index = selectedCard.findIndex(c => c.id === card.id); // 找到具有相同id的卡片对象的索引
        if (index !== -1) { // 如果找到了对应的索引
            selectedCard.splice(index, 1); // 从数组中删除该索引处的对象
        }
    }
    function removeByCid(cid: number) {
        const index = selectedCard.findIndex(c => c.id === cid); // 找到具有相同id的卡片对象的索引
        if (index !== -1) { // 如果找到了对应的索引
            selectedCard.splice(index, 1); // 从数组中删除该索引处的对象
        }
    }
    function getIds() {
        return selectedCard.map(card => card.id).join(",")
    }

    return { selectedCard, add, remove, getIds, addByCid, removeByCid }
})