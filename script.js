/* ============================
   💕 For My Love - JavaScript 💕
   Menggabungkan sistem CRUD Jeysen dengan visual CuteSpace
   ============================ */

// ============================
//  FLOATING HEARTS
// ============================
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const emojis = ['💕', '💖', '💗', '💓', '💝', '🌸', '✨', '🦋', '💌', '🧸'];
    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'heart-particle';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (14 + Math.random() * 18) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 12) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 22000);
    }
    // Initial wave
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 600);
    // Continuous
    setInterval(spawnHeart, 2500);
}

// ============================
//  NAVIGATION (SPA)
// ============================
function showSection(sectionId) {
    // Sembunyikan semua page
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    // Tampilkan page yang dipilih (mapping dari ID Jeysen ke ID structure baru)
    let pageElementId = 'pageLanding';
    if (sectionId === 'messages') pageElementId = 'pageMessages';
    if (sectionId === 'gallery') pageElementId = 'pageGallery';
    if (sectionId === 'playlist') pageElementId = 'pagePlaylist';

    const targetPage = document.getElementById(pageElementId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// ============================
//  MODALS
// ============================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Hentikan video jika lightbox ditutup
    if (id === 'modalViewGallery') {
        const container = document.getElementById('modalMediaContainer');
        container.innerHTML = '';
    }
}

function initModals() {
    // Click outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                closeModal(m.id);
            });
        }
    });
}

// ============================
//  TOAST
// ============================
function showToast(message, icon = '✅') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Get TimeStamp Now
function getTimeStamp() {
    const now = new Date();
    return now.toLocaleString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

const COLOR_GRADIENTS = {
    pink: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
    purple: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    blue: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
    green: 'linear-gradient(135deg, #96fbc4, #f9f586)',
    orange: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    rainbow: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd86f, #4facfe)'
};

function escapeHtml(unsafe) {
    return (unsafe || '').toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>");
}

// ============================
//  1. SECRET MESSAGES (LocalStorage Persisten)
// ============================
let messagesData = JSON.parse(localStorage.getItem('jeysenn_cute_messages')) || [];
let selectedStickers = ['💕'];
let selectedColor = 'pink';
let currentViewMsgIndex = null;

function renderMessages() {
    const grid = document.getElementById('msgGrid');
    const empty = document.getElementById('messagesEmpty');

    if (messagesData.length === 0) {
        grid.innerHTML = '';
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');
    grid.innerHTML = '';

    messagesData.forEach((msg, index) => {
        const card = document.createElement('div');
        card.className = 'envelope-card';
        card.style.background = COLOR_GRADIENTS[msg.color] || COLOR_GRADIENTS.pink;
        card.style.animationDelay = `${index * 0.1}s`;

        // Support backward compatibility if msg.sticker is a string
        let mainSticker = '💌';
        if (Array.isArray(msg.stickers) && msg.stickers.length > 0) {
            mainSticker = msg.stickers[0];
        } else if (msg.sticker) {
            mainSticker = msg.sticker;
        }

        card.innerHTML = `
            <button class="del-btn" onclick="deleteMessage(${index}, event)" title="Hapus">✕</button>
            <div class="envelope-icon">${mainSticker}</div>
            <div class="envelope-label">Buka Surat 💕</div>
        `;

        card.onclick = (e) => {
            if (!e.target.classList.contains('del-btn')) {
                openMsgModal(index);
            }
        };
        grid.appendChild(card);
    });
}

function initMessages() {
    const btnAdd = document.getElementById('btnAddMessage');
    const form = document.getElementById('formAddMessage');

    // Sticker picker (toggle multiple)
    document.querySelectorAll('#stickerPicker .sticker-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const sticker = btn.getAttribute('data-sticker');
            if (btn.classList.contains('selected')) {
                // Remove if there's more than 1 selected (don't allow 0 stickers)
                if (selectedStickers.length > 1) {
                    btn.classList.remove('selected');
                    selectedStickers = selectedStickers.filter(s => s !== sticker);
                }
            } else {
                btn.classList.add('selected');
                selectedStickers.push(sticker);
            }
        });
    });

    // Color picker
    document.querySelectorAll('#colorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#colorPicker .color-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.getAttribute('data-color');
        });
    });

    btnAdd.addEventListener('click', () => {
        document.getElementById('msgInput').value = '';
        // Reset selections
        selectedStickers = ['💕'];
        selectedColor = 'pink';
        document.querySelectorAll('#stickerPicker .sticker-option').forEach(b => {
            if (b.getAttribute('data-sticker') === '💕') b.classList.add('selected');
            else b.classList.remove('selected');
        });
        document.querySelectorAll('#colorPicker .color-option').forEach(b => b.classList.remove('selected'));
        document.querySelector('#colorPicker .color-option[data-color="pink"]').classList.add('selected');

        openModal('modalAddMessage');
    });

    document.getElementById('btnDeleteMsgFromModal').addEventListener('click', () => {
        if (currentViewMsgIndex !== null) {
            deleteMessage(currentViewMsgIndex, { stopPropagation: () => { } });
            closeModal('modalViewMessage');
        }
    });

    renderMessages();
}

