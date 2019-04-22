const initial = {total: 0, remaining: 0}
$(() => {
  let prevTime = clacRemainingTime();
  showRemainingTime(prevTime)

  setInterval(e => {
    const currentTime = clacRemainingTime();
    if(!prevTime || !currentTime || Object.keys(initial).some(key => prevTime[key] != currentTime[key])){
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
    $ul.append($(`<li>${num}h: ${round(time.remaining/num, 2)}日</li>`))
  })

  const percent = time.total !== 0 ? round(time.remaining / time.total * 100, 2) : 0
  $result.append($(`<p class="title">残り${time.remaining}/${time.total}時間 - ${percent}%</p>`))

  var promise = Promise.resolve()
  if($('.labels [title=outsource]').length > 0){
    promise = promise.then(() => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          outsourceMinAmount: window.GithubTodoConstans.outsourceMinAmount,
          outsourceMaxAmount: window.GithubTodoConstans.outsourceMaxAmount
        }, function(items) {
          $result.append(
            $(`<p class="price">${(time.total * items.outsourceMinAmount).toLocaleString()}円〜${(time.total * items.outsourceMaxAmount).toLocaleString()}円</p>`)
          )

          resolve()
        })
      })
    })
  }

  promise.then(() => $result.append($ul))
}

/**
 * 残り時間を計算します。
 * プルリクエストのページじゃないときはundefinedを返す。
 */
function clacRemainingTime(){
  if(!location.pathname.match(/\/(pull|issues)\/[0-9]+$/)){
    return undefined
  }

  const result = calcFor([...document.querySelectorAll('.task-list-item')])
  // blockquoteを引く
  const blockquote = calcFor([...document.querySelectorAll('blockquote .task-list-item')])

  return {
    total: result.total - blockquote.total,
    remaining: result.remaining - blockquote.remaining
  }
}

function calcFor(elements){
  return elements.map(elem => {
    return {
      matches: elem.innerText.match(/\[([0-9.]+?)\]/),
      checked: elem.querySelector('input[type=checkbox]').checked
    }
  })
  .filter(data => data.matches)
  .map(data => {
    return {
      time: parseFloat(data.matches[1], 10),
      checked: data.checked
    }
  })
  .reduce((sum, data) => {
    sum.total += data.time
    if(!data.checked){
      sum.remaining += data.time
    }
    return sum
  }, {...initial});
}

function round(val, precision){
  const digit = Math.pow(10, precision);
  return Math.round(val * digit) / digit;
}