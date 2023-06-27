<template>
<div id="first-div">悬停此处</div>
<div id="second-div"><span></span></div>
</template>


<style>
#first-div:hover + #second-div span {
  visibility: visible;
  opacity: 1;
}

#second-div span {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
</style>

<script lang="ts">
function showText(text, element, delay) {
  var i = 0;
  setTimeout(function() {
    var timer = setInterval(function() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
  }, delay);
}

var secondDivSpan = document.querySelector("#second-div span");
var textToShow = "这是要显示的文本。";
showText(textToShow, secondDivSpan, 100);
</script>
