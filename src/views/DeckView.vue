<script setup lang="ts">
import { defineProps, onMounted, reactive, ref, toRefs } from "vue";
import type { Deck } from "@/types/Deck";
import type { Card } from "@/types/Card";
import CardView from "./CardView.vue";
import { useAllCardStore } from "@/stores/AllCards";
import { useCardEnumStore } from "@/stores/CardEnum";

const allCardEnumStore = useCardEnumStore();
const allCardStore = useAllCardStore();

const props = defineProps({
  item: {
    type: Object as () => Deck,
    required: true,
  },
  selectCard: {
    type: Function,
    required: true,
  },
});

// 格式化时间输出
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  return `${year}/${month}/${day}`;
}

// 卡组预览头
const moveContainer = ref<HTMLElement | null>(null);
const operationsContainer = ref<HTMLElement | null>(null);
// 卡组预览背景
const bgOperation = ref<HTMLElement | null>(null);
const bgListener = ref<HTMLElement | null>(null);

onMounted(() => {
  // 预加载
  preloadImages()

  var startX = 0
  var scaleX = .2;
  var scaleLeftX = .1;
  var scaleRightX = .2;
  // fuck bug!
  var fuckEClient = 0
  let mouseoutTimer: number | undefined | NodeJS.Timeout;

  moveContainer.value?.addEventListener('mouseover', (e) => {
    clearTimeout(mouseoutTimer);
    startX = fuckEClient == 0 ? e.clientX : fuckEClient;
    operationsContainer.value?.classList.add('moving')
  })

  moveContainer.value?.addEventListener('mousemove', (e) => {
    let offsetX = e.clientX - startX
    offsetX *= offsetX > 0 ? scaleLeftX : scaleRightX
    operationsContainer.value?.style.setProperty('--offset', `${offsetX}px`)
  });

  moveContainer.value?.addEventListener('mouseout', (e) => {
    let offsetX = 0
    offsetX *= scaleX
    operationsContainer.value?.style.setProperty('--offset', `${offsetX}px`)
    operationsContainer.value?.classList.remove('moving')

    fuckEClient = startX
    mouseoutTimer = setTimeout(() => {
      // 检查鼠标是否还在父div内部
      fuckEClient = 0
    }, 200);
  });

  bgListener.value?.addEventListener("mouseover", () => {
    bgOperation.value?.style.setProperty('transform', 'scale(1.02)');
  })

  bgListener.value?.addEventListener("mouseout", () => {
    bgOperation.value?.style.setProperty('transform', 'scale(1)');
  })

  bgListener.value?.addEventListener("mousemove", (e) => {
    bgOperation.value?.style.setProperty('transform-origin',
      ((e.pageX - bgOperation.value?.offsetLeft) / bgOperation.value?.offsetWidth) * 100 + '% ' + ((e.pageY - bgOperation.value?.offsetTop) / bgOperation.value?.offsetHeight) * 100 + '%');
  })

})

function preloadImages() {
  // 最先预加载图片边框，防止白边穿帮
  const img = new Image();
  const img2 = new Image();
  const img3 = new Image();
  const img4 = new Image();
  const img5 = new Image();
  img.src = "src/assets/card/art/preview/other/border_bronze.png";
  img2.src = "src/assets/card/art/preview/other/border_gold.png";
  img3.src = "src/assets/card/art/preview/factor/desktop-tooltip-bottom.png";
  img4.src = "src/assets/card/art/preview/factor/desktop-tooltop-center.jpg";
  img5.src = "src/assets/card/art/preview/factor/tooltip-top-neu.jpg";
}
const imageLoadedMap = reactive(new Map());

const handleImageLoad = (cardId:number) => {
  imageLoadedMap.set(cardId, true);
};

</script>

