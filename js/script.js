/* ==========================================================================
   HAPPY BIRTHDAY NHÃ THY - CORE JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const introSection = document.getElementById("intro-section");
    const openBtn = document.getElementById("open-btn");
    const celebrationSection = document.getElementById("celebration-section");
    
    const musicPlayer = document.getElementById("music-player");
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const musicStatus = musicPlayer.querySelector(".music-status");
    
    const candles = document.querySelectorAll(".candle");
    const candleHint = document.getElementById("candle-hint");
    const wishesGalleryContainer = document.getElementById("wishes-gallery-container");
    const typewriterContainer = document.getElementById("typewriter-message");
    
    const video = document.getElementById("birthday-video");
    const videoOverlay = document.getElementById("video-overlay");
    
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    
    // State Variables
    let musicPlaying = false;
    let audioContext = null;
    let synthInterval = null;
    let bgAudio = null;
    let balloonsInterval = null;
    let isSynthPlaying = false;
    let ytPlayer = null;
    let ytReady = false;
    
    // Audio Configuration
    const audioConfig = {
        useYouTube: true, // Đặt thành true để dùng nhạc từ YouTube link, false để dùng MP3 hoặc nhạc còi tự phát
        youtubeId: 'S7KA4tQ483o', // ID của video YouTube (từ link https://www.youtube.com/watch?v=S7KA4tQ483o)
        localMp3Path: 'assets/audio/birthday-bgm.mp3'
    };
    
    // Custom Birthday Message for Nhã Thy
    const birthdayMessage = 
`Chào Nhã Thy! 🎉

Chúc cậu đón một tuổi mới thật rực rỡ, tràn đầy sức sống và luôn năng động như chính nụ cười của cậu vậy! 🌟

Mong rằng tuổi mới sẽ mang đến cho Thy thật nhiều niềm vui, những trải nghiệm thú vị, và mọi mục tiêu đề ra đều hoàn thành xuất sắc. Hãy luôn tự tin, rạng rỡ và yêu đời như hiện tại nhé! Cảm ơn vì cậu là một người bạn tuyệt vời. 💖

Chúc mừng sinh nhật, Nhã Thy! 🎂🎈✨`;

    // Khởi tạo YouTube Iframe Player API nếu chọn dùng YouTube
    if (audioConfig.useYouTube) {
        // Tạo thẻ div ẩn cho YouTube Player (tương thích iOS Safari)
        const ytDiv = document.createElement('div');
        ytDiv.id = 'youtube-player';
        ytDiv.style.position = 'fixed';
        ytDiv.style.bottom = '10px';
        ytDiv.style.right = '10px';
        ytDiv.style.width = '200px';
        ytDiv.style.height = '120px';
        ytDiv.style.opacity = '0.001';
        ytDiv.style.pointerEvents = 'none';
        ytDiv.style.zIndex = '-999';
        document.body.appendChild(ytDiv);

        // Nhúng thư viện YouTube API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Callback toàn cục khi API tải xong
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
                    'playlist': audioConfig.youtubeId // Bắt buộc để có thể tự động lặp lại video
                },
                events: {
                    'onReady': () => {
                        ytReady = true;
                        console.log("YouTube Player đã sẵn sàng!");
                    },
                    'onError': (e) => {
                        console.log("YouTube Player bị lỗi, chuyển sang chế độ dự phòng MP3/Synth:", e);
                        ytReady = false;
                    }
                }
            });
        };
    }

    /* ==========================================
       1. SCREEN TRANSITION & START
       ========================================== */
    openBtn.addEventListener("click", () => {
        // Khởi động nhạc NGAY LẬP TỨC để giữ ngữ cảnh tương tác (User Gesture) cho iOS Safari/Chrome
        initAudio();

        // Fade out intro envelope
        introSection.classList.add("fade-out");
        
        setTimeout(() => {
            introSection.classList.add("hidden-section");
            celebrationSection.classList.remove("hidden-section");
            
            // Trigger animation fade-in for celebration section
            setTimeout(() => {
                celebrationSection.classList.add("active-section");
            }, 50);
            
            // Start continuous floating balloons
            startBalloons();
        }, 800);
    });

    /* ==========================================
       2. AUDIO CONTROLLER & SYNTHESIZER
       ========================================== */
    // Fallback cute synthesized happy birthday melody
    const notes = [
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1 }, { note: 'C4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'E4', dur: 2 },
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1 }, { note: 'C4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'F4', dur: 2 },
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'C5', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'D4', dur: 2 },
        { note: 'A#4', dur: 0.5 }, { note: 'A#4', dur: 0.5 }, { note: 'A4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'F4', dur: 2 }
    ];

    const noteFreqs = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'A#4': 466.16, 'C5': 523.25
    };

    function initAudio() {
        if (audioConfig.useYouTube && ytReady && ytPlayer) {
            playMusic();
        } else {
            // Khởi tạo file MP3 cục bộ
            bgAudio = new Audio();
            bgAudio.src = audioConfig.localMp3Path;
            bgAudio.loop = true;
            
            bgAudio.play().then(() => {
                musicPlaying = true;
                musicPlayer.classList.add("playing");
                musicStatus.textContent = "Đang phát nhạc nền 🎵";
            }).catch((err) => {
                console.log("MP3 autoplay bị chặn hoặc không tìm thấy file. Chờ tương tác từ người dùng.", err);
                musicStatus.textContent = "Nhấp để phát nhạc sinh nhật 🎹";
            });
        }
    }

    // Toggle Music Button
    musicToggleBtn.addEventListener("click", () => {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function playMusic() {
        musicPlaying = true;
        musicPlayer.classList.add("playing");
        
        if (audioConfig.useYouTube && ytReady && ytPlayer) {
            try {
                ytPlayer.playVideo();
                musicStatus.textContent = "Đang phát nhạc YouTube 🎵";
            } catch (e) {
                console.log("Không phát được nhạc YouTube, chuyển sang dự phòng", e);
                playFallbackLocalAudio();
            }
        } else {
            playFallbackLocalAudio();
        }
    }

    function playFallbackLocalAudio() {
        if (bgAudio) {
            bgAudio.play().then(() => {
                musicStatus.textContent = "Đang phát nhạc nền 🎵";
            }).catch(() => {
                startSynthMelody();
            });
        } else {
            bgAudio = new Audio();
            bgAudio.src = audioConfig.localMp3Path;
            bgAudio.loop = true;
            bgAudio.play().then(() => {
                musicStatus.textContent = "Đang phát nhạc nền 🎵";
            }).catch(() => {
                startSynthMelody();
            });
        }
    }

    function pauseMusic() {
        musicPlaying = false;
        musicPlayer.classList.remove("playing");
        musicStatus.textContent = "Nhạc đã tạm dừng ⏸️";
        
        if (audioConfig.useYouTube && ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
            try {
                ytPlayer.pauseVideo();
            } catch(e) {}
        }
        if (bgAudio) {
            bgAudio.pause();
        }
        stopSynthMelody();
    }

    // Web Audio Synthesizer logic
    function startSynthMelody() {
        if (isSynthPlaying) return;
        isSynthPlaying = true;
        musicStatus.textContent = "Đang phát nhạc Retro Synth 🎹";
        
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        let currentNoteIndex = 0;
        
        function playNextNote() {
            if (!isSynthPlaying) return;
            
            const item = notes[currentNoteIndex];
            const freq = noteFreqs[item.note];
            const duration = item.dur * 0.45; // Tốc độ nốt nhạc
            
            playSynthTone(freq, duration);
            
            currentNoteIndex = (currentNoteIndex + 1) % notes.length;
            synthInterval = setTimeout(playNextNote, item.dur * 450);
        }
        
        playNextNote();
    }

    function stopSynthMelody() {
        isSynthPlaying = false;
        if (synthInterval) {
            clearTimeout(synthInterval);
            synthInterval = null;
        }
    }

    function playSynthTone(freq, duration) {
        if (!audioContext || audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start();
        osc.stop(audioContext.currentTime + duration);
    }

    // Play a quick cute "puff" synth tone when candles are blown
    function playBlowSound() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const bufferSize = audioContext.sampleRate * 0.15;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 400;
            filter.Q.value = 1.5;
            
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.4, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            noise.start();
        } catch (e) {
            console.log("Wind audio error", e);
        }
    }

    /* ==========================================
       3. INTERACTIVE CANDLES
       ========================================== */
    let candlesBlownCount = 0;
    
    candles.forEach(candle => {
        candle.addEventListener("click", () => {
            if (candle.getAttribute("data-blown") === "false") {
                candle.setAttribute("data-blown", "true");
                candle.classList.add("blown");
                playBlowSound();
                candlesBlownCount++;
                
                // Show some mini spark particles where the flame was
                spawnSparks(candle);
                
                if (candlesBlownCount === 3) {
                    revealWishes();
                }
            }
        });
    });

    function spawnSparks(candleElement) {
        const rect = candleElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top;
        
        for (let i = 0; i < 8; i++) {
            createSpark(startX, startY);
        }
    }

    function createSpark(x, y) {
        const spark = document.createElement("div");
        spark.style.position = 'fixed';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.width = '6px';
        spark.style.height = '6px';
        spark.style.borderRadius = '50%';
        spark.style.backgroundColor = '#FFE066';
        spark.style.boxShadow = '0 0 5px #FFE066';
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '999';
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 1.5; // slight upward drift
        
        document.body.appendChild(spark);
        
        let opacity = 1;
        let time = 0;
        
        function animate() {
            if (opacity <= 0) {
                spark.remove();
                return;
            }
            x += vx;
            y += vy;
            opacity -= 0.03;
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.opacity = opacity;
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    function revealWishes() {
        // Hide hint with fade
        candleHint.style.transition = "opacity 0.5s ease";
        candleHint.style.opacity = "0";
        setTimeout(() => candleHint.style.display = "none", 500);
        
        // Unleash heavy confetti shower
        startConfettiShower();
        
        // Show letter & gallery
        wishesGalleryContainer.classList.remove("wishes-hidden");
        
        setTimeout(() => {
            wishesGalleryContainer.classList.add("wishes-active");
            // Start Typewriter message effect
            startTypewriter(birthdayMessage);
        }, 300);
    }

    /* ==========================================
       4. TYPEWRITER EFFECT
       ========================================== */
    function startTypewriter(text) {
        typewriterContainer.textContent = "";
        let charIndex = 0;
        
        function type() {
            if (charIndex < text.length) {
                typewriterContainer.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 40); // 40ms per letter - quick but readable
            }
        }
        
        type();
    }

    /* ==========================================
       5. CONTINUOUS BALLOONS GENERATOR
       ========================================== */
    const balloonColors = ['#FF6B8B', '#FFA3B1', '#4ECDC4', '#FFE066', '#A29BFE', '#74B9FF', '#FF8E53'];

    function startBalloons() {
        // Generate immediately
        for(let i=0; i<6; i++) {
            setTimeout(createBalloon, Math.random() * 2000);
        }
        
        // Generate every 1.5s
        balloonsInterval = setInterval(createBalloon, 1500);
    }

    function createBalloon() {
        const container = document.getElementById("balloon-container");
        if (!container) return;
        
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        
        // Randomized attributes
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const left = Math.random() * 92; // Percent left
        const duration = Math.random() * 6 + 10; // 10s - 16s float speed
        const sizeMultiplier = Math.random() * 0.4 + 0.8; // size ratio
        
        balloon.style.backgroundColor = color;
        balloon.style.left = `${left}%`;
        balloon.style.animationDuration = `${duration}s`;
        balloon.style.transform = `scale(${sizeMultiplier})`;
        
        // Add random click burst
        balloon.addEventListener("click", () => {
            createBalloonBurst(balloon);
            balloon.remove();
        });
        
        container.appendChild(balloon);
        
        // Garbage collection
        setTimeout(() => {
            balloon.remove();
        }, duration * 1000);
    }

    function createBalloonBurst(balloonElement) {
        const rect = balloonElement.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        const color = balloonElement.style.backgroundColor;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
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

    /* ==========================================
       6. CONFETTI ENGINE (CANVAS)
       ========================================== */
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    let animationFrameId = null;
    let confettiParticles = [];
    const confettiColors = ['#FF6B8B', '#FFA3B1', '#4ECDC4', '#FFE066', '#A29BFE', '#74B9FF', '#FF9F43'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            // Spawn above screen
            this.y = Math.random() * -100 - 20;
            this.size = Math.random() * 6 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 4 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.wiggle = Math.random() * 0.05;
            this.wiggleSpeed = Math.random() * 0.02 + 0.01;
            this.phase = Math.random() * 100;
        }

        update() {
            this.y += this.speedY;
            this.phase += this.wiggleSpeed;
            this.x += this.speedX + Math.sin(this.phase) * 0.5;
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
        
        // Spawn 150 particles immediately
        for (let i = 0; i < 150; i++) {
            confettiParticles.push(new ConfettiParticle());
        }
        
        // Schedule continuous trickle of confetti
        let trickleTimer = setInterval(() => {
            if (confettiParticles.length < 250) {
                confettiParticles.push(new ConfettiParticle());
            }
        }, 150);
        
        // Stop trickle after 12 seconds to clear up
        setTimeout(() => {
            clearInterval(trickleTimer);
        }, 12000);

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                const p = confettiParticles[i];
                p.update();
                p.draw();
                
                // Remove if off screen
                if (p.y > canvas.height + 20) {
                    confettiParticles.splice(i, 1);
                }
            }
            
            if (confettiParticles.length > 0) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
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
        
        // Try playing video
        video.play().catch(e => {
            console.log("Video auto play blocked", e);
        });
        
        // Lower background music slightly while video plays
        if (bgAudio) {
            bgAudio.volume = 0.25;
        }
        if (audioConfig.useYouTube && ytPlayer && ytReady && typeof ytPlayer.setVolume === 'function') {
            try {
                ytPlayer.setVolume(20);
            } catch(e) {}
        }
    });

    video.addEventListener("pause", () => {
        if (bgAudio) {
            bgAudio.volume = 1.0;
        }
        if (audioConfig.useYouTube && ytPlayer && ytReady && typeof ytPlayer.setVolume === 'function') {
            try {
                ytPlayer.setVolume(100);
            } catch(e) {}
        }
    });

    video.addEventListener("play", () => {
        if (bgAudio) {
            bgAudio.volume = 0.25;
        }
        if (audioConfig.useYouTube && ytPlayer && ytReady && typeof ytPlayer.setVolume === 'function') {
            try {
                ytPlayer.setVolume(20);
            } catch(e) {}
        }
    });

    /* ==========================================
       8. PHOTO GALLERY CAROUSEL
       ========================================== */
    let currentSlide = 0;
    let autoSlideInterval = null;

    function showSlide(index) {
        // Wrap around limits
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        // Update active slide
        slides.forEach(slide => slide.classList.remove("active"));
        slides[currentSlide].classList.add("active");
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
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
        autoSlideInterval = setInterval(nextSlide, 5000); // Slide every 5 seconds
    }

    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    // Start auto slide
    startAutoSlide();
});
