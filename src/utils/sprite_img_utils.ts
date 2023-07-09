import spriteData from "@/assets/sprite_map.json"
import { ref, computed } from 'vue';
import type { StyleValue } from 'vue';
import type { CSSProperties  } from 'vue';
type SpriteData = {
    x: number,
    y: number,
    spriteName: string,
};


export const spriteUtils = (cardId:number,ImgSizeEnum:string): StyleValue => {
  if(!cardId){
    cardId = 0
  }
  let position = spriteData[cardId.toString() as keyof typeof spriteData];
  const sizeMap = new Map();
  // 正常显示
  sizeMap.set('low', { width: '49', height: '70' });
  // 详情显示
  sizeMap.set('larger', { width: '98.2', height: '140' });
  sizeMap.set('small', { width: '24.5', height: '35' });
  if (!position) {
    // 如果卡片不在文档中，返回默认的位置信息
    position = {
      x: 0,
      y: 0,
      spriteName: 'spritesheet_1' // 默认的雪碧图名称
    };
  }
  let width = sizeMap.get(ImgSizeEnum).width;
  let height = sizeMap.get(ImgSizeEnum).height;
  const { x, y, spriteName } = position;
  const backgroundPosition = `-${x*(width/150)}px -${y*(height/215)}px`;
  const backgroundImage = `url('src/assets/spritesheets/${spriteName}.jpg')`;
  const backgroundSize = `${width*10}px ${height*10}px`;
  const widthImg = `${width}px`;
  const heightImg = `${height}px`;
  const style = {
    backgroundImage,
    backgroundPosition,
    backgroundSize,
    width: widthImg,
    height: heightImg,
  };

  return {
    ...style
  };
};