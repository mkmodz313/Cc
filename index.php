<?php
/**
 * ULTRA FAST STANDALONE YOUTUBE DOWNLINK & AUDIO DECRYPTER
 * Developed by Umar Malang - Compact Standalone PHP Edition 
 * Uses David Cyril YouTube Search & SaveTube decryption endpoints
 */

ob_start();

$stats_file = 'stats.json';
if (!file_exists($stats_file)) {
    file_put_contents($stats_file, json_encode(['total_users' => 124, 'total_downloads' => 389]));
}

$stats = json_decode(file_get_contents($stats_file), true);

session_start();
if (!isset($_SESSION['visited'])) {
    $_SESSION['visited'] = true;
    $stats['total_users']++;
    file_put_contents($stats_file, json_encode($stats));
}

function fetch_api_payload($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 25);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code !== 200) return null;
    return json_decode($response, true);
}

$search_results = [];
$download_link = null;
$video_details = null;
$error = null;
$query = isset($_POST['query']) ? trim($_POST['query']) : '';
$action = isset($_POST['action']) ? $_POST['action'] : '';
$video_id = isset($_POST['video_id']) ? $_POST['video_id'] : '';
$video_title = isset($_POST['video_title']) ? $_POST['video_title'] : '';
$video_thumbnail = isset($_POST['video_thumbnail']) ? $_POST['video_thumbnail'] : '';
$video_duration = isset($_POST['video_duration']) ? $_POST['video_duration'] : '';
$video_views = isset($_POST['video_views']) ? $_POST['video_views'] : '';
$video_author = isset($_POST['video_author']) ? $_POST['video_author'] : '';
$video_uploaded = isset($_POST['video_uploaded']) ? $_POST['video_uploaded'] : '';
$show_details = isset($_POST['show_details']) ? $_POST['show_details'] : false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'search' && !empty($query)) {
        $search_url = "https://apis.davidcyriltech.my.id/youtube/search?query=" . urlencode($query);
        $data = fetch_api_payload($search_url);
        if ($data && isset($data['status']) && $data['status'] && isset($data['results']) && is_array($data['results'])) {
            $search_results = array_slice($data['results'], 0, 12);
        } else {
            $error = "Failed to intercept videos on this keyword or URL.";
        }
    } elseif ($action === 'view_details' && !empty($video_id)) {
        $show_details = true;
        $video_details = [
            'id' => $video_id, 
            'title' => $video_title, 
            'thumbnail' => $video_thumbnail, 
            'duration' => $video_duration, 
            'views' => $video_views, 
            'author' => $video_author, 
            'uploaded' => $video_uploaded
        ];
    } elseif ($action === 'download' && !empty($video_id)) {
        $show_details = true;
        $video_details = [
            'id' => $video_id, 
            'title' => $video_title, 
            'thumbnail' => $video_thumbnail, 
            'duration' => $video_duration, 
            'views' => $video_views, 
            'author' => $video_author, 
            'uploaded' => $video_uploaded
        ];
        $youtube_url = "https://www.youtube.com/watch?v=" . $video_id;
        
        // Try high speed download channels sequentially
        $formats = ['720', '360', 'mp3'];
        foreach ($formats as $format) {
            $api_url = "https://apis.davidcyriltech.my.id/download/savetube?url=" . urlencode($youtube_url) . "&format=" . $format;
            $data = fetch_api_payload($api_url);
            if ($data && isset($data['success']) && $data['success'] && isset($data['data']['download_url'])) {
                $download_link = $data['data']['download_url'];
                break;
            }
        }
        
        if ($download_link) {
            $stats['total_downloads']++;
            file_put_contents($stats_file, json_encode($stats));
        } else {
            $error = "Bypass node timed out. Please try generating again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultra Downloader - Golden PHP Standalone</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #060402; color: #f1f5f9; }
        .font-cyber { font-family: 'Space Grotesk', sans-serif; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center p-4 sm:p-6 select-none bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.05),transparent)]">

    <div class="w-full max-w-2xl mt-4 sm:mt-10">
        <!-- HEADER -->
        <header class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-yellow-500/10 pb-5">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center text-yellow-500">
                    <i class="fas fa-crown text-sm"></i>
                </div>
                <div>
                    <h1 class="font-cyber font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                        ULTRA YOUTUBE GOLD
                    </h1>
                    <p class="text-[8px] font-mono uppercase tracking-widest text-yellow-500/50">STANDALONE PHP BYPASS CORE</p>
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="text-[9px] font-mono bg-yellow-500/5 border border-yellow-500/15 py-1 px-3 rounded-lg text-yellow-400">
                    <span class="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                    ACTIVE DECRYPTERS: <?php echo number_format($stats['total_users']); ?>
                </div>
            </div>
        </header>

        <!-- SEARCH INPUT -->
        <div class="bg-black/40 border border-yellow-500/20 p-3 rounded-2xl shadow-inner mb-6">
            <form method="POST" class="flex flex-col sm:flex-row gap-2">
                <input type="hidden" name="action" value="search">
                <div class="flex-grow flex items-center bg-black/50 border border-yellow-500/10 rounded-xl px-3 focus-within:border-yellow-500/30 transition">
                    <i class="fas fa-search text-yellow-500/30 mr-2.5 text-xs"></i>
                    <input type="text" name="query" placeholder="Enter search keywords or paste video link..." value="<?php echo htmlspecialchars($query); ?>" class="w-full bg-transparent py-3 text-xs outline-none font-mono text-yellow-200 uppercase placeholder-yellow-500/20" required>
                </div>
                <button type="submit" class="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-cyber font-black text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition shadow-[0_4px_15px_rgba(245,158,11,0.2)]">
                    DECRYPT VIDEO
                </button>
            </form>
        </div>

        <?php if ($error): ?>
            <div class="bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-[10px] py-3.5 px-4 rounded-xl mb-6 text-center font-bold tracking-widest uppercase"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <!-- DETAILS THEATER INTERFACE -->
        <?php if ($show_details && $video_details): ?>
            <div class="bg-[#0c0a05]/95 border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl animate-fade-in max-w-lg mx-auto">
                <div class="p-5 sm:p-6 space-y-5">
                    <a href="" class="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase transition"><i class="fas fa-arrow-left"></i> RETURN TO DISCOVERY</a>
                    
                    <div class="aspect-video relative bg-black/80 rounded-2xl overflow-hidden border border-yellow-500/10">
                        <img src="<?php echo htmlspecialchars($video_details['thumbnail']); ?>" class="w-full h-full object-cover opacity-60">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div class="absolute bottom-3 right-3 bg-black/80 text-yellow-400 text-[9px] font-mono px-2 py-0.5 rounded font-black"><?php echo htmlspecialchars($video_details['duration']); ?></div>
                    </div>

                    <div class="space-y-2">
                        <h3 class="font-cyber font-black text-sm text-white uppercase tracking-wider leading-snug"><?php echo htmlspecialchars($video_details['title']); ?></h3>
                        <div class="flex justify-between font-mono text-[9px] text-yellow-500/60 uppercase">
                            <span>Channel: <?php echo htmlspecialchars($video_details['author']); ?></span>
                            <span>Views: <?php echo htmlspecialchars($video_details['views']); ?></span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-yellow-500/10">
                        <?php if ($download_link): ?>
                            <a href="<?php echo htmlspecialchars($download_link); ?>" target="_blank" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-cyber text-center font-black text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"><i class="fas fa-download"></i> DOWNLOAD FILE NOW</a>
                        <?php else: ?>
                            <form method="POST">
                                <input type="hidden" name="action" value="download">
                                <?php foreach($video_details as $k => $v): ?>
                                    <input type="hidden" name="video_<?php echo $k; ?>" value="<?php echo htmlspecialchars($v); ?>">
                                <?php endforeach; ?>
                                <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-cyber font-black text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition"><i class="fas fa-key animate-spin"></i> GENERATE GOLD DOWNLINK URL</button>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

        <!-- SEARCH RESULTS (EXACTLY 2 COLUMNS IN A ROW AS REQUESTED) -->
        <?php elseif (!empty($search_results)): ?>
            <div class="grid grid-cols-2 gap-4">
                <?php foreach ($search_results as $video): ?>
                    <div class="bg-[#0c0a05]/60 border border-yellow-500/10 hover:border-yellow-500/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition duration-200">
                        <div class="aspect-video relative bg-black">
                            <img src="<?php echo htmlspecialchars($video['thumbnail']); ?>" class="w-full h-full object-cover opacity-80" referrerpolicy="no-referrer">
                            <div class="absolute bottom-2 right-2 bg-black/80 text-yellow-400 text-[8px] font-mono px-1.5 py-0.5 rounded font-black"><?php echo htmlspecialchars($video['duration']); ?></div>
                        </div>
                        <div class="p-3.5 flex-grow flex flex-col justify-between gap-3">
                            <h3 class="font-bold text-[10px] sm:text-xs text-slate-200 line-clamp-2 uppercase tracking-wide leading-snug"><?php echo htmlspecialchars($video['title']); ?></h3>
                            
                            <form method="POST">
                                <input type="hidden" name="action" value="view_details">
                                <input type="hidden" name="video_id" value="<?php echo htmlspecialchars($video['videoId']); ?>">
                                <input type="hidden" name="video_title" value="<?php echo htmlspecialchars($video['title']); ?>">
                                <input type="hidden" name="video_thumbnail" value="<?php echo htmlspecialchars($video['thumbnail']); ?>">
                                <input type="hidden" name="video_duration" value="<?php echo htmlspecialchars($video['duration']); ?>">
                                <input type="hidden" name="video_views" value="<?php echo htmlspecialchars($video['views']); ?>">
                                <input type="hidden" name="video_author" value="<?php echo htmlspecialchars($video['channelTitle'] ?? 'YouTube Channel'); ?>">
                                <input type="hidden" name="video_uploaded" value="<?php echo htmlspecialchars($video['published'] ?? 'Now'); ?>">
                                <button type="submit" class="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-950 text-yellow-400 border border-yellow-500/15 rounded-lg font-mono font-black text-[9px] tracking-wider uppercase transition">GET VIDEO</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <!-- SEED TRENDS RADAR (EXACTLY 2 COLUMNS IN A ROW AS REQUESTED) -->
            <div class="space-y-4">
                <div class="flex items-center gap-2 mb-3">
                    <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping"></span>
                    <span class="text-[10px] font-mono font-black text-yellow-400 uppercase tracking-widest">DISCOVERY RADAR SYSTEM</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <?php 
                    $trending = [
                        ['id' => 'jfKfPfyJRdk', 'title' => 'Lofi Hip Hop Radio 📚 Beats to Study/Relax to', 'duration' => 'LIVE', 'views' => '18M views', 'thumbnail' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400'],
                        ['id' => '5qap5aO4i9A', 'title' => 'Lofi Hip Hop Radio - Beats to Study/Relax to 🐾', 'duration' => '24:15', 'views' => '2.1M views', 'thumbnail' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400'],
                        ['id' => 'tNtMyXbBfF0', 'title' => 'Synthwave Retrofuture Mix: Cosmic Highway', 'duration' => '1:05:22', 'views' => '890K views', 'thumbnail' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400'],
                        ['id' => '36YnV9Sby_Y', 'title' => '4K Cinematic Space Ambient Odyssey', 'duration' => '3:40:00', 'views' => '1.2M views', 'thumbnail' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400']
                    ];
                    foreach($trending as $video):
                    ?>
                        <div class="bg-[#0c0a05]/60 border border-yellow-500/10 hover:border-yellow-500/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition">
                            <div class="aspect-video relative bg-black">
                                <img src="<?php echo htmlspecialchars($video['thumbnail']); ?>" class="w-full h-full object-cover opacity-80" referrerpolicy="no-referrer">
                                <div class="absolute bottom-2 right-2 bg-black/80 text-yellow-400 text-[8px] font-mono px-1.5 py-0.5 rounded font-black"><?php echo htmlspecialchars($video['duration']); ?></div>
                            </div>
                            <div class="p-3.5 flex-grow flex flex-col justify-between gap-3">
                                <h3 class="font-bold text-[10px] sm:text-xs text-slate-200 line-clamp-2 uppercase tracking-wide leading-snug"><?php echo htmlspecialchars($video['title']); ?></h3>
                                
                                <form method="POST">
                                    <input type="hidden" name="action" value="view_details">
                                    <input type="hidden" name="video_id" value="<?php echo htmlspecialchars($video['id']); ?>">
                                    <input type="hidden" name="video_title" value="<?php echo htmlspecialchars($video['title']); ?>">
                                    <input type="hidden" name="video_thumbnail" value="<?php echo htmlspecialchars($video['thumbnail']); ?>">
                                    <input type="hidden" name="video_duration" value="<?php echo htmlspecialchars($video['duration']); ?>">
                                    <input type="hidden" name="video_views" value="<?php echo htmlspecialchars($video['views']); ?>">
                                    <input type="hidden" name="video_author" value="Lofi Hub">
                                    <input type="hidden" name="video_uploaded" value="Trending">
                                    <button type="submit" class="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-950 text-yellow-400 border border-yellow-500/15 rounded-lg font-mono font-black text-[9px] tracking-wider uppercase transition">GET VIDEO</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- COMPACT STATS FOOTER -->
        <footer class="mt-12 text-center text-[8px] text-yellow-500/30 font-extrabold uppercase tracking-[0.2em] space-y-2">
            <div>© 2026 ULTRA YOUTUBE DOWNLOADER</div>
            <div>DEVELOPED BY UMAR MALANG & CUSTOM TUNED FOR GOLD INFRASTRUCTURE</div>
        </footer>
    </div>
</body>
</html>
