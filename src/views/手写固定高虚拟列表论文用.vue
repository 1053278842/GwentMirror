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
          <div class="ShowList" :onscroll="updateStartIndex">
              <ul :style="listStyle">
                  <li v-for="(card, index) in visibleCards" :key="index" :style="itemStyle">
                      <CardView :card="card" :size="'small'"></CardView>
                      <span>{{ card.name }}</span>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usrSearchCardBarStatusStore } from '@/stores/status';
import CardView from './CardView.vue';
import { useAllCardStore } from '@/stores/AllCards';

const allCardStore = useAllCardStore();
const list = ref<HTMLUListElement | null>(null);
const listValue = ref(0);
const itemHeight = 30; // 每个项的高度
const visibleCount = 10; // 可视区域内最多显示的项数
const scrollOffset = 10; // 滚动偏移量，用于提前加载更多项
const startIndex = ref(0); // 可视区域内的第一个项的下标
const endIndex = computed(() => startIndex.value + visibleCount); // 可视区域内的最后一个项的下标
const visibleCards = computed(() => allCardStore.cardData.slice(startIndex.value, startIndex.value + visibleCount + scrollOffset)); // 可视区域内的卡牌数据

// 计算列表样式
const listStyle = computed(() => {
  const totalHeight = allCardStore.cardData.length * itemHeight;
  return {
      height: `${visibleCount * itemHeight}px`,
      // overflow: 'auto',
      paddingTop: `${startIndex.value * itemHeight}px`,
      paddingBottom: `${(allCardStore.cardData.length - endIndex.value -visibleCount) * itemHeight}px`,
  };
});

// 计算每个项的样式
const itemStyle = computed(() => {
  return {
      height: `${itemHeight}px`,
      lineHeight: `${itemHeight}px`,
  };
});

const updateStartIndex = () => {
  const maxStartLimit: number = allCardStore.cardData.length - visibleCount
  if (startIndex.value <= maxStartLimit) {
      listValue.value = document.getElementsByClassName('ShowList')[0]?.scrollTop ?? 0
      const scrollTop = document.getElementsByClassName('ShowList')[0]?.scrollTop ?? 0
      startIndex.value = Math.max(Math.floor(scrollTop / itemHeight), 0); 
  }else{
      startIndex.value = maxStartLimit
  }
};
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

.ShowList li {
  list-style: none;
  padding: 5px 20px;
  min-height: 30px;
  display: flex;
}

.ShowList ul {
  margin: 0;
  padding-left: 0;
}

.ShowList li:hover {
  background: rgba(219, 219, 219, 0.637);
}

.ShowList li span {
  font-weight: normal;
  font-size: 14px;
  color: rgb(125, 125, 125);
  margin-left: 10px;
}
</style>