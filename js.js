var Musiclist = []
var currentIndex = 0
var clock
var audio = new Audio()
audio.autoplay = true
var musicListContainer = document.querySelector('.musicbox .list')

getMusiclist(function (list) {
  Musiclist = list
  generateList(list)
  loadMusic(list[currentIndex])
})

audio.ontimeupdate = function () {
  console.log(this, this.currentTime)
  $('.musicbox .progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
  var min = Math.floor(this.currentTime / 60)
  var sec = Math.floor(this.currentTime % 60) + ''
  sec = sec.length === 2 ? sec : '0' + sec
  $('.musicbox .time').innerText = min + ':' + sec
}


$('.musicbox .play').onclick = function () {
  if (audio.paused) {
    audio.play()
    this.querySelector('.fa').classList.remove('fa-play-circle')
    this.querySelector('.fa').classList.add('fa-pause-circle')
  } else {
    audio.pause()
    this.querySelector('.fa').classList.add('fa-play-circle')
    this.querySelector('.fa').classList.remove('fa-pause-circle')
  }
}

$('.musicbox .forward').onclick = function () {
  currentIndex = (++currentIndex) % Musiclist.length
  console.log(currentIndex)
  loadMusic(Musiclist[currentIndex])
}


$('.musicbox .back').onclick = function () {
  currentIndex = (Musiclist.length + (--currentIndex)) % Musiclist.length
  console.log(currentIndex)
  loadMusic(Musiclist[currentIndex])
}
$('.musicbox .bar').onclick = function (e) {
  console.log(e)
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  console.log(percent)
  audio.currentTime = audio.duration * percent
}
audio.onended = function () {
  currentIndex = (++currentIndex) % Musiclist.length
  loadMusic(Musiclist[currentIndex])
}

function $(selector) {
  return document.querySelector(selector)
}

function getMusiclist(callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/music/music.json', true)
  xhr.onload = function () {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      callback(JSON.parse(this.responseText))
    } else {
      console.log('获取数据失败')
    }
  }
  xhr.onerror = function () {
    console.log('网络异常')
  }
  xhr.send()
}

function loadMusic(musicObj) {
  console.log('begin play', musicObj)
  $('.musicbox .title').innerText = musicObj.title
  $('.musicbox .auther').innerText = musicObj.auther
  $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
  audio.src = musicObj.src
  for (var i = 0; i < musicListContainer.children.length; i++) {
    musicListContainer.children[i].classList.remove('playing')
  }
  musicListContainer.children[currentIndex].classList.add('playing')
}

function generateList(list) {
  var container = document.createDocumentFragment()
  list.forEach(function (musicObj) {
    var node = document.createElement('li')
    node.innerText = musicObj.title + '-' + musicObj.auther
    console.log(node)
    container.appendChild(node)
  })
  musicListContainer.appendChild(container)
}


musicListContainer.onclick = function(e){
  if(e.target.tagName.toLowerCase() === 'li'){
    for(var i = 0; i < this.children.length; i++){
      if(this.children[i] === e.target){
        currentIndex = i
      }
    }
    console.log(currentIndex)
    loadMusic(Musiclist[currentIndex])
  }
}
