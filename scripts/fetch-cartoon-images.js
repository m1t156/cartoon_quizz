import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUTPUT_DIR = path.resolve("./public/images/cartoons");
const DATA_FILE = path.resolve("./src/data/cartoons.ts");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Read and parse cartoons from src/data/cartoons.ts
const content = fs.readFileSync(DATA_FILE, "utf-8");
const jsonLike =
  content
    .replace(/^import\s+.*?;/m, "")
    .replace(/export\s+const\s+CARTOONS:\s*Cartoon\[\]\s*=\s*/, "const cartoons = ") +
  "; return cartoons;";

const cartoons = new Function(jsonLike)();
console.log(`Loaded ${cartoons.length} cartoons from ${DATA_FILE}`);

// Custom search overrides for cartoons with Vietnamese names or special titles
const SEARCH_OVERRIDES = {
  // BiBi / China / Vietnam
  161: ["Robo Trái Cây hoạt hình", "Fruity Robo"],
  162: ["Sấm Chớp Và Tốc Độ hoạt hình", "Flash & Dash"],
  163: ["Chiến Cơ Siêu Hạng con quay", "Infinity Nado"],
  164: ["Tuyệt Đỉnh YoYo", "Blazing Teens"],
  165: ["Vòng Xoay Thần Tốc hoạt hình", "Spin Fighters"],
  166: ["AI Football GGO", "Huyền Thoại Sân Cỏ"],
  167: ["Armor Hero", "Anh Hùng Trái Đất"],
  168: ["The Legend of Nezha 2003", "Na Tra Truyền Kỳ hoạt hình"],
  169: ["Journey to the West 1999 animation", "Tây Du Ký 1999 hoạt hình"],
  170: ["Tiểu Long Nhân", "Little Dragon Boy 1992"],
  171: ["Dế Mèn Phiêu Lưu Ký hoạt hình"],
  172: ["108 Thủy Hử hoạt hình", "Water Margin Kids"],
  173: ["Thần Thú Chiến Kỷ", "Beast Fighter animation"],
  174: ["Pleasant Goat and Big Big Wolf", "Cừu Vui Vẻ Và Sói Xám"],
  175: ["Boonie Bears", "Gấu Boonie"],
  176: ["Kip Force", "Bội Phong Cuồng Bão"],
  177: ["Green Fox animation", "Tiểu Hồ Ly Đồng Xanh"],
  178: ["Rainbow Cat Blue Rabbit", "Hồng Mèo Và Lam Thỏ"],
  179: ["Captain Tsubasa", "Đội Trưởng Tsubasa"],
  180: ["Detective Conan", "Thám Tử Lừng Danh Conan"],
  181: ["Tonde Burin", "Hiệp Sĩ Lợn"],
  182: ["Fruit Friends animation", "Cuộc Phiêu Lưu Của Quả Táo"],
  183: ["Duel Masters", "Vua Bài Magic"],
  184: ["Machine Robo Rescue", "Chiến Đội Thần Xe"],
  185: ["Gormiti", "Gormiti The Lords of Nature"],
  186: ["Roman Kids animation", "Những Bạn Trẻ Thành Rome"],
  187: ["Happy Tree Friends", "Sát Thủ Đầu Mung Mủ"],
  188: ["Tí Quậy hoạt hình", "Tí Quậy truyện tranh"],
  189: ["Plasticine Crow", "Chú Đất Trét"],
  190: ["Romance of the Three Kingdoms 2009 animation", "Tam Quốc Diễn Nghĩa hoạt hình"],

  // Anime
  126: ["Doraemon", "Doraemon anime"],
  127: ["Pokemon", "Pocket Monsters"],
  128: ["Yu-Gi-Oh! Duel Monsters", "Yu-Gi-Oh!"],
  129: ["Dragon Ball Z", "Dragon Ball"],
  130: ["Naruto", "Naruto Shippuden"],
  131: ["Detective Conan", "Case Closed"],
  132: ["Crayon Shin-chan", "Shin Cậu Bé Bút Chì"],
  133: ["Digimon Adventure", "Digimon"],
  134: ["Sailor Moon", "Thủy Thủ Mặt Trăng"],
  135: ["Inuyasha", "Khuyển Dạ Xoa"],
  136: ["Cardcaptor Sakura", "Thủ Lĩnh Thẻ Bài"],
  137: ["One Piece", "Đảo Hải Tặc"],
  138: ["Captain Tsubasa", "Dấu Ấn Rồng Thiêng"],
  139: ["Slam Dunk", "Cao Thủ Bóng Rổ"],
  140: ["Hunter x Hunter", "Hunter x Hunter 2011"],
  141: ["Marchen Awakens Romance", "MAR anime"],
  142: ["Yaiba anime", "Kyuukyo Shounen Yaiba"],
  143: ["Dr. Slump", "Arale Norimaki"],
  144: ["Saint Seiya", "Knights of the Zodiac"],
  145: ["Yu Yu Hakusho", "Hành Trình U Hồn"],
  146: ["Bleach anime", "Bleach"],
  147: ["Fairy Tail anime", "Fairy Tail"],
  148: ["Inazuma Eleven", "Đội Bóng Tia Chớp"],
  149: ["Sonic X", "Sonic the Hedgehog"],
  150: ["Astro Boy 1980", "Astro Boy"],
  151: ["Ranma 1/2", "Ranma Nibun-no-Ichi"],
  152: ["Rurouni Kenshin", "Samurai X"],
  153: ["Hamtaro", "Tottoko Hamutaro"],
  154: ["Chibi Maruko-chan", "Nhóc Maruko"],
  155: ["Ninja Hattori-kun", "Ninja Hattori"],
  156: ["Perman anime", "Cậu Bé Siêu Nhân Perman"],
  157: ["Kiteretsu Daihyakka", "Cuốn Từ Điển Kỳ Diệu"],
  158: ["Shaman King 2001", "Shaman King"],
  159: ["Fullmetal Alchemist: Brotherhood", "Fullmetal Alchemist"],
  160: ["Death Note anime", "Death Note"],

  // Classics / Western
  100: ["Popeye the Sailor", "Popeye"],
  101: ["The Flintstones", "Flintstones"],
  108: ["DuckTales 1987", "DuckTales"],
  120: ["She-Ra Princess of Power", "She-Ra 1985"],
  121: ["Alvin and the Chipmunks", "The Chipmunks"],
  122: ["The Smurfs", "Les Schtroumpfs"],
  191: ["Batman: The Animated Series", "Batman TAS"],
  192: ["X-Men 1992 animated series", "X-Men TAS"],
  193: ["Spider-Man 1994 animated series", "Spider-Man TAS"],
  208: ["Spider-Man Into The Spider-Verse", "Spider-Verse poster"],
  209: ["The Incredibles 2004", "The Incredibles poster"],
  210: ["Megamind 2010", "Megamind poster"],
  249: ["Dinosaur King anime", "Kodai Otsuryu Dinosaur King"],
  254: ["Transformers 1984 G1", "Transformers G1"],
  256: ["G.I. Joe A Real American Hero", "GI Joe 1983"]
};

