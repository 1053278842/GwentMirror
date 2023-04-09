
<template>
    <div id="body-bg" ref="scrollContainer">
        <div id="page">
            <div id="PageContainer">
                <div id="PageContainerInner">
                    <!-- 卡牌搜索框 -->
                    <form :model="form"  id="SearchFormContainer" @submit.prevent>
                        <CardSearchView ></CardSearchView>
                    </form>
                    <br>
                    <!-- 卡组搜索框 -->
                    <form :model="form" @submit.prevent="fetchData" id="SearchFormContainer">
                        <el-icon size="20" color="#409EFC" class="is-loading" id="SearchIcon">
                            <Aim />
                        </el-icon>
                        <input v-model="form.ids" placeholder="Please input card ids!" @change="SearchOnChange">
                    </form>
                    <hr>
                    <!-- 搜索结果 -->
                    <div id="DecksListResult">
                        <span>
                            <b>-> {{ decks.length }} </b>
                            ……风暴正在登录.
                        </span>
                    </div>
                    <!-- 预览列表 -->
                    <div id="DeckListGridContainer" ref="deckListContainer" >
                        <div id="DeckListGridContainerInner">
                            <div class="DecksListRowContainer" v-for="(deck, index) in decks" :key="index">
                                <a class="DeckRowTopLinkContainer">
                                    <!-- 种族分布bar -->
                                    <div height="80" class="DeckRowCompositionRatioBar">
                                        <div v-for="(value, key) in deck.factionRatio" class="DeckRowFactionBar"
                                            :data-faction="value[0]" :style="{ width: value[1] }">
                                        </div>
                                    </div>
                                    <div class="DeckRow_Top">
                                        <div class="DeckRow_ArtContainer">
                                            <div class="DeckRow_ArtContainerInner">
                                                <div class="DeckRow_ArtContainerList"
                                                    v-for="(card, key) in deck.displayCards" :key="key">
                                                    <div class="DeckRow_ArtImgContainer"
                                                        style="width: 358px; height: 98px; margin-left: -21px; margin-right: 10px; clip-path: polygon(21px 0px, 358px 0px, 337px 98px, 0px 98px); opacity: 0.4;">
                                                        <img
                                                            :src="'/src/assets/card/art/preview/small/' + card.id + '.jpg'">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="DeckRow_ArtFade"></div>
                                        <div class="DeckRow_ArtFade_left"></div>
                                        <div class="DeckRow_Left">
                                            <div class="DeckIcoContainer">
                                                <img
                                                    :src="'/src/assets/card/art/preview/factor/ico/' + deck.displayLeaderCid + '.png'" />
                                            </div>
                                            <div class="DeckRowInfoContainer">
                                                <span>【{{ deck.deckName }}】</span>
                                            </div>
                                            <div class="DeckRowStatusContainer">
                                                <div class="StatsContainer">
                                                    <div class="LabelStat">
                                                        <label>胜率</label>
                                                        <span>88.8%</span>
                                                    </div>
                                                    <div class="LabelStat">
                                                        <label>时间</label>
                                                        <span class="span_color_white">{{ formatDate(deck.time.toString())
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
                                <div class="DeckBgContainer">
                                    <!-- <div class="DeckBgContainer"> -->
                                    <div class="DeckRowCardContainer">
                                        <div class="DeckRowCardContainerInner">
                                            <!-- 分类栏目 -->
                                            <div class="CardIconColumnContainer"
                                                v-for="(map, type) in deck.groupCardsByType" :key="type"
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
                                                    style="display: flex; justify-content: space-between;">
                                                    <template v-for="(card, cardIndex) in map[1].cards">
                                                        <template
                                                            v-if="cardIndex === 0 || (card.id != map[1].cards[cardIndex - 1].id)">
                                                            <div style="flex:1 1 auto ;">
                                                                <div class="ColumnGroupCardIcon"
                                                                    :class="{ RepeatCardColumn: cardIndex < map[1].cards.length - 1 ? (card.id == map[1].cards[cardIndex + 1].id) : true }"
                                                                    :data-id="card.id" style="position: relative;"
                                                                    @click="selectCard(card)">
                                                                    <CardView :card="card"
                                                                        :data-status="card.cardExtInfo.status"
                                                                        class="CardView" />
                                                                    <CardView :card="card" class="CardView CardIconRepeat"
                                                                        v-if="cardIndex < map[1].cards.length - 1 ? (card.id == map[1].cards[cardIndex + 1].id) : false" />
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </template>

                                                    <!-- 空元素 -->
                                                    <div v-for="i in (map[1].cards.length)" style="flex: 1 1 auto;">
                                                        <div class="hh" style="width: 50.1px;"></div>
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
                                                <span>一览 ({{ deck.allCard.length }})</span>
                                            </div>
                                            <!-- 卡牌图标列表 -->
                                            <div class="ColumnGroupCardIcons">
                                                <div class="ColumnGroupCardIcon" v-for="(card, index) in deck.allCard"
                                                    :key="index" @click="selectCard(card)">
                                                    <CardView :card="card" class="CardView"
                                                        :data-status="card.cardExtInfo.status" />
                                                </div>
                                            </div>
                                        </div>
                                        <!-- </div> -->
                                    </div>
                                    <!-- 背景图片 -->
                                    <div class="FactorCardBg"
                                        :style="{ backgroundImage: 'url(/src/assets/card/art/preview/small/' + deck.displayLeaderCid + '.jpg)' }">
                                        <div class="horizontalFade"></div>
                                        <div class="VerticalTopFade"></div>
                                        <div class="VerticalBottomFade"></div>
                                    </div>
                                    <!-- 背景图片 -->
                                    <div class="FactorDeckBg" :data-faction="deck.factionId"></div>
                                </div>
                                <!--  -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div ref="loadingMore" style="height: 100px; text-align: center;">
            <div v-if="!isAllLoaded" style="font-size: 24px;">
                <el-icon class="is-loading primary">
                    <ToiletPaper />
                </el-icon>
            </div>
        </div>
    </div>
    <!-- 卡牌详细信息1 -->
    <CardInfo :card="activeCard.cardInfo" :size="'small'" id="CardInfo"/>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watchEffect } from 'vue'
import { getAllDeck, getDecksByIds } from '@/api/gwentmirror'
import { useAllCardStore } from '@/stores/AllCards'
import { useCardEnumStore } from '@/stores/CardEnum'
import type { Card } from '@/types/Card'
import { usrNavStatusStore,usrSearchCardBarStatusStore } from '@/stores/status'
import CardView from './CardView.vue';
import CardSearchView from './CardSearchView.vue';
import CardInfo from './CardInfo.vue';
import { group } from 'console'
import { format } from 'path'
import { Edit } from '@element-plus/icons-vue'



// usrNavStatusStore().closeNav()
const allCardEnumStore = useCardEnumStore()
const allCardStore = useAllCardStore()
const allCardDataMap = allCardStore.cardDataMap
allCardStore.initCardData()

// sortIds第一张永远是技能卡
type SearchParam = {
    ids: string
    page: number
}
type Deck = {
    deckAuthor: string;
    deckName: string;
    sortCtIds: number[];
    time: number;
    allCard: Card[];
    groupCardsByType: Map<string, any>;
    factionRatio: Map<string, string>;
    // 展示的重要卡牌
    displayCards: Card[];
    displayLeaderCid: number;
    displayStratagemCid: number;
    deckWebId: number;
    fromPlayerId: number;
    factionId: number;
};

const isAllLoaded = ref(true);
const scrollContainer = ref<HTMLElement | null>(null);
const deckListContainer = ref<HTMLElement | null>(null);
const loadingMore = ref<HTMLElement | null>(null);
const cardInfoContainer = ref<HTMLElement | null>(null);
const isClickBody = ref(false);


const activeCard = reactive({
    cardInfo: {} as Card
});
// 输出
const decks = reactive([] as Deck[])
// 输入
var form = reactive({} as SearchParam)
form.ids = "152309"
form.page = 1

const fetchData = async () => {
    let param = {
        ids: form.ids,
        page: form.page
    }
    console.log("异步发送请求!列表数据请求中！当前page:" + form.page)
    // 发送 axios 请求获取数据
    getDecksByIds(param).then((res: { data: string | any[]; }) => {
        const data = res.data
        // decks.length = 0
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
                factionId: deckJson.factionId
            }
            deck.allCard = computedAllCard(deck);
            deck.groupCardsByType = computedGroupCardsByType(deck);
            deck.factionRatio = computedFactionRatio(deck);
            // 应该由后台传来，现在的规则是：p值最高的3~4个
            deck.displayCards = [deck.allCard[1], deck.allCard[2], deck.allCard[3], deck.allCard[4]];
            decks.push(deck)
        }
        isAllLoaded.value = true;
    })
};

