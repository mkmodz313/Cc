import { BioItem, PresetCategory, StylistFontPreset } from "./types";
import stylishBoyImg from "./assets/images/stylish_boy_1782169107213.jpg";

export const CATEGORIES: PresetCategory[] = [
  { id: "all", name: "All Bios", icon: "📱", description: "All 1000+ stylish bios" },
  { id: "vip_royal", name: "👑 VIP Royal", icon: "👑", description: "Premium accounts status symbols" },
  { id: "attitude", name: "😈 Attitude / Boys", icon: "🔥", description: "High-voltage attitude bios" },
  { id: "queen_girls", name: "🎀 Girls / Princess", icon: "💅", description: "Cute, aesthetic, and floral creations" },
  { id: "sad_broken", name: "🖤 Sad & Broken", icon: "🥀", description: "Dark, emotional poetry frames" },
  { id: "gamer", name: "🎮 Pro Gamer", icon: "⚔️", description: "Weapon indicators and esports designs" },
  { id: "symbols_art", name: "🎨 Name Frames", icon: "⭐", description: "Border layouts and custom font lines" }
];

// =========================================================================
// 🛠️ URDU / HINDI GUIDE: BIOS KO TABDEEL (EDIT) KAISE KAREIN
//
// 1. Agar aap koi bhi bio ya design khud badalna chahein, toh neeche diye gaye
//    arrays (baseVipRoyal, baseAttitude, etc.) me text ko directly change kar sakte hain.
// 2. Iss me unique elements (jaise 👑, 😈, 🖤, ☠️, ⚔️, 々, 亗, 𓆩♡𓆪) manually space dekar designer bio banayein.
// 3. English words ko bilkul kam rakha gaya hai taake look full-VIP aur futuristic lage!
// =========================================================================

// 1. Handcrafted base templates categorized appropriately (Symbol dominant, Minimal English)
const baseVipRoyal = [
  `👑 𓆩亗𓆪 𝖵𝖨𝖯 𓆩亗𓆪 👑\n ╰──────── ⭐ ────────╯\n  🔱 𝖫𝖨𝖥𝖤: [Date] 🩸\n  🔥 𝖫𝖤𝖵𝖤𝖫: 💯% ✔️\n  🖤 𝖪𝖨𝖭𝖦 亗 🖤`,
  `╔═════ 👑 ═════╗\n  𓆩☠️𓆪 𝖵𝖨𝖯 🅔🅝🅣🅡🅦 𓆩☠️𓆪\n  ✨ 𝖪𝖨𝖭𝖦 々 [Date] ✨\n  🔱 亗 𝖵𝖨𝖯 亗 🔱\n╚═════ 👑 ═════╝`,
  `★━━━━━━━━ 🔱 ━━━━━━━━★\n ╰─►  𓆩👑𓆪 𝖵𝖨𝖯 • 𝖯𝖱𝖮 🌟\n ╰─►  🖤 𝖣𝖠𝖱𝖪 々 亗\n ╰─►  🔥 🅥🅘🅟 [Date] ⚡\n★━━━━━━━━ 🔱 ━━━━━━━━★`,
  `👑 𓆩亗𓆪 𝖱𝖮𝖸𝖠𝖫 𓆩亗𓆪 👑\n─── ❖ ── ✦ ── ❖ ───\n ⚔️ 𝖪𝖨𝖭𝖦: 𝖥𝖨𝖱𝖤 🔥\n 🖤 𝖵𝖨𝖯: 💯% ✔️\n 🎂 [Date] 🩸`,
  `🔱 𓆩♡𓆪 𝖵𝖨𝖯 𓆩♡𓆪 🔱\n ╰────── ✧ ──────╯\n  ⚡ 亗 𝖫𝖨𝖥𝖤 亗 ⚡\n  🖤 𝖪𝖨𝖭𝖦 々 👑\n  🎂 [Date] 🩸`,
  `╭━━━━━═👑═━━━━━╮\n  ✨ 𝖵𝖨𝖯 🅚🅘🅝🅖 亗 ✨\n  🔱 々 ░ ░ 々 🔱\n  🖤 [Date] ☠️\n╰━━━━━═👑═━━━━━╯`,
  `⚡ 𝖱𝖮𝖸𝖠𝖫 𓆩☠️𓆪 𝖵𝖨𝖯 ⚡\n ★━━━━━━━━━━━━★\n  👑 𝖡𝖮𝖸 々 亗\n  🖤 𝖣𝖠𝖱𝖪 𝖲𝖮𝖴𝖫\n  🎂 [Date] ⚔️`,
  `╔═══❖•ೋ° 👑 °ೋ•❖═══╗\n  ✨ 𝖵𝖨𝖯 🅛🅘🅵🅔 ✨\n  🖤 𝖪𝖨𝖭𝖦 々 亗 ⚔️\n  🔥 [Date] 🩸\n╚═══❖•ೋ° 👑 °ೋ•❖═══╝`,
  `★━━━━━━━━ 👑 ━━━━━━━━★\n  🏆 𝖵𝖨𝖯 𝖢𝖧𝖠𝖬𝖯 亗\n  ⚡ 々 ░░ 々 ⚡\n  🏍️ [Date] 🩸\n★━━━━━━━━ 👑 ━━━━━━━━★`,
  `👑 𝖵𝖨𝖯 𝖯𝖱𝖮𝖥𝖨𝖫𝖤 👑\n ╰──────── ⭐ ────────╯\n  💎 [Date] 💎\n  🔥 𝖫𝖾𝗏𝖾𝗅: 💯% ✔️\n  🔱 亗 [Name] 亗 🔱`
];