<template>
  <a class="DeckRowTopLinkContainer">
    <!-- 种族分布bar -->
    <div height="80" class="DeckRowCompositionRatioBar">
      <div v-for="(value, key) in item.factionRatio" class="DeckRowFactionBar" :data-faction="value[0]"
        :style="{ width: value[1] }" :key="key"></div>
    </div>
    <div class="DeckRow_Top" ref="moveContainer">
      <div class="DeckRow_ArtContainer">
        <div class="DeckRow_ArtContainerInner" ref="operationsContainer">
          <div class="DeckRow_ArtContainerList" v-for="(card, key) in item.displayCards" :key="key">
            <div class="DeckRow_ArtImgContainer">
              <img :src="'src/assets/card/art/preview/small/' + imageLoadedMap.get(card.id) ?'112101':card.id + '.jpg'" @load="handleImageLoad(card.id)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="DeckRow_ArtFade"></div>
      <div class="DeckRow_ArtFade_left"></div>
      <div class="DeckRow_Left">
        <div class="DeckIcoContainer">
          <img :src="'src/assets/card/art/preview/factor/ico/' +
            item.displayLeaderCid +
            '.png'
            " />
        </div>
        <div class="DeckRowInfoContainer">
          <span>【{{ item.deckName }}】</span>
        </div>
        <div class="DeckRowStatusContainer">
          <div class="StatsContainer">
            <div class="LabelStat">
              <label>胜率</label>
              <span>88.8%</span>
            </div>
            <div class="LabelStat">
              <label>时间</label>
              <span class="span_color_white">{{
                formatDate(item.time.toString())
              }}</span>
            </div>
            <div class="LabelStat">
              <label>WINTER</label>
              <span class="span_color_white">34Min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
  <div class="DeckBgContainer" ref="bgListener">
    <!-- <div class="DeckBgContainer"> -->
    <div class="DeckRowCardContainer">
      <div class="DeckRowCardContainerInner">
        <!-- 分类栏目 -->
        <div class="CardIconColumnContainer" v-for="(map, type) in item.groupCardsByType" :key="type"
          v-show="map[1].totalCount > 0">
          <!-- 栏目标题 -->
          <div class="ColumnGroupTitle">
            <!-- 标题图标 -->
            <div class="ColumnGroupTitleIcon">
              <el-icon size="18" color="#ffffff" class="TypeIconContainer">
                <Aim />
                <!-- <div class="TypeIcon" :data-type="map[0]"></div> -->
              </el-icon>
            </div>
            <!-- 标题内容 -->
            <span>{{ map[0] }} ({{ map[1].totalCount }})</span>
          </div>
          <!-- 卡牌图标列表 -->
          <div class="ColumnGroupCardIcons" v-if="map[1].cards.length"
            style="display: flex; justify-content: space-between">
            <template v-for="(card, cardIndex) in map[1].cards" :key="cardIndex">
              <template v-if="cardIndex === 0 || card.id != map[1].cards[cardIndex - 1].id
                ">
                <div style="flex: 1 1 auto">
                  <div class="ColumnGroupCardIcon" :class="{
                      RepeatCardColumn:
                        cardIndex < map[1].cards.length - 1
                          ? card.id == map[1].cards[cardIndex + 1].id
                          : true,
                    }" :data-id="card.id" style="position: relative" @click="selectCard(card)">
                    <CardView :card="card" :size="'low'" :data-status="card.cardExtInfo.status" class="CardView" />
                    <CardView :card="card" :size="'low'" class="CardView CardIconRepeat" v-if="cardIndex < map[1].cards.length - 1
                        ? card.id == map[1].cards[cardIndex + 1].id
                        : false
                      " />
                  </div>
                </div>
              </template>
            </template>

            <!-- 空元素 -->
            <div v-for="i in map[1].cards.length" style="flex: 1 1 auto" :key="i">
              <div class="hh" style="width: 50.1px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一栏栏目 -->
    <div class="DeckRowCardContainer OneRead">
      <div class="CardIconColumnContainer">
        <!-- 栏目标题 -->
        <div class="ColumnGroupTitle">
          <!-- 标题图标 -->
          <div class="ColumnGroupTitleIcon">
            <el-icon size="18" color="#ffffff">
              <Edit />
            </el-icon>
          </div>
          <!-- 标题内容 -->
          <span>一览 ({{ item.allCard.length }})</span>
        </div>
        <!-- 卡牌图标列表 -->
        <div class="ColumnGroupCardIcons">
          <div class="ColumnGroupCardIcon" v-for="(card, index) in item.allCard" :key="index" @click="selectCard(card)">
            <CardView :card="card" :size="'low'" class="CardView" :data-status="card.cardExtInfo.status" />
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <!-- 背景图片 -->
    <div ref="bgListener" class="FactorCardBg">
      <div ref="bgOperation" class="bgImg" :style="{
          backgroundImage:
            'url(src/assets/card/art/preview/leader/' +
            item.displayLeaderCid +
            '.jpg)',
        }"></div>
      <div class="horizontalFade"></div>
      <div class="VerticalTopFade"></div>
      <div class="VerticalBottomFade"></div>
    </div>
    <!-- 背景图片 -->
    <div class="FactorDeckBg" :data-faction="item.factionId"></div>
  </div>
