const section1Bokeh=document.querySelector(".background-bokeh");
const SECTION1_TOTAL=35;

let section1BokehRunning = true;

function section1Random(min,max){
    return Math.random()*(max-min)+min;
}

function enterFullscreen(){

    const el=document.documentElement;

    if(el.requestFullscreen){

        el.requestFullscreen();

    }else if(el.webkitRequestFullscreen){

        el.webkitRequestFullscreen();

    }else if(el.msRequestFullscreen){

        el.msRequestFullscreen();

    }

}

function section1CreateLight(){

    const light=document.createElement("div");

    light.className="section-1-light";

    section1Bokeh.appendChild(light);

    section1AnimateLight(light);

}

function section1AnimateLight(light){

    const size=section1Random(50,100);

    const x=section1Random(0,window.innerWidth);

    const y=section1Random(0,window.innerHeight);

    const dx=section1Random(-80,80);

    const dy=section1Random(-80,80);

    const duration=section1Random(6000,12000);

    light.style.width=size+"px";
    light.style.height=size+"px";

    light.style.left=x+"px";
    light.style.top=y+"px";

    light.style.filter=`blur(${section1Random(5,10)}px)`;

    const start=performance.now();

    function frame(now){
        
        if(!section1BokehRunning) return;
        
        const t=(now-start)/duration;

        if(t>=1){

            if(section1BokehRunning){

                section1AnimateLight(light);

            }

            return;

        }

        const progress=Math.sin(t*Math.PI);

        light.style.opacity=0.42*progress;

        light.style.transform=
        `translate(${dx*t}px,${dy*t}px)
        translate(-50%,-50%)
        scale(${0.45+progress*0.8})`;

        requestAnimationFrame(frame);

    }

    requestAnimationFrame(frame);

}

function stopSection1Bokeh(){

    section1Bokeh.style.opacity = "0";

    setTimeout(()=>{

        section1BokehRunning = false;
        section1Bokeh.innerHTML = "";

    },1500);

}

function startSection1Bokeh(){

    if(section1BokehRunning) return;

    section1BokehRunning = true;

    for(let i=0;i<SECTION1_TOTAL;i++){

        setTimeout(section1CreateLight,i*180);

    }

}

for(let i=0;i<SECTION1_TOTAL;i++){

    setTimeout(section1CreateLight,i*180);

}



/*=========================
BUTTON FILL
=========================*/

const section1Button = document.getElementById("section1Button");

const section1=document.getElementById("section-1");
const section1Content=document.querySelector(".section-1-content");

section1Button.addEventListener("click",()=>{
    
    section1Button.disabled=true;

    if(!musicStarted){

        bgMusic.play().catch(()=>{});

        musicStarted=true;

        musicToggle.classList.add("show");
        
        musicToggle.classList.add("playing");

    }

    setTimeout(()=>{

        startSection2();

    },500);
    
        
    enterFullscreen();
    

});
const bgMusic=document.getElementById("bgMusic");
const musicToggle=document.getElementById("musicToggle");
musicToggle.classList.add("playing");

let musicStarted=false;

musicToggle.addEventListener("click",()=>{

    if(bgMusic.paused){

        bgMusic.play();

        musicToggle.classList.add("playing");

    }else{

        bgMusic.pause();

        musicToggle.classList.remove("playing");

    }

});

/*=========================
SECTION 2
=========================*/

const section2=document.getElementById("section-2");

function startSection2(){

    const section1=document.getElementById("section-1");

    section1.style.transition="opacity .8s ease";
    section1.style.opacity="0";

    setTimeout(()=>{

        section1.style.display="none";

        section2.classList.add("show");
            
        //document.body.style.overflowY="auto";

        window.scrollTo({
            top:0,
            behavior:"instant"
        });

    },800);

}

/*=========================
SECTION 2 HEART
=========================*/

const heart=document.getElementById("heart");
const heartFill=document.querySelector(".heart-fill");
const heartInstruction=document.getElementById("heartInstruction");
const heartSuccess=document.getElementById("heartSuccess");
const lovePercent=document.getElementById("lovePercent");
const loveEmoji=document.getElementById("loveEmoji");
const loveStatus=document.querySelector(".love-status");
const loveWarning=document.getElementById("loveWarning");
const section2Button=document.getElementById("section2Button");

const emojis=[
    "🤬",
    "😠",
    "🤧",
    "🤩",
    "😍"
];
const section2Next=document.getElementById("section2Next");

let hold=false;
let progress=0;
let finished=false;
let lastEmojiIndex=-1;

updateHeart();

function updateHeart(){

    heartFill.style.clipPath=`inset(${100-progress}% 0 0 0)`;

    const value=Math.round(progress);

    lovePercent.textContent=value+"%";

    let index=Math.floor(value/20);

    if(index>4) index=4;

    if(index!==lastEmojiIndex){

        loveEmoji.textContent=emojis[index];

        loveEmoji.animate(
            [
                {
                    transform:"scale(.6)"
                },
                {
                    transform:"scale(1.25)"
                },
                {
                    transform:"scale(1)"
                }
            ],
            {
                duration:220,
                easing:"ease-out"
            }
        );

        lastEmojiIndex=index;

    }

}