const baseAttitude = [
  `😈 𓆩亗𓆪 𝖪𝖨𝖫𝖫𝖤𝖱 𓆩亗𓆪 😈\n ─── ❖ ── ✦ ── ❖ ───\n  🔥 𝖠𝖳𝖳𝖨𝖳𝖴𝖣𝖤: 💯% ✔️\n  🖤 𝖦𝖠𝖬𝖤 𝖮𝖵𝖤𝖱 ☠️\n  🎂 [Date] 🩸`,
  `⚔️ 𓆩☠️𓆪 𝖠𝖳𝖳𝖨𝖳𝖴𝖣𝖤 𓆩☠️𓆪 ⚔️\n ╰──────── ⭐ ────────╯\n  🖤 𝖪𝖨𝖭𝖦 亗 🔥\n  😈 𝖡𝖠𝖣 𝖡𝖮𝖸 々\n  🎂 [Date] 🩸`,
  `☠️ 𝖣𝖠𝖭𝖦𝖤𝖱 亗 ☠️\n ╭━━━━━═👑═━━━━━╮\n  😈 𓆩☠️𓆪 𝖡𝖮𝖸 𓆩☠️𓆪 😈\n  🔥 [Date] 🩸\n ╰━━━━━═👑═━━━━━╯`,
  `🔥 𓆩亗𓆪 𝖪𝖨𝖫𝖫𝖤𝖱 𓆩亗𓆪 🔥\n ╰────── ✧ ──────╯\n  😎 々 亗 々 😎\n  🖤 𝖣𝖠𝖱𝖪 𝖲𝖮𝖴𝖫\n  🎂 [Date] 🩸`,
  `😈 𓆩☠️𓆪 𝖡𝖠𝖣 𝖡𝖮𝖸 𓆩☠️𓆪 😈\n ★━━━━━━━━━━━━★\n  ⚡ 𝖠𝖳𝖳𝖨𝖳𝖴𝖣𝖤 💯%\n  🏍️ 々 亗 々 🏍️\n  🎂 [Date] 🩸`,
  `⚡ 𝖣𝖠𝖭𝖦𝖤𝖱 𝖹𝖮𝖭𝖤 ⚡\n ╔═════ 👑 ═════╗\n  😎 𓆩☠️𓆪 亗 𓆩☠️𓆪 😎\n  🖤 [Date] 🩸\n ╚═════ 👑 ═════╝`,
  `🔥 𓆩亗𓆪 𝖡𝖤𝖠𝖲𝖳 𓆩亗𓆪 🔥\n ★━━━━━━━━━━━━★\n  ⛓️ 𓆩☠️𓆪 𓆩☠️𓆪 ⛓️\n  👑 𝖪𝖨𝖭𝖦 亗 🖤\n  🎂 [Date] 🩸`,
  `😈 𓆩☠️𓆪 𕗑𝖎𝖑𝖑𝖊𝖗 𓆩☠️𓆪 😈\n ╰──────── ⭐ ────────╯\n  🖤 𝖡𝖫𝖠𝖢𝖪 𝖮𝖴𝖳𝖥𝖨𝖳\n  🔥 々 亗 々 🔥\n  🎂 [Date] 🩸`,
  `⚔️ 𓆩亗𓆪 𝖶𝖠𝖱𝖱𝖨𝖮𝖱 𓆩亗𓆪 ⚔️\n ★━━━━━━━━━━━━★\n  🔱 々 亗 々 🔱\n  🔥 𝖪𝖨𝖭𝖦 亗\n  🎂 [Date] 🩸`,
  `😎 𓆩☠️𓆪 𝖲𝖬𝖠𝖱𝖳 𓆩☠️𓆪 😎\n ╰────── ✧ ──────╯\n  🔥 々 亗 々 🔥\n  🖤 𝖪𝖨𝖭𝖦 亗\n  🎂 [Date] 🩸`
];