function addMessage() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();

    if (!text) {
        showToast('Isi pesannya dulu dong sayang... 🥺', '❌');
        return;
    }

    messagesData.unshift({
        text: text,
        stickers: [...selectedStickers],
        color: selectedColor,
        time: getTimeStamp()
    });

    localStorage.setItem('jeysenn_cute_messages', JSON.stringify(messagesData));
    showToast('Pesan rahasia berhasil dikirim! 💌', '💌');
    closeModal('modalAddMessage');
    renderMessages();
}

function deleteMessage(index, event) {
    event.stopPropagation();
    if (confirm("Hapus surat ini?")) {
        messagesData.splice(index, 1);
        localStorage.setItem('jeysenn_cute_messages', JSON.stringify(messagesData));
        showToast('Pesan dihapus~', '🗑️');
        renderMessages();
    }
}

function openMsgModal(index) {
    const msg = messagesData[index];
    currentViewMsgIndex = index;

    const bg = COLOR_GRADIENTS[msg.color] || COLOR_GRADIENTS.pink;

    // Fallback for old data or default
    let stickersArr = ['💕'];
    if (Array.isArray(msg.stickers) && msg.stickers.length > 0) {
        stickersArr = msg.stickers;
    } else if (msg.sticker) {
        stickersArr = [msg.sticker];
    }

    // Update contents
    document.getElementById('modalMsgText').innerHTML = escapeHtml(msg.text);
    document.getElementById('viewMsgBody').style.background = 'transparent';
    document.querySelector('#modalViewMessage .modal-view-message').style.background = bg;
    document.getElementById('viewMsgBigSticker').textContent = stickersArr[Math.floor(Math.random() * stickersArr.length)];

    // Generate floating particles
    const particlesContainer = document.getElementById('modalStickerParticles');
    particlesContainer.innerHTML = '';

    // Create 15-25 random floating stickers
    const particleCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'modal-floating-sticker';
        particle.textContent = stickersArr[Math.floor(Math.random() * stickersArr.length)];

        // Randomize position, duration, and delay inside modal
        particle.style.left = (Math.random() * 90 + 5) + '%';
        particle.style.top = (Math.random() * 90 + 5) + '%';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';
        const size = (20 + Math.random() * 30) + 'px';
        particle.style.fontSize = size;

        // Custom animation variables for CSS
        particle.style.setProperty('--r', Math.random().toFixed(2));
        particle.style.setProperty('--r2', Math.random().toFixed(2));

        particlesContainer.appendChild(particle);
    }

    openModal('modalViewMessage');
}

// ============================
//  2. GALERI KENANGAN (CRUD Sesi - URL.createObjectURL)
// ============================
let galleryData = [];
let currentGalleryFile = null;

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('galleryEmpty');

    if (galleryData.length === 0) {
        grid.innerHTML = '';
        empty.classList.add('show');
        return;
    }

    empty.classList.remove('show');
    grid.innerHTML = galleryData.map((item, index) => {
        const isVideo = item.type.startsWith('video');
        return `
            <div class="gallery-card" style="animation-delay:${index * 0.1}s" onclick="openGalleryModal(${index})">
                <div class="gallery-card-media-container">
                    ${isVideo
                ? `<video class="gallery-card-media" src="${item.url}" muted preload="metadata"></video>
                           <span class="video-badge">🎬 Video</span>
                           <div class="play-overlay">▶️</div>`
                : `<img class="gallery-card-media" src="${item.url}" alt="Memory" loading="lazy">`
            }
                </div>
                <div class="gallery-card-info">
                    <div class="gallery-card-caption">${escapeHtml(item.caption || '✨ Kenangan Indah ✨')}</div>
                    <div class="gallery-card-timestamp">📅 Abadi pada: ${item.time}</div>
                </div>
                <button class="gallery-del-btn" onclick="deleteGallery(${index}, event)" title="Hapus">✕</button>
            </div>
        `;
    }).join('');
}

