<script setup lang="ts">
import type { Card } from '@/types/Card'
import { onMounted } from 'vue';
import CardView from './CardView.vue';

const props = defineProps({
    card: {
        type: Object as () => Card,
        required: true
    }

});

onMounted(() => {
  preloadImages()
})

function preloadImages() {
  // 最先预加载图片边框，防止白边穿帮
  const img3 = new Image();
  const img4 = new Image();
  const img5 = new Image();
  img3.src = "src/assets/card/art/preview/factor/desktop-tooltip-bottom.png";
  img4.src = "src/assets/card/art/preview/factor/desktop-tooltop-center.jpg";
  img5.src = "src/assets/card/art/preview/factor/tooltip-top-neu.jpg";
}
</script>

<template>
    <div>
        <div id="PositionContainer"  >
            <CardView :card="card" :size="'larger'" :res="'larger'" />
        </div>
    </div>
</template>

<style scoped>
#PositionContainer {
    position: absolute;
    top: -99px;
    left: -99px;
    /* transition: ease; */
}
</style>

