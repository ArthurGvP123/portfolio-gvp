import { Project, ProjectItem } from "@/types/portfolio";

/**
 * Procedural generator for aesthetic Swiss-brutalist SVG data URI covers.
 * Guarantees zero network latency, zero broken images, and zero layout shift (CLS).
 */
export function createProjectSvgCover(
  title: string,
  category: string,
  accentColor: string,
  bgBase: string,
  patternType: "grid" | "radial" | "lines" | "brackets" | "circle" | "hex"
): string {
  let pattern = "";
  if (patternType === "grid") {
    pattern = `
      <defs>
        <pattern id="p_${title.replace(/\s+/g, "_")}" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p_${title.replace(/\s+/g, "_")})"/>
      <circle cx="640" cy="360" r="180" fill="none" stroke="${accentColor}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="6 6"/>
      <line x1="120" y1="360" x2="1160" y2="360" stroke="${accentColor}" stroke-opacity="0.12" stroke-width="1"/>
      <line x1="640" y1="80" x2="640" y2="640" stroke="${accentColor}" stroke-opacity="0.12" stroke-width="1"/>
    `;
  } else if (patternType === "radial") {
    pattern = `
      <radialGradient id="rg_${title.replace(/\s+/g, "_")}" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
        <stop offset="70%" stop-color="${bgBase}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${bgBase}" stop-opacity="1"/>
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#rg_${title.replace(/\s+/g, "_")})"/>
      <circle cx="640" cy="360" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.4"/>
      <circle cx="640" cy="360" r="240" fill="none" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="4 8"/>
    `;
  } else if (patternType === "lines") {
    pattern = `
      <g opacity="0.18" stroke="${accentColor}" stroke-width="1.5">
        <line x1="0" y1="120" x2="1280" y2="120"/>
        <line x1="0" y1="240" x2="1280" y2="240"/>
        <line x1="0" y1="360" x2="1280" y2="360"/>
        <line x1="0" y1="480" x2="1280" y2="480"/>
        <line x1="0" y1="600" x2="1280" y2="600"/>
        <line x1="240" y1="0" x2="240" y2="720"/>
        <line x1="480" y1="0" x2="480" y2="720"/>
        <line x1="720" y1="0" x2="720" y2="720"/>
        <line x1="960" y1="0" x2="960" y2="720"/>
      </g>
      <polygon points="640,240 760,420 520,420" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.4"/>
    `;
  } else if (patternType === "brackets") {
    pattern = `
      <g stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.35">
        <path d="M 280 200 L 220 200 L 220 520 L 280 520" />
        <path d="M 1000 200 L 1060 200 L 1060 520 L 1000 520" />
        <line x1="320" y1="360" x2="960" y2="360" stroke-dasharray="8 8" opacity="0.25"/>
      </g>
    `;
  } else if (patternType === "circle") {
    pattern = `
      <circle cx="640" cy="360" r="160" fill="${accentColor}" fill-opacity="0.08" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.4"/>
      <circle cx="640" cy="360" r="90" fill="none" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.3"/>
      <circle cx="640" cy="360" r="230" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="3 6" stroke-opacity="0.25"/>
    `;
  } else {
    pattern = `
      <polygon points="640,220 750,285 750,435 640,500 530,435 530,285" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.4"/>
      <polygon points="640,260 715,305 715,415 640,460 565,415 565,305" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.2"/>
    `;
  }

  // Deterministic hex token derived from title and category to guarantee zero SSR/client hydration mismatch
  let hash = 0;
  const seed = `${title}:${category}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  }
  const nodeHex = hash.toString(16).toUpperCase().padStart(4, "0");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="100%" height="100%" fill="${bgBase}"/>
      ${pattern}
      <rect x="24" y="24" width="1232" height="672" fill="none" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1"/>
      <rect x="32" y="32" width="1216" height="656" fill="none" stroke="${accentColor}" stroke-opacity="0.1" stroke-width="1"/>
      
      <g stroke="${accentColor}" stroke-width="1" stroke-opacity="0.4">
        <path d="M 20 24 L 28 24 M 24 20 L 24 28" />
        <path d="M 1252 24 L 1260 24 M 1256 20 L 1256 28" />
        <path d="M 20 696 L 28 696 M 24 692 L 24 700" />
        <path d="M 1252 696 L 1260 696 M 1256 692 L 1256 700" />
      </g>

      <text x="56" y="80" fill="${accentColor}" font-family="monospace" font-size="14" font-weight="600" letter-spacing="3" opacity="0.75">
        ${category.toUpperCase()}
      </text>

      <text x="56" y="640" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="52" font-weight="800" letter-spacing="-1" opacity="0.9">
        ${title}
      </text>

      <text x="1224" y="80" text-anchor="end" fill="${accentColor}" font-family="monospace" font-size="12" opacity="0.5">
        [SYS_NODE: 0x${nodeHex}]
      </text>
      <text x="1224" y="640" text-anchor="end" fill="${accentColor}" font-family="monospace" font-size="12" opacity="0.5">
        LAT/LON 3D_SPHERE
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "sikawan",
    title: "SIKAWAN",
    subtitle: "Sistem Informasi Kegiatan dan Wawasan Kelompok Kerja Guru (KKG)",
    tagline: "Aplikasi Terpadu Kegiatan, Kas, dan Preservasi Arsip Cloud KKG",
    category: "Mobile Application",
    tags: ["#Mobile-App", "#Desain-Grafis", "Flutter", "Dart", "Firebase", "Google Apps Script"],
    period: "25 Sep 2025 – 10 Mei 2026",
    year: 2025,
    role: "Fullstack Mobile Application Developer & Brand/Logo Designer",
    context: "Freelance (Instrumen Penelitian Disertasi/Tesis Mahasiswa S2 Guru PJKR UNNES)",
    client: "Program Pascasarjana PJKR UNNES",
    status: "Selesai, Diuji di Lapangan & Didistribusikan dalam Format APK",
    techStack: [
      "Flutter SDK (^3.10.0)",
      "Dart",
      "Cloud Firestore",
      "Firebase Authentication",
      "Google Apps Script API Bridge",
      "Google Drive Cloud Storage",
      "TableCalendar",
      "Image Picker",
      "File Picker"
    ],
    summary: "Aplikasi sistem informasi mobile berbasis Flutter sebagai sarana terpadu bagi Kelompok Kerja Guru (KKG) dalam mengatur kegiatan kelompok, penjadwalan terpadu, pencatatan kas/keuangan transparan, preservasi arsip materi dan dokumentasi kegiatan ke Google Drive via serverless API bridge, serta media pengembangan diri mandiri bagi anggota KKG.",
    description: "Aplikasi mobile modern berbasis Flutter untuk Kelompok Kerja Guru (KKG) yang mendigitalkan koordinasi agenda kegiatan, transparansi pembukuan kas, serta preservasi materi dan dokumentasi kegiatan ke Google Drive tanpa biaya cloud komersial melalui Google Apps Script WebApp endpoint bridge.",
    challenge: "Kelompok Kerja Guru (KKG) sering menghadapi kendala koordinasi agenda, ketiadaan transparansi pembukuan kas, serta arsip dokumen dan foto kegiatan yang tersebar sporadis di grup chat hingga rentan hilang, sementara biaya sewa cloud storage komersial menjadi kendala utama bagi organisasi non-profit keguruan.",
    problemStatement: "Kelompok Kerja Guru (KKG) sering menghadapi kendala koordinasi agenda, ketiadaan transparansi pembukuan kas, serta arsip dokumen dan foto kegiatan yang tersebar sporadis di grup chat hingga rentan hilang, sementara biaya sewa cloud storage komersial menjadi kendala utama bagi organisasi non-profit keguruan.",
    solution: [
      "Arsitektur Mobile Cross-Platform Flutter dengan performa native 60 FPS",
      "Serverless Storage Bridge mengintegrasikan Cloud Firestore dan Google Apps Script ke Google Drive tanpa biaya sewa cloud",
      "Visualisasi agenda bulanan dan mingguan dengan TableCalendar",
      "Pencatatan kas dan pembukuan transparan dengan pelaporan saldo real-time",
      "Presensi digital anggota dan arsip notula rapat di cloud",
      "Perancangan identitas visual dan logo kolaboratif resmi KKG"
    ],
    solutionDetails: [
      "Arsitektur Mobile Cross-Platform Flutter: Memberikan performa native 60 FPS di seluruh varian perangkat Android guru.",
      "Cost-Effective Serverless Storage Bridge: Mengintegrasikan Cloud Firestore untuk data transaksional cepat dan Google Apps Script WebApp endpoint untuk mengunggah dokumen/foto langsung ke Google Drive organisasi secara gratis.",
      "Kalender Interaktif & Penjadwalan TableCalendar: Visualisasi kalender terpadu untuk pemetaan agenda bulanan/mingguan KKG beserta narasumber dan tema kegiatan.",
      "Pencatatan Kas & Keuangan Akuntabel: Pengelolaan kas masuk dan keluar dengan pelaporan saldo real-time untuk seluruh anggota kelompok kerja.",
      "Presensi Digital & Notula Rapat: Pencatatan absensi digital dan form editor notula rapat yang terarsipkan rapi di cloud.",
      "Desain Brand & Logo Identitas: Perancangan logo resmi bertema kolaborasi persahabatan, diekspor ke multi-density asset Android/iOS."
    ],
    features: [
      "Kalender Agenda & Penjadwalan Kegiatan Terpadu",
      "Pencatatan Kas & Laporan Keuangan Real-Time",
      "Pengunggahan Arsip Dokumen & Foto ke Google Drive",
      "Presensi Digital & Form Notula Rapat",
      "Autentikasi Firebase & Manajemen Anggota KKG"
    ],
    keyMetrics: [
      { label: "Target FPS", value: "60 FPS Native" },
      { label: "Cloud Cost", value: "$0 (Free Serverless)" },
      { label: "Distribution", value: "Release APK Mandiri" },
      { label: "Validation", value: "Tesis S2 PJKR UNNES" }
    ],
    coverPattern: "circle",
    coverImage: createProjectSvgCover("SIKAWAN", "Mobile Application", "#ffffff", "#0e0e0e", "circle"),
    accentColor: "#ffffff",
    links: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/sikawan",
        type: "github"
      },
      {
        label: "Unduh APK Android",
        url: "https://drive.google.com/file/d/1_gl1RiTsG5wDAC0SMc8QlqCK_9gMsuto/view?usp=sharing",
        type: "apk"
      },
      {
        label: "Buku Panduan Pengguna",
        url: "https://docs.google.com/document/d/1lI_hHeue3OsJueYYOujeRR8IjuEGYh5l/edit?usp=sharing&ouid=113922251280812517857",
        type: "docs"
      },
      {
        label: "Aset Desain Logo",
        url: "https://drive.google.com/file/d/11_m_e7DEEkKCXpggV7wEF39rYvSOjp5b/view?usp=drive_link",
        type: "figma"
      }
    ],
    badge: "Case",
    featured: true,
    externalUrl: "https://github.com/ArthurGvP123/sikawan"
  },
  {
    id: "proj-02",
    slug: "sibakat-id",
    title: "SIBAKAT ID",
    subtitle: "Sistem Identifikasi Bakat Olahraga Anak Usia 11–15 Tahun Berbasis Sport Search",
    tagline: "Platform Asesmen Bakat & Minat Olahraga Siswa Berbasis Sport Search & Manhattan Distance",
    category: "Web Application",
    tags: ["#Web-App", "#Desain-Grafis", "#Publikasi-Ilmiah", "React 18", "TypeScript", "Tailwind CSS", "Firebase", "ExcelJS"],
    period: "29 Agu 2025 – 20 Feb 2026",
    year: 2025,
    role: "Fullstack WebApp Developer & Brand/Logo Designer",
    context: "Freelance (Instrumen Penelitian Disertasi/Tesis Mahasiswa S2 Pendidikan Jasmani UNNES)",
    client: "Program Pascasarjana Pendidikan Jasmani UNNES",
    status: "Selesai & Dipublikasikan di Jurnal Ilmiah Terakreditasi JPES",
    techStack: [
      "TypeScript",
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Lucide React",
      "Google Firebase",
      "ExcelJS (.xlsx)",
      "html2canvas",
      "Manhattan Distance Algorithm",
      "Radar Chart Visualizer"
    ],
    summary: "Aplikasi web modern berbasis metodologi Sport Search dan formula jarak Manhattan Distance (L1 Norm) untuk mengidentifikasi potensi bakat olahraga bagi anak usia 11–15 tahun secara ilmiah berdasarkan 10 rangkaian tes fisik ke dalam 32 cabang olahraga terkurasi. Dilengkapi visualisasi Radar Chart profil fisik, komparasi Head-to-Head atlet, dan ekspor laporan Excel.",
    description: "Platform asesmen bakat olahraga anak usia dini berbasis web dengan algoritma Manhattan Distance L1 Norm yang memetakan 10 parameter fisik ke 32 cabang olahraga, divalidasi melalui publikasi jurnal terakreditasi JPES.",
    challenge: "Identifikasi bakat olahraga usia dini umumnya berlangsung subjektif tanpa standarisasi ilmiah, menyulitkan pelatih dan guru dalam merekomendasikan cabang olahraga yang selaras dengan kapasitas fisiologis anak.",
    problemStatement: "Identifikasi bakat olahraga usia dini umumnya berlangsung subjektif tanpa standarisasi ilmiah, menyulitkan pelatih dan guru dalam merekomendasikan cabang olahraga yang selaras dengan kapasitas fisiologis anak.",
    solution: [
      "Normalisasi 10 parameter tes fisik mentah ke norma baku standar (skala 1-5)",
      "Implementasi formula Manhattan Distance L1 Norm D = sum(|xi - yi|) untuk perankingan cabor",
      "Visualisasi Radar Chart kekuatan fisik atletik",
      "Komparasi Head-to-Head dua atlet untuk seleksi cabang olahraga beregu",
      "Ekspor instan laporan rekapitulasi ke berkas spreadsheet Excel (.xlsx)",
      "Perancangan identitas visual dan logo resmi SiBakat.id"
    ],
    solutionDetails: [
      "Normalisasi Nilai Tes ke Norma Baku: Mengonversi 10 pengukuran fisik mentah (lari cepat, vertical jump, bleep test, dll.) ke skor standar (skala 1–5) menurut kelompok usia dan gender.",
      "Komputasi Jarak Manhattan (L1 Norm): Menghitung jarak spasial D = sum(|xi - yi|) antara vektor profil atlet dengan 32 cabang olahraga untuk menentukan kecocokan ranking teratas.",
      "Visualisasi Radar Chart: Memetakan keunggulan dan area perbaikan fisik anak secara visual dan intuitif.",
      "Fitur Head-to-Head Comparison: Memfasilitasi analisis perbandingan langsung antara dua atlet guna seleksi cabang olahraga beregu.",
      "Client-Side Excel Report Generation: Mengekspor rekapitulasi data siswa dan rekomendasi cabor ke spreadsheet Excel (.xlsx) langsung di browser via ExcelJS.",
      "Branding & Logo Design: Merancang identitas visual resmi SiBakat.id yang merefleksikan kedinamisan dan presisi analitik olahraga."
    ],
    features: [
      "Normalisasi Norma Baku 10 Pengujian Fisik",
      "Mesin Rekomendasi 32 Cabor via Manhattan Distance",
      "Visualisasi Profil Atlet Radar Chart",
      "Perbandingan Head-to-Head Multi-Atlet",
      "Ekspor Rekapitulasi Laporan Excel (.xlsx)"
    ],
    keyMetrics: [
      { label: "Cabang Olahraga", value: "32 Cabor Terkurasi" },
      { label: "Komponen Uji", value: "10 Parameter Fisik" },
      { label: "Validasi Ilmiah", value: "Publikasi Jurnal JPES" },
      { label: "Algoritma", value: "Manhattan Distance L1" }
    ],
    coverPattern: "grid",
    coverImage: createProjectSvgCover("SIBAKAT ID", "Web Application", "#ffffff", "#0e0e0e", "grid"),
    accentColor: "#ffffff",
    links: [
      {
        label: "Web Application Live",
        url: "https://sibakat-53ef3.web.app/",
        type: "live"
      },
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/sibakat",
        type: "github"
      },
      {
        label: "Publikasi Jurnal JPES (DOI)",
        url: "https://doi.org/10.15294/jpes.v15i2.40549",
        type: "paper"
      },
      {
        label: "Aset Desain Logo",
        url: "https://drive.google.com/file/d/1gO47iKQyK0faFy2xL8NQFYr34Eb3lYtT/view?usp=sharing",
        type: "figma"
      }
    ],
    badge: "Case",
    featured: true,
    externalUrl: "https://sibakat-53ef3.web.app/"
  },
  {
    id: "proj-03",
    slug: "komparasi-loss-function",
    title: "Komparasi Loss Function Pengenalan Wajah",
    subtitle: "Performa Komparatif Ragam Loss Function pada Pelatihan Model Pengenalan Wajah Digital",
    tagline: "Komparasi 7 Loss Function Modern pada Pelatihan Model Deep Face Recognition",
    category: "AI & Machine Learning",
    tags: ["#AI", "#Machine-Learning", "#Computer-Vision", "#Riset-Akademik", "#Skripsi", "#Publikasi-Ilmiah", "PyTorch", "InsightFace", "MagFace", "AdaFace"],
    period: "08 Sep 2025 – 29 Jan 2026",
    year: 2025,
    role: "AI Engineer & Peneliti Utama (Lead Researcher)",
    context: "Penelitian Tugas Akhir / Skripsi Sarjana (S1 Teknik Komputer FT UNNES)",
    client: "Teknik Komputer UNNES",
    status: "Selesai, Disidangkan, Naskah Skripsi Lengkap & Draf Publikasi Ilmiah Disusun",
    techStack: [
      "Python 3.10+",
      "PyTorch",
      "InsightFace (buffalo_l)",
      "OpenCV",
      "Dlib",
      "ONNX Runtime",
      "Scikit-Learn",
      "NumPy (.npz Compressed)",
      "MagFace",
      "AdaFace",
      "CurricularFace",
      "ElasticFace",
      "GhostFaceNets",
      "FaceNet Triplet Loss"
    ],
    summary: "Riset komparatif tugas akhir sarjana untuk mengevaluasi ketangguhan dan akurasi 7 algoritma loss function modern (MagFace, AdaFace, CurricularFace, ElasticFace, GhostFaceNets/ArcFace, FaceNet Triplet Loss, Dlib) pada deep face recognition. Membuktikan bahwa MagFace unggul mutlak dengan mengaitkan magnitudo fitur secara intrinsik dengan kualitas citra wajah tanpa label kualitas tambahan.",
    description: "Riset ilmiah mendalam mengevaluasi ketahanan dan akurasi 7 algoritma margin loss function modern pada deep face recognition di bawah variasi kualitas gambar, membuktikan keunggulan representasi intrinsik MagFace.",
    challenge: "Pengenalan wajah di dunia nyata sering mengalami penurunan performa drastis akibat variasi kualitas citra (blur, pencahayaan buruk, sudut ekstrem). Algoritma konvensional memperlakukan seluruh sampel secara setara, menyebabkan distorsi ruang representasi fitur ketika dihadapkan pada citra berkualitas rendah.",
    problemStatement: "Pengenalan wajah di dunia nyata sering mengalami penurunan performa drastis akibat variasi kualitas citra (blur, pencahayaan buruk, sudut ekstrem). Algoritma konvensional memperlakukan seluruh sampel secara setara, menyebabkan distorsi ruang representasi fitur ketika dihadapkan pada citra berkualitas rendah.",
    solution: [
      "Prapemrosesan otomatis dan transformasi afine landmark InsightFace buffalo_l",
      "Ekstraksi 512-dimensi deep embeddings ternormalisasi L2 yang dikompresi (.npz)",
      "Evaluasi verifikasi all-pairs dengan Cosine Similarity dan Euclidean Distance",
      "Analisis sensitivitas threshold sweep (FAR vs FRR)",
      "Pembuktian adaptasi magnitudo fitur MagFace terhadap kualitas citra tanpa anotasi manual",
      "Inferensi langsung stream webcam ke pustaka embeddings dengan latensi milidetik"
    ],
    solutionDetails: [
      "Prapemrosesan Otomatis InsightFace buffalo_l: Ekstraksi 5 titik koordinat landmark wajah dan transformasi afine ke crop terstandarisasi (112x112, 150x150, 160x160).",
      "Ekstraksi 512-Dimensi Deep Embeddings: Konversi citra wajah menjadi vektor fitur 512-D ternormalisasi L2 yang disimpan dalam format terkompresi NumPy (.npz).",
      "Evaluasi All-Pairs Verification: Uji komprehensif kombinasi pasangan probe dan gallery menggunakan Cosine Similarity dan Euclidean Distance.",
      "Threshold Sweep Analysis: Pengujian stabilitas model terhadap false acceptance rate dan false rejection rate pada berbagai ambang batas sensitivitas.",
      "Penemuan Ilmiah MagFace: Menemukan bahwa loss adaptif berbasis magnitudo fitur (||f||) mampu bertindak sebagai indikator kualitas bawaan citra tanpa memerlukan anotasi kualitas manual.",
      "Uji Inferensi Waktu Nyata Webcam: Validasi implementasi model langsung dari stream kamera webcam ke pustaka embedding .npz dalam latensi milidetik."
    ],
    features: [
      "Benchmarking 7 Loss Functions (MagFace, AdaFace, ArcFace, dll.)",
      "Pipeline Ekstraksi Fitur 512-D L2 Embeddings",
      "All-Pairs Cosine Similarity Matrix Evaluator",
      "ROC Curve & Threshold Sensitivity Sweep",
      "Live Webcam Real-Time Recognition Demo"
    ],
    keyMetrics: [
      { label: "Algoritma Diuji", value: "7 Loss Functions" },
      { label: "Dimensi Vektor", value: "512-D L2 Norm" },
      { label: "Algoritma Terbaik", value: "MagFace (Cosine)" },
      { label: "Format Dataset", value: "NumPy (.npz) Compressed" }
    ],
    coverPattern: "radial",
    coverImage: createProjectSvgCover("Komparasi Loss Function", "AI & Machine Learning", "#ffffff", "#0e0e0e", "radial"),
    accentColor: "#ffffff",
    links: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/KomparasiAlgoritmaPengenalanWajah",
        type: "github"
      },
      {
        label: "Laporan Skripsi Lengkap",
        url: "https://drive.google.com/file/d/1Qc1De2BS2K0FjKskISwTh5gUVLwMKVag/view?usp=drive_link",
        type: "paper"
      },
      {
        label: "Draf Naskah Publikasi",
        url: "https://drive.google.com/file/d/1gDvfigKvluJCT9mfvuKlQN-a6WKVfWbI/view?usp=drive_link",
        type: "paper"
      },
      {
        label: "Pretrained Model Weights",
        url: "https://drive.google.com/drive/folders/1Dl8puY93i-INJ4ZPU0og4mPqYvm-n6zR?usp=drive_link",
        type: "docs"
      },
      {
        label: "Arsip Embeddings (.npz)",
        url: "https://drive.google.com/drive/folders/1mXOI8Xzfjr-jn1HOi-_AFBYCXMzsNFmo?usp=sharing",
        type: "docs"
      }
    ],
    badge: "Research",
    featured: true,
    externalUrl: "https://github.com/ArthurGvP123/KomparasiAlgoritmaPengenalanWajah"
  },
  {
    id: "proj-04",
    slug: "evaluasi-backbone",
    title: "Evaluasi Backbone Deep Face Recognition",
    subtitle: "Kinerja Model Pengenalan Wajah Mendalam di Bawah Fungsi Adaptive Margin Loss: Evaluasi Waktu Nyata",
    tagline: "Benchmarking Komparatif 4 Arsitektur Backbone CNN & Vision Transformer di Bawah AdaFace",
    category: "Computer Vision & Research",
    tags: ["#AI", "#Machine-Learning", "#Computer-Vision", "#Riset-Akademik", "#Publikasi-Ilmiah", "PyTorch", "AdaFace", "ResNet100", "GhostFaceNet", "IJAIR"],
    period: "09 Sep 2025 – 01 Jan 2026",
    year: 2025,
    role: "AI Engineer & Peneliti (Co-Author)",
    context: "Kolaborasi Riset Ilmiah Rekan Peneliti Sarjana & Dosen Pembimbing Teknik Komputer UNNES",
    client: "International Journal of Artificial Intelligence Research (IJAIR)",
    status: "Published & Peer-Reviewed di Jurnal Internasional Terindeks SINTA 2",
    techStack: [
      "Python 3.10+",
      "PyTorch",
      "AdaFace",
      "ResNet100",
      "GhostFaceNet",
      "LAFS",
      "TransFace",
      "InsightFace (buffalo_l)",
      "OpenCV",
      "ONNX Runtime"
    ],
    summary: "Benchmarking komparatif internasional mengevaluasi 4 arsitektur backbone (ResNet100, GhostFaceNet, LAFS, TransFace) di bawah fungsi loss AdaFace untuk sistem absensi real-time berbasis CPU di lingkungan open-set tak terkendali. ResNet100 mencetak FAR 0.00% dan akurasi 97.00% untuk keamanan kritis, sedangkan GhostFaceNet menjadi model paling seimbang dan efisien untuk CPU berdaya rendah (>93% akurasi).",
    description: "Studi benchmarking komparatif internasional mengevaluasi ResNet100, GhostFaceNet, LAFS, dan TransFace dengan AdaFace loss untuk absensi real-time CPU pada skenario open-set, dipublikasikan di jurnal internasional IJAIR (SINTA 2).",
    challenge: "Sistem absensi biometrik pada CPU standar menghadapi trade-off tajam antara pencegahan salah terima (false acceptance) terhadap penyusup dan kecepatan inferensi, terutama saat data pendaftaran sangat terbatas dan kondisi pencahayaan tidak terkontrol.",
    problemStatement: "Sistem absensi biometrik pada CPU standar menghadapi trade-off tajam antara pencegahan salah terima (false acceptance) terhadap penyusup dan kecepatan inferensi, terutama saat data pendaftaran sangat terbatas dan kondisi pencahayaan tidak terkontrol.",
    solution: [
      "Protokol evaluasi open-set ketat dengan subjek asing untuk mencegah false acceptance",
      "Integrasi fungsi margin loss AdaFace yang adaptif terhadap kualitas citra",
      "Benchmarking ResNet100 membuktikan FAR 0.00% dan akurasi 97.00% untuk keamanan kritis",
      "Optimasi GhostFaceNet berbasis Ghost Module dengan akurasi >93% untuk CPU edge",
      "Analisis kegagalan translasi Vision Transformer (TransFace) pada rezim data terbatas",
      "Penyusunan matriks panduan empiris pemilihan arsitektur backbone bagi industri"
    ],
    solutionDetails: [
      "Protokol Evaluasi Open-Set Ketat: Pengujian realistis dengan subjek tak dikenal untuk memastikan sistem mampu menolak impostor secara tegas tanpa kompromi.",
      "AdaFace Adaptive Loss: Pemanfaatan fungsi loss adaptif kualitas untuk menangani variasi gambar kabur dan pose miring.",
      "Benchmarking ResNet100: Membuktikan kapasitas residual 100-layer unggul dalam diskriminasi fitur dengan FAR 0.00% pada ambang batas ketat.",
      "Optimasi Edge GhostFaceNet: Memanfaatkan Ghost Module untuk komputasi CPU hemat daya dengan akurasi tetap tinggi (>93%).",
      "Analisis Kegagalan TransFace: Menemukan Vision Transformer kesulitan generalisasi pada rezim data terbatas karena ketiadaan inductive bias konvolusional.",
      "Rekomendasi Industri: Panduan empiris implementasi GhostFaceNet untuk terminal pintar berbiaya rendah dan ResNet100 untuk fasilitas dengan keamanan tinggi."
    ],
    features: [
      "Open-Set Evaluation Protocol Benchmarking",
      "Komparasi 4 Backbone (ResNet100, GhostFaceNet, LAFS, TransFace)",
      "Kalkulasi False Acceptance Rate (FAR) & AUC",
      "Analisis Efisiensi Edge Computing CPU",
      "Publikasi Internasional Terindeks SINTA 2"
    ],
    keyMetrics: [
      { label: "ResNet100 FAR", value: "0.00% (Strict)" },
      { label: "ResNet100 Akurasi", value: "97.00% (AUC 0.9970)" },
      { label: "GhostFaceNet Akurasi", value: ">93.00% (CPU Edge)" },
      { label: "Status Publikasi", value: "IJAIR (SINTA 2)" }
    ],
    coverPattern: "brackets",
    coverImage: createProjectSvgCover("Evaluasi Backbone", "Computer Vision & Research", "#ffffff", "#0e0e0e", "brackets"),
    accentColor: "#ffffff",
    links: [
      {
        label: "Laman Artikel IJAIR (DOI)",
        url: "https://doi.org/10.29099/ijair.v9i1.1.1641",
        type: "paper"
      },
      {
        label: "Unduh PDF Naskah Jurnal",
        url: "https://ijair.id/index.php/ijair/article/view/1641/pdf",
        type: "paper"
      },
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/KomparasiAlgoritmaPengenalanWajah",
        type: "github"
      }
    ],
    badge: "Research",
    featured: true,
    externalUrl: "https://doi.org/10.29099/ijair.v9i1.1.1641"
  },
  {
    id: "proj-05",
    slug: "agrobuyer",
    title: "AgroBuyer",
    subtitle: "Platform Marketplace Komoditas Pertanian & Distribusi Hasil Panen Tani",
    tagline: "Ekosistem Marketplace Digital Komoditas Pertanian Langsung dari Koperasi Tani",
    category: "Web Application",
    tags: ["#Web-App", "React 19", "Vite 7", "Tailwind CSS v4", "Firebase", "Cloudinary", "Framer Motion"],
    period: "19 Des 2025 – 22 Des 2025",
    year: 2025,
    role: "Fullstack WebApp Developer",
    context: "Freelance (Inisiatif Digitalisasi Rantai Pasok Pertanian & Pemberdayaan Ekonomi Petani Lokal)",
    client: "Petani Lokal & Koperasi Tani",
    status: "Selesai & Berjalan di Produksi (Production Live)",
    techStack: [
      "React 19",
      "Vite 7",
      "React Router v7",
      "Tailwind CSS v4",
      "Framer Motion",
      "Google Firebase",
      "Cloudinary REST API",
      "EMSIFA Regional API",
      "Lucide React"
    ],
    summary: "Platform marketplace agrikultur modern untuk memotong rantai pasok dan mendigitalkan distribusi komoditas pangan langsung dari petani/koperasi ke pembeli. Dilengkapi integrasi hierarki wilayah administratif Indonesia, sistem keranjang belanja multi-item, media upload komoditas via Cloudinary, serta komunikasi negosiasi interaktif melalui fitur chat real-time.",
    description: "Platform marketplace komoditas pertanian berbasis React 19 dan Tailwind CSS v4 yang menghubungkan koperasi petani dengan pembeli langsung melalui fitur chat real-time dan katalog terverifikasi.",
    challenge: "Rantai distribusi konvensional komoditas pertanian melibatkan banyak perantara tengkulak yang menekan harga jual di tingkat petani sekaligus melambungkan harga di tingkat konsumen, ditambah minimnya akses pasar digital langsung bagi koperasi tani.",
    problemStatement: "Rantai distribusi konvensional komoditas pertanian melibatkan banyak perantara tengkulak yang menekan harga jual di tingkat petani sekaligus melambungkan harga di tingkat konsumen, ditambah minimnya akses pasar digital langsung bagi koperasi tani.",
    solution: [
      "Sistem otentikasi peran ganda (Pembeli vs Koperasi Tani) dengan alur Google Sign-In hybrid",
      "Selector wilayah bertingkat 4 level menggunakan API Wilayah Indonesia EMSIFA",
      "Katalog produk komoditas pertanian dengan optimasi gambar Cloudinary CDN",
      "Keranjang belanja interaktif dengan kalkulasi subtotal instan",
      "Dashboard inventori dan stok panen real-time bagi petani",
      "Komunikasi negosiasi harga langsung via sub-koleksi P2P real-time chat Firestore"
    ],
    solutionDetails: [
      "Sistem Autentikasi Multi-Peran & Google Hybrid: Pemisahan peran tegas antara Pembeli dan Koperasi Tani dengan alur Google Sign-In hybrid.",
      "Cascading Selector Wilayah Indonesia: Integrasi API wilayah bertingkat (Provinsi -> Kota -> Kecamatan -> Kelurahan) untuk memvalidasi lokasi gudang koperasi.",
      "Katalog Produk & Upload Media Cloudinary: Penjelajahan produk segar dengan harga per satuan/kg, stok real-time, dan kompresi foto otomatis via Cloudinary.",
      "Keranjang Belanja Global & Checkout: State management keranjang belanja dengan penambahan kuantitas dan kalkulasi subtotal instan.",
      "Dashboard Inventori Koperasi: Manajemen produk, monitoring pesanan masuk, dan pembaruan stok panen secara mandiri.",
      "P2P Real-Time Chat: Fitur obrolan langsung antara pembeli dan petani dengan sub-koleksi Firestore untuk negosiasi harga dan koordinasi pengiriman."
    ],
    features: [
      "Sistem Multi-Role Authentication",
      "Cascading Regional Selector (EMSIFA API)",
      "Katalog Komoditas Panen dengan Cloudinary CDN",
      "Keranjang Belanja & Alur Checkout Instan",
      "P2P Real-Time Negosiasi Chat via Firestore"
    ],
    keyMetrics: [
      { label: "Frontend", value: "React 19 + Tailwind v4" },
      { label: "Database", value: "Cloud Firestore Real-Time" },
      { label: "Media Handling", value: "Cloudinary Image CDN" },
      { label: "Status", value: "Production Live" }
    ],
    coverPattern: "lines",
    coverImage: createProjectSvgCover("AgroBuyer", "Web Application", "#ffffff", "#0e0e0e", "lines"),
    accentColor: "#ffffff",
    links: [
      {
        label: "Web Application Live",
        url: "https://agrobuyer-c9527.web.app",
        type: "live"
      },
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/agrobuyer",
        type: "github"
      }
    ],
    badge: "Case",
    featured: false,
    externalUrl: "https://agrobuyer-c9527.web.app"
  },
  {
    id: "proj-06",
    slug: "eazykost",
    title: "EazyKost",
    subtitle: "Platform Pencarian & Manajemen Hunian Kost Modern Berbasis Laravel 12",
    tagline: "Platform Manajemen & Reservasi Rumah Kost Modern Terintegrasi WhatsApp Gateway",
    category: "Web Application",
    tags: ["#Web-App", "Laravel 12", "PHP 8.2+", "Tailwind CSS v4", "Alpine.js", "Vite 7", "WhatsApp Gateway"],
    period: "04 Des 2025 – 14 Des 2025",
    year: 2025,
    role: "Fullstack WebApp Developer",
    context: "Freelance (Inisiatif Digitalisasi Properti Hunian Sewa Mahasiswa & Masyarakat Umum)",
    client: "Pengelola & Pemilik Kost Mahasiswa",
    status: "Selesai & Berjalan (Completed / Open-Source)",
    techStack: [
      "PHP 8.2+",
      "Laravel 12",
      "Blade Templating",
      "Tailwind CSS v4",
      "Alpine.js",
      "Vite 7",
      "Eloquent ORM",
      "MySQL",
      "WhatsApp Click-to-Chat Gateway"
    ],
    summary: "Platform pencarian dan manajemen hunian kost modern berbasis Laravel 12 dan Tailwind CSS v4 untuk mempermudah pencari kost menemukan hunian idaman dengan pencarian instan dan galeri snap-carousel. Membantu pemilik kos dalam tata kelola kamar, monitoring pengajuan sewa, dan komunikasi langsung ke calon penghuni melalui integrasi WhatsApp otomatis.",
    description: "Sistem web pencarian dan manajemen kamar kost komprehensif berbasis Laravel 12 dengan live search Alpine.js dan otomatisasi koneksi WhatsApp pemesanan kamar.",
    challenge: "Pencarian kamar kost mahasiswa sering kali tidak efisien karena ketiadaan informasi ketersediaan kamar yang akurat, galeri foto minim, serta proses pemesanan dan komunikasi pemilik yang lambat.",
    problemStatement: "Pencarian kamar kost mahasiswa sering kali tidak efisien karena ketiadaan informasi ketersediaan kamar yang akurat, galeri foto minim, serta proses pemesanan dan komunikasi pemilik yang lambat.",
    solution: [
      "Arsitektur MVC modular Laravel 12 dengan Eloquent ORM dan form request validation",
      "Pencarian reaktif instan di sisi klien dengan Alpine.js tanpa reload",
      "Galeri kamar interaktif berbasis CSS scroll-snap carousel hingga 10 foto per unit",
      "Mekanisme reservasi kamar dengan pencegahan permohonan booking ganda dan middleware IsOwner",
      "Integrasi tombol WhatsApp Click-to-Chat otomatis berformat pesan dinamis",
      "Dashboard komprehensif pemilik properti untuk pemantauan ketersediaan kamar dan arsip penyewa"
    ],
    solutionDetails: [
      "Pola Arsitektur MVC Laravel 12: Struktur kode modular dengan Eloquent ORM, migrasi database, form request validation, dan Blade view components.",
      "Live Search Reaktif Alpine.js: Filter instan nama kost dan lokasi di sisi klien tanpa reload halaman web.",
      "Galeri Foto Snap-Carousel: Tampilan detail properti dengan navigasi gambar CSS scroll-snap dan dukungan multi-foto hingga 10 gambar per kamar.",
      "Alur Pengajuan Sewa & Anti-Spam: Mekanisme booking kamar dengan pencegahan permohonan duplikat ganda dan proteksi role middleware IsOwner.",
      "WhatsApp Click-to-Chat Fast Connect: Integrasi tombol kontak satu-klik yang otomatis memformat nomor telepon ke 62..., merangkai pesan konfirmasi dinamis, dan menandai status pengajuan menjadi 'Contacted'.",
      "Dashboard Pengelolaan Properti Pemilik: Panel kendali pemilik untuk melihat statistik kamar, pengajuan sewa pending, dan arsip penyewa."
    ],
    features: [
      "Modular MVC Architecture Laravel 12",
      "Alpine.js Instant Reactive Search",
      "Multi-Photo Snap Carousel Gallery",
      "WhatsApp Fast-Connect Automation",
      "Dashboard Pengelola & Pemilik Kost"
    ],
    keyMetrics: [
      { label: "Backend", value: "Laravel 12 (PHP 8.2+)" },
      { label: "Styling", value: "Tailwind CSS v4 + Vite" },
      { label: "Reactivity", value: "Alpine.js Live Search" },
      { label: "Integration", value: "WhatsApp Fast Connect" }
    ],
    coverPattern: "hex",
    coverImage: createProjectSvgCover("EazyKost", "Web Application", "#ffffff", "#0e0e0e", "hex"),
    accentColor: "#ffffff",
    links: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/eazykost",
        type: "github"
      }
    ],
    badge: "Case",
    featured: false,
    externalUrl: "https://github.com/ArthurGvP123/eazykost"
  },
  {
    id: "proj-07",
    slug: "waste-of-change",
    title: "Waste of Change",
    subtitle: "Platform Digitalisasi Bank Sampah & Logistik Daur Ulang",
    tagline: "Platform Circular Economy Digitalisasi Bank Sampah & Logistik Penjemputan Berbasis GIS",
    category: "Web Application",
    tags: ["#Web-App", "React 19", "Vite 7", "Tailwind CSS", "Leaflet", "React-Leaflet", "Firebase"],
    period: "10 Des 2025 – 12 Des 2025",
    year: 2025,
    role: "Fullstack WebApp Developer",
    context: "Freelance (Inisiatif Digitalisasi Pengelolaan Sampah Berkelanjutan & Bank Sampah)",
    client: "Unit Bank Sampah Wilayah",
    status: "Selesai & Berjalan di Produksi (Production Live)",
    summary: "Aplikasi web circular economy untuk mendigitalkan tata kelola bank sampah dan memfasilitasi logistik penjemputan sampah warga berbasis koordinat peta Leaflet. Dilengkapi kalkulator estimasi perolehan uang tunai dan poin reward real-time berdasarkan bobot dan 3 kategori sampah (anorganik, organik, B3), serta dashboard operasional verifikasi penimbangan bagi pengelola bank sampah.",
    description: "Solusi platform circular economy berbasis web yang mengotomasi logistik penjemputan sampah warga menggunakan peta geospasial Leaflet dan kalkulator konversi eco-points real-time.",
    challenge: "Bank sampah konvensional pasif menunggu nasabah datang membawa sampah, sementara warga enggan memilah sampah karena ketidaktahuan nilai ekonomis sampah serta repotnya logistik pengantaran ke bank sampah.",
    problemStatement: "Bank sampah konvensional pasif menunggu nasabah datang membawa sampah, sementara warga enggan memilah sampah karena ketidaktahuan nilai ekonomis sampah serta repotnya logistik pengantaran ke bank sampah.",
    solution: [
      "Kalkulator konversi nilai tukar rupiah dan eco-points real-time untuk 3 kategori sampah",
      "Penentuan titik penjemputan geospasial dengan peta interaktif Leaflet dan GPS",
      "Sistem pelacakan status penjemputan sampah transparan (Pending -> Dijemput -> Ditimbang -> Selesai)",
      "Dashboard operasional bank sampah untuk verifikasi berat riil dan penerbitan saldo",
      "Pencatatan dompet digital dan akumulasi poin reward lingkungan bagi nasabah"
    ],
    solutionDetails: [
      "Kalkulator Estimasi Nilai Dinamis: Menghitung konversi uang tunai (Rupiah) dan poin reward (eco-points) secara real-time berdasarkan estimasi bobot per jenis sampah (anorganik, organik, B3).",
      "Pemetaan Peta Geospasial Leaflet: Penentuan lokasi penjemputan sampah dengan draggable marker, GPS otomatis, dan visualisasi lokasi bank sampah mitra terdekat.",
      "Alur Pengajuan & Pelacakan Armada: Formulir permintaan jemput sampah terkoordinasi dengan tahapan status transparan (Pending -> Dijemput -> Ditimbang -> Selesai).",
      "Dashboard Pengelola Bank Sampah: Antarmuka verifikasi timbangan riil, penyesuaian nominal, dan penerbitan saldo ke akun nasabah.",
      "Dompet Digital & Riwayat Transaksi: Pencatatan mutasi saldo kas dan akumulasi poin ramah lingkungan nasabah."
    ],
    features: [
      "Kalkulator Estimasi Nilai Eco-Points & Rupiah",
      "Peta Penjemputan Geospasial Leaflet GIS",
      "Pelacakan Status Permintaan Penjemputan",
      "Dashboard Penimbangan & Verifikasi Kasir",
      "Dompet Digital Saldo Bank Sampah"
    ],
    techStack: [
      "React 19",
      "Vite 7",
      "React Router v7",
      "Tailwind CSS",
      "Framer Motion",
      "Leaflet",
      "React-Leaflet",
      "HTML5 Geolocation",
      "Google Firebase",
      "EMSIFA Regional API",
      "Lucide React"
    ],
    keyMetrics: [
      { label: "Kategori Sampah", value: "3 Kategori (Anorganik/Organik/B3)" },
      { label: "Geospatial", value: "Leaflet + GPS Coordinates" },
      { label: "Frontend", value: "React 19 + Framer Motion" },
      { label: "Status", value: "Production Live" }
    ],
    coverPattern: "lines",
    coverImage: createProjectSvgCover("Waste of Change", "Web Application", "#ffffff", "#0e0e0e", "lines"),
    accentColor: "#ffffff",
    links: [
      {
        label: "Web Application Live",
        url: "https://wasteofchange.web.app",
        type: "live"
      },
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/wasteofchange",
        type: "github"
      }
    ],
    badge: "Case",
    featured: false,
    externalUrl: "https://wasteofchange.web.app"
  },
  {
    id: "proj-08",
    slug: "lost-n-found",
    title: "Lost n Found",
    subtitle: "Platform Komunitas Pelaporan Barang Hilang & Sistem Imbalan (Bounty)",
    tagline: "Sistem Komunitas Pelaporan Barang Hilang & Penemuan Terpadu dengan Sistem Bounty",
    category: "Web Application",
    tags: ["#Web-App", "React 19", "Vite 7", "Styled-Components", "Firebase", "Cloudinary", "EmailJS"],
    period: "05 Des 2025 – 07 Des 2025",
    year: 2025,
    role: "Fullstack WebApp Developer & Brand/Logo Designer",
    context: "Freelance (Inisiatif Layanan Komunitas Digital & Manajemen Kehilangan Barang Publik)",
    client: "Komunitas Publik & Civitas Akademika",
    status: "Selesai & Berjalan di Produksi (Production Live)",
    techStack: [
      "React 19",
      "Vite 7",
      "React Router v7",
      "Styled-Components",
      "Google Firebase",
      "Cloudinary REST API",
      "Axios",
      "EmailJS",
      "React Easy Crop",
      "Lucide React"
    ],
    summary: "Platform web komunitas untuk memfasilitasi pelaporan barang hilang (Lost) dan penemuan barang (Found) secara terintegrasi. Dilengkapi sistem apresiasi imbalan (bounty uang tunai), obrolan langsung (P2P real-time chat) antar pengguna dengan bukti foto dan notifikasi email instan via EmailJS, pemotongan foto interaktif, serta identitas logo resmi.",
    description: "Platform komunitas pelaporan barang hilang dan ditemukan dengan sistem reward imbalan uang tunai (bounty), obrolan P2P real-time Firestore, notifikasi email otomatis, dan cropping gambar interaktif.",
    challenge: "Informasi barang hilang sering tersebar secara acak di berbagai grup media sosial tanpa struktur pencarian yang jelas, rawan penipuan, dan minim insentif bagi penemu untuk mengembalikan barang.",
    problemStatement: "Informasi barang hilang sering tersebar secara acak di berbagai grup media sosial tanpa struktur pencarian yang jelas, rawan penipuan, dan minim insentif bagi penemu untuk mengembalikan barang.",
    solution: [
      "Formulir pelaporan ganda (Lost vs Found) dengan proteksi informasi sensitif untuk verifikasi pemilik",
      "Sistem insentif finansial penghargaan (bounty uang tunai)",
      "Obrolan P2P real-time berbasis listener Firestore dengan verifikasi foto barang",
      "Integrasi pengiriman email instan EmailJS ke pemilik barang saat pertama dihubungi",
      "Pemotongan foto interaktif dengan React Easy Crop sebelum diunggah ke CDN Cloudinary",
      "Perancangan master logo vector resmi di Adobe Illustrator"
    ],
    solutionDetails: [
      "Sistem Pelaporan Ganda (Lost vs Found): Formulir terpisah untuk barang hilang (dengan lokasi/waktu/ciri) dan barang ditemukan (tanpa membeberkan detail rahasia demi validasi pemilik).",
      "Mekanisme Imbalan Finansial (Bounty): Fitur penawaran hadiah uang tunai oleh pemilik sebagai bentuk apresiasi bagi penemu.",
      "Obrolan P2P Real-Time & Bukti Foto: Chat dua arah berbasis listener Firestore dengan dukungan pengiriman foto bukti verifikasi barang dan lencana unread.",
      "Notifikasi Email Otomatis EmailJS: Pengiriman email instan ke pemilik ketika penemu mengirim pesan obrolan pertama kali.",
      "Pemotongan Foto Interaktif (React Easy Crop): Penyesuaian rasio foto sebelum diunggah ke Cloudinary CDN.",
      "Desain Logo & Identitas Brand: Perancangan master vector logo di Adobe Illustrator."
    ],
    features: [
      "Dual Reporting Workflow (Lost vs Found)",
      "Financial Reward (Bounty) System",
      "P2P Real-Time Photo Verification Chat",
      "Instant EmailJS Owner Notifications",
      "Interactive Image Cropping & Cloudinary CDN"
    ],
    keyMetrics: [
      { label: "Arsitektur Media", value: "Cloudinary CDN (Up to 5 images)" },
      { label: "Real-Time Sync", value: "Firestore onSnapshot Listener" },
      { label: "Alert System", value: "EmailJS Instant Email Alerts" },
      { label: "Status", value: "Production Live" }
    ],
    coverPattern: "circle",
    coverImage: createProjectSvgCover("Lost n Found", "Web Application", "#ffffff", "#0e0e0e", "circle"),
    accentColor: "#ffffff",
    links: [
      {
        label: "Web Application Live",
        url: "https://lostnfound-6983c.web.app",
        type: "live"
      },
      {
        label: "GitHub Repository",
        url: "https://github.com/ArthurGvP123/lostnfound",
        type: "github"
      }
    ],
    badge: "Case",
    featured: false,
    externalUrl: "https://lostnfound-6983c.web.app"
  }
];

export const REAL_PROJECTS = PROJECTS;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function getAllProjectCategories(): string[] {
  const set = new Set<string>();
  PROJECTS.forEach((p) => set.add(p.category));
  return ["All", ...Array.from(set)];
}
