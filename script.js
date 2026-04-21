/* ============================
   💕 For My Love - JavaScript 💕
   Menggabungkan sistem CRUD Jeysen dengan visual CuteSpace (Firebase Realtime Pro)
   ============================ */

// ============================
//  GLOBAL CONNECTION STATE & CONFIG
// ============================
let isOnline = navigator.onLine;
let firestoreConnected = true;

// File size limits (in MB)
const FILE_LIMITS = {
    image: 5,
    video: 20,
    audio: 10
};

// Monitor connection status
window.addEventListener('online', () => {
    isOnline = true;
    updateConnectionStatus();
    showToast('Koneksi kembali! 🟢', '🔌');
});

window.addEventListener('offline', () => {
    isOnline = false;
    updateConnectionStatus();
    showToast('Mode offline - data tersimpan lokal 💾', '🔌');
});

// Setup Firestore offline persistence
if (typeof firebase !== 'undefined' && typeof db !== 'undefined') {
    firebase.firestore().enablePersistence()
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.log('Multiple tabs open, persistence only in one tab');
            } else if (err.code === 'unimplemented') {
                console.log('Browser not supported for persistence');
            }
        });
}

// Monitor Firestore connection status
if (typeof db !== 'undefined') {
    db.collection('_status').doc('heartbeat').onSnapshot(
        (doc) => {
            firestoreConnected = true;
            updateConnectionStatus();
        },
        (error) => {
            if (error.code !== 'permission-denied') {
                firestoreConnected = false;
            }
            updateConnectionStatus();
        }
    );
}

function updateConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    if (statusEl) {
        if (isOnline && firestoreConnected) {
            statusEl.innerHTML = '🟢 Online';
            statusEl.classList.remove('offline');
            statusEl.classList.remove('syncing');
        } else if (isOnline) {
            statusEl.innerHTML = '🟡 Sync...';
            statusEl.classList.add('syncing');
            statusEl.classList.remove('offline');
        } else {
            statusEl.innerHTML = '🔴 Offline';
            statusEl.classList.add('offline');
            statusEl.classList.remove('syncing');
        }
    }
}

// ============================
//  FILE VALIDATION
// ============================
function validateFileSize(file, type) {
    const maxSizeMB = FILE_LIMITS[type] || 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        showToast(`File terlalu besar! Max ${maxSizeMB}MB`, '❌');
        return false;
    }
    return true;
}

function validateFileType(file, allowedTypes) {
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
        showToast('Tipe file tidak didukung! 📁', '❌');
        return false;
    }
    return true;
}

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
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 600);
    setInterval(spawnHeart, 2500);
}

// ============================
//  NAVIGATION (SPA)
// ============================
function showSection(sectionId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

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
//  MODALS & OVERLAYS
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
    if (id === 'modalViewGallery') {
        const container = document.getElementById('modalMediaContainer');
        container.innerHTML = '';
    }
}

function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
        }
    });
}

function showUploadOverlay(text = "Mengupload... 💕") {
    document.getElementById('uploadText').textContent = text;
    document.getElementById('uploadPercent').textContent = "0%";
    document.getElementById('uploadProgressFill').style.width = "0%";
    document.getElementById('uploadOverlay').style.display = 'flex';
}

function hideUploadOverlay() {
    document.getElementById('uploadOverlay').style.display = 'none';
}

function updateUploadProgress(percent) {
    const p = Math.round(percent);
    document.getElementById('uploadPercent').textContent = p + "%";
    document.getElementById('uploadProgressFill').style.width = p + "%";
}

// ============================
//  TOAST & UTILS
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
//  1. SECRET MESSAGES (Firebase Firestore - Realtime)
// ============================
let messagesData = [];
let selectedStickers = ['💕'];
let selectedColor = 'pink';
let currentViewMsgIndex = null;
let messagesListener = null;

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
        card.style.animationDelay = `${(index % 10) * 0.1}s`;

        let mainSticker = '💌';
        if (Array.isArray(msg.stickers) && msg.stickers.length > 0) {
            mainSticker = msg.stickers[0];
        } else if (msg.sticker) {
            mainSticker = msg.sticker;
        }

        card.innerHTML = `
            <button class="del-btn" onclick="deleteMessage('${msg.id}', event)" title="Hapus">✕</button>
            <div class="envelope-icon">${mainSticker}</div>
            <div class="envelope-label">Buka Surat 💕</div>
        `;

        card.onclick = (e) => {
            if (!e.target.classList.contains('del-btn')) openMsgModal(index);
        };
        grid.appendChild(card);
    });
}

