import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usrNavStatusStore = defineStore('navStatus', () => {
    const showNav = ref(true)
    
    function closeNav(){
        showNav.value = false
    }
    function openNav(){
        showNav.value = true
    }

    return { showNav, closeNav, openNav }
})

export const usrSearchCardBarStatusStore = defineStore('searchCardBarStatus', () => {
    const showed = ref(true)
    
    function close(){
        showed.value = false
    }
    function open(){
        showed.value = true
    }

    return { showed, close, open }
})