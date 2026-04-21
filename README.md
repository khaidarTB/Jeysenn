# 💕 Jeysenn - Website Realtime dengan Firebase

Website lucu dan interaktif bertema pink dengan fitur **realtime database** menggunakan Firebase Firestore.

## ✨ Fitur Utama

### 1. **Pesan Rahasia** 💌
- Kirim pesan teks dengan emoji dan warna custom
- Pilih sticker untuk setiap pesan
- **Realtime** - Pesan muncul langsung saat dikirim (di semua tab/device)
- Bisa hapus pesan kapan saja

### 2. **Galeri Kenangan** 📸
- Upload foto dan video langsung ke Firebase Storage
- Setiap upload dilengkapi caption dan timestamp
- **Realtime** - Galeri update otomatis saat ada upload baru
- Support video preview dengan player

### 3. **Playlist Cinta** 🎵
- Upload lagu MP3 ke playlist
- Player musik dengan kontrol play/pause/next/prev
- Progress bar dengan current time tracking
- **Realtime** - Playlist update saat ada lagu baru

## 🔌 Fitur Realtime

### Offline-First Architecture
```
- Firestore offline persistence enabled
- Data tersimpan di local device sekalipun offline
- Otomatis sync saat kembali online
- Connection status indicator (🟢 Online / 🟡 Sync / 🔴 Offline)
```

### Real-Time Listeners
Menggunakan `onSnapshot()` untuk setiap koleksi:
- **messages** - Listen perubahan pesan realtime
- **gallery** - Listen upload foto/video baru
- **playlist** - Listen lagu baru

```javascript
// Contoh real-time listener
db.collection('messages')
  .orderBy('timestamp', 'desc')
  .limit(100)
  .onSnapshot((snapshot) => {
    // Auto-update setiap ada perubahan
    messagesData = [];
    snapshot.forEach(doc => {
      messagesData.push({ id: doc.id, ...doc.data() });
    });
    renderMessages();
  });
```

## 📁 Struktur Project

```
Jeysenn/
├── index.html           # Main HTML (dengan Firebase SDK)
├── script.js            # JavaScript dengan fitur realtime
├── style.css            # Styling pink theme
├── service-worker.js    # PWA support
├── manifest.json        # PWA manifest
└── icons/               # App icons
```

## 🚀 Setup & Firebase Configuration

### Firebase Config (sudah ter-setup)
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC-UZsqAFBfvoWDCLM7MtcchcYufEGVIQY",
    authDomain: "jeysenn.firebaseapp.com",
    projectId: "jeysenn",
    storageBucket: "jeysenn.firebasestorage.app",
    messagingSenderId: "91133406128",
    appId: "1:91133406128:web:5195c586e8adc7a0f18475",
    measurementId: "G-B90FMSXSYL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
```

### Firebase Firestore Collections

#### `messages` Collection
```json
{
  "text": "Pesan teks...",
  "stickers": ["💕", "🌸"],
  "color": "pink",
  "time": "21 April 2026, 14:30",
  "timestamp": 1713621000000
}
```

#### `gallery` Collection
```json
{
  "url": "https://storage.url/...",
  "type": "image/jpeg",
  "caption": "Kenangan indah",
  "time": "21 April 2026, 14:30",
  "filename": "gallery_1713621000_photo.jpg",
  "timestamp": 1713621000000
}
```

#### `playlist` Collection
```json
{
  "url": "https://storage.url/...",
  "name": "Nama Lagu",
  "filename": "song_1713621000_audio.mp3",
  "timestamp": 1713621000000
}
```

## 🛡️ Validasi & Error Handling

### File Size Limits
- Image: 5 MB
- Video: 20 MB
- Audio: 10 MB

### Validasi yang Dijalankan
- ✅ File type validation
- ✅ File size validation
- ✅ Text length validation (max 1000 char)
- ✅ Input sanitization (mencegah XSS)
- ✅ Offline state handling
- ✅ Error messages yang user-friendly

```javascript
// Contoh validasi
function validateFileSize(file, type) {
    const maxSizeMB = FILE_LIMITS[type] || 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        showToast(`File terlalu besar! Max ${maxSizeMB}MB`, '❌');
        return false;
    }
    return true;
}
```

## 📱 PWA Support (Progressive Web App)

Website bisa dipasang sebagai aplikasi:
- Service Worker untuk offline support
- Manifest.json untuk app metadata
- Apple-mobile-web-app compatible

## 🎨 Theme & Customization

**CSS Variables yang bisa di-customize:**
```css
:root {
    --pink-500: #ec4899;
    --bg-primary: #fff0f6;
    --text-primary: #4a1942;
    --radius-md: 18px;
    --font-main: 'Poppins', sans-serif;
}
```

## 🔄 Connection Status

Icon status di top-right menunjukkan:
- 🟢 **Online** - Connected ke Firebase
- 🟡 **Sync...** - Online tapi sync data
- 🔴 **Offline** - Device offline, data tersimpan lokal

## 📊 Performance Features

- **Lazy loading** untuk images
- **Pagination** limit 100 items per collection
- **Indexed queries** untuk faster loading
- **Caching** dengan offline persistence
- **Optimized animations** dengan CSS transforms

## 🐛 Troubleshooting

### Data tidak muncul?
1. Pastikan Firebase rules memungkinkan read/write
2. Check browser console untuk error messages
3. Refresh page atau clear browser cache

### Upload lambat?
1. Check connection status indicator
2. File size mungkin terlalu besar
3. Try upload ulang

### Offline mode?
1. Data lokal masih tersimpan
2. Akan auto-sync saat kembali online
3. Check connection status indicator

## 📝 Firebase Firestore Rules

Untuk deployment, pastikan Firestore rules sudah proper:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document=**} {
      allow read, write: if true;
    }
    match /gallery/{document=**} {
      allow read, write: if true;
    }
    match /playlist/{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Note:** Beta mode di atas. Untuk production, tambahkan authentication proper.

## 🚀 Deploy

Website sudah siap di-deploy ke:
- Firebase Hosting
- Vercel
- Netlify
- Atau hosting lainnya

## 💝 Credits

Created dengan ❤️ menggunakan:
- Firebase Firestore (Real-time Database)
- Firebase Storage (File Upload)
- Poppins & Quicksand Fonts
- PWA Technology

---

**Made with 💕 for special someone** ✨
