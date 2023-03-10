import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCardEnumStore = defineStore('CardEnum', () => {
    const BorderColorEnum = ref({ Bronze: 'bronze', Gold: 'gold' });
    const CardTypeEnum = ref({ Artifact: 'artifact', Special: 'special', Stratagem: 'stratagem', Unit: 'unit' });
    const RarityEnum = ref({ Legendary: 'legendary', Epic: 'epic', Rare: 'rare', Common: 'common' });
    const FactionEnum = ref({ Northern_Realms: 'northern_realms', Skellige: 'skellige', Nilfgaard: 'nilfgaard', Syndicate: 'syndicate', Monster: 'monster', Scoiatael: 'scoiatael', Neutral: 'neutral' })
    const BorderStyleEnum = ref({ Normal: 'normal', Selected: 'selected', Hover: 'hover'})
    return { BorderColorEnum, CardTypeEnum, RarityEnum, FactionEnum,BorderStyleEnum }
})