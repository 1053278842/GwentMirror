<script setup lang="ts">
import { defineProps, computed } from "vue";
import type { Card } from "@/types/Card";
import { useCardEnumStore } from "@/stores/CardEnum";
import { spriteUtils }  from "@/utils/sprite_img_utils";

const CardEnumStore = useCardEnumStore();
const CardType = CardEnumStore.CardTypeEnum;
const props = defineProps({
  card: {
    type: Object as () => Card,
    required: true,
  },
  size: {
    type: String as () => string,
    required: true,
  },
  res: {
    type: String as () => string,
    required: false,
  },
});
var cardRes = props.card.res;
if (props.res) {
  cardRes = props.res;
}
// const {card} = toRefs(props);
//悬停展示信息

const formattedTooltip = computed(() => {
  const text = props.card.tooltip;
  return text
    .replace(/\\n/g, "<br/>")
    .replace(/<keyword=([a-zA-Z]+)>/g, "<span class='keyword'>")
    .replace(/<\/keyword>/g, "</span>");
});
</script>

<template>
  <div id="card-listing">
    <div
      class="card-wrap card-data"
      :data-res="cardRes"
      :data-id="card.id"
      data-artid="3817j"
      :data-power="card.power"
      :data-armor="card.armor"
      :data-provision="card.provision"
      :data-faction="card.faction"
      data-set="cursed toad"
      :data-color="card.color"
      :data-type="card.type"
      :data-rarity="card.rarity"
      :data-vertical-dir="card.verticalDir"
      :data-horizontal-dir="card.horizontalDir"
    >
      <div class="card-info-wrap" v-if="card.res == 'larger'">
        <div class="card-head">
          <div class="card-name">{{ card.name }}</div>
          <div class="card-category">{{ card.categories }}</div>
        </div>
        <div class="card-body">
          <div class="card-body-ability">
            <span class="keyword doomed">未知</span><br />
            <div v-html="formattedTooltip"></div>
            <br />
          </div>
          <p class="card-body-ext">{{ card.fluff }}</p>
        </div>
      </div>

      <div class="card-art-wrap">
        <a href="#">
          <!-- <a href="https://gwent.one/cn/card/202793"></a> -->
          <div class="card-image-wrap">
            <!-- "'@\assets\card\art\preview\big\'+card.id+'.jpg'" -->
            <div class="card_asset-img">
              <!-- <img loading="lazy" :style="spriteUtils(card.id, size)" /> -->
              <img loading="lazy" :src="card.imgUrl" />
            </div>
            <div class="card_asset-border"></div>

            <div class="card_asset-armor-icon" v-if="card.armor != '0'">
              <div class="card_asset-armor"></div>
            </div>
            <div
              class="card_asset-provision-icon"
              v-if="card.type != CardType.Stratagem"
            ></div>
            <div
              class="card_asset-provision-bg"
              v-if="card.type != CardType.Stratagem"
            >
              <div class="card_asset-provision"></div>
            </div>
            <div class="card_asset-banner">
              <div class="card_asset-power"></div>
            </div>
            <div class="card_asset-trinket"></div>
            <div class="card_asset-rarity"></div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.keyword {
  font-weight: bolder;
}
.card-wrap {
  /* display: flex; */
  flex-direction: row-reverse;
  flex-wrap: wrap;
  position: relative;
}

.card-info-wrap {
  width: 200px;
  display: flex;
  flex-flow: row wrap;
  margin-left: 2px;
  pointer-events: none;
  position: absolute;
  /* z-index: 1; */
}

.card-data[data-res="larger"][data-vertical-dir="under"] .card-info-wrap {
  top: 0 !important;
}

.card-data[data-res="larger"][data-vertical-dir="above"] .card-info-wrap {
  bottom: 0 !important;
}

.card-data[data-res="larger"][data-horizontal-dir="left"] .card-info-wrap {
  right: 100px !important;
}

.card-data[data-res="larger"][data-horizontal-dir="right"] .card-info-wrap {
  left: 100px !important;
}

