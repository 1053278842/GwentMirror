export type Card = {
    res: string
    
    id: number
    power: number
    armor: string
    provision: number
    faction: string
    color: string
    type: string
    rarity: string
    
    
    imgUrl: string
    
    name: string
    tooltip: string
    categories: string
    fluff: string

    verticalDir:string
    horizontalDir:string

    cardExtInfo: CardExtInfo
}
export type CardExtInfo = {
    repeat: boolean
    order:number
    status:string
}


