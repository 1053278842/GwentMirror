<script setup lang="ts">
import type { Card } from '@/types/Card'
import CardView from './CardView.vue';

const props = defineProps({
    card: {
        type: Object as () => Card,
        required: true
    }

});
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