function initMessages() {
    const btnAdd = document.getElementById('btnAddMessage');

    document.querySelectorAll('#stickerPicker .sticker-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const sticker = btn.getAttribute('data-sticker');
            if (btn.classList.contains('selected')) {
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

    document.querySelectorAll('#colorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#colorPicker .color-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.getAttribute('data-color');
        });
    });

    btnAdd.addEventListener('click', () => {
        document.getElementById('msgInput').value = '';
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
            const id = messagesData[currentViewMsgIndex].id;
            deleteMessage(id, { stopPropagation: () => { } });
            closeModal('modalViewMessage');
        }
    });

    // Realtime Firestore listener
    if (messagesListener) messagesListener();
    
    messagesListener = db.collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .onSnapshot(
            (snapshot) => {
                messagesData = [];
                snapshot.forEach(doc => {
                    messagesData.push({ id: doc.id, ...doc.data() });
                });
                renderMessages();
                updateConnectionStatus();
            },
            (error) => {
                console.error("Error fetching messages:", error);
                if (error.code !== 'permission-denied') {
                    showToast('Gagal load pesan: ' + error.message, '⚠️');
                }
            }
        );
}

function addMessage() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();

    if (!text) {
        showToast('Isi pesannya dulu dong sayang... 🥺', '❌');
        return;
    }

    if (text.length > 1000) {
        showToast('Pesan terlalu panjang max 1000 karakter! 📝', '❌');
        return;
    }

    if (!isOnline) {
        showToast('Pesan akan ter-save setelah online! 💾', '⚠️');
    }

    db.collection('messages').add({
        text: text,
        stickers: [...selectedStickers],
        color: selectedColor,
        time: getTimeStamp(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        showToast('Pesan rahasia berhasil dikirim! 💌', '💌');
        input.value = '';
        closeModal('modalAddMessage');
    }).catch(error => {
        console.error("Add message error:", error);
        showToast('Gagal mengirim pesan: ' + error.message, '❌');
    });
}

function deleteMessage(id, event) {
    event.stopPropagation();
    if (confirm("Hapus surat ini?")) {
        db.collection('messages').doc(id).delete()
            .then(() => showToast('Pesan dihapus~', '🗑️'))
            .catch(error => showToast('Gagal menghapus: ' + error.message, '❌'));
    }
}

function openMsgModal(index) {
    const msg = messagesData[index];
    currentViewMsgIndex = index;
    const bg = COLOR_GRADIENTS[msg.color] || COLOR_GRADIENTS.pink;

    let stickersArr = Array.isArray(msg.stickers) && msg.stickers.length > 0 ? msg.stickers : (msg.sticker ? [msg.sticker] : ['💕']);

    document.getElementById('modalMsgText').innerHTML = escapeHtml(msg.text);
    document.getElementById('viewMsgBody').style.background = 'transparent';
    document.querySelector('#modalViewMessage .modal-view-message').style.background = bg;
    document.getElementById('viewMsgBigSticker').textContent = stickersArr[Math.floor(Math.random() * stickersArr.length)];

    const particlesContainer = document.getElementById('modalStickerParticles');
    particlesContainer.innerHTML = '';
    const particleCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'modal-floating-sticker';
        particle.textContent = stickersArr[Math.floor(Math.random() * stickersArr.length)];
        particle.style.left = (Math.random() * 90 + 5) + '%';
        particle.style.top = (Math.random() * 90 + 5) + '%';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';
        particle.style.fontSize = (20 + Math.random() * 30) + 'px';
        particle.style.setProperty('--r', Math.random().toFixed(2));
        particle.style.setProperty('--r2', Math.random().toFixed(2));
        particlesContainer.appendChild(particle);
    }
    openModal('modalViewMessage');
}