let heartStartTime = 0;
const HEART_DURATION = 7000; // 7 detik

function growHeart(){

    if(!hold || finished) return;

    const elapsed = performance.now() - heartStartTime;

    progress = Math.min(
        elapsed / HEART_DURATION * 100,
        100
    );

    updateHeart();

    if(progress >= 100){

        finishHeart();

        return;

    }

    requestAnimationFrame(growHeart);

}

function startHold(){

    if(finished) return;

    hold = true;

    heartStartTime = performance.now();

    growHeart();

}

function stopHold(){

    hold=false;

    if(finished) return;

    const value=Math.round(progress);

    if(value===0) return;

    loveStatus.style.opacity="0";

    loveWarning.textContent=`Nggak boleh ${value}% 😠`;
    loveWarning.style.opacity="1";

    setTimeout(()=>{

        loveWarning.style.opacity="0";

        setTimeout(()=>{

            loveWarning.textContent="";

            loveStatus.style.opacity="1";

            progress=0;

            updateHeart();

        },300);

    },1000);

}

// Heart
heart.addEventListener("mousedown", startHold);

heart.addEventListener("touchstart", e=>{
    e.preventDefault();
    startHold();
},{passive:false});

// Heart Instruction
heartInstruction.addEventListener("mousedown", startHold);

heartInstruction.addEventListener("touchstart", e=>{
    e.preventDefault();
    startHold();
},{passive:false});

// Stop hold
window.addEventListener("mouseup", stopHold);
window.addEventListener("touchend", stopHold);
window.addEventListener("touchcancel", stopHold);

function finishHeart(){

    finished=true;

    hold=false;

    progress=100;

    updateHeart();

    heart.classList.add("pulse");
    
    const heartTitle=document.querySelector(".heart-title");

heartTitle.style.transition=".4s";
heart.style.transition=".4s";
heartInstruction.style.transition=".4s";

heartTitle.style.opacity="0";
heart.style.opacity="0";
heartInstruction.style.opacity="0";

setTimeout(()=>{

    heartTitle.style.display="none";
    heart.style.display="none";
    heartInstruction.style.display="none";

},400);

    heartInstruction.style.display="none";

    heartSuccess.classList.add("show");
    
    burstHeart();

}

/*=========================
BURST HEART 
=========================*/

function burstHeart(){

    const rect=heart.getBoundingClientRect();

    const cx=rect.left+rect.width/2;

    const cy=rect.top+rect.height/2;

    for(let i=0;i<120;i++){

        const p=document.createElement("div");

        p.className="heart-particle";

        p.textContent=Math.random()>.5?"❤":"🤍";

        p.style.left=cx+"px";

        p.style.top=cy+"px";

        document.body.appendChild(p);

        const angle=Math.random()*Math.PI*2;

        const distance=180+Math.random()*380;

        const x=Math.cos(angle)*distance;

        const y=Math.sin(angle)*distance;

        p.animate(
            [
                {
                    transform:"translate(0,0) scale(.5)",
                    opacity:1
                },
                {
                    transform:`translate(${x}px,${y}px) rotate(${Math.random()*720}deg) scale(1.3)`,
                    opacity:0
                }
            ],
            {
                duration:7000,
                easing:"cubic-bezier(.2,.8,.2,1)",
                fill:"forwards"
            }
        );

        setTimeout(()=>{

            p.remove();

        },7200);

    }

    setTimeout(()=>{

        const heartTitle=document.querySelector(".heart-title");

        heartTitle.style.transition=".5s ease";
        heart.style.transition=".5s ease";
        heartInstruction.style.transition=".5s ease";

        heartTitle.style.opacity="0";
        heart.style.opacity="0";
        heartInstruction.style.opacity="0";

        setTimeout(()=>{

            heartTitle.style.display="none";
            heart.style.display="none";
            heartInstruction.style.display="none";

            setTimeout(()=>{

                section2Next.classList.add("show");

            },100);

        },500);

    },1500);

}

/*=========================
SECTION 2 BUTTON 
=========================*/

section2Next.addEventListener("click",()=>{

    const section2=document.getElementById("section-2");
    const section3=document.getElementById("section-3");

    // Langsung mulai transisi background
    stopSection1Bokeh();
    document.getElementById("romanticBackground").classList.add("show");
    startGlows();
    startFireflies();

    // Tunda hilangnya Section 2 selama 1 detik
    setTimeout(()=>{

        section2.style.transition="opacity .8s ease";
        section2.style.opacity="0";

        setTimeout(()=>{

            section2.style.display="none";
            section3.classList.add("show");

        },800);

    },500);

});