const baseQueenGirls = [
  `🎀 𓆩♡𓆪 𝒬𝓊𝑒𝑒𝓃 𓆩♡𓆪 🎀\n ╰──────── ❀ ────────╯\n  👑 𝖰𝖴𝖤𝖤𝖭 々 ✿\n  🧁 𝖲𝖶𝖤𝖤𝖳 🍭\n  🧸 [Name] 🥀`,
  `🦋 𓆩♡𓆪 𝖵𝖨𝖯 𓆩♡𓆪 🦋\n ★━━━━━━━━━━━━★\n  🖤 𝖡𝖫𝖠𝖢𝖪 𝖫𝖮𝖵𝖤\n  🧸 🅒🅤🅣🅔 🎀\n  🎂 [Date] ✿`,
  `✨ 𓆩♡𓆪 𕗑𝖚𝖊𝖊𝖓 𓆩♡𓆪 ✨\n ╔═════ 🌸 ═════╗\n  👑 𝖰𝖴𝖤𝖤𝖭 亗\n  🧁 [Date] 🍰\n ╚═════ 🌸 ═════╝`,
  `✿ 𓆩♡𓆪 𝖯𝖱𝖨𝖭𝖢𝖤𝖲𝖲 𓆩♡𓆪 ✿\n ╰──────── ❀ ────────╯\n  🎀 𝖢𝖴𝖳𝖤 𝖣𝖮𝖫𝖫\n  🎂 [Date] 🌸\n  ✨ [Name] ✨`,
  `🎀 𓆩♡𓆪 𝖥𝖠𝖲𝖧𝖨𝖮𝖭 𓆩♡𓆪 🎀\n ─── ❖ ── ✦ ── ❖ ───\n  👑 𝖰𝖴𝖤𝖤𝖭 々\n  🧸 𝖢𝖴𝖳𝖤 ✿\n  💅 [Date] 🍓`,
  `🦋 𓆩♡𓆪 𝒫𝒾𝓃𝓀 𓆩♡𓆪 🦋\n ╰────── ✧ ──────╯\n  🌸 𝖢𝖴𝖳𝖤 𝖣𝖮𝖫𝖫\n  🍰 [Date] ✿`,
  `👑 𓆩♡𓆪 𝖯𝖱🅸🅝🅲🅔🆂🆂 𓆩♡𓆪 👑\n ★━━━━━━━━━━━━★\n  🧚 𝖢𝖴𝖳𝖤 ✿\n  🧁 [Date] 🍓`,
  `🎀 𓆩♡𓆪 𝖲𝖳𝖸𝖫𝖨𝖲𝖧 𓆩♡𓆪 🎀\n ╰──────── ❀ ────────╯\n  🧸 𝖧𝖤𝖠𝖱𝖳 々\n  🎂 [Date] 🌸`,
  `🌸 𓆩♡𓆪 𝖰𝖴𝖤𝖤𝖭 𓆩♡𓆪 🌸\n ─── ❖ ── ✦ ── ❖ ───\n  👑 𝖵𝖨𝖯 🅖🅘🅡🅛 ✨\n  🍰 [Date] 🍓`,
  `🦋 𓆩♡𓆪 𝖣𝖱🅤🅐🅜🅨 𓆩♡𓆪 🦋\n ★━━━━━━━━━━━━★\n  🎀 𝖢𝖴𝖳𝖤 ✿\n  👑 [Date] 🍓`
];