function initGallery() {
    const btnAdd = document.getElementById('btnAddGallery');
    const fileInput = document.getElementById('mediaInput');
    const uploadArea = document.getElementById('galleryUploadArea');
    const preview = document.getElementById('galleryPreview');
    const previewImg = document.getElementById('galleryPreviewImg');
    const previewVid = document.getElementById('galleryPreviewVid');
    const previewRemove = document.getElementById('galleryPreviewRemove');

    btnAdd.addEventListener('click', () => {
        document.getElementById('mediaCaption').value = '';
        resetGalleryPreview();
        openModal('modalAddGallery');
    });

    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            currentGalleryFile = fileInput.files[0];
            const url = URL.createObjectURL(currentGalleryFile);

            uploadArea.style.display = 'none';
            preview.style.display = 'block';

            if (currentGalleryFile.type.startsWith('video')) {
                previewImg.style.display = 'none';
                previewVid.style.display = 'block';
                previewVid.src = url;
            } else {
                previewVid.style.display = 'none';
                previewImg.style.display = 'block';
                previewImg.src = url;
            }
        }
    });

    previewRemove.addEventListener('click', resetGalleryPreview);

    renderGallery();
}

function resetGalleryPreview() {
    currentGalleryFile = null;
    document.getElementById('mediaInput').value = '';
    document.getElementById('galleryUploadArea').style.display = 'block';
    const preview = document.getElementById('galleryPreview');
    preview.style.display = 'none';
    document.getElementById('galleryPreviewImg').src = '';
    document.getElementById('galleryPreviewVid').src = '';
}

function addMedia() {
    const captionInput = document.getElementById('mediaCaption');

    if (!currentGalleryFile) {
        showToast('Pilih foto atau video dulu sayang! 📸', '⚠️');
        return;
    }

    const url = URL.createObjectURL(currentGalleryFile);

    galleryData.unshift({
        url: url,
        type: currentGalleryFile.type,
        caption: captionInput.value,
        time: getTimeStamp()
    });

    showToast('Kenangan baru ditambahkan! 📸', '📸');
    closeModal('modalAddGallery');
    renderGallery();
}

function deleteGallery(index, event) {
    event.stopPropagation();
    if (confirm("Hapus kenangan ini?")) {
        galleryData.splice(index, 1);
        showToast('Kenangan dihapus~', '🗑️');
        renderGallery();
    }
}

function openGalleryModal(index) {
    const item = galleryData[index];
    const container = document.getElementById('modalMediaContainer');

    if (item.type.startsWith('video')) {
        container.innerHTML = `<video src="${item.url}" controls autoplay></video>`;
    } else {
        container.innerHTML = `<img src="${item.url}" alt="full">`;
    }

    document.getElementById('modalMediaCaption').innerText = escapeHtml(item.caption || '✨ Kenangan Indah ✨');
    document.getElementById('modalMediaTime').innerText = `Abadi pada: ${item.time}`;

    openModal('modalViewGallery');
}

// ============================
//  3. PLAYLIST CINTA (CRUD Sesi - Custom Cute Player)
// ============================
let playlistData = [];
let audioPlayer = null;
let currentSongIndex = -1;
let isPlaying = false;
let currentSongFile = null;

function renderPlaylist() {
    const list = document.getElementById('playlistGrid');
    const empty = document.getElementById('playlistEmpty');
    const playerUI = document.getElementById('musicPlayer');

    if (playlistData.length === 0) {
        list.innerHTML = '';
        empty.classList.add('show');
        playerUI.style.display = 'none';
        return;
    }

    empty.classList.remove('show');
    playerUI.style.display = 'block';

    list.innerHTML = playlistData.map((song, i) => `
        <div class="playlist-item ${i === currentSongIndex ? 'active' : ''}" onclick="playSong(${i})" style="animation-delay:${i * 0.08}s">
            <span class="playlist-item-num">${i === currentSongIndex && isPlaying ? '🎵' : (i + 1)}</span>
            <div class="playlist-item-icon">${i === currentSongIndex && isPlaying ? '🎶' : '🎵'}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${escapeHtml(song.name)}</div>
                <div class="playlist-item-artist">Our special playlist</div>
            </div>
            <div class="playlist-item-actions">
                <button class="playlist-item-btn" onclick="deleteSong(${i}, event)" title="Hapus">🗑️</button>
            </div>
        </div>
    `).join('');
}

