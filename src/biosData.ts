import { BioItem, PresetCategory, StylistFontPreset } from "./types";

export const CATEGORIES: PresetCategory[] = [
  { id: "all", name: "All Bios", icon: "📱", description: "All 1000+ stylish bios" },
  { id: "vip_royal", name: "👑 VIP Royal", icon: "👑", description: "Premium accounts status symbols" },
  { id: "attitude", name: "😈 Attitude / Boys", icon: "🔥", description: "High-voltage attitude bios" },
  { id: "queen_girls", name: "🎀 Girls / Princess", icon: "💅", description: "Cute, aesthetic, and floral creations" },
  { id: "sad_broken", name: "🖤 Sad & Broken", icon: "🥀", description: "Dark, emotional poetry frames" },
  { id: "gamer", name: "🎮 Pro Gamer", icon: "⚔️", description: "Weapon indicators and esports designs" },
  { id: "symbols_art", name: "🎨 Name Frames", icon: "⭐", description: "Border layouts and custom font lines" }
];

// 1. Handcrafted base templates categorized appropriately
const baseVipRoyal = [
  `👑 𝒱𝐼𝒫 𝒜𝒸𝒸𝑜𝓊𝓃𝓉 👑\n💎 VIP Entry: [Date]\n🖤 Papa's King\n🔥 Attitude Level: 💯%\n☠️ Game Over ☠️`,
  `👑 Royal Entry [Date] 👑\n💥 Dynamic Personality\n😎 Mind High, Attitude Top\n🎂 Wish Me on [Date]\n🥂 Champion Mindset`,
  `★ ✨ 𝙑𝙄𝙋 𝙋𝙧𝙤𝙛𝙞𝙡𝙚 ✨ ★\n💯 Official Account ✔️\n🖤 Dark Soul Rider\n🔥 Single but Taken by Goals\n🎂 Cake Murder 21 Feb 🔪`,
  `👑 WELCOME TO THE ROYAL KING EMPIRE 👑\n🔱 Rule Maker, Rule Breaker\n🏎️ Speed Lover\n🕶️ Classy, Not Trendy\n🌟 Live Life King Size`,
  `🔱 Royal Blood, Loyal Heart 🔱\n👑 Emperor of My Own World\n🏎️ Audi R8 Lover\n🖤 Simple Living, High Thinking\n🎂 25 December 🎉`,
  `😎 𝒱𝐼𝒫 𝐿𝒾𝒻𝑒𝓈𝓉𝓎𝓁𝑒 ⭐\n👑 King of Hearts\n🔥 Killer Attitude Only\n🎸 Guitar Lover | Singer\n🎂 Blow My Candle: [Date]`,
  `⚡ POWERFUL & ROYAL ⚡\n🎖️ Official Fanpage Creator\n💎 Diamond Heart\n🔥 Born to Rule, Not to Cooperate\n👑 King Is Back`,
  `👑 𝓡𝓸𝔂𝓪𝓵 𝓐𝓽𝓽𝓲𝓽𝓾𝓭𝓮 👑\n😎 Born on [Date]\n🖤 Black Coffee & Heavy Gym\n🏋️ Fitness Freak\n🔥 Proud Human Being`,
  `🌟 THE GOLDEN BOY 🌟\n👑 Living My Royal Days\n🏎️ Supercar Enthusiast\n🕶️ Attitude in My DNA\n🎂 Cake Murder: [Date]`,
  `✨ 𝖵𝖨𝖯 𝖯𝖾𝗋𝗌𝗈𝗇𝖺𝗅𝗂𝗍𝗒 𝖮𝖿𝖿𝗂𝖼𝗂𝖺𝗅 ✨\n🏆 Gold Medalist in Attitude\n⚡ Neon Lights & Late Nights\n🏍️ Born to Ride\n🍷 Cheers to Life`
];