</template>

<style scoped>
.DeckRowTopLinkContainer {
  cursor: pointer;
  color: white;
  text-decoration: none;
}

.DeckRowCompositionRatioBar {
  width: 100%;
  height: 5px;
  display: flex;
  flex-direction: row;
  border: 1px solid rgba(205, 186, 95, 0.33);
  border-bottom: none;
  border-right: unset;
}

.DeckRowFactionBar[data-faction="neutral"] {
  background-color: rgb(217 213 193);
}

.DeckRowFactionBar[data-faction="skellige"] {
  background-color: #341a7a;
  opacity: 0.8;
}

.DeckRowFactionBar[data-faction="northern_realms"] {
  background-color: #184d8b;
  opacity: 0.8;
}

.DeckRowFactionBar[data-faction="nilfgaard"] {
  background-color: #020100;
  opacity: 0.8;
}

.DeckRowFactionBar[data-faction="syndicate"] {
  background-color: #d37a00;
  opacity: 0.8;
}

.DeckRowFactionBar[data-faction="monster"] {
  background-color: #ab0e0e;
  opacity: 0.8;
}

.DeckRowFactionBar[data-faction="scoiatael"] {
  background-color: #2d7a2a;
  opacity: 0.8;
}

.FactorDeckBg[data-faction="2"] {
  background-image: url("@/assets/card/art/preview/factor/monsters-bg.jpg");
}

.FactorDeckBg[data-faction="4"] {
  background-image: url("@/assets/card/art/preview/factor/nilf-bg.jpg");
}

.FactorDeckBg[data-faction="8"] {
  background-image: url("@/assets/card/art/preview/factor/northern-bg.jpg");
}

.FactorDeckBg[data-faction="16"] {
  background-image: url("@/assets/card/art/preview/factor/scoia-bg.jpg");
}

.FactorDeckBg[data-faction="32"] {
  background-image: url("@/assets/card/art/preview/factor/skellige-bg.jpg");
}

.FactorDeckBg[data-faction="64"] {
  background-image: url("@/assets/card/art/preview/factor/syndicate-bg.jpg");
}

.DeckRow_Top {
  position: relative;
  overflow: hidden;
  /* display: flex; */
  padding: 10px 20px;
  min-height: 100px;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.DeckRow_Top:hover ,#DeckListGridContainerInner:hover .DeckRow_Top{
  padding: 7px 10px 7px 7px;
}

.DeckRow_Top:hover .DeckRow_ArtFade,
.DeckRow_Top:hover .DeckRow_ArtFade_left,
#DeckListGridContainerInner:hover .DeckRow_ArtFade,
#DeckListGridContainerInner:hover .DeckRow_ArtFade_left {
  opacity: .2;
}

.DeckRow_Top:hover .DeckRowStatusContainer,
#DeckListGridContainerInner:hover .DeckRowStatusContainer {
  background: rgba(0, 0, 0, 0.2);
}