function initPlaylist() {
    audioPlayer = document.getElementById('mainAudio');
    const btnAdd = document.getElementById('btnAddSong');
    const fileInput = document.getElementById('audioInput');
    const uploadArea = document.getElementById('songUploadArea');
    const fileSelected = document.getElementById('songFileSelected');
    const fileName = document.getElementById('songFileName');
    const fileRemove = document.getElementById('songFileRemove');
    const btnPlay = document.getElementById('btnPlay');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    const progressBar = document.getElementById('progressBar');

    // Add button
    btnAdd.addEventListener('click', () => {
        document.getElementById('songName').value = '';
        resetSongPreview();
        openModal('modalAddSong');
    });

    // File handling
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            currentSongFile = fileInput.files[0];
            fileName.textContent = currentSongFile.name;
            uploadArea.style.display = 'none';
            fileSelected.style.display = 'flex';

            const nameInput = document.getElementById('songName');
            if (!nameInput.value) {
                nameInput.value = currentSongFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            }
        }
    });

    fileRemove.addEventListener('click', resetSongPreview);

    function resetSongPreview() {
        currentSongFile = null;
        fileInput.value = '';
        uploadArea.style.display = 'block';
        fileSelected.style.display = 'none';
    }

    // Player controls
    btnPlay.addEventListener('click', () => {
        if (currentSongIndex === -1 && playlistData.length > 0) {
            playSong(0);
        } else {
            togglePlay();
        }
    });

    btnNext.addEventListener('click', () => {
        if (playlistData.length === 0) return;
        const next = (currentSongIndex + 1) % playlistData.length;
        playSong(next);
    });

    btnPrev.addEventListener('click', () => {
        if (playlistData.length === 0) return;
        const prev = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
        playSong(prev);
    });

    // Progress bar updates
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
            document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        if (playlistData.length > 0) {
            const next = (currentSongIndex + 1) % playlistData.length;
            playSong(next);
        }
    });

    progressBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration)) {
            const time = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = time;
        }
    });

    renderPlaylist();
}

function addSong() {
    const nameInput = document.getElementById('songName');

    if (!currentSongFile || !nameInput.value.trim()) {
        showToast('Pilih lagu MP3 dan isi judulnya ya! 🎵', '⚠️');
        return;
    }

    const url = URL.createObjectURL(currentSongFile);

    playlistData.push({
        url: url,
        name: nameInput.value.trim()
    });

    showToast('Lagu ditambahkan ke playlist! 🎵', '🎵');
    closeModal('modalAddSong');
    renderPlaylist();
}

function deleteSong(index, event) {
    if (event) event.stopPropagation();

    if (confirm("Hapus lagu ini dari playlist?")) {
        // Jika lagu yang dihapus lagi diputer, stop player
        if (index === currentSongIndex) {
            audioPlayer.pause();
            audioPlayer.src = '';
            isPlaying = false;
            currentSongIndex = -1;
            document.getElementById('playerTitle').textContent = 'No Song Playing';
            document.getElementById('btnPlay').textContent = '▶️';
            document.getElementById('vinylDisc').classList.remove('spinning');
            document.getElementById('progressBar').value = 0;
            document.getElementById('currentTime').textContent = '0:00';
            document.getElementById('totalTime').textContent = '0:00';
        } else if (index < currentSongIndex) {
            currentSongIndex--;
        }

        playlistData.splice(index, 1);
        showToast('Lagu dihapus dari playlist~', '🗑️');
        renderPlaylist();
    }
}

function playSong(index) {
    const song = playlistData[index];
    currentSongIndex = index;

    audioPlayer.src = song.url;
    audioPlayer.play().catch(e => console.log(e));
    isPlaying = true;

    document.getElementById('playerTitle').textContent = song.name;
    document.getElementById('btnPlay').textContent = '⏸️';
    document.getElementById('vinylDisc').classList.add('spinning');

    renderPlaylist();
}

function togglePlay() {
    if (!audioPlayer.src) return;
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        document.getElementById('btnPlay').textContent = '▶️';
        document.getElementById('vinylDisc').classList.remove('spinning');
    } else {
        audioPlayer.play().catch(e => console.log(e));
        isPlaying = true;
        document.getElementById('btnPlay').textContent = '⏸️';
        document.getElementById('vinylDisc').classList.add('spinning');
    }
    renderPlaylist();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ============================
//  INISIALISASI AWAL
// ============================
window.onload = function () {
    initFloatingHearts();
    initModals();
    initMessages();
    initGallery();
    initPlaylist();
    // Tampilkan landing page di awal
    showSection('landing');
};