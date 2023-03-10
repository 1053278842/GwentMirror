<template>
    about
</template>

<script setup lang="ts">
import {usrNavStatusStore} from '@/stores/status'
const useNavStatus = usrNavStatusStore()
useNavStatus.openNav()
</script>

<style>

</style>