/*=========================
SECTION 3 ELEMENT
=========================*/
const section3=document.getElementById("section-3");

const section3Lock=document.getElementById("section3Lock");
const section3Gallery=document.getElementById("section3Gallery");

const section3Slider=document.getElementById("section3Slider");
const section3Track=document.getElementById("section3Track");
const section3Progress=document.getElementById("section3Progress");
const section3Text=document.getElementById("section3Text");

const section3Preview=document.getElementById("section3Preview");
const section3PreviewImage=document.getElementById("section3PreviewImage");
const section3ClosePreview=document.getElementById("section3ClosePreview");

const section3Prev=document.getElementById("section3Prev");
const section3NextPreview=document.getElementById("section3NextPreview");
const section3Dots=document.getElementById("section3Dots");

const section3Photos=[
    ...document.querySelectorAll(".section-3-grid img")
];

const section3CaptionTitle=
document.getElementById("section3CaptionTitle");

const section3CaptionText=
document.getElementById("section3CaptionText");

const section3Header=document.querySelector(".section-3-header");
const section3Next=document.getElementById("section3Next");
const section3Loading=document.getElementById("section3Loading");

let section3Dragging=false;
let section3StartX=0;
let section3StartLeft=0;

/* Carousel */

let section3CurrentIndex=0;

/*=========================
SECTION 3 SLIDER
=========================*/

function section3MaxSlide(){

    return section3Track.clientWidth-section3Slider.offsetWidth;

}

section3Slider.addEventListener("pointerdown",e=>{

    section3Dragging=true;

    section3StartX=e.clientX;
    section3StartLeft=parseFloat(
        section3Slider.dataset.x||0
    );

    section3Slider.style.transition="none";
    section3Progress.style.transition="none";

    section3Text.classList.add("hide");
    section3Text.classList.remove("animate");

    section3Slider.setPointerCapture(e.pointerId);

});

section3Slider.addEventListener("pointermove",e=>{

    if(!section3Dragging) return;

    let x=
    section3StartLeft+
    (e.clientX-section3StartX);

    x=Math.max(
        0,
        Math.min(
            x,
            section3MaxSlide()
        )
    );

    section3Slider.dataset.x=x;

    section3Slider.style.transform=
    `translateX(${x}px)`;

    const trackRect=
    section3Track.getBoundingClientRect();

    const sliderRect=
    section3Slider.getBoundingClientRect();

    section3Progress.style.width=
    `${sliderRect.right-trackRect.left}px`;

});

function section3EndSlide(){

    if(!section3Dragging) return;

    section3Dragging=false;

    const x=parseFloat(
        section3Slider.dataset.x||0
    );

    section3Slider.style.transition=".35s ease";
    section3Progress.style.transition=".35s ease";

    if(x>=section3MaxSlide()*0.95){

        section3Slider.dataset.x=
        section3MaxSlide();

        section3Slider.style.transform=
        `translateX(${section3MaxSlide()-5}px)`;

        section3Progress.style.width="100%";

        section3Lock.classList.add("hide");
        section3Header.classList.add("hide");

        setTimeout(()=>{

            section3Lock.style.display="none";
            section3Header.style.display="none";

            section3Loading.classList.add("show");

            setTimeout(()=>{

                section3Loading.classList.remove("show");

                section3Gallery.classList.add("show");

                setTimeout(()=>{

                    section3Next.classList.add("show");

                },500);

            },1000);

        },450);

    }else{

        section3Slider.dataset.x=0;

        section3Slider.style.transform=
        "translateX(0)";

        section3Progress.style.width="0";

        section3Text.classList.remove("hide");

        void section3Text.offsetWidth;

        section3Text.classList.add("animate");

    }

}

section3Slider.addEventListener(
    "pointerup",
    section3EndSlide
);

section3Slider.addEventListener(
    "pointercancel",
    section3EndSlide
);

/*=========================
SECTION 3 PREVIEW
=========================*/

function section3CreateDots(){

    section3Dots.innerHTML="";

    section3Photos.forEach((photo,index)=>{

        const dot=document.createElement("button");

        dot.className="section-3-dot";

        if(index===0){

            dot.classList.add("active");

        }

        dot.addEventListener("click",()=>{

            section3ShowPhoto(index);

        });

        section3Dots.appendChild(dot);

    });

}

function section3UpdateDots(){

    [...section3Dots.children].forEach((dot,index)=>{

        dot.classList.toggle(
            "active",
            index===section3CurrentIndex
        );

    });

}

function section3ShowPhoto(index){

    if(index<0){

        index=section3Photos.length-1;

    }

    if(index>=section3Photos.length){

        index=0;

    }

    section3CurrentIndex=index;

    const photo=section3Photos[index];

    section3PreviewImage.animate(
        [
            {
                opacity:.3,
                transform:"scale(.97)"
            },
            {
                opacity:1,
                transform:"scale(1)"
            }
        ],
        {
            duration:250,
            easing:"ease"
        }
    );

    section3PreviewImage.src=photo.src;

    section3CaptionTitle.textContent=
    photo.dataset.title||"";

    section3CaptionText.textContent=
    photo.dataset.caption||"";

    section3UpdateDots();

}

