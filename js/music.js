
(function() {
    /*doc.body.clientWidth是获取当前的body的宽度，640是我们的移动端的最大宽度，相除就会得出一个比例，在乘以100px，就会得出我们当前的1rem等于多少px*/
    document.body.style.fontSize = 100 * (document.body.clientWidth / 640) + "px";
})();
var myMusic = new Vue({
    el:"#musicApp",
    data:{
        music:{
            albumid: 1621496,
            albummid: "000S0De80RYg22",
            albumname: "Sprint for the Dreams",
            albumpic_big: "http://i.gtimg.cn/music/photo/mid_album_300/2/2/000S0De80RYg22.jpg",
            albumpic_small: "http://i.gtimg.cn/music/photo/mid_album_90/2/2/000S0De80RYg22.jpg",
            downUrl: "http://dl.stream.qqmusic.qq.com/108666278.m4a?vkey=DD643B0672D53A3A4AA9C0EA636F5FD6DA3EA3C6707CFE7E3EA20D0D44E8839E1419FE1AE9D14B6F224E5114245E0D1EF095104CBAFE62E0&guid=2718671044",
            m4a: "http://ws.stream.qqmusic.qq.com/108666278.m4a?fromtag=46",
            media_mid: "003R0shb2QR0NG",
            singerid: 1104989,
            singername: "MICHI",
            songid: 108666278,
            songmid: "003R0shb2QR0NG",
            songname: "Checkmate!?",
            strMediaMid: "003R0shb2QR0NG"
        },
        keyWord:"",
        page:1,
        maxPage:1,
        musicCache:[],
        player:undefined,
        playOrPause:false,
        timer:undefined
    },
    mounted:function () {
        this.$nextTick(function () {
        })
    },
    methods:{
        getJson:function (callback) {
            this.$http.get("https://route.showapi.com/213-1?keyword="+this.keyWord+"&page="+this.page+"&showapi_appid=50847&showapi_sign=79d972d4c0b04b3b8c6c1d1f0963cc02").then(res =>{
                if(res.status==200){
                    this.musicCache=res.data.showapi_res_body.pagebean.contentlist;
                    this.maxPage=res.data.showapi_res_body.pagebean.allPages;
                }
            });
            if(typeof callback =="function"){//回调函数
                callback();
            }
        },
        //搜索
        searchMusic:function () {
                this.getJson();
        },
        //更换musicList页数
        changePage:function (flag) {
            if(flag) {
                this.page > 1 ? this.page-- : this.page = 1;
            }
            else{
                this.page<this.maxPage?this.page++:this.page=this.maxPage;
            }
            this.getJson();
        },
        //选中
        checkedMusic:function(item){
            try
            {
                this.pauseMusic();
            }
            catch(err){

            };
            this.musicCache.forEach(val=>{
                if(item.songid == val.songid){
                    if(val.check=="undefined"){
                        this.set(val,"check",true);
                    }
                    else {
                        val.check=true;
                    }
                }
                else {
                    val.check=false;
                }
            });
            this.music=item;
        },
        //播放
        playMusic:function () {
            this.playOrPause=true;
            this.player=document.getElementsByClassName("audio")[0];
            this.player.play();
            this.updataProgress();
        },
        //暂停
        pauseMusic:function () {
            this.playOrPause=false;
            this.player.pause();
            clearInterval(this.timer);
        },
        //下一首
        nextMusic:function (item) {
                var index=this.musicCache.indexOf(item),
                    isIndex=index;
                    if(index>=this.musicCache.length-1){
                        if (this.page<this.maxPage){
                            this.page++;
                            this.getJson();
                        }
                    }
                    else {
                        index++;
                        this.checkedMusic(this.musicCache[index]);
                    }
                    if(index!=isIndex){
                        this.playOrPause=false;
                        this.pauseMusic();
                    }
        },
        //上一首
        prevMusic:function (item) {
            var index=this.musicCache.indexOf(item),
                isIndex=index;
            if(index<=0){
                if (this.page>1){
                    this.page--;
                    this.getJson();
                }
            }
            else {
                index--;
                this.checkedMusic(this.musicCache[index]);
                item=this.musicCache[index];
            }
            if(index!=isIndex){
                this.playOrPause=false;
                this.pauseMusic();
            }
        },
        //更新进度条
        updataProgress:function () {
            var _this =this;
            //格式化时间至的函数
            function formatTime(val) {
                return Math.floor(val/60)+":"+Math.floor(val%60);
            }
            this.timer= setInterval(function () {
                var  scale = _this.player.currentTime/_this.player.duration,
                     progressVal = document.getElementsByClassName("progress-val")[0],
                     progressFlag = document.getElementsByClassName("progress-flag")[0],
                     playTime = document.getElementsByClassName("play-time")[0];
                     playTime.innerText=formatTime(_this.player.currentTime);
                     progressVal.style.width = scale*100+"%";
                     progressFlag.style.left=progressVal.offsetWidth-progressFlag.offsetWidth/2+"px";

            },1000/60)
        },
        dragProgressFlaf:function (e) {
                this.playMusic();
                this.pauseMusic();
            var oe =e||window.event,
                flag=document.getElementsByClassName("progress-flag")[0],
                progress=document.getElementsByClassName("progress-val")[0],
                MinL=-flag.offsetWidth/2,
                MaxL=document.getElementsByClassName("progress")[0].offsetWidth+MinL,
                flagLeft=flag.offsetLeft,
                flagX=oe.clientX;
            document.onmousemove=function (e) {
                 var oe =e||window.event,
                      scale,
                      thisX=oe.clientX-flagX+flagLeft;
                      thisX=Math.min(thisX,MaxL);
                      thisX=Math.max(MinL,thisX);
                      scale=(thisX-MinL)/(MaxL-MinL);

                 myMusic.player.currentTime=scale*myMusic.player.duration;
                 progress.style.width=thisX-MinL+"px";
                 flag.style.left=thisX+"px";
            }
            document.onmouseup=function () {
                document.onmousemove=null;
                document.onmuseup=null;
                myMusic.playMusic();
            }
        }
    },
    filters:{
        formatTime:function (val) {
            return Math.floor(val/60)+":"+Math.floor(val%60);
        }
    }
})