const baseAttitude = [
  `😈 𝓚𝓲𝓵𝓵𝓮𝓻 𝓡𝓸𝔂𝓪𝓵 𝓑𝓸𝔂 😈\n⛓️ My Style, My Attitude\n🔥 Rule Changer On Fire\n🖤 No Love, No Tension\n🎂 Wish Me on [Date]`,
  `⚔️ ATTITUDE KING ⚔️\n💯 Ghamand Nahi, Khauf Hai\n🤨 Don't Test My Limit\n🖤 Black Heart Black Car\n🔥 Royal Entry: [Date]`,
  `☠️ DANGER INSIDE ☠️\n😈 Devil's Mind, Royal Blood\n🏋️ Gym Freak 🏋️\n🔥 Zero Friends, Millions of Fans\n🎂 Wish Me on [Date]`,
  `🔥 KILLER BOY [Name] 🔥\n😎 Attitude Level Overloaded\n🏎️ High Speed Life\n🖤 Black Lover | Tea Addict\n🔱 King is Here`,
  `😈 BAD BOY [Name] 😈\n💯 % Shauk Nahi, Khauf Hai\n🏍️ Bike Rider Lover\n🎂 12 June\n❌ Don't trust anyone!`,
  `⚡ DANGER ZONE ⚡\n😎 Keep Distance, King is on Fire\n🔥 My Attitude My Life\n🖤 Mafia Soul\n⚔️ Respect is Earned, Not Demanded`,
  `🔥 THE BEAST IS ALIVE 🔥\n👑 Emperor of Attitude\n⛓️ Zero Drama, Heavy Gym\n🕶️ Ray-Ban Glasses Lover\n🎂 Wish Me on [Date]`,
  `😈 𝕶𝖎𝖑𝖑𝖊𝖗 𝕬𝖙𝖙𝖎𝖙𝖚𝖉𝖊 😈\n🔥 No Attitude, Just standard!\n🖤 Black Outfit Addict\n🎧 Music is My Medicine\n👑 Born To Stand Out`,
  `⚔️ 𝖶𝖠𝖱𝖱𝖨𝖮𝖱 𝖲𝖮𝖴𝖫 ⚔️\n🔱 Rule My Own Empire\n💯 Ghamand Toh Raavan Ka Bhi Nahi Raha\n🔥 Just Simple Killer Look\n🎂 Wish Me: [Date]`,
  `😎 SMART BOY [Name] 😎\n🔥 Double Mind, Single Soul\n🏎️ Living on the Edge\n🖤 Black Lover\n👑 Sunking of Attitude`
];

const baseQueenGirls = [
  `🎀 𝒬𝓊𝑒𝑒𝓃 𝒪𝒻 𝑀𝓎 𝒲𝑜𝓇𝓁𝒹 🎀\n👑 Princess • Papa's Angel\n💄 Makeup Lover | Shopping Queen\n🧁 Sweet but Psycho 😉\n🚫 No attitude check needed`,
  `🦋 𝖵𝖨𝖯 𝖦𝗂𝗋𝗅 𝖠𝖾𝗌𝗍𝗁𝖾𝗍𝗂𝖼 🦋\n✨ [Name] • Glow Princess\n🖤 Black Addict | Foodie\n🧸 Soft Heart, Bold Attitude\n🎂 Wish Me: [Date]`,
  `✨ 𝕼𝖚𝖊𝖊𝖓 𝖔𝖋 𝕳𝖊𝖆𝖗𝖙𝖘 ✨\n👑 Simple Living but Queen Touch\n🧸 Cute Doll face\n🌸 Nature Lover | Photographer\n🧁 Sweet Cupcake 🧁`,
  `✿ 𝖯𝗋𝗂𝗇𝖼𝖾𝗌𝗌 [Name] ✿\n🎀 Pink Theme Lover\n✨ Dance & Drama Queen\n🖤 Black Eyes, Killer Smile\n🎂 Calendar Blow: [Date]`,
  `🎀 𝓕𝓪𝓼𝓱𝓲𝓸𝓷 𝓠𝓾𝓮𝓮𝓷 🎀\n💄 Modeling is My Hobby\n✨ Glow Up Every Day\n🧸 Papa's Cute Doll\n🍓 Sweet and Sassy`,
  `🦋 𝒫𝒾𝓃𝓀 𝐵𝓊𝓉𝓉𝑒𝓇𝒻𝓁𝓎 🦋\n🌸 Pure Hearted Girl\n✨ Sparkling Soul\n🍰 Cake Murder: [Date]\n🖤 Music & Travel Enthusiast`,
  `👑 𝖱𝗈𝗒𝖺𝗅 𝖯𝗋𝗂𝗇𝖼𝖾𝗌𝗌 👑\n✨ Self Believer\n🧚 Cute but Dangerous\n🖤 Dark Eyes Shadow\n🧁 Chocolate Addicted`,
  `🎀 𝖲𝗍𝗒𝗅𝗂𝗌𝗁 𝖣𝗈𝗅𝗅 🎀\n✨ [Name] • Sparkling Queen\n🧸 Soft Soft Heart\n🔥 Sassy Mind\n🎂 Birthday Bash: [Date]`,
  `🌸 Fluttering Hearts 🌸\n👑 I am My Own Queen\n🖤 Black Dress Addict\n🦄 Unicorn Lover\n🍰 Wish Me on [Date]`,
  `🦋 𝖣𝗋𝖾𝖺𝗆𝗒 𝖦𝗂𝗋𝗅 🦋\n✨ Star Gazing and Coffee\n🎀 Designing is My Passion\n🧁 Cupcake Sweetness\n👑 Queen Mindset Only`
];