section3Photos.forEach((photo,index)=>{

    photo.addEventListener("click",()=>{

        section3Preview.classList.add("show");

        section3ShowPhoto(index);

    });

});

section3CreateDots();

/*=========================
PREV
=========================*/

section3Prev.addEventListener("click",()=>{

    section3ShowPhoto(
        section3CurrentIndex-1
    );

});

/*=========================
NEXT
=========================*/

section3NextPreview.addEventListener("click",()=>{

    section3ShowPhoto(
        section3CurrentIndex+1
    );

});

/*=========================
CLOSE
=========================*/

function section3CloseViewer(){

    section3Preview.classList.remove("show");

}

section3ClosePreview.addEventListener(
    "click",
    section3CloseViewer
);

section3Preview.addEventListener("click",e=>{

    if(
        e.target===section3Preview||
        e.target.classList.contains(
            "section-3-preview-bg"
        )
    ){

        section3CloseViewer();

    }

});

/*=========================
KEYBOARD
=========================*/

document.addEventListener("keydown",e=>{

    if(
        !section3Preview.classList.contains(
            "show"
        )
    ) return;

    if(e.key==="Escape"){

        section3CloseViewer();

    }

    if(e.key==="ArrowLeft"){

        section3ShowPhoto(
            section3CurrentIndex-1
        );

    }

    if(e.key==="ArrowRight"){

        section3ShowPhoto(
            section3CurrentIndex+1
        );

    }

});


/*=========================
ROMANTIC BACKGROUND
=========================*/

const romanticBackground=document.getElementById("romanticBackground");

const bgGlows=[
    document.querySelector(".glow-1"),
    document.querySelector(".glow-2"),
    document.querySelector(".glow-3")
];

function moveGlow(glow){

    const x=Math.random()*window.innerWidth;
    const y=Math.random()*window.innerHeight;

    const scale=.9+Math.random()*.35;

    const opacity=parseFloat(getComputedStyle(glow).opacity);

    glow.style.transition=
    `left ${18+Math.random()*10}s ease-in-out,
     top ${18+Math.random()*10}s ease-in-out,
     transform ${12+Math.random()*6}s ease-in-out,
     opacity ${8+Math.random()*4}s ease-in-out`;

    glow.style.left=x+"px";
    glow.style.top=y+"px";

    glow.style.transform=
    `translate(-50%,-50%) scale(${scale})`;

    glow.style.opacity=(opacity+.05+Math.random()*.08).toFixed(2);

}

let glowIntervals = [];

function startGlows(){

    if(glowIntervals.length) return;

    bgGlows.forEach(glow=>{

        moveGlow(glow);

        glowIntervals.push(

            setInterval(()=>{

                moveGlow(glow);

            },18000+Math.random()*8000)

        );

    });

}

function stopGlows(){

    glowIntervals.forEach(interval=>{

        clearInterval(interval);

    });

    glowIntervals=[];

}
/*=========================
FIREFLIES
=========================*/

const fireflies=document.getElementById("fireflies");

function createFirefly(){

    const dot=document.createElement("div");

    dot.className="firefly";

    const size=2+Math.random()*3;

    dot.style.width=size+"px";
    dot.style.height=size+"px";

    dot.style.left=Math.random()*window.innerWidth+"px";
    dot.style.top=(window.innerHeight+30)+"px";

    const dx=(Math.random()*180-90);

    const duration=16000+Math.random()*10000;

    dot.style.animation=
    `fireflyTwinkle ${2800+Math.random()*1800}ms ease-in-out infinite`;

    fireflies.appendChild(dot);

    const start=performance.now();

    function animate(now){

        const t=(now-start)/duration;

        if(t>=1){

            dot.remove();

            return;

        }

        const ease=1-Math.pow(1-t,2);

        dot.style.transform=
        `translate(${dx*ease}px,${-window.innerHeight*ease}px)`;

        requestAnimationFrame(animate);

    }

    requestAnimationFrame(animate);

}

let fireflyInterval = null;

function startFireflies(){

    if(fireflyInterval) return;

    fireflyInterval = setInterval(createFirefly,550);

    for(let i=0;i<18;i++){

        setTimeout(createFirefly,i*300);

    }

}

function stopFireflies(){

    clearInterval(fireflyInterval);

    fireflyInterval=null;

    fireflies.innerHTML="";

}

function hideRomanticBackground(){

    romanticBackground.classList.remove("show");

}

section3Next.addEventListener("click",startSection4);

/*=========================
SECTION 4 ELEMENT
=========================*/

const section4=document.getElementById("section-4");
const section4Canvas=document.getElementById("section4Canvas");
const section4Ctx=section4Canvas.getContext("2d");
const section4HeartWrap=document.querySelector(".section-4-heart-wrap");
const section4Heart=document.querySelector(".section-4-heart");

