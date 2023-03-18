import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getAllData } from '@/api/carddata'
import { useCardEnumStore } from '@/stores/CardEnum'
import type { Card } from '@/types/Card'
import allCardData from "@/assets/allCard.json"

export const useAllCardStore = defineStore('AllCards', () => {
    // 常量
    const CardEnumStore = useCardEnumStore()
    const BorderColor = CardEnumStore.BorderColorEnum
    const Rarity = CardEnumStore.RarityEnum
    const Faction = CardEnumStore.FactionEnum
    const CardType = CardEnumStore.CardTypeEnum

    const parentMessage = ref('medium')
    const imgUrl = ref("../assets/card/art/preview/small/")
    const imgSuffix = ref(".jpg")
    // 返回参数
    const cardData = reactive([] as Card[])
    const cardDataMap = reactive(new Map<Number, Card>)

    function initCardData() {
        if (cardDataMap.size != 0) {
            console.log("存在CardData,取消重复请求")
            return
        }
        // getAllData().then((res: { data: string | any[]; }) => {
        //     jsonDataToCards(res.data)
        //     console.log("初始化card-all完成!")
        // });
        const data = allCardData
        jsonDataToCards(data)
        
    }


    function jsonDataToCards(data: any) {
        // const data = res.data
        for (let index = 0; index < data.length; index++) {
            const jsonData = data[index]._source;

            var rarity_web = jsonData.rarity
            var rarity = Rarity.Common
            var border_color = BorderColor.Bronze
            if (rarity_web == 25) {
                rarity = Rarity.Legendary
                border_color = BorderColor.Gold
            }
            else if (rarity_web == 20) {
                rarity = Rarity.Epic
                border_color = BorderColor.Gold
            }
            else if (rarity_web == 15)
                rarity = Rarity.Rare

            var type_web = jsonData.type
            var cardType = CardType.Unit
            if (type_web == "16")
                cardType = CardType.Stratagem
            else if (type_web == "8")
                cardType = CardType.Artifact
            else if (type_web == "4")
                cardType = CardType.Unit
            else if (type_web == "2")
                cardType = CardType.Special
            var faction = Faction.Monster
            switch (jsonData.faction) {
                case 0:
                    faction = Faction.Neutral
                    break
                case 1:
                    faction = Faction.Monster
                    break
                case 2:
                    faction = Faction.Nilfgaard
                    break
                case 3:
                    faction = Faction.Northern_Realms
                    break
                case 4:
                    faction = Faction.Scoiatael
                    break
                case 5:
                    faction = Faction.Skellige
                    break
                case 6:
                    faction = Faction.Syndicate
                    break
            }
            var categories: Array<String>[] = jsonData.translations.en.categories
            var category :string= ""
            if (categories) { // 检查 categories 是否存在
                category = categories.flat().join(",");
            }
            var card: Card = {
                res: "medium",

                id: jsonData.id,
                power: jsonData.power,
                armor: jsonData.armour,
                provision: jsonData.provisions_cost,
                faction: faction,
                color: border_color,
                type: cardType,
                rarity: rarity,
                imgUrl: new URL(imgUrl.value + jsonData.id + imgSuffix.value, import.meta.url).href,
                name: jsonData.translations.en.name,
                tooltip: jsonData.translations.en.tooltip,
                categories: category,
                fluff: jsonData.translations.en.fluff,

                cardExtInfo: {
                    repeat: false,
                    order: 0,
                    status: ''
                },
                verticalDir:"under",
                horizontalDir:"right",
            
            }
            cardDataMap.set(jsonData.id, card)
            cardData.push(card)
        }
        console.log("初始化card-all完成!")
    }

    return { cardData, cardDataMap, initCardData }
})