.DeckRow_Top:hover .DeckRowInfoContainer,
#DeckListGridContainerInner:hover .DeckRowInfoContainer {
  margin-top: -40px;
  margin-left: -10px;
}

#DeckListGridContainerInner:hover .horizontalFade {
  opacity: .3;
}

.DeckRowStatusContainer,
.DeckRow_Top,
.DeckRowInfoContainer,
.DeckRow_ArtFade,
.DeckRow_ArtFade_left {
  transition: 0.2s ease-in-out;
}

#DeckListGridContainerInner:hover .DeckRow_ArtImgContainer {
  opacity: 0.6;
  filter: blur(0px);
}

/* deck背景hover */
.FactorCardBg {
  transition: .2s all ease-in;
}

.DeckBgContainer:hover .FactorCardBg {
  /* width: 65%; */
}

.DeckRow_Top .DeckRow_ArtContainer {
  position: absolute;
  width: 70%;
  top: 0px;
  left: 0px;
  height: 100%;
  z-index: -1;
  transform: translateX(-70px);
}

.DeckRow_ArtContainerInner {
  --offset: 0px;
  position: absolute;
  display: flex;
  top: 50%;
  /* transform: translateY(-50%); */
  width: 100%;
  background: rgba(34, 34, 34, 0);
  margin-top: -1px;
  transform: translate(calc(var(--offset)), -50%);
  filter: blur(var(--blur));
  transition: .4s all ease-in;
}

.DeckRow_ArtContainerInner.moving {
  transition: none;
}

.DeckBgContainer {
  /* background: #ccc; */
  /* width: 100%; */
  /* background-image: url("/src/assets/card/art/preview/small/202953.jpg"); */
  width: 100%;
  position: relative;
  /* height: 400px; */
  /* clip-path: polygon(0px 0px, 337px 0px, 358px 98px, 0px 98px); */
  /* opacity: .1; */
  /* position: absolute; */
}

.FactorDeckBg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background-size: cover;
  background-repeat: no-repeat;
  /* background-position: 0 -15px;s */
}

.DeckBgContainer .FactorCardBg {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  -webkit-mask-image: -webkit-gradient(linear,
      left top,
      right top,
      color-stop(0, transparent),
      color-stop(5%, transparent),
      color-stop(25%, #000),
      color-stop(100%, #000));
}

.bgImg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0 0px;
  --offset: 0px;
  transform: translate(var(--offset), var(--offset));
  transition: transform .5s ease-out;
}

.FactorCardBg .horizontalFade {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(98deg,
      rgb(38, 35, 33) 10%,
      hsl(0deg 0% 100% / 0%) 50%,
      rgb(38, 35, 33) 90%,
      rgb(38, 35, 33) 100%);
  opacity: 1;
  transition: 0.2s ease-in-out;
}

.FactorCardBg .VerticalTopFade {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
      rgb(38, 35, 33) 10px,
      hsl(0deg 0% 100% / 0%) 60px,
      hsl(0deg 0% 100% / 0%) 80%,
      rgb(38, 35, 33) 100%);
  opacity: 1;
  transition: 0.2s ease-in-out;
}

.FactorCardBg .VerticalBottomFade {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      hsl(0deg 0% 100% / 0%) 60px,
      hsl(0deg 0% 100% / 0%) 80%,
      rgb(38, 35, 33) 100%);
  opacity: 1;
  transition: 0.2s ease-in-out;
}

.DeckRow_Top .DeckRow_ArtFade {
  position: absolute;
  opacity: 1;
  z-index: -1;
  width: 10%;
  top: 0px;
  right: 0px;
  height: 100%;
  background: linear-gradient(to right,
      transparent 0px,
      rgba(16, 16, 16, 0.99) 80%);
}

.DeckRow_Top .DeckRow_ArtFade_left {
  position: absolute;
  opacity: 1;
  z-index: -1;
  width: 10%;
  top: 0px;
  left: 0px;
  height: 100%;
  background: linear-gradient(to left,
      transparent 0px,
      rgba(16, 16, 16, 0.99) 80%);
}