let section4Fireworks=true;

const section4Rockets=[];
const section4Explosions=[];

const section4FireworkColors=[
    "#ffffff",
    "#ffd60a",
    "#ff8fab",
    "#a855f7",
    "#38bdf8"
];

/*=========================
SECTION 4 FIREWORK CLASS
=========================*/

class Section4Rocket{

    constructor(){

        this.x=Math.random()*section4Canvas.width;

        this.y=section4Canvas.height+20;

        this.targetY=
        Math.random()*section4Canvas.height*0.35+40;

        this.vy=-(5+Math.random()*1.6);

        this.color=
        section4FireworkColors[
            Math.floor(
                Math.random()*
                section4FireworkColors.length
            )
        ];

    }

    update(){

        this.y+=this.vy;

        this.vy*=0.998;

        if(this.y<=this.targetY){

            section4FireworkExplode(
                this.x,
                this.y,
                this.color
            );

            return false;

        }

        return true;

    }

    draw(ctx){

        ctx.fillStyle=this.color;

        ctx.fillRect(
            this.x,
            this.y,
            2,
            2
        );

        ctx.beginPath();

        ctx.moveTo(
            this.x+1,
            this.y+10
        );

        ctx.lineTo(
            this.x+1,
            this.y
        );

        ctx.lineWidth=1;

        ctx.strokeStyle=this.color;

        ctx.stroke();

    }

}

class Section4Explosion{

    constructor(x,y,color){

        this.x=x;
        this.y=y;

        const angle=Math.random()*Math.PI*2;
        const speed=Math.random()*4+1;

        this.vx=Math.cos(angle)*speed;
        this.vy=Math.sin(angle)*speed;

        this.life=110;

        this.color=color;

    }

    update(){

        this.x+=this.vx;
        this.y+=this.vy;

        this.vx*=0.992;
        this.vy*=0.992;

        this.vy+=0.02;

        this.life--;

        return this.life>0;

    }

    draw(ctx){

        ctx.globalAlpha=this.life/110;

        ctx.fillStyle=this.color;

        ctx.fillRect(
            this.x,
            this.y,
            2,
            2
        );

        ctx.globalAlpha=1;

    }

}

/*=========================
SECTION 4 FIREWORKS
=========================*/

function section4FireworkExplode(
    x,
    y,
    color
){

    for(let i=0;i<150;i++){

        section4Explosions.push(

            new Section4Explosion(
                x,
                y,
                color
            )

        );

    }

}

function section4LaunchFirework(){

    if(!section4Fireworks) return;

    section4Rockets.push(
        new Section4Rocket()
    );

    setTimeout(

        section4LaunchFirework,

        180+
        Math.random()*220

    );

}

/*=========================
SECTION 4 SHOW
=========================*/

function startSection4(){

    const section3=
    document.getElementById("section-3");

    section3.style.transition=
    "opacity .8s ease";

    section3.style.opacity="0";

    setTimeout(()=>{

        section3.style.display="none";

        section4.classList.add("show");

        section4Resize();

        section4Fireworks=true;

        section4LaunchFirework();
        
        section4HeartWrap.style.cursor="pointer";

        section4HeartWrap.onclick=()=>{

            section4HeartWrap.onclick=null;

            setTimeout(()=>{

                section4Explode();

            },500);

        };        

    },800);

}

/*=========================
SECTION 4 RESIZE
=========================*/

function section4Resize(){

    section4Canvas.width=
    window.innerWidth;

    section4Canvas.height=
    window.innerHeight;

}

window.addEventListener(
    "resize",
    section4Resize
);

/*=========================
SECTION 4 BURST
=========================*/

function section4Explode(){

    section4Burst();

}

function section4Burst(){

    const rect=section4Heart.getBoundingClientRect();

    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;

    const interval=setInterval(()=>{

        for(let i=0;i<8;i++){

            const p=document.createElement("div");

            p.className="section-4-heart-particle";

            p.textContent="❤";

            p.style.left=cx+"px";
            p.style.top=cy+"px";
            p.style.transform="translate(-50%,-50%)";         

            document.body.appendChild(p);

            const angle=Math.random()*Math.PI*2;

            const distance=90+Math.random()*180;

            const x=Math.cos(angle)*distance;

            const y=Math.sin(angle)*distance;

            p.animate(
                [
                    {
                        transform:"translate(-50%,-50%) scale(.4)",
                        opacity:.65
                    },
                    {
                        transform:`translate(calc(${x}px - 50%),calc(${y}px - 50%)) scale(1)`,
                        opacity:0
                    }
                ],
                {
                    duration:2400,
                    easing:"ease-out",
                    fill:"forwards"
                }
            );

            setTimeout(()=>{

                p.remove();

            },1200);

        }

    },60);

    setTimeout(()=>{

        clearInterval(interval);

        section4Hide();

    },3000);

}