const baseSadBroken = [
  `🖤 𝔖𝔞𝔡 𝔖𝔬𝔲𝔩 🖤\n🥀 [Name] • Broken Inside\n🤐 Fake Smile, Silent Pain\n🌌 Dark Nights & Sad Songs\n⏳ Wait for My Time...`,
  `『 [Name] 』\n🎭 Log Badalte Hain, Hum Nahi\n💔 Heart Broken but Mind High\n🚶 Single Walk In Deep Forest\n⛈️ Raining Tears In My Heart`,
  `🥀 Silent Pain Inside 🥀\n💔 No Love, No Expectations\n🚶 Alone is Much Better\n🖤 Fake World, Fake People\n⌛ Time Will Heal Everything`,
  `🖤 THE DARK SOUL 🖤\n🥀 Heart is Empty, Brain is Full\n💔 Unlocked Pain Inside\n🎧 Midnight Lo-Fi Beats\n🤐 No Complains, Just Silence`,
  `🍂 Fallen Leaves 🍂\n💔 Heart Broken Legend\n🚶 Walking Alone In Shadows\n🖤 Lover of Darkness\n🎂 Cake Murder on [Date]`,
  `🥀 Broken but Unbeatable 🥀\n🎭 Behind This Smiling Mask\n💔 Heartbeat Without Love\n🌌 In Love with Darkness\n⏳ Waiting for the End`,
  `🖤 𝖲𝗂𝗅𝖾𝗇𝗍 𝖳𝖾𝖺𝗋𝗌 🖤\n🥀 Lonely Soul Wanderer\n💔 Trust is a Dangerous Game\n🎧 Sad Urdu Ghazals and Tea\n⌛ Waiting for My Destiny`,
  `🎭 FAKE SMILE MAFIA 🎭\n💔 Happy Outside, Dead Inside\n🖤 Dark Room, No Light\n🚬 Pain is My Only Friend\n🥀 Broken Hearts Guild`,
  `🥀 𝖫𝖺𝗌𝗍 𝖡𝗋𝖾𝖺𝗍𝗁 𝖮𝖿 𝖫𝗈𝗏𝖾 🥀\n💔 Overthinking Destroyer\n🚶 No Friends, No Company\n🖤 Dark Blue Sky Observer\n⏳ Game of Hearts Over`,
  `🖤 EMPTY HEARTS CLUB 🖤\n🥀 [Name] • Living Legend of Grief\n💔 Broken Promises Veteran\n☕ Black Tea and Deep Sighs\n🌌 Night Crawler`
];