const baseSadBroken = [
  `🖤 𓆩🥀𓆪 𝖲𝖠𝖣 𓆩🥀𓆪 🖤\n ╰──────── 💔 ────────╯\n  🥀 𝖡𝖱𝖮𝖪𝖤𝖭 々\n  🤐 𝖲𝖨𝖫𝖤𝖭𝖳 𝖯𝖠𝖨𝖭\n  ⏳ [Date] 🖤`,
  `『 [Name] 』\n ╭━━━━━═💔═━━━━━╮\n  🎭 𝖲𝖠𝖣 𝖲𝖮𝖴𝖫 々 🥀\n  🚶 𝖫𝖮𝖭𝖤𝖫𝖸 𝖫𝖨𝖥𝖤\n ╰━━━━━═💔═━━━━━╯`,
  `🥀 𓆩💔𓆪 𝖲𝖨𝖫𝖤𝖭𝖳 𓆩💔𓆪 🥀\n ─── ❖ ── ✦ ── ❖ ───\n  🖤 𝖭𝖮 𝖫𝖮𝖵𝖤 ✖️\n  🚶 𝖠𝖫𝖮𝖭𝖤 々\n  ⌛ [Date]`,
  `🖤 𓆩🥀𓆪 𝖣𝖠𝖱𝖪 𓆩🥀𓆪 🖤\n ╰────── ✧ ──────╯\n  💔 𝖡𝖱𝖮𝖪𝖤𝖭 𝖧𝖤𝖠𝖱𝖳\n  🎧 𝖫𝖮𝖥𝖨 𝖡𝖤𝖠𝖳𝖲\n  🤐 [Date] 🖤`,
  `🍂 𓆩💔𓆪 𝖲𝖠𝖣 𝖫𝖨𝖥𝖤 𓆩💔𓆪 🍂\n ★━━━━━━━━━━━━★\n  🖤 𝖣𝖠𝖱𝖪𝖭𝖤𝖲𝖲 々 🥀\n  🎂 [Date] ⏳`,
  `🥀 𓆩💔𓆪 𝖡𝖱𝖮𝖪𝖤𝖭 𓆩💔𓆪 🥀\n ╔═════ 🖤 ═════╗\n  🎭 𝖲𝖠𝖣 𝖡🅞🅨 々\n  ⏳ [Date] 🥀\n ╚═════ 🖤 ═════╝`,
  `🖤 𓆩🥀𓆪 𝖲𝖨𝖫𝖤𝖭𝖳 𓆩🥀𓆪 🖤\n ╰──────── 💔 ────────╯\n  🥀 𝖫𝖮𝖭𝖤𝖫𝖸 𝖲𝖮𝖴𝖫 々\n  💔 𝖭𝖮 𝖳🅱🅤🅢🅣 ✖️\n  ⌛ [Date]`,
  `🎭 𓆩🥀𓆪 𝖲𝖠𝖣 🅜🅐🅵🅘🅐 𓆩🥀𓆪 🎭\n ★━━━━━━━━━━━━★\n  🖤 𝖣𝖠𝖱𝖪 𝖱🅞🅞🅜 々\n  🚬 𝖯𝖠𝖨𝖭 💯\n  🥀 [Date]`,
  `🥀 𓆩💔𓆪 𝖫𝖠𝖲𝖳 𓆩💔𓆪 🥀\n ─── ❖ ── ✦ ── ❖ ───\n  🖤 𝖲𝖠𝖣 𝖫𝖨𝖥𝖤 々\n  🚶 𝖠𝖫𝖮𝖭𝖤\n  ⏳ [Date] 🥀`,
  `🖤 𓆩🥀𓆪 𝖤🅜🅟🅣🅨 𓆩🥀𓆪 🖤\n ★━━━━━━━━━━━━★\n  💔 𝖡𝖱𝖮𝖪𝖤𝖭 々\n  ☕ 𝖲𝖠𝖣 🅥🅘🅑🅔🅢\n  ⏳ [Date] 🖤`
];