/*=========================
SECTION 4 DRAW
=========================*/

function section4Draw(){

    section4Ctx.clearRect(
        0,
        0,
        section4Canvas.width,
        section4Canvas.height
    );

    /* Rockets */

    for(
        let i=section4Rockets.length-1;
        i>=0;
        i--
    ){

        const rocket=section4Rockets[i];

        rocket.draw(section4Ctx);

        if(!rocket.update()){

            section4Rockets.splice(i,1);

        }

    }

    /* Explosion */

    for(
        let i=section4Explosions.length-1;
        i>=0;
        i--
    ){

        const explosion=
        section4Explosions[i];

        explosion.draw(section4Ctx);

        if(!explosion.update()){

            section4Explosions.splice(i,1);

        }

    }

    requestAnimationFrame(section4Draw);

}

section4Draw();

/*=========================
SECTION 4 HIDE
=========================*/

function section4Hide(){

    section4.classList.add("hide");

    setTimeout(()=>{

        section4.style.display="none";

        section5.classList.add("show");

        section5Resize();

        // Kembang api TIDAK dimatikan.
        // Akan tetap berlanjut di section 5.

        setTimeout(()=>{

            section5Shake();

        },500);

    },800);

}

/*=========================
SECTION 5 ELEMENT
=========================*/

const section5=document.getElementById("section-5");

const section5Canvas=document.getElementById("section5Canvas");
const section5Ctx=section5Canvas.getContext("2d");

const section5Gift=document.getElementById("section5Gift");
const section5Lid=document.querySelector(".section-5-lid");

const section5Message=document.getElementById("section5Message");
const section5Typing=document.getElementById("section5Typing");


let section5Particles=[];
let section5Emojis=[];

const section5Box=document.querySelector(".section-5-box");

const section5Replay=document.getElementById("section5Replay");

/*=========================
SECTION 5 SHOW
=========================*/

function startSection5(){

    const section4=document.getElementById("section-4");

    section4.style.transition="opacity .8s ease";
    section4.style.opacity="0";

    setTimeout(()=>{

        section4.style.display="none";

        section5.classList.add("show");

        section5Resize();

        setTimeout(()=>{

            section5Shake();

        },500);

    },800);

}

/*=========================
SECTION 5 RESIZE
=========================*/

function section5Resize(){

    section5Canvas.width=window.innerWidth;
    section5Canvas.height=window.innerHeight;

}

window.addEventListener("resize",section5Resize);

/*=========================
SECTION 5 SHAKE
=========================*/

function section5Shake(){

    section5Gift.classList.add("shake");

    setTimeout(()=>{

        section5Explode();

    },1000);

}

/*=========================
SECTION 5 EXPLODE
=========================*/

function section5Explode(){

    section5Gift.classList.remove("shake");

    section5Lid.classList.add("fly");

    section5Burst();

    section5LaunchEmojis();

    // Confetti warna-warni mulai
    section5Spraying=true;

    // Berlangsung lebih lama
    setTimeout(()=>{

        section5Spraying=false;

        // Kotak tetap terlihat sebentar
        setTimeout(()=>{

            section5Gift.classList.add("hide");

            setTimeout(()=>{

                section5ShowMessage();

            },700);

        },1000);

    },5000);

}

/*=========================
SECTION 5 BURST
=========================*/

function section5Burst(){

    const rect=section5Gift.getBoundingClientRect();

    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;

    for(let i=0;i<100;i++){

        const p=document.createElement("div");

        p.className="section-5-burst";

        p.style.position="fixed";
        p.style.left=cx+"px";
        p.style.top=cy+"px";
        p.style.width="5px";
        p.style.height="5px";
        p.style.borderRadius="2px";
        p.style.background="#ffffff";
        p.style.pointerEvents="none";

        document.body.appendChild(p);

        const angle=Math.random()*Math.PI*2;
        const distance=220+Math.random()*220;

        const x=Math.cos(angle)*distance;
        const y=Math.sin(angle)*distance;

        p.animate(
            [
                {
                    transform:"translate(0,0) scale(1)",
                    opacity:1
                },
                {
                    transform:`translate(${x}px,${y}px) scale(0)`,
                    opacity:0
                }
            ],
            {
                duration:1000,
                easing:"ease-out",
                fill:"forwards"
            }
        );

        setTimeout(()=>{

            p.remove();

        },1000);

    }

}

/*=========================
SECTION 5 EMOJI
=========================*/

const section5EmojiList=[
    "🎈",
    "💖",
    "🎊",
    "🎁",
    "✨",
    "🎉",
    "💝",
    "🧸",
    "🎂",
    "🕯️"
];

