$(() => {
  let prevTime = clacRemainingTime();
  showRemainingTime(prevTime)

  setInterval(e => {
    const currentTime = clacRemainingTime();
    if(prevTime != currentTime){
      prevTime = currentTime
      showRemainingTime(currentTime)
    }
  }, 600)
})

function showRemainingTime(time){
  let $result = $("#recs-todo-remaining-time")
  if($result.length === 0){
    $result = $(`<div id="recs-todo-remaining-time" />`).prependTo('body')
  }

  // pullリクエストのページじゃないときは表示を削除
  if(time === undefined){
    $result.remove();
    return;
  }

  $result.empty()

  $ul = $('<ul></ul>');

  [...Array(6).keys()].map(n => n += 2).forEach(num => {
    $ul.append($(`<li>${num}h: ${round(time/num, 2)}日</li>`))
  })


  
  $result.append($(`<p class="title">残り${time}時間</p>`)).append($ul)
}

/**
 * 残り時間を計算します。
 * プルリクエストのページじゃないときはundefinedを返す。
 */
function clacRemainingTime(){
  if(!location.pathname.match(/\/pull\/[0-9]+$/)){
    return undefined
  }

  return [...document.querySelectorAll('.task-list-item')]
    .filter(elem => !elem.querySelector('input[type=checkbox]').checked)
    .map(elem => elem.innerText.match(/\[([0-9]+?)\]/))
    .filter(matches => matches)
    .map(matches => parseInt(matches[1], 10))
    .reduce((val, sum) => sum += val, 0);
}

function round(val, precision){
  const digit = Math.pow(10, precision);
  return Math.round(val * digit) / digit;
}