const baseGamer = [
  `⚔️ 𓆩🔫𓆪 𝖦𝖠𝖬𝖤🅡 𓆩🔫𓆪 ⚔️\n ╰──────── ⭐ ────────╯\n  👾 𝖯𝖱𝖮 𝖦𝖠𝖬𝖤𝖱 々\n  ☠️ 𝖦𝖠𝖬𝖤 𝖮𝖵𝖤𝖱\n  🏆 [Date] 💣`,
  `░░▒▒▓▓ 𓆩👾𓆪 ▓▓▒▒░░\n ╔═════ ⚔️ ═════╗\n  👑 𝖦𝖠𝖬𝖤🅡 𝖲🅞🅤🅛 々\n  🏆 [Date] 💣\n ╚═════ ⚔️ ═════╝`,
  `🎮 𓆩🔫𓆪 𝖦𝖠𝖬𝖤🅡 𓆩🔫𓆪 🎮\n ╰────── ✧ ──────╯\n  ⚔️ 𝖢𝖫𝖠𝖭: 𝖵𝖨𝖯 々\n  🔥 𝖫𝖤𝖵🅤🅛: 𝖬𝖠𝖷\n  🏆 [Date] 💣`,
  `👾 𓆩⚔️𓆪 𝖦𝖠𝖬𝖤🅡 𓆩⚔️𓆪 👾\n ★━━━━━━━━━━━━★\n  👑 𝖵𝖨𝖯 🅟🅛🅐🅨🅔🅡\n  🔌 🅛🅞🅞🅣 々\n  🎂 [Date] 💣`,
  `🤖 𓆩👾𓆪 🅒🅦🅑🅤🅡 𓆩👾𓆪 🤖\n ─── ❖ ── ✦ ── ❖ ───\n  ⚔️ Esports 々\n  🏆 [Date] 💣`,
  `⚔️ 𓆩🔫𓆪 🆂🅽🅸🅿🅴🆁 𓆩🔫𓆪 ⚔️\n ╰──────── ⭐ ────────╯\n  🎮 𝖦𝖠𝖬𝖤🅡 々 亗\n  🖤 𝖪𝖨𝖫𝖫𓆃\n  🏆 [Date] 💣`,
  `🎮 𓆩⚔️𓆪 🅒🅗🅐🅜🅟 𓆩⚔️𓆪 🎮\n ★━━━━━━━━━━━━★\n  👑 𝖵𝖨𝖯 🅟🅛🅐🅨🅔🅡\n  🔥 𝖠🖲🖲 々 💯%\n  ☠️ [Date] 💣`,
  `👾 𓆩🔫𓆪 𝖦𝖠𝖬𝖤🅡 𓆩🔫𓆪 👾\n ╰────── ✧ ──────╯\n  ⚔️ 亗 [Name] 亗\n  🎧 🅑🅔🅐🅣🅢 々\n  🏆 [Date] 💣`,
  `⚡ 𓆩👾𓆪 🅝🅔🅞🅝 𓆩👾𓆪 ⚡\n ╔═════ ⚔️ ═════╗\n  🎮 𝖦...`, // Wait, gamer complete arrays
  `⚡ 𓆩👾𓆪 🅝🅔🅞🅝 𓆩👾𓆪 ⚡\n ╔═════ ⚔️ ═════╗\n  🎮 𝖦𝖠𝖬𝖤🅡 亗\n  🏆 [Date] 💣\n ╚═════ ⚔️ ═════╝`,
  `🔫 𓆩⚔️𓆪 🅡🅤🅢🅗🅔🅡 𓆩⚔️𓆪 🔫\n ★━━━━━━━━━━━━★\n  🎮 𝖦...`, // complete line
  `🔫 𓆩⚔️𓆪 🅡🅤🅢🅗🅔🅡 𓆩⚔️𓆪 🔫\n ★━━━━━━━━━━━━★\n  🎮 𝖦𝖠𝖬𝖤🅡 々\n  🏆 [Date] 💣`
];

