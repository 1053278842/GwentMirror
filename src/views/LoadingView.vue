<template>
  <div id="app">
  <div ref="word" class="word">LOADING...</div>
  <div class="overlay"> </div>
  </div>
</template>


<style scoped>
#app {
  height: 100%;
}

#app {
  background: radial-gradient(#2229227d, #000500b0);
    font-family: 'Source Code Pro', monospace;
    font-weight: 400;
    overflow: hidden;
    padding: 30px 0 0 30px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.word {
  bottom: 0;
  color: #fff;
  font-size: 2.5em;
  height: 2.5em;
  left: 0;
  line-height: 2.5em;
  margin: auto;
  right: 0;
  position: absolute;
  text-shadow: 0 0 10px rgba(50, 255, 50, 0.5), 0 0 5px rgba(100, 255, 100, 0.5);
  top: 0
}

.word span {
  display: inline-block;
  transform: translateX(100%) scale(0.9);
  transition: transform 500ms;
}

.word .done {
  color: #6f6;
  transform: translateX(0) scale(1);
}

.overlay {
  background-image: linear-gradient(transparent 0%, rgba(10, 16, 10, 0.5) 50%);
  background-size: 1000px 2px;
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

class Ticker {
  private letters: HTMLElement[];
  private letterCount: number;
  private letterCurrent: number = 0;
  private cycleCount: number = 5;
  private cycleCurrent: number = 0;
  private chars: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ,._'.split('');
  private charsCount: number = this.chars.length;
  private done: boolean = false;

  constructor(elem: HTMLElement) {
    this.lettering(elem);
    this.letters = Array.from(elem.querySelectorAll('span'));
    this.letterCount = this.letters.length;
    this.letters.forEach(letter => {
      letter.setAttribute('data-orig', letter.textContent!);
      letter.textContent = '-';
    });
  }

  private lettering(elem: HTMLElement): void {
    elem.innerHTML = elem.textContent!.replace(/\S/g, "<span>$&</span>");
  }

  private getChar(): string {
    return this.chars[Math.floor(Math.random() * this.charsCount)];
  }

  public reset(): void {
    this.done = false;
    this.cycleCurrent = 0;
    this.letterCurrent = 0;
    this.letters.forEach(letter => {
      letter.textContent = letter.getAttribute('data-orig')!;
      letter.classList.remove('done');
    });
    this.loop();
  }

  private loop(): void {
    this.letters.forEach((elem, index) => {
      if (index >= this.letterCurrent) {
        if (elem.textContent !== ' ') {
          elem.textContent = this.getChar();
          elem.style.opacity = `${Math.random()}`;
        }
      }
    });

    if (this.cycleCurrent < this.cycleCount) {
      this.cycleCurrent++;
    } else if (this.letterCurrent < this.letterCount) {
      const currLetter = this.letters[this.letterCurrent];
      this.cycleCurrent = 0;
      currLetter.textContent = currLetter.getAttribute('data-orig')!;
      currLetter.style.opacity = '1';
      currLetter.classList.add('done');
      this.letterCurrent++;
    } else {
      this.done = true;
    }

    if (!this.done) {
      requestAnimationFrame(() => {
        this.loop();
      });
    } else {
      setTimeout(() => {
        this.reset();
      }, 650);
    }
  }
}

const word = ref<HTMLElement | null>(null);


onMounted(() => {
  if(word.value){
    const ticker = new Ticker(word.value);
    ticker.reset();
  }
});



</script>
