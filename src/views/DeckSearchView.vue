<template>
  <div id="body-bg" ref="deckListContainer">
    <template v-if="!loading||filteredItems.length > 0">
      <div id="PageContainer">
        <div id="PageContainerInner">
          <!-- 卡牌搜索框 -->
          <form id="SearchFormContainer" @submit.prevent>
            <CardSearchView :select-card="selectCard"></CardSearchView>
          </form>
          <hr />
          <!-- 搜索结果 -->
          <div id="DecksListResult">
            <span>
              <b>-> {{ decks.length }} </b>
              ……{{ tips }}
            </span>
          </div>
        </div>
      </div>
      <DynamicScroller id="page" :items="filteredItems" :min-item-size="460" :emit-update="false"
        class="scroller DecksListRowContainer" @resize="onResize" @update="onUpdate" :prerender="3"
        style="min-height: 1000px; max-height: 1000px" key-field="id1">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.id1]" :data-index="index"
            :data-active="active"  class="message">
            <div id="PageContainer">
              <div id="PageContainerInner">
              
                <!-- 预览列表 -->
                <div id="DeckListGridContainer">
                  <div id="DeckListGridContainerInner">
                    <DeckView :item="item" :select-card="selectCard"></DeckView>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="index == decks.length - 1" ref="loadingMore"
              style="height: 500px; text-align: center; margin-top: 15px">
              <div style="font-size: 24px">
                <el-icon class="is-loading primary">
                  <ToiletPaper />
                </el-icon>
                <div style="margin-top: 10px" v-if="decks.length % 10 >= 7">
                  好像...到底了....
                </div>
                <div style="margin-top: 10px" v-else="decks.length % 10 >= 4">
                  这里...好深啊.......好深....
                </div>
                <div style="margin-top: 10px" v-else>
                  已经...不用再滚动.......了....
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </template>
    <!-- <template v-else>
      <div v-if="!loading" id="PageContainer">
        <div id="PageContainerInner">

          <form id="SearchFormContainer" @submit.prevent>
            <CardSearchView :select-card="selectCard"></CardSearchView>
          </form>
          <hr />

          <div id="DecksListResult">
            <span>
              <b>-> {{ decks.length }} </b>
              ……{{ tips }}
            </span>
          </div>
        </div>
      </div>
    </template> -->
    <!-- 卡牌详细信息1 -->
    <CardInfo :card="activeCard.cardInfo" :size="'small'" id="CardInfo" />
    <!-- Loading -->
    <LoadingView v-show="loading"></LoadingView>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watchEffect } from "vue";
import { getAllDeck, getDecksByIds, getRandomDeckLast } from "@/api/gwentmirror";
import { useAllCardStore } from "@/stores/AllCards";
import { useCardEnumStore } from "@/stores/CardEnum";
import type { Card } from "@/types/Card";
import type { Deck } from "@/types/Deck";
import {
  usrNavStatusStore,
  usrSearchCardBarStatusStore,
} from "@/stores/status";
import CardView from "./CardView.vue";
import CardSearchView from "./CardSearchView.vue";
import LoadingView from "./LoadingView.vue";
import CardInfo from "./CardInfo.vue";
import DeckView from "./DeckView.vue";
import { useSelectedCardsStore } from "@/stores/UserOperationStore";

const selectedCardStore = useSelectedCardsStore();

// usrNavStatusStore().closeNav()
const allCardEnumStore = useCardEnumStore();
const allCardStore = useAllCardStore();
const allCardDataMap = allCardStore.cardDataMap;
allCardStore.initCardData();


// sortIds第一张永远是技能卡
type SearchParam = {
  ids: string;
  page: number;
};

const tips = ref("");


const scrollContainer = ref<HTMLElement | null>(null);
const deckListContainer = ref<HTMLElement | null>(null);
const loadingMore = ref<HTMLElement | null>(null);
const cardInfoContainer = ref<HTMLElement | null>(null);
const isClickBody = ref(false);
const loading = ref(false);
// 悬停卡牌
const activeCard = reactive({
  cardInfo: {} as Card,
});
// 输出

const decks = reactive([] as Deck[]);

const fetchData = async () => {
  loading.value = true;
  if (selectedCardStore.getIds().length != 0) {
    let param = {
      ids: selectedCardStore.getIds(),
      page: 0,
    };
    tips.value = "风暴正在登陆";
    getDecksByIds(param).then(deckJsonToViewData);
  } else {
    tips.value = "随机的总是好的.";
    let MAX_RANDOM_NUM = 50
    getRandomDeckLast(MAX_RANDOM_NUM).then(deckJsonToViewData);
  }

};