// ============================
//  2. GALERI KENANGAN (Firebase Storage + Firestore - Realtime)
// ============================
let galleryData = [];
let currentGalleryFile = null;
let galleryListener = null;

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
            <div class="gallery-card" style="animation-delay:${(index % 10) * 0.1}s" onclick="openGalleryModal(${index})">
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
                <button class="gallery-del-btn" onclick="deleteGallery('${item.id}', event)" title="Hapus">✕</button>
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
            const file = fileInput.files[0];
            
            // Validate file type
            const isImage = file.type.startsWith('image');
            const isVideo = file.type.startsWith('video');
            
            if (!isImage && !isVideo) {
                showToast('Hanya foto atau video yang didukung! 📸', '❌');
                fileInput.value = '';
                return;
            }

            // Validate file size
            const type = isImage ? 'image' : 'video';
            if (!validateFileSize(file, type)) {
                fileInput.value = '';
                return;
            }

            currentGalleryFile = file;
            const url = URL.createObjectURL(file);

            uploadArea.style.display = 'none';
            preview.style.display = 'block';

            if (isVideo) {
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

    // Realtime Firestore listener
    if (galleryListener) galleryListener();
    
    galleryListener = db.collection('gallery')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .onSnapshot(
            (snapshot) => {
                galleryData = [];
                snapshot.forEach(doc => {
                    galleryData.push({ id: doc.id, ...doc.data() });
                });
                renderGallery();
                updateConnectionStatus();
            },
            (error) => {
                console.error("Error fetching gallery:", error);
                if (error.code !== 'permission-denied') {
                    showToast('Gagal load galeri: ' + error.message, '⚠️');
                }
            }
        );
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

    const file = currentGalleryFile;
    const filename = `gallery_${Date.now()}_${file.name}`;
    const uploadTask = storage.ref(`gallery/${filename}`).put(file);

    showUploadOverlay('Mengupload Kenangan... 📸');

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateUploadProgress(progress);
        },
        (error) => {
            hideUploadOverlay();
            console.error("Upload error:", error);
            showToast('Gagal upload file: ' + error.message, '❌');
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection('gallery').add({
                    url: downloadURL,
                    type: file.type,
                    caption: captionInput.value.trim(),
                    time: getTimeStamp(),
                    filename: filename,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    hideUploadOverlay();
                    showToast('Kenangan baru ditambahkan! 📸', '📸');
                    resetGalleryPreview();
                    closeModal('modalAddGallery');
                }).catch(err => {
                    hideUploadOverlay();
                    console.error("Add gallery error:", err);
                    showToast('Gagal simpan data: ' + err.message, '❌');
                });
            }).catch(err => {
                hideUploadOverlay();
                console.error("Get URL error:", err);
                showToast('Gagal get download URL: ' + err.message, '❌');
            });
        }
    );
}

