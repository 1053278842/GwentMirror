<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
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
            <CardView :card="card" />
        </div>
    </div>
</template>

<style scoped>
#PositionContainer {
    position: absolute;
    top: 0;
    left: 0;
    transition: ease;
}
</style>