const deckJsonToViewData = (res: { data: string | any[] }) => {
  const data : any  = res;
  let decksTemp = [] as Deck[]
  for (let index = 0; index < data.length; index++) {
    const deckJson = data[index];
    const deck: Deck = {
      deckAuthor: deckJson.deckAuthor,
      deckName: deckJson.deckName,
      sortCtIds: deckJson.sortedCtIds,
      time: deckJson.time,
      allCard: [],
      groupCardsByType: new Map(),
      factionRatio: new Map(),
      displayCards: [],
      displayLeaderCid: deckJson.leaderCtId,
      displayStratagemCid: deckJson.stratagemCtId,
      deckWebId: deckJson.webDeckId,
      fromPlayerId: deckJson.fromPlayerId,
      factionId: deckJson.factionId,
      id1: deckJson.time,
    };
    deck.allCard = computedAllCard(deck);
    deck.groupCardsByType = computedGroupCardsByType(deck);
    deck.factionRatio = computedFactionRatio(deck);
    // 应该由后台传来，现在的规则是：p值最高的3~4个
    deck.displayCards = [
      deck.allCard[1],
      deck.allCard[2],
      deck.allCard[3],
      deck.allCard[4],
      deck.allCard[5],
    ];

    decksTemp.push(deck);
  }
  loading.value = false;
  decks.length = 0;
  decksTemp.forEach(deck => {
    decks.push(deck);
  })
}

const computedAllCard = (deck: Deck) => {
  let cards: Card[] = [];
  deck.sortCtIds.forEach((ids) => {
    if (deck.displayLeaderCid != ids) {
      const card: Card = getCardById(ids) as Card;
      if (card !== undefined) {
        // 计算选择的样式效果
        let ids = selectedCardStore.getIds();
        if (card.id == parseInt(ids)) {
          card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Selected;
        }
        cards.push(card);
      }
    }

  });
  cards.sort(
    (a, b) =>
      (b.provision > 0 ? b.provision : 20) * 1000000 -
      b.id -
      ((a.provision > 0 ? a.provision : 20) * 1000000 - a.id)
  );
  return cards.slice(1);
};

const computedFactionRatio = (deck: Deck) => {
  const countMap = new Map<string, number>();
  var factionName = "";
  switch (deck.factionId) {
    case 2:
      factionName = allCardEnumStore.FactionEnum.Monster;
      break;
    case 4:
      factionName = allCardEnumStore.FactionEnum.Nilfgaard;
      break;
    case 8:
      factionName = allCardEnumStore.FactionEnum.Northern_Realms;
      break;
    case 16:
      factionName = allCardEnumStore.FactionEnum.Scoiatael;
      break;
    case 32:
      factionName = allCardEnumStore.FactionEnum.Skellige;
      break;
    case 64:
      factionName = allCardEnumStore.FactionEnum.Syndicate;
      break;
  }
  countMap.set(factionName, 0);
  for (const cardItem of deck.allCard) {
    const faction = cardItem.faction!;
    if (countMap.has(faction)) {
      countMap.set(faction, countMap.get(faction)! + 1);
    } else {
      countMap.set(faction, 1);
    }
  }
  // 计算比例
  const total = deck.allCard.length;
  const ratioMap = new Map<string, string>();
  for (const [key, value] of countMap.entries()) {
    const ratio = ((value / total) * 100).toFixed(1);
    ratioMap.set(key, ratio + "%");
  }
  return ratioMap;
};