const baseGamer = [
  `⚔️ 𝖦𝖠𝖬𝖤𝖱 𝖫𝖨𝖥𝖤 ⚔️\n🔫 𝖪𝖨𝖫𝖫𝖤𝖱 [Name] ࿇\n🎮 Free Fire/PUBG Pro\n☠️ No Love, Only Loot 💣\n🏆 Rush Gameplay Only`,
  `░░▒▒▓▓ [Name] ▓▓▒▒░░\n👑 𝕲𝖆𝖒𝖊𝖗 𝕾𝖔𝖚𝖑 ⭐\n👾 Esports Champion\n🎧 Bass Boosted Beats\n⛔ Born To Conquer ⛔`,
  `🎮 PRO GAMER ZONE 🎮\n⚔️ Clan Leader [Esports Account]\n🔫 Sniper King On Duty\n🏆 KD Ratio: 7.2\n☠️ Headshot Master Only`,
  `👾 LEVEL: EXPERT 👾\n👑 Gaming Sovereign\n⚔️ Rush Gameplay\n🔌 High Ping Challenger\n🎂 Cake Smash: [Date]`,
  `🤖 THE CYBER WARRIOR 🤖\n👾 Esports Gamer Fanatic\n🎧 Music & Esports Grind\n🏎️ Speed Booster Racer\n🏆 Win or Learn`,
  `⚔️ 𝖲𝖭𝖨𝖯𝖤𝖱 𝖠𝖲𝖲𝖠𝖲𝖲𝖨𝖭 ⚔️\n🔫 One Shot, One Kill\n🎮 Esports Legend\n🖤 No Emotion, All Game\n🏆 Winner Winner Chicken Dinner`,
  `🎮 𝖯𝖴𝖡𝖦/𝖥𝖥 𝖢𝖧𝖠𝖬𝖯𝖨𝖮𝖭 🎮\n⚔️ [Name] 々 Esports Player\n👑 Living In Virtual Reality\n🔥 High Aim, Perfect Precision\n☠️ Enemy Spotted`,
  `👾 GYM & TIMING GAME 👾\n⚔️ Ultimate Reflexes Player\n🎮 Hardcore Console Player\n🎧 Lo-Fi Beats & Chill Gaming\n🏆 Aiming for the Stars`,
  `⚡ NEON GAMER FORCE ⚡\n👾 Virtual Sniper Expert\n⚔️ Clan tag: [Name] Esports\n🖤 Black Room Gaming Lights\n🏆 Conqueror Lobby Ready`,
  `🔫 RUSH GAMEPLAY ONLY 🔫\n🎮 Battle Ground Expert\n⚔️ No Revive, Only Rush\n🎧 Electronic Energy Music\n🏆 Born to Be Pro`
];