.card-info-wrap .card-head {
  display: flex;
  flex: 1 0 100%;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  flex-flow: row wrap;
  background-image: url("@/assets/card/art/preview/factor/tooltip-top-neu.jpg");
  height: 55px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center 0px;
}

.card-info-wrap .card-head .card-category {
  flex: 1 0 100%;
  font-size: 14px;
  color: rgb(232, 232, 232);
  text-align: center;
  padding: 0px 10px;
  margin: -10px 0px 0px;
  font-family: HalisGR-Light, sans-serif;
}

.card-info-wrap .card-head .card-name {
  flex: 1 0 100%;
  font-size: 18px;
  line-height: 14px;
  color: rgb(242, 242, 242);
  text-align: center;
  font-family: HalisGR-Light, sans-serif;
  padding: 5px 20px 0px;
  margin: 0px;
  max-height: 58px;
  /* overflow: hidden; */
  word-break: break-word;
  text-decoration: none;
  /* white-space: nowrap; */
}

.card-body {
  flex: 0 0 100%;
  background-image: url("@/assets/card/art/preview/factor/desktop-tooltip-bottom.png"),
    url("@/assets/card/art/preview/factor/desktop-tooltop-center.jpg");
  background-size: 100%;
  background-repeat: no-repeat, repeat-y;
  background-position: center bottom;
  word-break: keep-all;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: left;
}

.card-body .card-body-ability {
  font-size: 14px;
  line-height: 20px;
  color: rgb(34, 29, 22);
  flex: 1 0 100%;
  padding: 6px 16px 10px;
  margin-bottom: 6px;
  position: relative;
  word-break: break-word;
  font-family: system-ui;
}

.card-body .card-body-ability::after {
  content: "";
  background-image: url("@/assets/card/art/preview/factor/separator_tooltip.png");
  background-repeat: no-repeat;
  background-position: center center;
  height: 5px;
  width: 85%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin: 0px auto;
}

.card-body .card-body-ability .keyword {
  color: rgb(34, 29, 22);
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  line-height: inherit;
}

.card-body .card-body-ext {
  font-size: 12px;
  color: rgb(82 72 57);
  flex: 1 0 100%;
  padding: 0px 16px;
  margin: 0;
  font-family: 黑体, sans-serif;
  word-break: break-word;
  font-style: italic;
  margin-bottom: 10px;
}

.card-data[data-armor="1"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_01.png");
}

.card-data[data-armor="2"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_02.png");
}

.card-data[data-armor="3"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_03.png");
}

.card-data[data-armor="4"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_04.png");
}

.card-data[data-armor="5"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_05.png");
}

.card-data[data-armor="6"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_06.png");
}

.card-data[data-armor="10"] .card_asset-armor {
  background-image: url("@/assets/card/art/preview/number/armor_10.png");
}

.card-data .card_asset-armor-icon {
  background-image: url("@/assets/card/art/preview/other/trinket_armor.png");
}

.card-data .card_asset-provision-icon {
  background-image: url("@/assets/card/art/preview/banner/provision_icon.png");
}

.card-data[data-power="1"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_01.png");
}

.card-data[data-power="2"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_02.png");
}

.card-data[data-power="3"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_03.png");
}

.card-data[data-power="4"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_04.png");
}

.card-data[data-power="5"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_05.png");
}

.card-data[data-power="6"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_06.png");
}

.card-data[data-power="7"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_07.png");
}

.card-data[data-power="8"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_08.png");
}

.card-data[data-power="9"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_09.png");
}

.card-data[data-power="10"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_10.png");
}

.card-data[data-power="11"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_11.png");
}

.card-data[data-power="12"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_12.png");
}

.card-data[data-power="15"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_15.png");
}

.card-data[data-power="18"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/power_18.png");
}

/* 边框 */
.card-data[data-color="bronze"] .card_asset-border {
  background-image: url("@/assets/card/art/preview/other/border_bronze.png");
}

.card-data[data-color="gold"] .card_asset-border {
  background-image: url("@/assets/card/art/preview/other/border_gold.png");
}

