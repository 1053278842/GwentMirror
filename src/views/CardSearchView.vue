<template>
    <div class="SelectCardItemTokenContainer">
        <el-icon size="20" color="#409EFC" class="is-loading" id="SearchIcon">
            <Edit />
        </el-icon>
        <div class="SelectCardItemToken">
            <div class="CardToken card-data" :data-id="allCard[18].id" >
                <CardView :card="allCard[0]" :size="'small'"></CardView>
                <div class="deleteToken">
                    <div class="deleteIco">
                        <el-icon size="14" color="#fff" >
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </div>
            <div class="CardToken">
                <CardView :card="allCard[18]" :size="'small'"></CardView>
            </div>

        </div>
    </div>
    <input placeholder="Please input card ids!"
        @click="usrSearchCardBarStatusStore().showed = !usrSearchCardBarStatusStore().showed" @click.stop>

    <div class="CardSearchExtShowContainer" v-show="usrSearchCardBarStatusStore().showed">
        <div class="SearchCardTypeDivContainer">
            <div class="TypeTile">
                <span class="TypeName">卡牌</span>
                <span class="CardNumber">{{ allCardStore.cardData.length }}</span>
            </div>
            <DynamicScroller :items="filteredItems" :min-item-size="54" :emit-update="true" class="scroller ShowList"
                @resize="onResize" @update="onUpdate">
                <template #default="{ item, index, active }">
                    <ul>
                        <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
                            item.name,
                        ]" :data-index="index" :data-active="active" :title="`当前Card索引: ${index}`" class="message">
                            <CardView :card="item" :size="'small'"></CardView>
                            <span>{{ item.name }}</span>
                        </DynamicScrollerItem>
                    </ul>
                </template>
            </DynamicScroller>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import { usrSearchCardBarStatusStore } from '@/stores/status';
import CardView from './CardView.vue';
import { useAllCardStore } from '@/stores/AllCards';
useAllCardStore().initCardData()
const allCardStore = useAllCardStore();

const allCard = useAllCardStore().cardData;
const data = ref({
    allCard,
    search: '',
    updateParts: { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 },
});
const filteredItems = computed(() => {
    const { search, allCard } = data.value;
    if (!search) return allCard;
    const lowerCaseSearch = search.toLowerCase();
    return allCard.filter(i => i.name.toLowerCase().includes(lowerCaseSearch));
});
function onResize() {
    console.log('resize')
}

function onUpdate(viewStartIndex: number, viewEndIndex: number, visibleStartIndex: number, visibleEndIndex: number) {
    data.value.updateParts.viewStartIdx = viewStartIndex
    data.value.updateParts.viewEndIdx = viewEndIndex
    data.value.updateParts.visibleStartIdx = visibleStartIndex
    data.value.updateParts.visibleEndIdx = visibleEndIndex
}
</script>
  
  
  
<style scoped>
#SearchIcon {
    margin-right: 10px;
}

input {
    padding: 25px 20px;
}

.CardSearchExtShowContainer {
    background: white;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0px;
    min-width: 270px;
    z-index: 1;
    position: absolute;
    left: 0px;
    widows: unset;
    transform: unset;
    right: unset;
    top: calc(100% + 0px);
    /* width: 100%; */
    height: auto;
    overflow: hidden;
    max-height: 600px;
    min-height: 200px;
    display: flex;

}

.CardSearchExtShowContainer .SearchCardTypeDivContainer {
    width: 270px;
    height: 440px;
    display: flex;
    flex-direction: column;
}

.TypeTile {
    background: rgb(237, 237, 237);
    padding: 0px 15px;
    font-size: 14px;
    font-weight: bold;
    color: rgb(115, 115, 115);
    min-height: 40px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}

.CardNumber {
    font-weight: normal;
    margin-left: 10px;
}

.ShowList {
    overflow: scroll;
}

.ShowList .message {
    list-style: none;
    padding: 5px 20px;
    min-height: 30px;
    display: flex;
}

.ShowList ul {
    margin: 0;
    padding-left: 0;
}

.ShowList .message:hover {
    background: rgba(219, 219, 219, 0.637);
}

.ShowList .message span {
    font-weight: normal;
    font-size: 14px;
    color: rgb(125, 125, 125);
    margin-left: 10px;
}

.ShowList ul {
    cursor: pointer;
}

.SelectCardItemTokenContainer {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
}

.SelectCardItemToken {
    display: flex;
    flex-direction: row;
}

.CardToken {
    margin-right: 10px;
    position: relative;
}

.CardToken:hover .deleteToken {
    opacity: 1;
}

.deleteToken{
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    background-color: brown;
    width: 100%;
    height:100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}
 .deleteIco {
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 7px);
}
</style>