const computedGroupCardsByType = (deck: Deck) => {
  var groupMap = new Map<string, { cards: Card[]; totalCount: number }>();
  groupMap.set("谋略", { cards: [] as Card[], totalCount: 0 });
  groupMap.set("单位", { cards: [] as Card[], totalCount: 0 });
  groupMap.set("特殊", { cards: [] as Card[], totalCount: 0 });
  groupMap.set("神器", { cards: [] as Card[], totalCount: 0 });

  for (let index = 0; index < deck.allCard.length; index++) {
    const card: Card = deck.allCard[index];
    if (card?.type == "stratagem") {
      let typeGroup = groupMap.get("谋略")!;
      typeGroup.cards.push(card);
      typeGroup.totalCount = typeGroup.totalCount + 1;
    }
    if (card?.type == "unit") {
      let typeGroup = groupMap.get("单位")!;
      typeGroup.cards.push(card);
      typeGroup.totalCount = typeGroup.totalCount + 1;
    }
    if (card?.type == "special") {
      let typeGroup = groupMap.get("特殊")!;
      typeGroup.cards.push(card);
      typeGroup.totalCount = typeGroup.totalCount + 1;
    }
    if (card?.type == "artifact") {
      let typeGroup = groupMap.get("神器")!;
      typeGroup.cards.push(card);
      typeGroup.totalCount = typeGroup.totalCount + 1;
    }
  }
  // 部分卡组sort cid内无谋略卡
  if (groupMap.get("谋略")?.cards.length == 0) {
    const stratagemCard: Card = getCardById(deck.displayStratagemCid);
    let typeGroup = groupMap.get("谋略")!;
    typeGroup.cards.push(stratagemCard);
    typeGroup.totalCount = typeGroup.totalCount + 1;

    deck.allCard.unshift(stratagemCard);
  }
  return groupMap;
};

const getCardById = (cardId: number) => {
  return allCardStore.cardDataMap.get(cardId as number) as Card;
};

const getCardByIdClone = (cardId: number) => {
  return allCardStore.cardDataMap.get(cardId as number) as Card;
};

const data = ref({
  decks,
  search: "",
  updateParts: {
    viewStartIdx: 0,
    viewEndIdx: 0,
    visibleStartIdx: 0,
    visibleEndIdx: 0,
  },
});
const filteredItems = computed(() => {
  const { decks, search } = data.value;
  if (!search) return decks;
  const lowerCaseSearch = search.toLowerCase();
  return decks.filter((i) =>
    i.deckName.toLowerCase().includes(lowerCaseSearch)
  );
});
function onResize() {
  // console.log('resize')
}

function onUpdate(
  viewStartIndex: number,
  viewEndIndex: number,
  visibleStartIndex: number,
  visibleEndIndex: number
) {
  data.value.updateParts.viewStartIdx = viewStartIndex;
  data.value.updateParts.viewEndIdx = viewEndIndex;
  data.value.updateParts.visibleStartIdx = visibleStartIndex;
  data.value.updateParts.visibleEndIdx = visibleEndIndex;
}

const selectCard = (card: Card) => {
  if (card.cardExtInfo.status == allCardEnumStore.BorderStyleEnum.Selected) {
    card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Normal;
    selectedCardStore.remove(card);
  } else {
    card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Selected;
    selectedCardStore.add(card);
  }

  // decks.length = 0
  let i = 0;
  while (i < decks.length) {
    let deck = decks[i];
    let count = 0;
    let uniqueArr = [...new Set(deck.allCard)];
    uniqueArr.forEach((card) => {
      count +=
        card.cardExtInfo.status == allCardEnumStore.BorderStyleEnum.Selected
          ? 1
          : 0;
    });
    if (count != selectedCardStore.selectedCard.length) {
      console.log(deck.deckName);
      decks.splice(decks.indexOf(deck), 1);
    } else {
      i++;
    }
  }
  fetchData();
};

onMounted(() => {
  fetchData();
  // scrollContainer.value?.addEventListener('scroll', loadMore)
  deckListContainer.value?.addEventListener("mouseover", handleCardMouseOver);
  // deckListContainer.value?.addEventListener('mouseout', outCard)
  document.body.addEventListener("click", () =>
    usrSearchCardBarStatusStore().close()
  );
  usrSearchCardBarStatusStore().close();
});

const handleCardMouseOver = (event: MouseEvent) => {
  var cid: number = getCardIdByXY(event.clientX, event.clientY);
  if (cid <= 0) {
    //消除信息框
    const movingDiv = document.querySelector("#PositionContainer");
    (movingDiv as HTMLElement).style.visibility = "hidden";
  } else {
    //弹出信息框
    //填充信息框信息
    var card: Card = getCardById(cid) as Card;
    card = JSON.parse(JSON.stringify(card));
    card.res = "larger";
    activeCard.cardInfo = card;

    const movingDiv = document.querySelector("#PositionContainer");
    var underElement = getCardByXY(event.clientX, event.clientY);

    var cardArtElement = underElement;
    var cardInfoElement = movingDiv?.querySelector(".card-info-wrap");
    if (cardArtElement && cardInfoElement) {
      const artPosition = cardArtElement.getBoundingClientRect();
      const infoPosition = cardInfoElement.getBoundingClientRect();
      var Y = 0;
      var X = artPosition.x - artPosition.width / 2;
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      if (
        screenHeight >
        artPosition.top + artPosition.height + infoPosition.height + 30
      ) {
        Y = artPosition.top + artPosition.height + 10;
        card.verticalDir = "under";
      } else {
        Y = artPosition.top - artPosition.height * 2 - 10;
        card.verticalDir = "above";
      }
      if (
        screenWidth <
        artPosition.x + artPosition.width + infoPosition.width + 30
      ) {
        card.horizontalDir = "left";
      }
      (movingDiv as HTMLElement).style.visibility = "visible";
      (movingDiv as HTMLElement).style.left = X + "px";
      (movingDiv as HTMLElement).style.top = Y + "px";
    }
  }
};