// Direct guaranteed poster URLs for cartoons that have tricky or ambiguous search names
const DIRECT_URLS = {
  11: "https://image.tmdb.org/t/p/original/ppM8Pl6e8JIr39HPLRFgqDH3Vf1.jpg", // Codename: Kids Next Door
  156: "https://simkl.in/posters/14/146680178f81f24aeb_ca.jpg", // Perman
  161: "https://data.kenhsinhvien.vn/transfer/2012/KSV.ME-biarobotraicay8.jpg", // Robo Trái Cây
  163: "https://4.bp.blogspot.com/-C_hQi5H1X2k/Vl8UpwNNPzI/AAAAAAAAE6s/MnDJEHC1tDE/s1600/29894_large.jpg", // Chiến Cơ Siêu Hạng
  167: "https://m.media-amazon.com/images/M/MV5BOGQzZGYwZDItMWY1ZC00YzQ3LTk2ZjctOTBlMzUwZTdhYzZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", // Armor Hero
  188: "https://www.hieusachlananh.com/wp-content/uploads/2022/02/Ty-quay-tap-1.jpg", // Tí Quậy
  194: "https://image.tmdb.org/t/p/original/krZRu80TcRBcYzkcA1f9Jbxfs7W.jpg", // Justice League Unlimited
  209: "https://image.tmdb.org/t/p/original/54UG2eBIEhMgJUa5ZAf8uJjGJos.jpg", // The Incredibles
  231: "https://images.justwatch.com/poster/321379948/s718/monster-buster-club.jpg", // Monster Buster Club
  232: "https://static.tvmaze.com/uploads/images/original_untouched/599/1499134.jpg", // Miraculous Ladybug & Cat Noir
};

