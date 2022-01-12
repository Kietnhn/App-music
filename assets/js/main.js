

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORE_KEY ='F8_PLAYER'

const player = $('.player')
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const propress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const ramdomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const  randomCurrent = []

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    config:  JSON.parse(localStorage.getItem(PLAYER_STORE_KEY)) || {},
    songs: [
        {
          name: "Đi về nhà",
          singer: "Đen x JustaTee",
          path: "./assets/music/Đivenha.mp3 ",
          image: "./assets/img/ĐivềNhà-img.jpg"
        },
        {
          name: "Yêu đơn phương",
          singer: "OnlyC x Karik",
          path: "./assets/music/Yeudonphuong.mp3",
          image:
            "./assets/img/Yeeudonphuong-img.jpg"
        },
        {
          name: "Hít vào thở ra",
          singer: "Min x Hieuthuhai",
          path:
            "./assets/music/Hitvaothora.mp3",
          image: "./assets/img/hitvaothora.jpg"
        },
        {
          name: "Tương 31",
          singer: "W/n x Titie ft Nau",
          path: "./assets/music/Tuong31.mp3",
          image:
            "./assets/img/Tuong31.jpg"
        },
        {
          name: "Tan vỡ",
          singer: "Chi Dân",
          path: "./assets/music/Tanvo.mp3",
          image:
            "./assets/img/tanvo.jpg"
        },
        {
          name: "Hiện đại",
          singer: "Khắc Việt",
          path:
            "./assets/music/Hiendai.mp3",
          image:
            "./assets/img/hiendai.jpg"
        },
        {
          name: "Có lẽ anh chưa từng",
          singer: "OnlyC x Karik",
          path: "./assets/music/Coleanhchuatung.mp3",
          image:
            "./assets/img/coleanhchuatung.jpg"
        },
        {
            name: "Bước qua nhau",
            singer: "Thái Vũ",
            path: "./assets/music/Buocquanhau.mp3",
            image:
              "./assets/img/buocquanhau.jpg"
        },
        {
            name: "Chuyện đôi ta",
            singer: "Emcee L ft Muội",
            path: "./assets/music/Chuyendoita.mp3",
            image:
              "./assets/img/chuyendoita.jpg"
        },
        {
            name: "3107 7",
            singer: "W/n ft Titie, Duongg ",
            path: "./assets/music/31077.mp3",
            image:
              "./assets/img/31077.jpg"
        },
      ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>            
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth
        const _this = this
        //Xu ly cd quay/dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause()


        //Xu ly scroll
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop 
            const newCdWidth = cdWidth - scrollTop            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth/cdWidth
        }
        //Xu ly khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
            
        }
        // khi played song
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khhi pause song
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercen = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercen
            }
        }
        //xu li khi tua
        progress.onchange = function(e){
            const seekTime = audio.duration/100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next song
        nextBtn.onclick = function(){
            if( _this.isRamdom){
                _this.playRamdomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        } 
        //khi prev song
        prevBtn.onclick = function(){
            if( _this.isRamdom){
                _this.playRamdomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        } 
        //Xu ly ramdom
        ramdomBtn.onclick = function(){
            _this.isRamdom = !_this.isRamdom
            _this.setConfig('isRamdom', _this.isRamdom)
            this.classList.toggle('active',_this.isRamdom)
        }
        //xu ly khi edded song
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //Xu ly repeat song;
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
           
            this.classList.toggle('active',_this.isRepeat)
        }
        // lang nghe click vao playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if( e.target.closest('.option'))[

                ]
            }
        }
        
    },
    scrollToActiveSong: function(){
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src =this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRamdomSong: function(){
        // var newIndex
        // do{
        //     newIndex = Math.floor(Math.random() * app.songs.length)
        // }while(newIndex === this.currentIndex)
        // this.currentIndex = newIndex
        // this.loadCurrentSong()
        function randomIndex(){ 
            return  Math.floor(Math.random() * app.songs.length)
        }
        let newIndex = randomIndex()
        if(randomCurrent.length === app.songs.length){
            randomCurrent.splice(0, randomCurrent.length)
        }else{
            while(randomCurrent.includes(newIndex)){
                newIndex = randomIndex()
            }
        }
        randomCurrent.push(newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadConfig: function(){
        this.isRamdom = this.config.isRamdom
        this.isRepeat = this.config.isRepeat
    },
    start: function(){
        //gan cau hinh tu config 
        this.loadConfig()

        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()

        ramdomBtn.classList.toggle('active',this.isRamdom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
app.start()