const getCardByXY = (x: number, y: number) => {
  var element = document.elementFromPoint(x, y);
  while (!element?.classList.contains("card-data")) {
    if (element == null) {
      break;
    }
    element = element!.parentElement;
  }
  return element;
};

const getCardIdByXY = (x: number, y: number) => {
  var element = document.elementFromPoint(x, y);
  while (!element?.classList.contains("card-data")) {
    if (element == null) {
      break;
    }
    element = element!.parentElement;
  }
  if (element) {
    return parseInt((element as HTMLElement).dataset.id as string) || 0;
  } else {
    return -1;
  }
};

</script>
<style>
* {
  box-sizing: inherit;
}
.vue-recycle-scroller.direction-vertical:not(.page-mode) {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.vue-recycle-scroller.direction-vertical:not(.page-mode)::-webkit-scrollbar {
  width: 6px;
}

.vue-recycle-scroller.direction-vertical:not(.page-mode)::-webkit-scrollbar-thumb {
  background-color: transparent;
}
#body-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /* overflow-y: auto; */
  margin: 0px;
  background-color: rgb(38, 35, 33);
  font-family: "Open Sans", sans-serif;
  color: white;
  /* background-image: url("/src/assets/xili.png"); */
}

#page {
  display: flex;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  grid-column-start: 1;
  /* 让#app对我的限制滚蛋 */
  grid-column-end: 3;
}

#PageContainer {
  margin: 0 auto;
  max-width: 1300px;
}

#PageContainerInner {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 1500px;
  padding: 10px 20px;
  margin: 0px auto;
}

#SearchFormContainer {
  background-color: white;
  border-radius: 3px;
  display: flex;
  color: black;
  -webkit-box-align: center;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
}

#SearchIcon {
  color: rgba(0, 0, 0, 0.43);
  margin: 0px 2px 0px 15px;
  font-size: 16px;
}

#SearchFormContainer input {
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  flex: 1 1 200px;
  min-width: 0px;
  height: 30px;
  cursor: text;
  width: 60vmax;
}

#PageContainerInner hr {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
  border: none;
  margin: 25px 0px;
}

#DecksListResult {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: space-between;
  -webkit-box-pack: justify;
  padding-left: 15px;
  padding-right: 5px;
  background-color: rgba(25, 25, 25, 0.7);
  border-radius: 3px;
  min-height: 46px;
  margin-bottom: 15px;
}

.CardView[data-status="selected"] .card_asset-border {
  border: 1px dashed rgb(251 180 107);
  box-shadow: 0 0 6px 3px rgb(255 139 45 / 80%);
}

.CardView:hover .card_asset-border {
  border: 2px solid rgb(113, 174, 8);
  border-radius: 3px;
  box-shadow: 0 0 10px 5px rgba(30, 115, 9, 0.8);
  /* padding: 2px; */
  /* margin: 5px; */
}

.card_asset-border img,
.CardIconBorderInner img {
  height: 70px;
  width: 49.1px;
}

#DecksListResult span {
  color: rgb(67, 128, 77);
}

#DecksListResult span b {
  color: white;
}

#DeckListGridContainer {
  box-sizing: border-box;
  direction: ltr;
  height: auto;
  position: relative;
  /* width: 1234px; */
  will-change: transform;
  overflow: auto;
}

#DeckListGridContainer #DeckListGridContainerInner {
  width: auto;
  /* height: 3900px; */
  /* max-width: 1234px; */
  /* max-height: 3900px; */
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.DecksListRowContainer {
  /* height: 230px; */
  left: 0px;
  position: relative;
  top: 0px;
  width: 100%;
  z-index: 0;
}
</style>