const baseSymbolsArt = [
  `╔════🔱 𝖵𝖨𝖯 𝖡𝖨𝖮 🔱════╗\n  ⭐ [Name] 亗 ⭐\n  🖤 𓆩亗𓆪 𝖵𝖨𝖯\n  🔥 𝖫𝖤𝖵𝖤𝖫: 💯%\n╚══════════════════╝`,
  `╭━━━━━═👑═━━━━━╮\n  ✨ 𝖵𝖨𝖯 🅠🅤🅔🅔🅝 ✨\n  🌸 𓆩♡𓆪 𓆩♡𓆪 🌸\n  🖤 🅒🅤🅣🅔 Doll\n╰━━━━━═👑═━━━━━╯`,
  `█║▌│█│║▌║││█║▌│║▌║\n💯 Official Approved ✔️\n🔥 𝖵𝖨𝖯 🅢🅣🅐🅣🅤🅢\n👑 𝖪𝖨𝖭𝖦 亗 🖤\n🎂 [Date] 🩸`,
  `╔═══❖•ೋ° 👑 °ೋ•❖═══╗\n  ✨ 𝖵𝖨𝖯 🅛🅘🅵🅔 Approved ✨\n  🖤 亗 [Name] 亗 🖤\n  🔥 𝖫𝖤𝖵𝖤𝖫: 💯%\n╚═══❖•ೋ° 👑 °ೋ•❖═══╝`,
  `◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢\n  🔥 𝖠𝖳🅣🅸🅣🆄🅳🅔 🅞🅝 🔥\n  😈 𓆩☠️𓆪 🅑🅞🅡🅝 𓆩☠️𓆪\n  🖤 亗 𝖪𝖨𝖭𝖦 亗\n◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢`,
  `•━•━•━•━• 👑 •━•━•━•━•\n  ⭐ 𝖵𝖨𝖯 🅡🅞🅦🅐🅛🅨 ⭐\n  🔥 亗 𝖪𝖨𝖭𝖦 亗\n  🖤 [Date] 🩸\n•━•━•━•━• 👑 •━•━•━•━•`,
  `╭━━━━━━⚔️━━━━━━╮\n  🔥 𝖠𝖳𝖳𝖨𝖳𓆃 𝖪𝖨𝖭𝖦\n  🕶️ 𓆩亗𓆪 𝖵𝖨𝖯 亗\n  🖤 [Date] 🩸\n╰━━━━━━⚔️━━━━━━╯`,
  `───⚜️ 🅟🅡🅞 🅥🅘🅟 Approved ⚜️───\n👑 亗 𝖪𝖨𝖭𝖦 亗 👑\n🔥 𝖫𝖤𝖵𝖤𝖫: 💯% ✔_\n🎂 [Date] 🩸\n───⚜️────────────────⚜️───`,
  `⭐░▒▓█►── 𝖵𝖨𝖯 🅛🅘🅵🅔 ──◄█▓▒░⭐\n👑 𓆩亗𓆪 𝖪𝖨𝖭𝖦 [Name]\n🖤 𝖵𝖨𝖯 🅢🅣🅐🅣🅤🅢\n🔥 [Date] 🩸\n⭐░▒▓█►──────────────◄█▓▒░⭐`,
  `╭━──━─≪ 👑 ≫─━──━╮\n  ✨ 𝖵𝖨𝖯 🅟🅡🅞🅕🅘🅛🅔 Approved\n  🥀 𓆩♡𓆪 𓆩♡𓆪\n  🖤 亗 𝖪𝖨𝖭𝖦 亗\n╰━──━─≪ 👑 ≫─━──━╯`
];

// Helper components for generator multipliers
const dates = [
  "12 January", "14 February", "1 March", "18 March", "5 April", "28 April", 
  "10 May", "25 May", "12 June", "24 June", "1 July", "16 July", "8 August", 
  "22 August", "5 September", "19 September", "12 October", "25 October", 
  "3 November", "15 November", "10 December", "25 December", "31 December"
];

const aestheticSymbols = [
  ["👑", "🔱", "⚜️", "⭐", "🍷"],
  ["😈", "🔥", "⚡", "⚔️", "⛓️"],
  ["🎀", "🦋", "🌸", "🧸", "🧁"],
  ["🖤", "🥀", "💔", "🤐", "🌌"],
  ["🛡️", "🔫", "⚔️", "👾", "🏆"],
  ["⚡", "✧", "❄️", "✨", "🌟"]
];

const extraPhrases = [
  "𓆩亗𓆪 𝖵𝖨𝖯-👑 𓆩亗𓆪",
  "☠️ 𝖡𝖠𝖣 𝖡𝖮𝖸-々 🖤",
  "🌹 𓆩♡𓆪-𝖰𝖴𝖤𝖤𝖭 🦋",
  "🔱 𝖪𝖨𝖭𝖦-亗 🥇",
  "🔥 𝖠𝖳🅣🅘🅣🅤🅓🅔-💯% ✔️",
  "🖤 𝖣𝖠𝖱𝖪-🅛🅘🅵🅔 々",
  "⚔️ 𝖪𝖨𝖫𝖫𝖤𝖱-☠️ 🩸",
  "✨ 𝖱🅞🅦🅐🅛-𓆩⭐𓆪",
  "🧸 𝖢🅤🅣🅔-𓆩♡𓆪 🎀",
  "💥 𝖦𝖠𝖬𝖤 𝖮𝖵𝖤🅡-✖️",
  "🍂 𝖲𝖠𝖣-𓆩🥀𓆪 💔",
  "⚡ 𝖵𝖨𝖯-🅟🅡🅞 ✔️",
  "🦅 𝖠🅡🅜🅨-亗 ⚔️",
  "🦁 🅑🅞🅢🅢-🔥 💯",
  "💎 𝖵𝖨𝖯_🅛🅘🅵🅔-✨",
  "🎨 🅢🅣🅨🅛🅘🅢🅗-々 👑",
  "🚬 🅓🅐🅡🅖🅔🅡-☠️ ⛓️"
];