function section5LaunchEmojis(){

    const rect=section5Gift.getBoundingClientRect();

    const cx=rect.left+rect.width/2;
    const cy=rect.top+20;

    const total=24;

    for(let i=0;i<total;i++){

        setTimeout(()=>{

            const emoji=
            section5EmojiList[
                Math.floor(
                    Math.random()*
                    section5EmojiList.length
                )
            ];

            const angle=
            (-90+(Math.random()-.5)*90)
            *Math.PI/180;

            const speed=
            7+Math.random()*5;

            section5Emojis.push({

                emoji,

                x:cx+(Math.random()-.5)*12,
                y:cy,

                vx:Math.cos(angle)*speed,
                vy:Math.sin(angle)*speed,

                gravity:.12,

                rotate:(Math.random()-.5)*20,
                angle:Math.random()*360,

                alpha:1,

                size:28+Math.random()*14

            });

        },i*120);

    }

}

/*=========================
SECTION 5 CONFETTI
=========================*/

let section5Spraying=false;

const section5Colors=[
    "#ff4d6d",
    "#ffd60a",
    "#38bdf8",
    "#22c55e",
    "#a855f7",
    "#ff8fab",
    "#ffffff"
];

function section5EmitConfetti(){

    if(!section5Spraying) return;

    const rect=
    section5Gift.getBoundingClientRect();

    const cx=
    rect.left+rect.width/2;

    const cy=
    rect.top+45;

    for(let i=0;i<5;i++){

        const angle=
        (-90+(Math.random()-.5)*34)
        *Math.PI/180;

        const speed=
        7+Math.random()*4;

        section5Particles.push({

            x:cx+(Math.random()-.5)*12,
            y:cy,

            vx:Math.cos(angle)*speed,
            vy:Math.sin(angle)*speed,

            gravity:.10,

            width:3,
            height:6,

            angle:
            Math.random()*360,

            rotate:
            (Math.random()-.5)*25,

            alpha:1,

            color:
            section5Colors[
                Math.floor(
                    Math.random()*
                    section5Colors.length
                )
            ]

        });

    }

}

/*=========================
SECTION 5 DRAW
=========================*/

function section5Draw(){

    section5Ctx.clearRect(
        0,
        0,
        section5Canvas.width,
        section5Canvas.height
    );

    section5EmitConfetti();

    /*=====================
    CONFETTI
    =====================*/

    for(let i=section5Particles.length-1;i>=0;i--){

        const p=section5Particles[i];

        p.vx*=0.996;
        p.vy*=0.996;

        p.vy+=p.gravity;

        p.x+=p.vx;
        p.y+=p.vy;

        p.angle+=p.rotate;

        /* Pantul kiri */

        if(p.x<0){

            p.x=0;

            p.vx*=-0.65;

        }

        /* Pantul kanan */

        if(p.x>section5Canvas.width){

            p.x=section5Canvas.width;

            p.vx*=-0.65;

        }

        /* Pantul atas */

        if(p.y<0){

            p.y=0;

            p.vy*=-0.65;

        }

        /* Lantai */

        const floor=
        section5Canvas.height-p.height;

        if(p.y>=floor){

            p.y=floor;

            if(Math.abs(p.vy)>0.45){

                p.vy*=-0.22;

                p.vx*=0.90;

            }else{

                p.vy=0;
                p.vx=0;

                p.gravity=0;

                p.rotate=0;

            }

        }

        section5Ctx.save();

        section5Ctx.translate(
            p.x,
            p.y
        );

        section5Ctx.rotate(
            p.angle*Math.PI/180
        );

        section5Ctx.globalAlpha=
        p.alpha;

        section5Ctx.fillStyle=
        p.color;

        section5Ctx.fillRect(

            -p.width/2,
            -p.height/2,

            p.width,
            p.height

        );

        section5Ctx.restore();

    }

    /*=====================
    EMOJI
    =====================*/

    for(let i=section5Emojis.length-1;i>=0;i--){

        const e=
        section5Emojis[i];

        e.vx*=0.995;
        e.vy*=0.995;

        e.vy+=e.gravity;

        e.x+=e.vx;
        e.y+=e.vy;

        e.angle+=e.rotate;

        /* Pantul kiri */

        if(e.x<20){

            e.x=20;

            e.vx*=-0.7;

        }

        /* Pantul kanan */

        if(
            e.x>
            section5Canvas.width-20
        ){

            e.x=
            section5Canvas.width-20;

            e.vx*=-0.7;

        }

        /* Pantul atas */

        if(e.y<20){

            e.y=20;

            e.vy*=-0.7;

        }

        /* Lantai */

        const emojiFloor=
        section5Canvas.height-25;

        if(e.y>=emojiFloor){

            e.y=emojiFloor;

            if(Math.abs(e.vy)>0.5){

                e.vy*=-0.28;

                e.vx*=0.9;

            }else{

                e.vy=0;
                e.vx=0;

                e.gravity=0;

                e.rotate=0;

            }

        }

        section5Ctx.save();

        section5Ctx.translate(
            e.x,
            e.y
        );

        section5Ctx.rotate(
            e.angle*Math.PI/180
        );

        section5Ctx.globalAlpha=
        e.alpha;

        section5Ctx.font=
        `${e.size}px serif`;

        section5Ctx.textAlign="center";
        section5Ctx.textBaseline="middle";

        section5Ctx.fillText(

            e.emoji,

            0,

            0

        );

        section5Ctx.restore();

    }

    requestAnimationFrame(
        section5Draw
    );

}

