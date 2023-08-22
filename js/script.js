// "use strict";
var player;

function loadYTAPIScript() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onError': onError,
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onError(event) {
  console.error('YouTube API error!', event);
}

function onPlayerReady(e) {
  listClickButtons();
}

var done = false;
function onPlayerStateChange(e) {
  var state = e.target.getPlayerState();
  var stateText = '';
  if (state === -1) {
    stateText = 'unstarted';
  } else if (state === YT.PlayerState.ENDED) {
    stateText = 'ended';
  } else if (state === YT.PlayerState.PLAYING) {
    stateText = 'playing';
  } else if (state === YT.PlayerState.PAUSED) {
    stateText = 'paused';
  } else if (state === YT.PlayerState.BUFFERING) {
    stateText = 'buffering';
  } else if (state === YT.PlayerState.CUED) {
    stateText = 'cued';
  }
  console.log('State text: ', stateText);

  // if (state === YT.PlayerState.PLAYING && !done) {
  //   setTimeout(() => {
  //     player.stopVideo();
  //   }, 54500); //54500
  //   done = true;
  // }
}

function onPlayerStateChange2(e) {
  var state = e.target.getPlayerState();
  var stateText = '';
  if (state === -1) {
    stateText = 'unstarted';
  } else if (state === YT.PlayerState.ENDED) {
    stateText = 'ended';
  } else if (state === YT.PlayerState.PLAYING) {
    stateText = 'playing';
  } else if (state === YT.PlayerState.PAUSED) {
    stateText = 'paused';
  } else if (state === YT.PlayerState.BUFFERING) {
    stateText = 'buffering';
  } else if (state === YT.PlayerState.CUED) {
    stateText = 'cued';
  }
  console.log('State text: ', stateText);
}

function listClickButtons() {
  var isPlayed = false;
  var playpauseBtn = document.getElementById('yt-playpause');
  var switcherInput = document.getElementById('switcher-input');

  playpauseBtn.addEventListener('click', (e) => {
    console.log('click')
    e.preventDefault();
    switcherInput.checked = !switcherInput.checked;

    setTimeout(() => {
      if (isPlayed === false) {
        player.playVideo();
        isPlayed = true;
      } else {
        player.pauseVideo();
        isPlayed = false;
      }
    }, 400)
  });
  playpauseBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    switcherInput.checked = !switcherInput.checked;

    setTimeout(() => {
      if (isPlayed === false) {
        player.playVideo();
        isPlayed = true;
      } else {
        player.pauseVideo();
        isPlayed = false;
      }
    }, 400)
  });
}



document.addEventListener('DOMContentLoaded', function () {
  loadYTAPIScript();
  //Variables
  var paginationPoints = document.querySelectorAll('.pagination'),
      parallaxItems = document.querySelectorAll('.parallaxed'),
      upperline = document.getElementById("upperline"),
      smlFir = document.querySelectorAll('.anm__sml'),
      smlSec = document.querySelectorAll('.anm__vsm'),
      rngRock = document.getElementById("rng__rock"),
      big = document.querySelectorAll('.anm__big'),
      mid = document.querySelectorAll('.anm__mid'),
      slider = document.getElementById("slider"),
      head = document.getElementById("header"),
      next = document.getElementById("next"),
      playpauseBtn = document.getElementById('yt-playpause'),
      docHeight = document.documentElement.scrollHeight,
      windowHeight = window.innerHeight,
      windowWidth = window.innerWidth,
      width = header.offsetWidth,
      cursorPos = width * .175,
      mouseCheck = false,
      //Mouse events trigger
      paginationPos = 0,
      scrollPos = 0,
      sliderPos = 0,
      //Variables for swiping
      maxSwipeTime = 1500,
      //Max time for swipe
      swipeRange = 30,
      firstButtonScroll = true,
      //Min distance for swiping
      swipeHeight,
      startTime,
      endTime,
      swipeX,
      swipeY; //Events

  // window.addEventListener('scroll', function(e) {
  //   console.log('scroll!', e)
  //   if (e.preventDefault) {
  //     e.preventDefault();
  //   }

  //   if (e.deltaY < 0) {
  //     scrollingPage(true); //Scrolling up
  //   }

  //   if (e.deltaY > 0) {
  //     scrollingPage(); //Scrolling down
  //   }
  // });

  window.addEventListener("wheel", function (e) {
    console.log('wheel')
      if (e.preventDefault) {
        e.preventDefault();
      }
  
      if (e.deltaY < 0) {
        scrollingPage(true); //Scrolling up
      }
  
      if (e.deltaY > 0) {
        scrollingPage(); //Scrolling down
      }
  });
  playpauseBtn.addEventListener("click", function () {
      if (firstButtonScroll) {
        setTimeout(() => {
          scrollingPage();
        }, 999);
        setTimeout(() => {
          scrollingPage();
        }, 1999);
      }
    firstButtonScroll = false;
  });
  playpauseBtn.addEventListener("touchend", function () {
    if (firstButtonScroll) {
      setTimeout(() => {
        scrollingPage();
      }, 999);
      setTimeout(() => {
        scrollingPage();
      }, 1999);
    }
  firstButtonScroll = false;
});


  header.addEventListener('mousemove', function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (mouseCheck) {
      sliderOptions(e);
    }
  });

  header.addEventListener('mouseup', function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    mouseCheck = false;
  });
  header.addEventListener('touchstart', function (e) {
    var touchObj = e.changedTouches[0];
    startTime = new Date().getTime();
    swipeX = touchObj.pageX;
    swipeY = touchObj.pageY;
    swipeHeight = 0;

    if (e.preventDefault) {
      e.preventDefault();
    }
  });
  header.addEventListener('touchmove', function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
  });
  header.addEventListener('touchend', function (e) {
    swipeEnd(e);

    if (e.preventDefault) {
      e.preventDefault();
    }
  });





  function scrollingPage(direction) {
    console.log('scrolling', direction);
    if (direction) {
      if (-scrollPos > docHeight / 3 - 10) {
        scrollPos += windowHeight;
        paginationPos--;
      }
    } else {
      if (-scrollPos < docHeight - docHeight / 3 - 10) {
        scrollPos -= windowHeight;
        paginationPos++;
      }
    }

    head.style.transform = "translateY(".concat(scrollPos, "px)");
    nextButton(paginationPos);
    parallaxImitation(paginationPos);
  }

  function nextButton(r) {
    if (r == 0) {
      next.style.display = "flex";
    } else {
      next.style.display = "none";
    }
  }

  function parallaxImitation(r) {
    for (var i = 0; i < parallaxItems.length; i++) {
      parallaxItems[i].style.transform = "translateY(".concat(-r * 20, "rem)");
    }
  }

  function swipeEnd(e) {
    var touchObj = e.changedTouches[0];
    swipeHeight = touchObj.pageY - swipeY;
    endTime = new Date().getTime() - startTime;

    if (endTime <= maxSwipeTime && Math.abs(touchObj.pageX - swipeX) <= 100) {
      if (swipeHeight >= swipeRange) {
        scrollingPage(true);
      } else if (swipeHeight <= -swipeRange) {
        scrollingPage();
      }
    }
  }

  var openB = document.getElementById("open");
  openB.addEventListener('click', function() {
    openB.style.opacity = "0";
    head.style.height = '200vh';
  });
  openB.addEventListener('touchend', function() {
    openB.style.display = "none";
    head.style.height = '200vh';
  });
});
