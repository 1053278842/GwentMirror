<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
import type { Card } from '@/types/Card'
import { useCardEnumStore } from '@/stores/CardEnum'

const CardEnumStore = useCardEnumStore()
const BorderColor = CardEnumStore.BorderColorEnum
const Rarity = CardEnumStore.RarityEnum
const Faction = CardEnumStore.FactionEnum
const CardType = CardEnumStore.CardTypeEnum
const props = defineProps({
  card: {
    type: Object as () => Card,
    required: true
  },
});
// const {card} = toRefs(props);
</script>

<template>
  <div id="card-listing">
    <div class="card-wrap card-data" data-res="medium" :data-id=card.id data-artid="3817j" :data-power=card.power
      :data-armor=card.armor :data-provision=card.provision :data-faction=card.faction data-set="cursed toad"
      :data-color=card.color :data-type=card.type :data-rarity=card.rarity>

      <!-- <div class="card-info-wrap">
          <div class="card-head">
            <div class="card-name"><a href="https://gwent.one/cn/card/203088">{{ card.name }}</a></div>
            <div class="card-category">{{ card.categories }}</div>
          </div>
          <div class="card-body">
            <div class="card-body-ability"><span class="keyword doomed">佚亡</span><br>
              <span class="keyword deploy">部署：</span>若己方起始牌组有至少 25 个单位，则<span class="keyword create">创造</span> 1
              个诅咒来代替己方领袖能力，随后<span class="keyword create">创造</span> 1 个祝福<span class="keyword infused">灌注</span>己方领袖能力。
              <br>
            </div>
          </div>
        </div> -->

      <div class="card-art-wrap ">
        <a href="https://gwent.one/cn/card/202793">
          <div class="card-image-wrap">
            <!-- "'@\assets\card\art\preview\big\'+card.id+'.jpg'" -->
            <div class="card_asset-img">
              <img loading="lazy" :src="card.imgUrl">

            </div>
            <div class="card_asset-border"></div>

            <div class="card_asset-armor-icon" v-if="card.armor != '0'">
              <div class="card_asset-armor"></div>
            </div>
            <div class="card_asset-provision-icon" v-if="card.type != CardType.Stratagem"></div>
            <div class="card_asset-provision-bg" v-if="card.type != CardType.Stratagem">
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
card-art-wrap {
  width: 80px;

}

.card-data[data-res=medium][data-armor="1"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_01.png");
}

.card-data[data-res=medium][data-armor="2"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_02.png");
}

.card-data[data-res=medium][data-armor="3"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_03.png");
}

.card-data[data-res=medium][data-armor="4"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_04.png");
}

.card-data[data-res=medium][data-armor="5"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_05.png");
}

.card-data[data-res=medium][data-armor="6"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_06.png");
}

.card-data[data-res=medium][data-armor="10"] .card_asset-armor {
  background-image: url("/src/assets/card/art/preview/number/armor_10.png");
}

.card-data[data-res=medium] .card_asset-armor-icon {
  background-image: url("/src/assets/card/art/preview/other/trinket_armor.png");
}

.card-data[data-res=medium] .card_asset-provision-icon {
  background-image: url("/src/assets/card/art/preview/banner/provision_icon.png");
}


.card-data[data-res=medium][data-power="1"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_01.png");
}

.card-data[data-res=medium][data-power="2"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_02.png");
}

.card-data[data-res=medium][data-power="3"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_03.png");
}

.card-data[data-res=medium][data-power="4"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_04.png");
}

.card-data[data-res=medium][data-power="5"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_05.png");
}

.card-data[data-res=medium][data-power="6"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_06.png");
}

.card-data[data-res=medium][data-power="7"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_07.png");
}

.card-data[data-res=medium][data-power="8"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_08.png");
}

.card-data[data-res=medium][data-power="9"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_09.png");
}

.card-data[data-res=medium][data-power="10"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_10.png");
}

.card-data[data-res=medium][data-power="11"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_11.png");
}

.card-data[data-res=medium][data-power="12"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_12.png");
}

.card-data[data-res=medium][data-power="15"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_15.png");
}

.card-data[data-res=medium][data-power="18"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/power_18.png");
}

/* 边框 */
.card-data[data-res=medium][data-color=bronze] .card_asset-border {
  background-image: url("/src/assets/card/art/preview/other/border_bronze.png");
}

.card-data[data-res=medium][data-color=gold] .card_asset-border {
  background-image: url("/src/assets/card/art/preview/other/border_gold.png");
}