section5Draw();

/*=========================
SECTION 5 MESSAGE
=========================*/

const section5Text=[...document.querySelectorAll("#section5Source p")]
.map(p=>p.textContent.trim())
.join("\n\n");
    
let section5Index=0;
let section5TypingDone=false;

/*=========================
TYPE MESSAGE
=========================*/

function section5ShowMessage(){

    section5Message.classList.add("show");

    section5Typing.textContent = "";
    section5Typing.classList.remove("done");

    section5Index = 0;

    section5Type();

}

function section5Type(){

    if(section5Index >= section5Text.length){

    section5TypingDone=true;

    section5Typing.classList.add("done");

    setTimeout(()=>{

        section5Replay.classList.add("show");        

    },1000);

    return;

}

    section5Typing.textContent += section5Text.charAt(section5Index);

    section5Index++;

    let delay = 28;

    const char = section5Text.charAt(section5Index - 1);

    if(char === ".") delay = 220;
    if(char === ",") delay = 120;
    if(char === "\n") delay = 180;

    setTimeout(section5Type, delay);
    
}

/*=========================
NEXT BUTTON
=========================*/

const section5Next=
document.getElementById("section5Next");

function section5ShowNext(){

    if(!section5Next) return;

    section5Next.classList.add("show");

}

section5Next?.addEventListener("click",()=>{

    /* Fireworks berhenti saat keluar
       dari section 5 */

    section4Fireworks=false;

    const section5=
    document.getElementById("section-5");

    const section6=
    document.getElementById("section-6");

    section5.classList.add("hide");

    setTimeout(()=>{

        section5.style.display="none";

        if(section6){

            section6.classList.add("show");

        }

    },800);

});

section5Replay.addEventListener("click",()=>{

    resetWebsite();

});

/*=========================
RESET WEBSITE
=========================*/

function resetWebsite(){

    /*=====================
    SCROLL
    =====================*/

    window.scrollTo({
        top:0,
        behavior:"instant"
    });

    /*=====================
    BACKGROUND
    =====================*/

    stopFireflies();

    stopGlows();

    romanticBackground.classList.remove("show");

    section1Bokeh.style.opacity="1";

    startSection1Bokeh();

    /*=====================
    SECTION 1
    =====================*/

    section1.style.display="flex";
    section1.style.opacity="1";

    section1Button.disabled=false;

    /*=====================
    SECTION 2
    =====================*/

    section2.classList.remove("show");
    section2.style.opacity="1";
    section2.style.display="";

    hold=false;
    finished=false;
    progress=0;
    lastEmojiIndex=-1;

    updateHeart();

    const heartTitle=document.querySelector(".heart-title");

    heartTitle.style.display="";
    heartTitle.style.opacity="1";

    heart.style.display="";
    heart.style.opacity="1";
    heart.classList.remove("pulse");

    heartInstruction.style.display="";
    heartInstruction.style.opacity="1";

    heartSuccess.classList.remove("show");

    loveStatus.style.opacity="1";

    loveWarning.textContent="";
    loveWarning.style.opacity="0";

    section2Next.classList.remove("show");

    /*=====================
    SECTION 3
    =====================*/

    section3.classList.remove("show");
    section3.style.display="";
    section3.style.opacity="1";

    section3Header.style.display="";
    section3Header.classList.remove("hide");

    section3Lock.style.display="";
    section3Lock.classList.remove("hide");

    section3Loading.classList.remove("show");

    section3Gallery.classList.remove("show");

    section3Next.classList.remove("show");

    section3Preview.classList.remove("show");

    section3Slider.dataset.x=0;
    section3Slider.style.transform="translateX(0)";

    section3Progress.style.width="0";

    section3Text.classList.remove("hide");
    section3Text.classList.add("animate");

    /*=====================
    SECTION 4
    =====================*/

    section4.classList.remove("show","hide");

    section4.style.display="";
    section4.style.opacity="1";

    section4Fireworks=false;

    section4Rockets.length=0;
    section4Explosions.length=0;

    section4HeartWrap.classList.remove("hide-bg");

    /*=====================
    SECTION 5
    =====================*/

    section5.classList.remove("show","hide");

    section5.style.display="";
    section5.style.opacity="1";

    section5Gift.classList.remove("hide","shake");

    section5Lid.classList.remove("fly");

    section5Message.classList.remove("show");

    section5Typing.textContent="";

    section5Index=0;
    section5TypingDone=false;

    section5Replay.classList.remove("show");

    section5Particles.length=0;
    section5Emojis.length=0;

    section5Spraying=false;
}