const baseSymbolsArt = [
  `╔════🔱 𝖵𝖨𝖯 𝖡𝖨𝖮 🔱════╗\n  ⭐ [Name] Royal Star ⭐\n  🖤 Pure Attitude Legend\n  🔥 Living In High Class\n╚═══════════════════╝`,
  `╭━━━━═👑═━━━━╮\n   ✨ Royal Empress ✨\n   🌸 Delicate But Bold 🌸\n   🖤 Unique Soul Girl\n╰━━━━═👑═━━━━╯`,
  `█║▌│█│║▌║││█║▌│║▌║\n💯 Official Profile Approved\n🔥 VIP Status Online\n👑 King of Dynamic Styling\n🎂 blow: [Date]`,
  `╔═══❖•ೋ°👑°ೋ•❖═══╗\n  ✨ VIP Account Approved ✨\n  💪 Work Hard, Dream Bigger\n  🖤 Unique Character Style\n╚═══❖•ೋ°👑°ೋ•❖═══╝`,
  `◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢\n  🔥 ATTITUDE CHECK ON 🔥\n  😎 Dangerously Stylish [Name]\n  🖤 Mafioso Style Elite\n◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢`,
  `•━•━•━•━•👑•━•━•━•━•\n  ⭐ VIP ROYALTY MIND ⭐\n  🔥 [Name] King Rules\n  🖤 Boldness Level: Max\n•━•━•━•━•👑•━•━•━•━•`,
  `╭━━━━━⚔️━━━━━╮\n  🔥 ELITE ATTITUDE WARRIOR\n  🕶️ Ray-Ban Goggles On\n  🖤 Living Life King-Size\n╰━━━━━⚔️━━━━━╯`,
  `───⚜️ PRO ACCOUNT Approved ⚜️───\n👑 Welcome to Royal Emperor Bio\n🔥 Highly Decorated Lifestyle\n🎂 Smash Birthday on [Date]\n───⚜️────────────────⚜️───`,
  `⭐░▒▓█►── FAMILY VIP ──◄█▓▒░⭐\n👑 Sovereign King [Name] Stars\n🖤 Born to Rise Above Clouds\n🔥 Rule Breaker On Duty\n⭐░▒▓█►───────────────◄█▓▒░⭐`,
  `╭━──━─≪👑≫─━──━╮\n  ✨ VIP Profile Luxury Approved\n  🥀 Sincere and Beautiful\n  🖤 King Mindset Hacker\n╰━──━─≪👑≫─━──━╯`
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
  "Live life with zero rules.",
  "Your attitude determines your direction.",
  "Simplicity is the ultimate sophistication.",
  "Behind the scenes, I build my empire.",
  "Creating my own happiness.",
  "Never expect, never demand, never beg.",
  "Silent actions over loud promises.",
  "Music is my escape from reality.",
  "Too glam to give a damn.",
  "Legends don't die, we retire.",
  "Always forward, never backward.",
  "Living under the grace of my parents.",
  "Gym is therapy, music is healing.",
  "Haste makes waste, speed brings victory.",
  "No friends, no fake trends.",
  "Only goals, no random roles."
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
      finalStr = finalStr.replace(/\[Name\]/g, "Stylish Boy/Girl");
      
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

  // Keep a copy of handcrafted ones
  const handCryptedCount = resultList.length;

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
      title = "𝓥𝓘𝓟 𝓡𝓸𝔂𝓪𝓵 𝓐𝓬𝓬𝓸𝓾𝓷𝓽 👑";
      heartToken = "🔱";
    } else if (category === "attitude") {
      styleRow = aestheticSymbols[1];
      title = "🔥 𝕶𝖎𝖑𝖑𝖊𝖗 𝕬𝖙𝖙𝖎𝖙𝖚𝖉𝖊 𝕭𝖔𝖞 😈";
      heartToken = "⚔️";
    } else if (category === "queen_girls") {
      styleRow = aestheticSymbols[2];
      title = "🎀 𝒬𝓊𝑒𝑒𝓃 𝒪𝒻 𝑀𝓎 𝒲𝑜𝓇𝓁𝒹 ✨";
      heartToken = "🦋";
    } else if (category === "sad_broken") {
      styleRow = aestheticSymbols[3];
      title = "🖤 𝔖𝔞𝔡 & 𝔅𝔯𝔬𝔨𝔢𝔫🥀";
      heartToken = "💔";
    } else if (category === "gamer") {
      styleRow = aestheticSymbols[4];
      title = "⚔️ 𝖯𝖱𝖮 𝖦𝖠𝖬𝖤𝖱 𝖫𝖨𝖥𝖤 🎮";
      heartToken = "🔫";
    } else {
      styleRow = aestheticSymbols[5];
      title = "╔════⭐ 𝖵𝖨𝖯 𝖡𝖨𝖮 ⭐════╗";
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
      // Artistic layout
      textBlock = `${title}\n  ${o1} Welcome to My Heaven\n  ${o2} Bold Personality Since ${randomDate}\n  ${o3} ${randomPhrase}\n╚═══════⚜️ VIP Approved #${sequenceNumber} ⚜️═══════╝`;
    } else {
      textBlock = `${o1} ${title} ${o1}\n${heartToken} Official Approved Account ✔️\n${o2} Living Classy Lifestyle\n${o3} Slogan: "${randomPhrase}"\n${o4} Cake Murder Event: ${randomDate} 🔪\n${o5} Follow Me and Stay Gold`;
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
      const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const custom = "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅𝔖𝔇𝔈𝔉𝔊𝔓𝔍𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔𝔖𝔖𝔗𝔘𝔙𝔚𝔛𝔒action";
      // Handcrafted conversion for elegant vintage font
      const map: any = {
        'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅',
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
        'a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'𝔀','x':'𝔁','y':'𝔂','z':'𝔃'
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
        'A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝖍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ',
        'a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝕢','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫'
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
