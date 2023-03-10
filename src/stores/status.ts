import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usrNavStatusStore = defineStore('navStatus', () => {
    const showNav = ref(true)
    
    console.log("asd")
    function closeNav(){
        showNav.value = false
    }
    function openNav(){
        showNav.value = true
    }

    return { showNav, closeNav, openNav }
})