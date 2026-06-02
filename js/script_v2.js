/* ==========================================================================
   HAPPY BIRTHDAY NHÃ THY - GAME LAYOUT JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const introSection = document.getElementById("intro-section");
    const openBtn = document.getElementById("open-btn");
    
    const loadingScreen = document.getElementById("loading-screen");
    const startProgressBtn = document.getElementById("start-game-btn");
    const loadingPercentText = document.getElementById("loading-percent");
    const loadingBarFill = document.getElementById("loading-bar-fill");
    
    const gameSection = document.getElementById("game-section");
    const gameArena = document.getElementById("game-arena");
    const gumaShooter = document.getElementById("guma-shooter");
    const gumaBubble = document.getElementById("guma-bubble");
    const csDisplay = document.getElementById("cs-display");
    const goldDisplay = document.getElementById("gold-display");
    const gameStatusText = document.getElementById("game-status-text");
    
    const victoryOverlay = document.getElementById("victory-overlay");
    const celebrationSection = document.getElementById("celebration-section");
    const wishesGalleryContainer = document.getElementById("wishes-gallery-container");
    const typewriterContainer = document.getElementById("typewriter-message");
    
    const musicPlayer = document.getElementById("music-player");
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const musicStatus = musicPlayer.querySelector(".music-status");
    
    const video = document.getElementById("birthday-video");
    const videoOverlay = document.getElementById("video-overlay");
    
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    
    // Game States
    let csScore = 0;
    let goldScore = 0;
    let isGameFinished = false;
    let minionsList = [];
    let gameLoopInterval = null;
    let minionSpawnInterval = null;
    
    // Audio States
    let musicPlaying = false;
    let audioCtx = null;
    let bgAudio = null;
    let balloonsInterval = null;
    let ytPlayer = null;
    let ytReady = false;

    // Happy Birthday Synthesizer States
    let isPlayingHappyBirthday = false;
    let happyBirthdayTimeoutIds = [];
    let activeOscillators = [];
    let happyBirthdayIndex = 0;
    
    // Transparent image cache data URLs (will be computed on load)
    let gumaShooterDataUrl = 'assets/images/gumayusi/gumayusi_shot_v2.png';
    let cannonMinionDataUrl = 'assets/images/cannon_minion_v2.png';
    let casterMinionDataUrl = 'assets/images/caster_minion_v2.png';
    
    // Audio Configuration
    const audioConfig = {
        useYouTube: true, // Use YouTube track for Gods
        youtubeId: 'S2k78Z2dYg4', // YouTube Video ID for "GODS" by NewJeans
        localMp3Path: 'assets/audio/birthday-bgm.mp3'
    };
    
    // Custom Birthday Message for Nhã Thy
    const birthdayMessage = 
`Chào Nhã Thy! 🎉

Chúc mừng cậu đã xuất sắc hoàn thành thử thách farm lính và giành chiến thắng MVP của trận đấu! 🏆

Chúc cậu đón một tuổi mới thật bùng nổ, tràn đầy sức sống và luôn tự tin "Show & Prove" bản thân trên mọi mặt trận giống như cách Gumayusi tỏa sáng vậy! 🌟

Mong rằng tuổi mới sẽ mang đến cho Thy thật nhiều niềm vui, những trải nghiệm tuyệt vời, và mọi dự định đề ra đều được cậu 'xạ thủ' bắn trúng hồng tâm. Hãy luôn tỏa sáng rực rỡ và giữ mãi nụ cười năng động nhé! Cảm ơn vì cậu là một người bạn tuyệt vời. 💖

Chúc mừng sinh nhật, Nhã Thy! 🎂🎈✨`;

    const bubbleQuotes = [
        "Bắn đỉnh quá Nhã Thy ơi! 🎯",
        "Nhã Thy farm lính chuẩn thế! 🏆",
        "Show and Prove, Nhã Thy! 🔥",
        "Guma khen Nhã Thy hết lời luôn nha! 🌟",
        "Nhã Thy bắn trúng rồi! Đỉnh! 🦊",
        "Kỹ năng của Nhã Thy quá cừ! 😎",
        "Nhã Thy gánh Guma còng lưng! 💖",
        "Một cú bắn tuyệt vời, Nhã Thy! 💥"
    ];

    const happyBirthdayNotes = [
        { note: 'C4', dur: 0.375 },
        { note: 'C4', dur: 0.125 },
        { note: 'D4', dur: 0.5 },
        { note: 'C4', dur: 0.5 },
        { note: 'F4', dur: 0.5 },
        { note: 'E4', dur: 1.0 },
        
        { note: 'C4', dur: 0.375 },
        { note: 'C4', dur: 0.125 },
        { note: 'D4', dur: 0.5 },
        { note: 'C4', dur: 0.5 },
        { note: 'G4', dur: 0.5 },
        { note: 'F4', dur: 1.0 },
        
        { note: 'C4', dur: 0.375 },
        { note: 'C4', dur: 0.125 },
        { note: 'C5', dur: 0.5 },
        { note: 'A4', dur: 0.5 },
        { note: 'F4', dur: 0.5 },
        { note: 'E4', dur: 0.5 },
        { note: 'D4', dur: 1.0 },
        
        { note: 'Bb4', dur: 0.375 },
        { note: 'Bb4', dur: 0.125 },
        { note: 'A4', dur: 0.5 },
        { note: 'F4', dur: 0.5 },
        { note: 'G4', dur: 0.5 },
        { note: 'F4', dur: 1.0 }
    ];

    const noteFreqs = {
        'C4': 261.63,
        'D4': 293.66,
        'E4': 329.63,
        'F4': 349.23,
        'G4': 392.00,
        'A4': 440.00,
        'Bb4': 466.16,
        'C5': 523.25
    };

    // Preload transparent images (no canvas pixel manipulation to avoid CORS/security restrictions)
    function preprocessImages(callback) {
        let loadedCount = 0;
        const targets = [
            gumaShooterDataUrl,
            cannonMinionDataUrl,
            casterMinionDataUrl
        ];

        targets.forEach(src => {
            const img = new Image();
            img.onload = function() {
                loadedCount++;
                if (loadedCount === targets.length) {
                    callback();
                }
            };
            img.onerror = function() {
                loadedCount++;
                if (loadedCount === targets.length) {
                    callback();
                }
            };
            img.src = src;
        });
    }

    // Run preloading immediately while user reads the envelope
    preprocessImages(() => {
        console.log("Đã tải xong toàn bộ hình ảnh trong suốt!");
        gumaShooter.querySelector("img").src = gumaShooterDataUrl;
    });

    // Khởi tạo YouTube Iframe Player API
    if (audioConfig.useYouTube) {
        const ytDiv = document.createElement('div');
        ytDiv.id = 'youtube-player';
        ytDiv.style.position = 'fixed';
        ytDiv.style.bottom = '10px';
        ytDiv.style.right = '10px';
        ytDiv.style.width = '1px';
        ytDiv.style.height = '1px';
        ytDiv.style.opacity = '0.001';
        ytDiv.style.pointerEvents = 'none';
        ytDiv.style.zIndex = '-999';
        document.body.appendChild(ytDiv);

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function() {
            ytPlayer = new YT.Player('youtube-player', {
                height: '1',
                width: '1',
                videoId: audioConfig.youtubeId,
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'disablekb': 1,
                    'fs': 0,
                    'rel': 0,
                    'showinfo': 0,
                    'loop': 1,
                    'playlist': audioConfig.youtubeId
                },
                events: {
                    'onReady': () => {
                        ytReady = true;
                        try {
                            ytPlayer.setVolume(20);
                        } catch(e) {}
                        console.log("YouTube Player Ready for GODS!");
                    },
                    'onError': (e) => {
                        console.log("YouTube Player Error, fallback to Synth", e);
                        ytReady = false;
                    }
                }
            });
        };
    }

    /* ==========================================
       SOUND SYNTHESIZER (WEB AUDIO API)
       ========================================== */
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playShootSound() {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
            
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {
            console.error(e);
        }
    }

    function playGoldSound() {
        try {
            const ctx = getAudioContext();
            const time = ctx.currentTime;
            
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(1046.50, time); // C6
            osc1.frequency.setValueAtTime(1396.91, time + 0.07); // F6
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(2093.00, time); // C7
            
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.start();
            osc2.start();
            osc1.stop(time + 0.3);
            osc2.stop(time + 0.3);
        } catch (e) {
            console.error(e);
        }
    }

        function playVictorySound() {
        try {
            const ctx = getAudioContext();
            const time = ctx.currentTime;
            
            const notes = [
                { f: [261.63, 329.63, 392.00], d: 0.3 }, // C Major
                { f: [349.23, 440.00, 523.25], d: 0.3 }, // F Major
                { f: [392.00, 493.88, 587.33], d: 0.3 }, // G Major
                { f: [523.25, 659.25, 783.99], d: 1.2 }  // C5 Major
            ];
            
            let offset = 0;
            notes.forEach(n => {
                n.f.forEach(freq => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, time + offset);
                    
                    gain.gain.setValueAtTime(0.08, time + offset);
                    gain.gain.exponentialRampToValueAtTime(0.001, time + offset + n.d);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(time + offset);
                    osc.stop(time + offset + n.d);
                });
                offset += n.d * 0.85;
            });
        } catch (e) {
            console.error(e);
        }
    }

    function playHappyBirthdaySynth() {
        stopHappyBirthdaySynth();
        
        isPlayingHappyBirthday = true;
        musicPlayer.classList.add("playing");
        musicStatus.textContent = "Đang phát nhạc sinh nhật 🎂";
        const musicTitleEl = musicPlayer.querySelector(".music-title");
        if (musicTitleEl) {
            musicTitleEl.textContent = "Happy Birthday Nhã Thy (Synth) 🎹";
        }

        let tempo = 110; // beats per minute (slightly slower, gentler)
        let beatDuration = 60 / tempo;
        
        function playNextNote() {
            if (!isPlayingHappyBirthday) return;
            
            const noteInfo = happyBirthdayNotes[happyBirthdayIndex];
            const freq = noteFreqs[noteInfo.note];
            const duration = noteInfo.dur * beatDuration * 2; // scale duration a bit
            
            playSynthNote(freq, duration - 0.05);
            
            happyBirthdayIndex = (happyBirthdayIndex + 1) % happyBirthdayNotes.length;
            
            const timeoutId = setTimeout(playNextNote, duration * 1000);
            happyBirthdayTimeoutIds.push(timeoutId);
        }
        
        playNextNote();
    }

    function playSynthNote(freq, duration) {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            // Subtle vibrato
            const vibrato = ctx.createOscillator();
            const vibratoGain = ctx.createGain();
            vibrato.frequency.value = 6.5; 
            vibratoGain.gain.value = 4.0; 
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            vibrato.start();
            
            // Envelope: soft attack & release
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.06, ctx.currentTime + duration - 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
            
            activeOscillators.push({ osc, vibrato, gain });
            setTimeout(() => {
                activeOscillators = activeOscillators.filter(item => item.osc !== osc);
            }, duration * 1000);
        } catch(e) {
            console.error(e);
        }
    }

    function stopHappyBirthdaySynth() {
        isPlayingHappyBirthday = false;
        musicPlayer.classList.remove("playing");
        musicStatus.textContent = "Nhạc sinh nhật tạm dừng ⏸️";
        
        happyBirthdayTimeoutIds.forEach(id => clearTimeout(id));
        happyBirthdayTimeoutIds = [];
        
        activeOscillators.forEach(item => {
            try {
                item.osc.stop();
                item.vibrato.stop();
            } catch(e) {}
        });
        activeOscillators = [];
    }

    /* ==========================================
       1. SCREEN TRANSITIONS
       ========================================== */
    openBtn.addEventListener("click", () => {
        getAudioContext();
        introSection.classList.add("fade-out");
        
        setTimeout(() => {
            introSection.classList.add("hidden-section");
            loadingScreen.classList.remove("hidden-section");
            startLoadingProgress();
        }, 800);
    });

    function startLoadingProgress() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                loadingBarFill.style.width = "100%";
                loadingPercentText.textContent = "100";
                
                setTimeout(() => {
                    startProgressBtn.classList.remove("hidden-element");
                }, 300);
            } else {
                loadingBarFill.style.width = `${progress}%`;
                loadingPercentText.textContent = progress;
            }
        }, 80);
    }

    startProgressBtn.addEventListener("click", () => {
        initAudio();
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transform = "scale(0.9)";
        
        setTimeout(() => {
            loadingScreen.classList.add("hidden-section");
            gameSection.classList.remove("hidden-section");
            musicPlayer.classList.remove("hidden-element");
            startGame();
        }, 500);
    });

    /* ==========================================
       2. AUDIO CONTROLLER (BG MUSIC)
       ========================================== */
    function initAudio() {
        if (audioConfig.useYouTube && ytReady && ytPlayer) {
            try {
                if (typeof ytPlayer.unMute === 'function') {
                    ytPlayer.unMute();
                }
                ytPlayer.setVolume(20); // 20% volume
            } catch(e) {}
            playMusic();
        } else {
            bgAudio = new Audio();
            bgAudio.src = audioConfig.localMp3Path;
            bgAudio.loop = true;
            bgAudio.volume = 0.2; // 20% volume
            
            bgAudio.play().then(() => {
                musicPlaying = true;
                musicPlayer.classList.add("playing");
                musicStatus.textContent = "Đang phát nhạc nền 🎵";
            }).catch((err) => {
                console.log("Local audio blocked, waiting for click", err);
                musicStatus.textContent = "Nhấp để phát nhạc sinh nhật 🎹";
            });
        }
    }

    musicToggleBtn.addEventListener("click", () => {
        if (isGameFinished) {
            if (isPlayingHappyBirthday) {
                stopHappyBirthdaySynth();
            } else {
                playHappyBirthdaySynth();
            }
        } else {
            if (musicPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        }
    });

    function playMusic() {
        musicPlaying = true;
        musicPlayer.classList.add("playing");
        
        if (audioConfig.useYouTube && ytReady && ytPlayer) {
            try {
                if (typeof ytPlayer.unMute === 'function') {
                    ytPlayer.unMute();
                }
                ytPlayer.setVolume(20); // 20% volume
                ytPlayer.playVideo();
                musicStatus.textContent = "Đang phát nhạc YouTube 🎵";
            } catch (e) {
                playLocalFallback();
            }
        } else {
            playLocalFallback();
        }
    }

    function playLocalFallback() {
        if (!bgAudio) {
            bgAudio = new Audio();
            bgAudio.src = audioConfig.localMp3Path;
            bgAudio.loop = true;
        }
        bgAudio.volume = 0.2; // 20% volume
        bgAudio.play().then(() => {
            musicStatus.textContent = "Đang phát nhạc nền 🎵";
        }).catch((e) => {
            console.log("Audio play failed", e);
        });
    }

    function pauseMusic() {
        musicPlaying = false;
        musicPlayer.classList.remove("playing");
        musicStatus.textContent = "Nhạc đã tạm dừng ⏸️";
        
        if (ytPlayer) {
            try {
                if (typeof ytPlayer.pauseVideo === 'function') {
                    ytPlayer.pauseVideo();
                }
                if (typeof ytPlayer.stopVideo === 'function') {
                    ytPlayer.stopVideo();
                }
                if (typeof ytPlayer.mute === 'function') {
                    ytPlayer.mute();
                }
            } catch(e) {}
        }
        if (bgAudio) {
            try {
                bgAudio.pause();
                bgAudio.currentTime = 0;
            } catch(e) {}
        }
    }

    /* ==========================================
       3. MINI-GAME LOGIC (FARM MINIONS)
       ========================================== */
    function startGame() {
        gameArena.addEventListener("mousemove", handleShooterMove);
        gameArena.addEventListener("touchmove", handleShooterTouchMove);
        gameArena.addEventListener("mousedown", handleArenaShoot);
        
        gameLoopInterval = setInterval(updateGameLoop, 1000 / 60);
        minionSpawnInterval = setInterval(spawnMinion, 1600);
        
        spawnMinion();
        showSpeechBubble("Guma bắn lính, Nhã Thy click phụ nhé! Let's go!");
    }

    function handleShooterMove(e) {
        const arenaRect = gameArena.getBoundingClientRect();
        let mouseX = e.clientX - arenaRect.left;
        
        const halfWidth = gumaShooter.offsetWidth / 2;
        mouseX = Math.max(halfWidth, Math.min(arenaRect.width - halfWidth, mouseX));
        gumaShooter.style.left = `${mouseX}px`;
    }

    function handleShooterTouchMove(e) {
        if (e.touches.length > 0) {
            const arenaRect = gameArena.getBoundingClientRect();
            let touchX = e.touches[0].clientX - arenaRect.left;
            
            const halfWidth = gumaShooter.offsetWidth / 2;
            touchX = Math.max(halfWidth, Math.min(arenaRect.width - halfWidth, touchX));
            gumaShooter.style.left = `${touchX}px`;
        }
    }

    function handleArenaShoot(e) {
        if (e.target.closest(".minion") || isGameFinished) return;
        
        const arenaRect = gameArena.getBoundingClientRect();
        const clickX = e.clientX - arenaRect.left;
        const clickY = e.clientY - arenaRect.top;
        
        shootLaser(clickX, clickY);
        
        if (Math.random() < 0.2) {
            showSpeechBubble("Bắn hụt rồi cậu ơi! Cố lên! 🏹");
        }
    }

    function showSpeechBubble(text) {
        const bubbleTextEl = gumaBubble.querySelector(".bubble-text");
        if (bubbleTextEl) {
            bubbleTextEl.textContent = text;
        } else {
            gumaBubble.textContent = text;
        }
        gumaBubble.classList.add("show");
        
        if (gumaBubble.timeoutId) {
            clearTimeout(gumaBubble.timeoutId);
        }
        
        gumaBubble.timeoutId = setTimeout(() => {
            gumaBubble.classList.remove("show");
        }, 2200);
    }

    function shootLaser(targetX, targetY) {
        playShootSound();
        
        const arenaRect = gameArena.getBoundingClientRect();
        const shooterRect = gumaShooter.getBoundingClientRect();
        
        // Laser muzzle near Guma's hands
        const muzzleX = shooterRect.left + (shooterRect.width / 2) - arenaRect.left;
        const muzzleY = shooterRect.top + 30 - arenaRect.top; 
        
        const laser = document.createElement("div");
        laser.className = "laser-beam";
        
        const angle = Math.atan2(targetY - muzzleY, targetX - muzzleX);
        const distance = Math.hypot(targetY - muzzleY, targetX - muzzleX);
        
        laser.style.width = `${distance}px`;
        laser.style.left = `${muzzleX}px`;
        laser.style.top = `${muzzleY}px`;
        laser.style.transform = `rotate(${angle}rad)`;
        
        gameArena.appendChild(laser);
        
        setTimeout(() => {
            laser.remove();
        }, 180);
    }

    let minionIdCounter = 0;
    function spawnMinion() {
        if (isGameFinished || csScore >= 10) return;
        
        const isCannon = Math.random() < 0.35; // 35% Cannon minion, 65% Caster minion
        const hp = isCannon ? 3 : 1; // Cannon minion has 3 HP, Caster has 1 HP
        const minionEl = document.createElement("div");
        minionEl.className = "minion";
        
        // Increase size slightly for Cannon minion to feel more realistic and tanky
        if (isCannon) {
            minionEl.style.width = '64px';
            minionEl.style.height = '64px';
        }
        
        minionEl.innerHTML = `
            <div class="minion-hp-bar">
                <div class="minion-hp-fill" style="width: 100%"></div>
            </div>
            <div class="minion-sprite">
                <img src="${isCannon ? cannonMinionDataUrl : casterMinionDataUrl}" style="width:100%;height:100%;object-fit:contain;">
            </div>
        `;
        
        const startFromLeft = Math.random() < 0.5;
        const x = startFromLeft ? -70 : gameArena.offsetWidth + 10;
        const minY = 20;
        const maxY = (gameArena.offsetHeight / 2) - 40; // Spawns in top half of the arena to avoid overlapping Guma
        const y = Math.random() * (maxY - minY) + minY;
        
        minionEl.style.left = `${x}px`;
        minionEl.style.top = `${y}px`;
        
        gameArena.appendChild(minionEl);
        
        const speed = Math.random() * 1.0 + 0.7; // slightly slower for realistic feel
        const directionX = startFromLeft ? 1 : -1;
        const mId = minionIdCounter++;
        
        const minionData = {
            id: mId,
            element: minionEl,
            hpFill: minionEl.querySelector(".minion-hp-fill"),
            x: x,
            y: y,
            hp: hp,
            maxHp: hp,
            isCannon: isCannon,
            speed: speed,
            directionX: directionX
        };
        
        const hitTrigger = (clientX, clientY) => {
            if (isGameFinished) return;
            
            const arenaRect = gameArena.getBoundingClientRect();
            const localX = clientX - arenaRect.left;
            const localY = clientY - arenaRect.top;
            
            shootLaser(localX, localY);
            handleMinionDamage(minionData);
        };

        minionEl.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            hitTrigger(e.clientX, e.clientY);
        });
        
        minionEl.addEventListener("touchstart", (e) => {
            e.stopPropagation();
            if (e.touches.length > 0) {
                hitTrigger(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        minionsList.push(minionData);
    }

    function handleMinionDamage(minion) {
        // Every single hit triggers a Guma praise quote for Nha Thy!
        const randQuote = bubbleQuotes[Math.floor(Math.random() * bubbleQuotes.length)];
        showSpeechBubble(randQuote);

        minion.hp--;
        const percent = (minion.hp / minion.maxHp) * 100;
        minion.hpFill.style.width = `${percent}%`;
        
        if (minion.hp <= 0) {
            // Kill Minion
            minionsList = minionsList.filter(m => m.id !== minion.id);
            minion.element.style.pointerEvents = 'none';
            minion.element.style.transform = 'scale(0.7) rotate(45deg)';
            minion.element.style.opacity = '0';
            minion.element.style.transition = 'all 0.3s ease';
            
            setTimeout(() => minion.element.remove(), 300);
            
            csScore++;
            csDisplay.textContent = `${csScore}/10`;
            
            const goldEarned = minion.isCannon ? 50 : 21;
            goldScore += goldEarned;
            goldDisplay.textContent = goldScore;
            
            playGoldSound();
            spawnGoldPopup(minion.x, minion.y, goldEarned);
            
            if (csScore >= 10) {
                triggerVictory();
            }
        }
    }

    function spawnGoldPopup(x, y, amount) {
        const popup = document.createElement("div");
        popup.className = "gold-popup";
        popup.textContent = `+${amount}G`;
        popup.style.left = `${Math.max(10, Math.min(gameArena.offsetWidth - 50, x))}px`;
        popup.style.top = `${y}px`;
        gameArena.appendChild(popup);
        
        setTimeout(() => popup.remove(), 700);
    }

    function updateGameLoop() {
        if (isGameFinished) return;
        
        for (let i = minionsList.length - 1; i >= 0; i--) {
            const m = minionsList[i];
            m.x += m.speed * m.directionX;
            m.element.style.left = `${m.x}px`;
            
            const isOutOfScreen = (m.directionX === 1 && m.x > gameArena.offsetWidth + 80) || 
                                  (m.directionX === -1 && m.x < -80);
            if (isOutOfScreen) {
                m.element.remove();
                minionsList.splice(i, 1);
            }
        }
    }

    /* ==========================================
       4. VICTORY REVEAL & WISHES SCREEN
       ========================================== */
    function triggerVictory() {
        // Stop current bg music (GODS) immediately
        try {
            pauseMusic();
        } catch(e) {
            console.error(e);
        }
        
        isGameFinished = true;
        clearInterval(gameLoopInterval);
        clearInterval(minionSpawnInterval);
        
        try {
            minionsList.forEach(m => {
                if (m && m.element) m.element.remove();
            });
        } catch(e) {}
        minionsList = [];
        
        try {
            playVictorySound();
        } catch(e) {}
        
        // Start Happy Birthday synth music after a short delay
        setTimeout(() => {
            playHappyBirthdaySynth();
        }, 1200);
        
        victoryOverlay.classList.remove("victory-hidden");
        victoryOverlay.classList.add("victory-visible");
        
        setTimeout(() => {
            victoryOverlay.style.opacity = "0";
            
            setTimeout(() => {
                victoryOverlay.classList.remove("victory-visible");
                victoryOverlay.classList.add("victory-hidden");
                
                gameSection.style.opacity = "0";
                setTimeout(() => {
                    gameSection.classList.add("hidden-section");
                    celebrationSection.classList.remove("hidden-section");
                    
                    setTimeout(() => {
                        celebrationSection.classList.add("active-section");
                        startTypewriter(birthdayMessage);
                        startBalloons();
                        startConfettiShower();
                    }, 50);
                }, 500);
            }, 500);
        }, 3200);
    }

    /* ==========================================
       5. TYPEWRITER EFFECT
       ========================================== */
    function startTypewriter(text) {
        typewriterContainer.textContent = "";
        let charIndex = 0;
        
        function type() {
            if (charIndex < text.length) {
                typewriterContainer.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 35);
            }
        }
        
        type();
    }

    /* ==========================================
       6. BALLOONS & CONFETTI ENGINE
       ========================================== */
    const balloonColors = ['#FF2E55', '#D4AF37', '#00E5FF', '#111827', '#E10600', '#FFD54F', '#7E22CE'];

    function startBalloons() {
        for(let i = 0; i < 5; i++) {
            setTimeout(createBalloon, Math.random() * 2000);
        }
        balloonsInterval = setInterval(createBalloon, 1600);
    }

    function createBalloon() {
        const container = document.getElementById("balloon-container");
        if (!container) return;
        
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const left = Math.random() * 92;
        const duration = Math.random() * 6 + 10;
        const scale = Math.random() * 0.4 + 0.8;
        
        balloon.style.backgroundColor = color;
        balloon.style.left = `${left}%`;
        balloon.style.animationDuration = `${duration}s`;
        balloon.style.transform = `scale(${scale})`;
        
        balloon.addEventListener("click", () => {
            createBalloonBurst(balloon);
            balloon.remove();
        });
        
        container.appendChild(balloon);
        
        setTimeout(() => {
            balloon.remove();
        }, duration * 1000);
    }

    function createBalloonBurst(balloon) {
        const rect = balloon.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const color = balloon.style.backgroundColor;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '7px';
            particle.style.height = '7px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = color;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '99';
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            document.body.appendChild(particle);
            
            let opacity = 1;
            function animate() {
                if (opacity <= 0) {
                    particle.remove();
                    return;
                }
                const px = parseFloat(particle.style.left) + vx;
                const py = parseFloat(particle.style.top) + vy;
                opacity -= 0.04;
                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = opacity;
                requestAnimationFrame(animate);
            }
            animate();
        }
    }

    // Confetti Engine
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    let animId = null;
    let confettiParticles = [];
    const confettiColors = ['#E10600', '#D4AF37', '#00E5FF', '#FFFFFF', '#A855F7', '#3B82F6'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -100 - 20;
            this.size = Math.random() * 6 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 4 + 2.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.phase = Math.random() * 100;
        }

        update() {
            this.y += this.speedY;
            this.phase += 0.02;
            this.x += this.speedX + Math.sin(this.phase) * 0.4;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    function startConfettiShower() {
        confettiParticles = [];
        
        for (let i = 0; i < 140; i++) {
            confettiParticles.push(new Confetti());
        }
        
        let timer = setInterval(() => {
            if (confettiParticles.length < 220) {
                confettiParticles.push(new Confetti());
            }
        }, 120);
        
        setTimeout(() => clearInterval(timer), 10000);

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                const p = confettiParticles[i];
                p.update();
                p.draw();
                
                if (p.y > canvas.height + 20) {
                    confettiParticles.splice(i, 1);
                }
            }
            
            if (confettiParticles.length > 0) {
                animId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animId);
                animId = null;
            }
        }
        
        render();
    }

    /* ==========================================
       7. VIDEO OVERLAY & CONTROLS
       ========================================== */
    videoOverlay.addEventListener("click", () => {
        videoOverlay.style.opacity = "0";
        setTimeout(() => {
            videoOverlay.style.display = "none";
        }, 300);
        
        video.play().catch(e => console.log(e));
        
        // Pause Happy Birthday synth during video play
        if (isPlayingHappyBirthday) {
            stopHappyBirthdaySynth();
            video.shouldResumeSynth = true;
        }
    });

    video.addEventListener("pause", () => {
        if (video.shouldResumeSynth) {
            playHappyBirthdaySynth();
            video.shouldResumeSynth = false;
        }
    });

    video.addEventListener("play", () => {
        if (isPlayingHappyBirthday) {
            stopHappyBirthdaySynth();
            video.shouldResumeSynth = true;
        }
    });

    video.addEventListener("ended", () => {
        if (video.shouldResumeSynth) {
            playHappyBirthdaySynth();
            video.shouldResumeSynth = false;
        }
    });

    /* ==========================================
       8. CAROUSEL SLIDESHOW
       ========================================== */
    let currentSlide = 0;
    let autoSlideTimer = null;

    function showSlide(index) {
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        slides.forEach(slide => slide.classList.remove("active"));
        slides[currentSlide].classList.add("active");
        
        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentSlide].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {
        showSlide(currentSlide + 1);
        resetAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        showSlide(currentSlide - 1);
        resetAutoSlide();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"));
            showSlide(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 4500);
    }

    function resetAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        }
    }

    startAutoSlide();
});