/* 数字 */
.card-data[data-provision="1"] .card_asset-power {
  background-image: url("@/assets/card/art/preview/number/provision_01.png");
}

.card-data[data-provision="2"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_02.png");
}

.card-data[data-provision="3"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_03.png");
}

.card-data[data-provision="4"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_04.png");
}

.card-data[data-provision="5"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_05.png");
}

.card-data[data-provision="6"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_06.png");
}

.card-data[data-provision="7"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_07.png");
}

.card-data[data-provision="8"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_08.png");
}

.card-data[data-provision="9"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_09.png");
}

.card-data[data-provision="10"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_10.png");
}

.card-data[data-provision="11"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_11.png");
}

.card-data[data-provision="12"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_12.png");
}

.card-data[data-provision="13"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_13.png");
}

.card-data[data-provision="14"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_14.png");
}

.card-data[data-provision="15"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_15.png");
}

.card-data[data-provision="16"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_16.png");
}

.card-data[data-provision="17"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_17.png");
}

.card-data[data-provision="18"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_18.png");
}

.card-data[data-provision="19"] .card_asset-provision {
  background-image: url("@/assets/card/art/preview/number/provision_19.png");
}

/* rarity */
.card-data[data-rarity="common"] .card_asset-rarity {
  background-image: url("@/assets/card/art/preview/other/rarity_common.png");
}

.card-data[data-rarity="rare"] .card_asset-rarity {
  background-image: url("@/assets/card/art/preview/other/rarity_rare.png");
}

.card-data[data-rarity="epic"] .card_asset-rarity {
  background-image: url("@/assets/card/art/preview/other/rarity_epic.png");
}

.card-data[data-rarity="legendary"] .card_asset-rarity {
  background-image: url("@/assets/card/art/preview/other/rarity_legendary.png");
}

/* 装饰品 */
.card-data[data-type="special"] .card_asset-trinket {
  background-image: url("@/assets/card/art/preview/other/trinket_special.png");
}

.card-data[data-type="stratagem"] .card_asset-trinket {
  background-image: url("@/assets/card/art/preview/other/trinket_stratagem.png");
}

.card-data[data-type="artifact"] .card_asset-trinket {
  background-image: url("@/assets/card/art/preview/other/trinket_artifact.png");
}

.card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_nilfgaard.png");
}

.card-data[data-faction="scoiatael"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_scoiatael.png");
}

.card-data[data-faction="skellige"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_skellige.png");
}

.card-data[data-faction="neutral"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_neutral.png");
}

.card-data[data-faction="monster"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_monster.png");
}

.card-data[data-faction="nilfgaard"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_nilfgaard.png");
}

.card-data[data-faction="syndicate"] .card_asset-banner {
  background-image: url("@/assets/card/art/preview/banner/default_syndicate.png");
}

.card-data[data-faction="skellige"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_skellige.png");
}

.card-data[data-faction="nilfgaard"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_nilfgaard.png");
}

.card-data[data-faction="syndicate"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_syndicate.png");
}

.card-data[data-faction="monster"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_monster.png");
}

.card-data[data-faction="scoiatael"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_scoiatael.png");
}

.card-data[data-faction="neutral"] .card_asset-provision-bg {
  background-image: url("@/assets/card/art/preview/banner/provision_neutral.png");
}

div[class*="card_asset"] {
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}

/* 定死大小 */
.card-data[data-res="small"] .card-image-wrap,
.card-data[data-res="small"] img {
  /* width: 249px;
  height: 357px; */
  width: 24.5px;
  height: 35px;
}

/* 定死大小 */
.card-data[data-res="medium"] .card-image-wrap,
.card-data[data-res="medium"] img {
  width: 49px;
  height: 70px;
  background-size: auto;
}

/* 定死大小 */
.card-data[data-res="larger"] .card-image-wrap,
.card-data[data-res="larger"] img {
  width: 98.2px;
  height: 140px;
}


.card-image-wrap,
.card-relation-image-wrap {
  position: relative;
}
</style>