// Fallback high-quality SVG graphic converted to WebP
function generateFallbackSvg(cartoon) {
  const title = cartoon.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cat = (cartoon.category || "cartoon").toUpperCase().replace("-", " ");
  const year = cartoon.year || "";
  
  const gradients = {
    "cartoon-network": ["#000000", "#1E293B", "#00C6FF"],
    disney: ["#1E3A8A", "#2563EB", "#F59E0B"],
    nickelodeon: ["#EA580C", "#F97316", "#FFEDD5"],
    classic: ["#D97706", "#F59E0B", "#FEF3C7"],
    anime: ["#991B1B", "#DC2626", "#7C3AED"],
    bibi: ["#065F46", "#059669", "#FBBF24"],
    superhero: ["#1E1B4B", "#312E81", "#EF4444"],
    "adult-animation": ["#4C1D95", "#581C87", "#10B981"],
    international: ["#0F766E", "#0D9488", "#FDE047"],
    "toy-battle": ["#7F1D1D", "#B91C1C", "#06B6D4"],
  };
  
  const [c1, c2, c3] = gradients[cartoon.category] || ["#1E293B", "#334155", "#F59E0B"];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="60%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c1}"/>
      </linearGradient>
      <pattern id="pat" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#ffffff" opacity="0.08"/>
      </pattern>
    </defs>
    <rect width="480" height="360" fill="url(#bg)"/>
    <rect width="480" height="360" fill="url(#pat)"/>
    
    <!-- Accent Border Frame -->
    <rect x="16" y="16" width="448" height="328" rx="14" fill="none" stroke="${c3}" stroke-width="3" opacity="0.75"/>
    <rect x="22" y="22" width="436" height="316" rx="10" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.2"/>

    <!-- Category Pill Badge -->
    <g transform="translate(240, 60)">
      <rect x="-80" y="-16" width="160" height="32" rx="16" fill="${c3}"/>
      <text x="0" y="5" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#121316" text-anchor="middle" letter-spacing="1.5">${cat}</text>
    </g>

    <!-- Star decoration -->
    <g transform="translate(240, 140)">
      <circle cx="0" cy="0" r="42" fill="#000000" opacity="0.35"/>
      <circle cx="0" cy="0" r="36" fill="${c3}" opacity="0.85"/>
      <polygon points="0,-22 6,-6 22,-6 9,4 14,20 0,10 -14,20 -9,4 -22,-6 -6,-6" fill="#121316"/>
    </g>

    <!-- Title and Subtitle -->
    <text x="240" y="240" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">${title.length > 28 ? title.slice(0, 26) + "..." : title}</text>
    <text x="240" y="275" font-family="monospace" font-weight="700" font-size="14" fill="${c3}" text-anchor="middle" letter-spacing="2">CARTOON SUPER CUP ${year ? "• " + year : ""}</text>
  </svg>`;
}

// 2. Multi-tier Image Search Providers
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Provider A: TVMaze Show Search
async function searchTVMaze(query) {
  try {
    // 1. Single search
    let url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`;
    let res = await fetchWithTimeout(url, {}, 5000);
    if (res.ok) {
      let data = await res.json();
      if (data?.image?.original || data?.image?.medium) {
        return data.image.original || data.image.medium;
      }
    }
    // 2. Fuzzy list search
    url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    res = await fetchWithTimeout(url, {}, 5000);
    if (res.ok) {
      let list = await res.json();
      for (const item of list) {
        if (item.show?.image?.original || item.show?.image?.medium) {
          return item.show.image.original || item.show.image.medium;
        }
      }
    }
  } catch (e) {}
  return null;
}

// Provider B: Wikipedia Summary REST API
async function searchWikipedia(query) {
  try {
    const cleanTitle = query.replace(/\s+/g, "_");
    const headers = { "User-Agent": "CartoonSuperCup/1.0 (contact@cartooncup.com)" };
    
    // Check English Wikipedia
    let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`;
    let res = await fetchWithTimeout(url, { headers }, 5000);
    if (res.ok) {
      let data = await res.json();
      if (data?.thumbnail?.source) {
        // Upgrade thumbnail width if possible
        return data.thumbnail.source.replace(/\/\d+px-/, "/500px-");
      }
    }

    // Check Vietnamese Wikipedia if needed
    url = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`;
    res = await fetchWithTimeout(url, { headers }, 5000);
    if (res.ok) {
      let data = await res.json();
      if (data?.thumbnail?.source) {
        return data.thumbnail.source.replace(/\/\d+px-/, "/500px-");
      }
    }
  } catch (e) {}
  return null;
}

// Provider C: DuckDuckGo Image Search
async function searchDuckDuckGo(query) {
  try {
    const tokenRes = await fetchWithTimeout(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" } },
      5000
    );
    const html = await tokenRes.text();
    const vqd = html.match(/vqd=([\d-]+)/)?.[1];
    if (!vqd) return null;

    const imgRes = await fetchWithTimeout(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } },
      5000
    );
    const data = await imgRes.json();
    if (data?.results?.length > 0) {
      return data.results[0].image;
    }
  } catch (e) {}
  return null;
}

