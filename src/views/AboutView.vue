<template>
  <!-- {{ startIndex }}
  {{ endIndex }}
  {{ listValue }} -->
  <el-icon size="20" color="#409EFC" class="is-loading" id="SearchIcon">
      <Edit />
  </el-icon>
  <input placeholder="Please input card ids!" @click="usrSearchCardBarStatusStore().open()" @click.stop>

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
                      ]" :data-index="index" :data-active="active" :title="`Click to change message ${index}`" class="message">
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
</style>