.DeckRow_Top .DeckRow_Left {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  z-index: 1;
  cursor: default;
}

.DeckRowStatusContainer {
  background: rgba(0, 0, 0, 0.5);
  padding: 12px 20px;
  border-radius: 3px;
  margin-left: 20px;
}

.LabelStat {
  display: flex;
  flex-direction: column;
  margin: 0px 20px;
  margin-left: 0px;
  align-items: center;
}

.LabelStat label {
  font-family: "Open Sans";
  font-weight: normal;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0px;
}

.LabelStat span {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  font-family: "Russo One";
  font-weight: normal;
  font-size: 20px;
  color: rgb(55, 175, 22);
}

.StatsContainer {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
}

.DeckRowInfoContainer {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  margin-right: 10px;
  overflow: hidden;
  word-break: keep-all;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.DeckRowInfoContainer span {
  font-size: 20px;
  font-family: "Russo One", sans-serif;
}

.span_color_white {
  color: white !important;
}

.DeckRowCardContainer {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(34, 31, 30, 0.45);
  z-index: 1;
  position: relative;
}

.DeckRowCardContainer {
  flex-wrap: wrap;
  overflow-x: auto;
  display: flex;
  min-height: 107px;
  z-index: 1;
  align-items: flex-start;
}

.DeckRowCardContainerInner {
  z-index: 1;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  min-height: 107px;
}

.CardIconColumnContainer {
  display: flex;
  flex-direction: column;
  padding: 7px 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.DeckRowCardContainerInner .CardIconColumnContainer:first-child {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.ColumnGroupCardIcons {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-left: -8px;
  /* min-width: 200px; */
}

.OneRead .ColumnGroupCardIcons {
  padding-right: 50px;
}

.ColumnGroupCardIcon img {
  width: 100%;
}

.ColumnGroupCardIcon {
  flex: 1 1 auto;
  display: flex;
  /* flex-direction: column; */
  margin-left: 6px;
  margin-bottom: 6px;
  z-index: 0;
  box-shadow: unset;
}

.OneRead .ColumnGroupCardIcon:hover,
.CardIconRepeat:hover {
  z-index: 9999999999 !important;
  flex: 2 1 auto;
}

.ColumnGroupTitle {
  display: flex;
  -webkit-box-align: center;
  margin-bottom: 5px;
  white-space: nowrap;
  align-items: flex-end;
}

.ColumnGroupTitleIcon {
  margin-right: 8px;
  display: inline;
  display: inline-block;
  font: normal normal normal 14px/1 Mana;
  font-size: inherit;
  line-height: 1em;
  text-rendering: auto;
  transform: translate(0, 0);
  speak: none;
  text-transform: none;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
}

.ColumnGroupTitle span {
  color: rgba(255, 255, 255, 0.6);
}

.CardIconRepeat {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: -4px;
  right: -8px;
  z-index: -2;
  transform: rotate(6deg);
  /* margin-left:10px; */
  margin-bottom: 6px;
}

.CardIconRepeat img {}

.RepeatCardColumn {
  margin-right: 8px;
  margin-bottom: 4px;
}

.OneRead {
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.OneRead .ColumnGroupCardIcon {
  width: 0px;
}

.OneRead .CardIconColumnContainer {
  overflow: hidden;
  max-width: 60%;
  min-height: 20%;
  flex-grow: 1;
  flex-shrink: 1;
}

.TypeIcon {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/other/TypeIcon/filter-type-unit.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.TypeIconContainer {
  width: 25px;
  height: 25px;
}

.DeckIcoContainer img {
  width: 90px;
  padding-right: 15px;
}

.DeckRow_ArtImgContainer {
  flex: 0 0 auto;
  width: 358px;
  transition: 0.2s ease-in-out;
  height: 98px;
  margin-left: -21px;
  margin-right: 10px;
  clip-path: polygon(21px 0px, 358px 0px, 337px 98px, 0px 98px);
  opacity: 0.4;
  filter: blur(.8px);
}



.DeckRow_ArtImgContainer img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