function deleteGallery(id, event) {
    event.stopPropagation();
    if (confirm("Hapus kenangan ini?")) {
        const item = galleryData.find(g => g.id === id);
        if (item && item.filename) {
            storage.ref(`gallery/${item.filename}`).delete()
                .catch(e => console.log('Storage delete error:', e));
        }
        db.collection('gallery').doc(id).delete()
            .then(() => {
                showToast('Kenangan dihapus~', '🗑️');
                closeModal('modalViewGallery');
            })
            .catch(error => showToast('Gagal menghapus: ' + error.message, '❌'));
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

    document.getElementById('btnDeleteGallery').onclick = (e) => deleteGallery(item.id, e);

    openModal('modalViewGallery');
}

// ============================
//  3. PLAYLIST CINTA (Firebase Storage + Firestore - Realtime)
// ============================
let playlistData = [];
let audioPlayer = null;
let currentSongIndex = -1;
let isPlaying = false;
let currentSongFile = null;
let playlistListener = null;

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
        <div class="playlist-item ${i === currentSongIndex ? 'active' : ''}" onclick="playSong(${i})" style="animation-delay:${(i % 10) * 0.08}s">
            <span class="playlist-item-num">${i === currentSongIndex && isPlaying ? '🎵' : (i + 1)}</span>
            <div class="playlist-item-icon">${i === currentSongIndex && isPlaying ? '🎶' : '🎵'}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${escapeHtml(song.name)}</div>
                <div class="playlist-item-artist">Our special playlist</div>
            </div>
            <div class="playlist-item-actions">
                <button class="playlist-item-btn" onclick="deleteSong('${song.id}', event)" title="Hapus">🗑️</button>
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

    btnAdd.addEventListener('click', () => {
        document.getElementById('songName').value = '';
        resetSongPreview();
        openModal('modalAddSong');
    });

    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            // Validate file type
            if (!file.type.startsWith('audio')) {
                showToast('Hanya file audio yang didukung! 🎵', '❌');
                fileInput.value = '';
                return;
            }

            // Validate file size
            if (!validateFileSize(file, 'audio')) {
                fileInput.value = '';
                return;
            }

            currentSongFile = file;
            fileName.textContent = file.name;
            uploadArea.style.display = 'none';
            fileSelected.style.display = 'flex';

            const nameInput = document.getElementById('songName');
            if (!nameInput.value) {
                nameInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
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

    btnPlay.addEventListener('click', () => {
        if (currentSongIndex === -1 && playlistData.length > 0) playSong(0);
        else togglePlay();
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

    // Realtime Firestore listener
    if (playlistListener) playlistListener();
    
    playlistListener = db.collection('playlist')
        .orderBy('timestamp', 'asc')
        .limit(100)
        .onSnapshot(
            (snapshot) => {
                const newPlaylistData = [];
                snapshot.forEach(doc => {
                    newPlaylistData.push({ id: doc.id, ...doc.data() });
                });
                
                // Track yang sedang diputar
                const wasPlayingId = currentSongIndex !== -1 ? playlistData[currentSongIndex]?.id : null;
                
                playlistData = newPlaylistData;
                
                // Cek kalau lagu yang lagi diputar kehapus
                if (currentSongIndex >= playlistData.length) {
                    currentSongIndex = -1;
                    audioPlayer.pause();
                    isPlaying = false;
                }
                
                // Update current song index if song still exists
                if (wasPlayingId) {
                    const newIndex = playlistData.findIndex(s => s.id === wasPlayingId);
                    if (newIndex !== -1) {
                        currentSongIndex = newIndex;
                    } else {
                        currentSongIndex = -1;
                        audioPlayer.pause();
                        isPlaying = false;
                    }
                }
                
                renderPlaylist();
                updateConnectionStatus();
            },
            (error) => {
                console.error("Error fetching playlist:", error);
                if (error.code !== 'permission-denied') {
                    showToast('Gagal load playlist: ' + error.message, '⚠️');
                }
            }
        );
}

function addSong() {
    const nameInput = document.getElementById('songName');

    if (!currentSongFile || !nameInput.value.trim()) {
        showToast('Pilih lagu MP3 dan isi judulnya ya! 🎵', '⚠️');
        return;
    }

    if (nameInput.value.length > 100) {
        showToast('Nama lagu terlalu panjang max 100 karakter! 🎵', '❌');
        return;
    }

    const file = currentSongFile;
    const filename = `song_${Date.now()}_${file.name}`;
    const uploadTask = storage.ref(`playlist/${filename}`).put(file);

    showUploadOverlay('Mengupload Lagu... 🎵');

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateUploadProgress(progress);
        },
        (error) => {
            hideUploadOverlay();
            console.error("Upload error:", error);
            showToast('Gagal upload: ' + error.message, '❌');
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection('playlist').add({
                    url: downloadURL,
                    name: nameInput.value.trim(),
                    filename: filename,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    hideUploadOverlay();
                    showToast('Lagu ditambahkan ke playlist! 🎵', '🎵');
                    resetSongPreview();
                    closeModal('modalAddSong');
                }).catch(err => {
                    hideUploadOverlay();
                    console.error("Add song error:", err);
                    showToast('Gagal simpan data: ' + err.message, '❌');
                });
            }).catch(err => {
                hideUploadOverlay();
                console.error("Get URL error:", err);
                showToast('Gagal get download URL: ' + err.message, '❌');
            });
        }
    );
}

function deleteSong(id, event) {
    if (event) event.stopPropagation();

    if (confirm("Hapus lagu ini dari playlist?")) {
        const item = playlistData.find(s => s.id === id);
        if (item && item.filename) {
            storage.ref(`playlist/${item.filename}`).delete()
                .catch(e => console.log('Storage delete error:', e));
        }
        
        // Stop if it's currently playing
        const index = playlistData.findIndex(s => s.id === id);
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

        db.collection('playlist').doc(id).delete()
            .then(() => showToast('Lagu dihapus dari playlist~', '🗑️'))
            .catch(error => showToast('Gagal menghapus: ' + error.message, '❌'));
    }
}

function playSong(index) {
    const song = playlistData[index];
    currentSongIndex = index;

    audioPlayer.src = song.url;
    audioPlayer.play().catch(e => console.log('Playback error:', e));
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
        audioPlayer.play().catch(e => console.log('Playback error:', e));
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
window.addEventListener('load', function () {
    initFloatingHearts();
    initModals();
    initMessages();
    initGallery();
    initPlaylist();
    showSection('landing');
    updateConnectionStatus();
});