/* 数字 */
.card-data[data-res=medium][data-provision="1"] .card_asset-power {
  background-image: url("/src/assets/card/art/preview/number/provision_01.png");
}

.card-data[data-res=medium][data-provision="2"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_02.png");
}

.card-data[data-res=medium][data-provision="3"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_03.png");
}

.card-data[data-res=medium][data-provision="4"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_04.png");
}

.card-data[data-res=medium][data-provision="5"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_05.png");
}

.card-data[data-res=medium][data-provision="6"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_06.png");
}

.card-data[data-res=medium][data-provision="7"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_07.png");
}

.card-data[data-res=medium][data-provision="8"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_08.png");
}

.card-data[data-res=medium][data-provision="9"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_09.png");
}

.card-data[data-res=medium][data-provision="10"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_10.png");
}

.card-data[data-res=medium][data-provision="11"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_11.png");
}

.card-data[data-res=medium][data-provision="12"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_12.png");
}

.card-data[data-res=medium][data-provision="13"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_13.png");
}

.card-data[data-res=medium][data-provision="14"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_14.png");
}

.card-data[data-res=medium][data-provision="15"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_15.png");
}

.card-data[data-res=medium][data-provision="16"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_16.png");
}

.card-data[data-res=medium][data-provision="17"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_17.png");
}

.card-data[data-res=medium][data-provision="18"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_18.png");
}

.card-data[data-res=medium][data-provision="19"] .card_asset-provision {
  background-image: url("/src/assets/card/art/preview/number/provision_19.png");
}

/* rarity */
.card-data[data-res=medium][data-rarity=common] .card_asset-rarity {
  background-image: url("src/assets/card/art/preview/other/rarity_common.png");
}

.card-data[data-res=medium][data-rarity=rare] .card_asset-rarity {
  background-image: url("src/assets/card/art/preview/other/rarity_rare.png");
}

.card-data[data-res=medium][data-rarity=epic] .card_asset-rarity {
  background-image: url("src/assets/card/art/preview/other/rarity_epic.png");
}

.card-data[data-res=medium][data-rarity=legendary] .card_asset-rarity {
  background-image: url("src/assets/card/art/preview/other/rarity_legendary.png");
}


/* 装饰品 */
.card-data[data-res=medium][data-type=special] .card_asset-trinket {
  background-image: url("src/assets/card/art/preview/other/trinket_special.png");
}

.card-data[data-res=medium][data-type=stratagem] .card_asset-trinket {
  background-image: url("src/assets/card/art/preview/other/trinket_stratagem.png");
}

.card-data[data-res=medium][data-type=artifact] .card_asset-trinket {
  background-image: url("src/assets/card/art/preview/other/trinket_artifact.png");
}

.card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_nilfgaard.png");

}

.card-data[data-res=medium][data-faction=scoiatael] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_scoiatael.png");
}

.card-data[data-res=medium][data-faction=skellige] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_skellige.png");
}

.card-data[data-res=medium][data-faction=neutral] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_neutral.png");
}

.card-data[data-res=medium][data-faction=monster] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_monster.png");
}

.card-data[data-res=medium][data-faction=nilfgaard] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_nilfgaard.png");
}

.card-data[data-res=medium][data-faction=syndicate] .card_asset-banner {
  background-image: url("src/assets/card/art/preview/banner/default_syndicate.png");
}


.card-data[data-res=medium][data-faction=skellige] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_skellige.png");
}

.card-data[data-res=medium][data-faction=nilfgarrd] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_nilfgaard.png");
}

.card-data[data-res=medium][data-faction=syndicate] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_syndicate.png");
}

.card-data[data-res=medium][data-faction=monster] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_monster.png");
}

.card-data[data-res=medium][data-faction=scoiatael] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_scoiatael.png");
}

.card-data[data-res=medium][data-faction=neutral] .card_asset-provision-bg {
  background-image: url("src/assets/card/art/preview/banner/provision_neutral.png");
}

div[class*=card_asset] {
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}

/* 定死大小 */
.card-data[data-res=medium] .card-image-wrap,
.card-data[data-res=medium] img {
  /* width: 249px;
  height: 357px; */
  width: 49.1px;
  height: 70px;
}

.db-small .card-image-wrap {
  /* width: 150px !important;
  height: 215px !important; */
  width: 30px !important;
  height: 42px !important;
}

.card-image-wrap,
.card-relation-image-wrap {
  position: relative;
}
</style>