const computedAllCard = (deck: Deck) => {
    let cards: Card[] = []
    deck.sortCtIds.forEach(ids => {
        const card: Card = getCardById(ids) as Card;
        if (card !== undefined) {
            // 计算选择的样式效果
            if (card.id == parseInt(form.ids)) {
                card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Selected
            }
            cards.push(card)
        }
    });
    cards.sort((a, b) =>
        ((b.provision > 0 ? b.provision : 20) * 1000000 - b.id) - ((a.provision > 0 ? a.provision : 20) * 1000000 - a.id)
    )
    return cards
}

const computedFactionRatio = (deck: Deck) => {
    const countMap = new Map<string, number>()
    var factionName = ""
    switch (deck.factionId) {
        case 2:
            factionName = allCardEnumStore.FactionEnum.Monster
            break
        case 4:
            factionName = allCardEnumStore.FactionEnum.Nilfgaard
            break
        case 8:
            factionName = allCardEnumStore.FactionEnum.Northern_Realms
            break
        case 16:
            factionName = allCardEnumStore.FactionEnum.Scoiatael
            break
        case 32:
            factionName = allCardEnumStore.FactionEnum.Skellige
            break
        case 64:
            factionName = allCardEnumStore.FactionEnum.Syndicate
            break
    }
    countMap.set(factionName, 0)
    for (const cardItem of deck.allCard) {
        const faction = cardItem.faction!
        if (countMap.has(faction)) {
            countMap.set(faction, countMap.get(faction)! + 1)
        } else {
            countMap.set(faction, 1)
        }
    }
    // 计算比例
    const total = deck.allCard.length
    const ratioMap = new Map<string, string>()
    for (const [key, value] of countMap.entries()) {
        const ratio = ((value / total) * 100).toFixed(1)
        ratioMap.set(key, ratio + '%')
    }
    return ratioMap
}