export function generateAllBios(): BioItem[] {
  const resultList: BioItem[] = [];
  let currentId = 1;

  // Add the base pre-designed bios first, with maximum style
  const addBase = (list: string[], cat: string) => {
    list.forEach((tmpl, index) => {
      let finalStr = tmpl;
      // replace variables
      const randomDate = dates[index % dates.length];
      finalStr = finalStr.replace(/\[Date\]/g, randomDate);
      finalStr = finalStr.replace(/\[Name\]/g, "亗 VIP 亗");
      
      resultList.push({
        id: currentId++,
        text: finalStr,
        category: cat,
        likes: Math.floor(100 + Math.random() * 899)
      });
    });
  };

  addBase(baseVipRoyal, "vip_royal");
  addBase(baseAttitude, "attitude");
  addBase(baseQueenGirls, "queen_girls");
  addBase(baseSadBroken, "sad_broken");
  addBase(baseGamer, "gamer");
  addBase(baseSymbolsArt, "symbols_art");

  // Programmatic generator to systematically create up to 1020 unique stylish bios
  const targetTotal = 1020;
  const categoriesToGenerate = ["vip_royal", "attitude", "queen_girls", "sad_broken", "gamer", "symbols_art"];

  let customSeedCounter = 0;
  while (resultList.length < targetTotal) {
    const category = categoriesToGenerate[customSeedCounter % categoriesToGenerate.length];
    
    // Choose appropriate ornaments
    let styleRow = aestheticSymbols[0];
    let title = "VIP Standard Profile";
    let heartToken = "💎";

    if (category === "vip_royal") {
      styleRow = aestheticSymbols[0];
      title = "𓆩亗𓆪 VIP 𓆩亗𓆪";
      heartToken = "🔱";
    } else if (category === "attitude") {
      styleRow = aestheticSymbols[1];
      title = "🔥 𓆩☠️𓆪 VIP BOY 𓆩☠️𓆪 😈";
      heartToken = "⚔️";
    } else if (category === "queen_girls") {
      styleRow = aestheticSymbols[2];
      title = "🎀 𓆩♡𓆪 QUEEN 𓆩♡𓆪 ✨";
      heartToken = "🦋";
    } else if (category === "sad_broken") {
      styleRow = aestheticSymbols[3];
      title = "🖤 𓆩🥀𓆪 SAD SOUL 𓆩🥀𓆪";
      heartToken = "💔";
    } else if (category === "gamer") {
      styleRow = aestheticSymbols[4];
      title = "🎮 𓆩⚔️𓆪 GAMER 𓆩⚔️𓆪 🎮";
      heartToken = "🔫";
    } else {
      styleRow = aestheticSymbols[5];
      title = "╔════⭐ VIP ⭐════╗";
      heartToken = "✧";
    }

    const o1 = styleRow[0];
    const o2 = styleRow[1];
    const o3 = styleRow[2];
    const o4 = styleRow[3];
    const o5 = styleRow[4];

    const randomPhrase = extraPhrases[customSeedCounter % extraPhrases.length];
    const randomDate = dates[(customSeedCounter + 7) % dates.length];
    const sequenceNumber = resultList.length + 100;

    let textBlock = "";
    if (category === "symbols_art") {
      textBlock = `${title}\n  ${o1} 𓆩亗𓆪 VIP 𓆩亗𓆪\n  ${o2} 🅥🅘🅟 Approved #${sequenceNumber}\n  ${o3} ${randomPhrase}\n╚═══════ ⚜️ Approved ⚜️ ═══════╝`;
    } else {
      textBlock = `${o1} ${title} ${o1}\n${heartToken} 𝖵𝖨𝖯 ✔️\n${o2} 𝖫𝖨𝖥𝖤: 亗\n${o3} 𓆩🥀𓆪 ${randomPhrase}\n${o4} 𝖤𝖭𝖳𝖱𝖸: ${randomDate} 🔪\n${o5} 𓆩亗𓆪 𝖦𝖠𝖬𝖤 𝖮𝖵𝖤𝖱`;
    }

    resultList.push({
      id: currentId++,
      text: textBlock,
      category: category,
      likes: Math.floor(45 + Math.random() * 450)
    });

    customSeedCounter++;
  }

  return resultList;
}