// Download and convert to uncropped high-quality WebP (fit inside max 600x600)
async function downloadAndProcessImage(imgUrl, targetPath) {
  const res = await fetchWithTimeout(imgUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
    }
  }, 10000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const processed = await sharp(buffer)
    .resize(600, 600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();

  fs.writeFileSync(targetPath, processed);
  return processed.length;
}

// Process a single cartoon
async function processCartoon(cartoon, index, total, forceIndividual = false) {
  const filename = path.basename(cartoon.image);
  const targetPath = path.join(OUTPUT_DIR, filename);

  const FORCE = forceIndividual || process.argv.includes("--force");
  // If already exists and valid size (> 2KB), skip unless FORCE
  if (!FORCE && fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    if (stats.size > 2000) {
      console.log(`[${index + 1}/${total}] ⏩ SKIPPED (Already exists): ${cartoon.name}`);
      return;
    }
  }

  let imageUrl = DIRECT_URLS[cartoon.id] || null;
  let sourceName = imageUrl ? "DirectURL" : "";

  if (!imageUrl) {
    const overrides = SEARCH_OVERRIDES[cartoon.id] || [];
    const cleanName = cartoon.name.replace(/\(.*?\)/g, "").trim();
    const cleanOrig = (cartoon.originalName || "").replace(/\(.*?\)/g, "").split("/")[0].trim();

    // Prioritize cleanName over short acronyms
    const searchCandidates = [
      ...overrides,
      cleanName,
      cleanOrig,
      cartoon.name
    ].filter(Boolean);

    // 1. Try TVMaze
    for (const query of searchCandidates) {
      imageUrl = await searchTVMaze(query);
      if (imageUrl) {
        sourceName = "TVMaze";
        break;
      }
    }

  // 2. Try Wikipedia
  if (!imageUrl) {
    for (const query of searchCandidates) {
      imageUrl = await searchWikipedia(query);
      if (imageUrl) {
        sourceName = "Wikipedia";
        break;
      }
    }
  }

  // 3. Try DuckDuckGo
  if (!imageUrl) {
    for (const query of searchCandidates) {
      const q = cartoon.category === "bibi" ? `${query} hoạt hình poster` : `${query} cartoon poster`;
      imageUrl = await searchDuckDuckGo(q);
      if (imageUrl) {
        sourceName = "DuckDuckGo";
        break;
      }
    }
  }
}

  // If found an image, download and convert
  if (imageUrl) {
    try {
      const size = await downloadAndProcessImage(imageUrl, targetPath);
      console.log(`[${index + 1}/${total}] ✅ SUCCESS (${sourceName}): ${cartoon.name} -> ${filename} (${Math.round(size / 1024)}KB)`);
      return;
    } catch (err) {
      console.warn(`[${index + 1}/${total}] ⚠️ Download failed (${imageUrl.slice(0, 60)}...): ${err.message}. Trying SVG poster fallback.`);
    }
  }

  // 4. Fallback: generate stylized SVG converted to WebP
  try {
    const svg = generateFallbackSvg(cartoon);
    const fallbackBuffer = await sharp(Buffer.from(svg))
      .resize(480, 360)
      .webp({ quality: 85 })
      .toBuffer();
    fs.writeFileSync(targetPath, fallbackBuffer);
    console.log(`[${index + 1}/${total}] 🎨 GENERATED STYLIZED POSTER: ${cartoon.name} -> ${filename}`);
  } catch (err) {
    console.error(`[${index + 1}/${total}] ❌ Failed to generate fallback for ${cartoon.name}:`, err.message);
  }
}

// Main execution with concurrency pool of 4
async function run() {
  const idsArg = process.argv.find(a => a.startsWith("--ids="));
  const filterIds = idsArg ? idsArg.replace("--ids=", "").split(",").map(Number) : null;
  const list = filterIds ? cartoons.filter(c => filterIds.includes(c.id)) : cartoons;

  console.log(`Starting image download for ${list.length} cartoons...`);
  const concurrency = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < list.length) {
      const idx = cursor++;
      await processCartoon(list[idx], idx, list.length, Boolean(filterIds));
      // Small polite delay between requests
      await new Promise(r => setTimeout(r, 150));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log("\n==========================================");
  console.log(`Processed ${list.length} cartoon images successfully!`);
  console.log(`Target directory: ${OUTPUT_DIR}`);
  console.log("==========================================\n");
}

run().catch(console.error);