const computedGroupCardsByType = (deck: Deck) => {
    var groupMap = new Map<string, { cards: Card[], totalCount: number }>();
    groupMap.set("谋略", { cards: [] as Card[], totalCount: 0 })
    groupMap.set("单位", { cards: [] as Card[], totalCount: 0 })
    groupMap.set("特殊", { cards: [] as Card[], totalCount: 0 })
    groupMap.set("神器", { cards: [] as Card[], totalCount: 0 })

    for (let index = 0; index < deck.allCard.length; index++) {
        const card: Card = deck.allCard[index];
        if (card?.type == "stratagem") {
            let typeGroup = groupMap.get("谋略")!;
            typeGroup.cards.push(card)
            typeGroup.totalCount = typeGroup.totalCount + 1
        }
        if (card?.type == "unit") {
            let typeGroup = groupMap.get("单位")!;
            typeGroup.cards.push(card)
            typeGroup.totalCount = typeGroup.totalCount + 1
        }
        if (card?.type == "special") {
            let typeGroup = groupMap.get("特殊")!;
            typeGroup.cards.push(card)
            typeGroup.totalCount = typeGroup.totalCount + 1
        }
        if (card?.type == "artifact") {
            let typeGroup = groupMap.get("神器")!;
            typeGroup.cards.push(card)
            typeGroup.totalCount = typeGroup.totalCount + 1
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
    return allCardStore.cardDataMap.get(cardId as number) as Card
}

const getCardByIdClone = (cardId: number) => {
    return allCardStore.cardDataMap.get(cardId as number) as Card
}

// 改变input且失去焦点后提交表单
const SearchOnChange = () => {
    if (!form.page) {
        form.page = 2
    }
    if (!form.ids || form.ids.length % 6 > 1) {
        form.ids = "152309"
    }
    // if (!form.ids || isNaN(parseFloat(form.ids)) || form.ids.length != 6) {
    //     form.ids = "152309"
    // }
    decks.length = 0
    // page: form.page
    fetchData()
}
// 格式化时间输出
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    return `${year}/${month}/${day}`;
}
//下拉自动加载
const loadMore = async () => {
    if (!scrollContainer.value || !loadingMore.value) {
        return;
    }
    if (!isAllLoaded.value) {
        return;
    }
    const containerRect = scrollContainer.value.getBoundingClientRect();
    const loadingRect = loadingMore.value.getBoundingClientRect();
    if (loadingRect.top - containerRect.bottom < 500) {
        try {
            form.page += 1
            isAllLoaded.value = false;
            fetchData()
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(() => {
    fetchData()
    scrollContainer.value?.addEventListener('scroll', loadMore)
    deckListContainer.value?.addEventListener('mouseover', handleCardMouseOver)
    // deckListContainer.value?.addEventListener('mouseout', outCard)
    document.body.addEventListener('click', ()=> usrSearchCardBarStatusStore().close())
    usrSearchCardBarStatusStore().close()
})

const handleCardMouseOver = (event: MouseEvent) => {
    var cid: number = getCardIdByXY(event.clientX, event.clientY)
    if (cid <= 0) {
        //消除信息框
        const movingDiv = document.querySelector('#PositionContainer');
        (movingDiv as HTMLElement).style.visibility = 'hidden';
    } else {
        //弹出信息框
        //填充信息框信息
        var card: Card = getCardById(cid) as Card;
        card = { ...card }
        card.res = "larger"
        activeCard.cardInfo = card;

        const movingDiv = document.querySelector('#PositionContainer');
        var underElement = getCardByXY(event.clientX, event.clientY)

        var cardArtElement = underElement;
        var cardInfoElement = movingDiv?.querySelector('.card-info-wrap');
        if (cardArtElement && cardInfoElement) {
            const artPosition = cardArtElement.getBoundingClientRect()
            const infoPosition = cardInfoElement.getBoundingClientRect()
            var Y = 0
            var X = artPosition.x - artPosition.width / 2;
            var screenHeight = window.innerHeight;
            var screenWidth = window.innerWidth;
            if (screenHeight > artPosition.top + artPosition.height + infoPosition.height + 30) {
                Y = artPosition.top + artPosition.height + 10;
                card.verticalDir = "under"
            } else {
                Y = artPosition.top - artPosition.height * 2 - 10;
                card.verticalDir = "above"
            }
            if (screenWidth < artPosition.x + artPosition.width + infoPosition.width + 30) {
                card.horizontalDir = "left"
            }
            (movingDiv as HTMLElement).style.visibility = 'visible';
            (movingDiv as HTMLElement).style.left = X + 'px';
            (movingDiv as HTMLElement).style.top = Y + 'px';
        }


    }

}

const getCardByXY = (x: number, y: number) => {
    var element = document.elementFromPoint(x, y);
    while (!element?.classList.contains("card-data")) {
        if (element == null) {
            break
        }
        element = element!.parentElement;
    }
    return element
}

const getCardIdByXY = (x: number, y: number) => {
    var element = document.elementFromPoint(x, y);
    while (!element?.classList.contains("card-data")) {
        if (element == null) {
            break
        }
        element = element!.parentElement;
    }
    if (element) {
        return parseInt((element as HTMLElement).dataset.id as string) || 0
    } else {
        return -1
    }
}

const selectCard = (card: Card) => {
    if (card.cardExtInfo.status == allCardEnumStore.BorderStyleEnum.Selected) {
        card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Normal;
        var ids = form.ids.split(',')
        ids.pop()
        form.ids = ids.join(',')
    } else {
        card.cardExtInfo.status = allCardEnumStore.BorderStyleEnum.Selected;
        form.ids += ("," + card.id)
    }

    // 刷新
    form.page = 1

    // decks.length = 0
    let i = 0
    while (i < decks.length) {
        let deck = decks[i]
        let count = 0
        let uniqueArr = [...new Set(deck.allCard)];
        uniqueArr.forEach(card => {
            count += card.cardExtInfo.status == allCardEnumStore.BorderStyleEnum.Selected ? 1 : 0;
        })
        if (count != form.ids.split(',').length) {

            console.log(deck.deckName)
            decks.splice(decks.indexOf(deck), 1)
        } else {
            i++
        }
    }
    decks.length = 0
    fetchData()
}

</script >
<style>
* {
    box-sizing: inherit;
}

#body-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    margin: 0px;
    background-color: rgb(38, 35, 33);
    font-family: "Open Sans", sans-serif;
    color: white;
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
    /* flex: 1 1 0px; */
    /* width: 100%; */
    max-width: 1300px;
}

#PageContainerInner {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 1500px;
    padding: 20px;
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
    color: rgba(0, 0, 0, .43);
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
    background-color: rgba(255, 255, 255, .20);
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
    background-color: rgba(25, 25, 25, .7);
    border-radius: 3px;
    min-height: 46px;
}

.DeckRow_ArtImgContainer {
    flex: 0 0 auto;
    transition: all 200ms linear 0s;
}

.DeckRow_ArtImgContainer img {
    object-fit: cover;
    width: 100%;
    height: 100%;
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
    margin-top: 20px;
    z-index: 0;
}

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
    /* background-image: url("/src/assets/other/FactionBg/neutral.png"); */
}

.DeckRowFactionBar[data-faction="skellige"] {
    /* background-image: url("/src/assets/other/FactionBg/skellige.png"); */
    background-color: #341a7a;
    opacity: .8;
}

.DeckRowFactionBar[data-faction="northern_realms"] {
    /* background-image: url("/src/assets/other/FactionBg/northern_realms.png"); */
    background-color: #184d8b;
    opacity: .8;
}

.DeckRowFactionBar[data-faction="nilfgaard"] {
    /* background-image: url("/src/assets/other/FactionBg/nilfgaard.png"); */
    background-color: #020100;
    opacity: .8;
}

.DeckRowFactionBar[data-faction="syndicate"] {
    /* background-image: url("/src/assets/other/FactionBg/syndicate.png"); */
    background-color: #d37a00;
    opacity: .8;
}

.DeckRowFactionBar[data-faction="monster"] {
    /* background-image: url("/src/assets/other/FactionBg/monster.png"); */
    background-color: #ab0e0e;
    opacity: .8;
}

.DeckRowFactionBar[data-faction="scoiatael"] {
    /* background-image: url("/src/assets/other/FactionBg/scoiatael.png"); */
    background-color: #2d7a2a;
    opacity: .8;
}

.FactorDeckBg[data-faction="2"] {
    background-image: url('/src/assets/card/art/preview/factor/monsters-bg.jpg');
}

.FactorDeckBg[data-faction="4"] {
    background-image: url('/src/assets/card/art/preview/factor/nilf-bg.jpg');
}

.FactorDeckBg[data-faction="8"] {
    background-image: url('/src/assets/card/art/preview/factor/northern-bg.jpg');
}

.FactorDeckBg[data-faction="16"] {
    background-image: url('/src/assets/card/art/preview/factor/scoia-bg.jpg');
}

.FactorDeckBg[data-faction="32"] {
    background-image: url('/src/assets/card/art/preview/factor/skellige-bg.jpg');
}

.FactorDeckBg[data-faction="64"] {
    background-image: url('/src/assets/card/art/preview/factor/syndicate-bg.jpg');
}

.DeckRow_Top {
    position: relative;
    overflow: hidden;
    display: flex;
    padding: 10px 20px;
    min-height: 100px;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.DeckRow_Top .DeckRow_ArtContainer {
    position: absolute;
    width: 70%;
    top: 0px;
    left: 0px;
    height: 100%;
    z-index: -1;
}

.DeckRow_ArtContainerInner {
    position: absolute;
    display: flex;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    background: rgb(34, 34, 34);
    z-index: -1;
    margin-top: -1px;
}


.DecksListRowContainer .DeckBgContainer {
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
    z-index: -1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 -15px;

}

.DecksListRowContainer .DeckBgContainer .FactorCardBg {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0px;
    -webkit-mask-image: -webkit-gradient(linear, left top, right top, color-stop(0, transparent), color-stop(5%, transparent), color-stop(25%, #000), color-stop(100%, #000));

}

.FactorCardBg .horizontalFade {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(98deg, rgb(38, 35, 33) 10%, hsl(0deg 0% 100% / 0%) 50%, rgb(38, 35, 33) 90%, rgb(38, 35, 33) 100%);
}

.FactorCardBg .VerticalTopFade {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgb(38, 35, 33) 10px, hsl(0deg 0% 100% / 0%) 60px, hsl(0deg 0% 100% / 0%) 80%, rgb(38, 35, 33) 100%);
}

.FactorCardBg .VerticalBottomFade {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, hsl(0deg 0% 100% / 0%) 60px, hsl(0deg 0% 100% / 0%) 80%, rgb(38, 35, 33) 100%);
}

.DeckRow_Top .DeckRow_ArtFade {
    position: absolute;
    z-index: -1;
    width: 10%;
    top: 0px;
    right: 0px;
    height: 100%;
    background: linear-gradient(to right, transparent 0px, rgba(16, 16, 16, .99) 80%);
}

.DeckRow_Top .DeckRow_ArtFade_left {
    position: absolute;
    z-index: -1;
    width: 10%;
    top: 0px;
    left: 0px;
    height: 100%;
    background: linear-gradient(to left, transparent 0px, rgba(16, 16, 16, .99) 80%);
}

.DeckRow_Top .DeckRow_Left {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
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

.OneRead .ColumnGroupCardIcon:hover,
.CardIconRepeat:hover {
    z-index: 9999999999 !important;
    flex: 2 1 auto;
}


.card_asset-border img,
.CardIconBorderInner img {
    height: 70px;
    width: 49.1px;
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
    margin-bottom: 6px
}

.CardIconRepeat img {}

.RepeatCardColumn {
    margin-right: 8px;
    margin-bottom: 4px
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
    background-image: url("/src/assets/other/TypeIcon/filter-type-unit.png");
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
</style>