// Convert numbers or generate styling variations
export const FONT_PRESETS: StylistFontPreset[] = [
  {
    id: "normal",
    name: "Normal Text",
    transform: (t) => t
  },
  {
    id: "royal_vintage",
    name: "𝕽𝖔𝖞𝖆𝖑 𝖁𝖎𝖓𝖙𝖆𝖌𝖊",
    transform: (t) => {
      const map: any = {
        'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'🄹','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅',
        'a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'
      };
      return t.split("").map(c => map[c] || c).join("");
    }
  },
  {
    id: "cursive_italic",
    name: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮 𝓛𝓾𝔁𝓾𝓻𝔂",
    transform: (t) => {
      const map: any = {
        'A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩',
        'a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'<b>','x':'𝔁','y':'𝔂','z':'𝔃'
      };
      return t.split("").map(c => map[c] || c).join("");
    }
  },
  {
    id: "sans_parentheses",
    name: "🅢🅤🅝🅢🅗🅘🅝🅔 Bubble",
    transform: (t) => {
      const map: any = {
        'A':'🅜','B':'🅑','C':'🅒','D':'🅓','E':'🅔','F':'🅡','G':'🅖','H':'🅗','I':'🅘','J':'🅙','K':'🅚','L':'🅛','M':'🅜','N':'🅝','O':'🅞','P':'🅟','Q':'🅠','R':'🅡','S':'🅢','T':'🅣','U':'🅤','V':'🅥','W':'🅦','X':'🅧','Y':'🅨','Z':'🅩',
        'a':'🅐','b':'🅑','c':'🅒','d':'🅓','e':'🅔','f':'🅵','g':'🅖','h':'🅗','i':'🅘','j':'🅙','k':'🅚','l':'🅛','m':'🅜','n':'🅝','o':'🅞','p':'🅟','q':'🅠','r':'🅡','s':'🅢','t':'🅣','u':'🅤','v':'🅥','w':'🅦','x':'🅧','y':'🅨','z':'🅩'
      };
      return t.split("").map(c => map[c] || map[c.toUpperCase()] || c).join("");
    }
  },
  {
    id: "heavy_square",
    name: "🄷🄴🄰🅅🅈 Square",
    transform: (t) => {
      const map: any = {
        'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🄲','R':'🄾','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉',
        'a':'🄰','b':'🄱','c':'🄲','d':'🄳','e':'🄴','f':'🄵','g':'🄶','h':'🄷','i':'🄸','j':'🄹','k':'🄺','l':'🄻','m':'🄼','n':'🄽','o':'🄾','p':'🄿','q':'🄲','r':'🄾','s':'🅂','t':'🅃','u':'🅄','v':'🅅','w':'🅆','x':'🅇','y':'🅈','z':'🅉'
      };
      return t.split("").map(c => map[c] || map[c.toUpperCase()] || c).join("");
    }
  },
  {
    id: "neon_glitch",
    name: "F҉a҉n҉t҉a҉s҉y҉ Glitch",
    transform: (t) => {
      return t.split("").map(c => c !== " " ? `${c}҉` : " ").join("");
    }
  },
  {
    id: "double_struck",
    name: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜",
    transform: (t) => {
      const map: any = {
        'A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'🇮','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝖍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ',
        'a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'🇮','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝕢','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫'
      };
      return t.split("").map(c => map[c] || c).join("");
    }
  }
];

export const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", // Royal Gold Boy
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", // Queen Girl
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&h=150&q=80", // Dynamic Gamer Anime
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", // Alpha Male King
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"  // Cyber aesthetic Girl
];

export const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=400&q=80", // Abstract Neon Gold
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&h=400&q=80", // Gradient Cyber Purple
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&h=400&q=80", // Dark Cosmic Starry Night
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&h=400&q=80"  // Dark Gaming Red Matrix
];

export const TACTILE_CHORDS = {
  copy: [261.63, 329.63, 392.00, 523.25], // C Major Arpeggio of joy
  click: [440.00], // A tone of physical touch
  success: [523.25, 659.25, 783.99, 1046.50], // Gold chime of success
  switch: [349.23, 440.00], // Smooth F Major transitions
  delete: [220.00, 164.81] // Sad detune of destruction
};
