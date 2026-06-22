<?php
/**
 * MKMODZ ULTIMATE CLOUD TERMINAL - V9.0.0 (CYBER GOLDEN PINK NEXUS)
 * ----------------------------------------------------------------------
 * CORE SYSTEM ENGINE V9.0.0 COMPREHENSIVE REWRITE
 * REDESIGNED TO MEET THE ABSOLUTE ULTRA HIGH DIGITAL HACKER THEME aesthetic!
 * FEATURES:
 * 1. HIGH-TECH GLOWING GLASS GRID: Beautiful gold, pink, cyber-green CRT filters and neon glows.
 * 2. ZIP KATABUM STYLE WORKFLOW: Stored, unzipped recursively, directory flattened, run nodes instantly.
 * 3. ADVANCED DIRECTORY UPLOADS: Retains multi-level systems under HTML5 webkit uploads.
 * 4. CODE COLLABORATOR SUB-EDITOR: Embedded CDM code highlights for PHP, JS, HTML, CSS, Py.
 * 5. INTEGRATED INTERACTIVE SYSTEM CHASSIS ORBITAL GRID: Live custom matrix rain background canvas.
 * 6. SYNTHESIZED RETRO AUDIO CONSOLE: Built-in Web Audio synthesis module for real cyber ambiance.
 * 7. THEME MANAGER MATRIX: Custom picker supporting multiple premium hacker templates.
 * ----------------------------------------------------------------------
 */

// === SYSTEM SECURITY OVERLAYS ===
ini_set('session.cookie_lifetime', 0);
ini_set('session.use_cookies', 1);
ini_set('session.use_only_cookies', 1);
session_start();

if (!isset($_SESSION['user_identity'])) {
    $_SESSION['user_identity'] = 'CADET-' . strtoupper(bin2hex(random_bytes(4)));
}

// === CONST DATA CONFIGURATIONS ===
$ADMIN_PASS = 'MKMODZ@786';
$WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb0JJaI5EjxpYI1YZC18";
$SYSTEM_VERSION = "9.0.0 ULTRA HACKER NEXUS";

if (isset($_POST['root_access_key'])) {
    if ($_POST['root_access_key'] === $ADMIN_PASS) {
        $_SESSION['is_admin_active'] = true;
        $_SESSION['last_action'] = time();
    } else {
        $error_feedback = "ACCESS DENIED: Master key decryption signature failed!";
    }
}

if (isset($_GET['cmd']) && $_GET['cmd'] === 'lockdown') {
    session_destroy();
    header("Location: " . basename($_SERVER['PHP_SELF']));
    exit;
}

if (isset($_GET['verify_user']) && $_GET['verify_user'] === 'success') {
    $_SESSION['member_verified'] = true;
    header("Location: " . basename($_SERVER['PHP_SELF']));
    exit;
}

// === DIRECTORY PLATFORM INITIALIZATION ===
$storage_dir = 'sites';
$archives_dir = "$storage_dir/archives";

if (!is_dir($storage_dir)) {
    mkdir($storage_dir, 0777, true);
    file_put_contents($storage_dir . '/.htaccess', "Options -Indexes\nDirectoryIndex index.html index.php\n<FilesMatch '\\.(zip|ZIP)$'>\nOrder Allow,Deny\nDeny from all\n</FilesMatch>");
}
if (!is_dir($archives_dir)) {
    mkdir($archives_dir, 0777, true);
}

// Validating target code frameworks
$ALLOWED_EXTRACT_EXT = ['html','htm','css','js','py','php','json','xml','txt','md','jpg','jpeg','png','gif','svg','webp','ico','woff','woff2','ttf','eot','otf','mp3','mp4','webm','ogg','wav','pdf','csv','map','webmanifest','htaccess'];
$ALLOWED_UPLOAD_EXT = array_merge($ALLOWED_EXTRACT_EXT, ['zip']);

// === BACKEND PROCEDURAL OPERATIONS ===
function generate_slug($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = strtolower($text);
    return empty($text) ? 'signal-' . rand(1000, 9999) : $text;
}

function get_live_path($slug) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $dir = dirname($_SERVER['PHP_SELF']);
    $clean_dir = ($dir == DIRECTORY_SEPARATOR || $dir == '.') ? '' : $dir;
    return $protocol . "://" . $host . $clean_dir . "/sites/" . $slug . "/";
}

function get_file_url($slug, $relpath) {
    return get_live_path($slug) . ltrim($relpath, '/');
}

function rrmdir($dir) {
    if (!is_dir($dir)) return;
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($iterator as $file) {
        $file->isDir() ? rmdir($file) : unlink($file);
    }
    rmdir($dir);
}

function count_files($dir) {
    if (!is_dir($dir)) return 0;
    $count = 0;
    $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
    foreach ($rii as $f) if ($f->isFile()) $count++;
    return $count;
}

function safe_rel_path($path) {
    $path = str_replace('\\', '/', $path);
    while (strpos($path, '../') !== false) $path = str_replace('../', '', $path);
    return ltrim($path, '/.');
}

function get_file_icon($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $map = [
        'html' => ['fab fa-html5', '#ff007f'],
        'htm'  => ['fab fa-html5', '#ff007f'],
        'css'  => ['fab fa-css3-alt', '#264de4'],
        'js'   => ['fab fa-js', '#f7df1e'],
        'py'   => ['fab fa-python', '#3776ab'],
        'php'  => ['fab fa-php', '#8892bf'],
        'json' => ['fas fa-code', '#cbcb41'],
        'xml'  => ['fas fa-code', '#9b4f96'],
        'jpg'  => ['fas fa-image', '#00ff88'],
        'jpeg' => ['fas fa-image', '#00ff88'],
        'png'  => ['fas fa-image', '#00ff88'],
        'gif'  => ['fas fa-image', '#00ff88'],
        'svg'  => ['fas fa-image', '#00ff88'],
        'webp' => ['fas fa-image', '#00ff88'],
        'ico'  => ['fas fa-image', '#00ff88'],
        'mp3'  => ['fas fa-music', '#ff1493'],
        'mp4'  => ['fas fa-video', '#ff1493'],
        'webm' => ['fas fa-video', '#ff1493'],
        'txt'  => ['fas fa-file-alt', '#888'],
        'md'   => ['fas fa-file-alt', '#ff007f'],
        'pdf'  => ['fas fa-file-pdf', '#ff0040'],
        'zip'  => ['fas fa-file-archive', '#ffd700'],
    ];
    return isset($map[$ext]) ? $map[$ext] : ['fas fa-file', '#aaa'];
}

function get_type_info($meta) {
    if (!isset($meta['type'])) return ['HTML', 'fab fa-html5', '#ff007f'];
    $t = $meta['type'];
    if (strpos($t, 'zip') !== false) return ['ZIP', 'fas fa-file-archive', '#ffd700'];
    if (strpos($t, 'folder') !== false) return ['FOLDER', 'fas fa-folder', '#ffd700'];
    if (strpos($t, 'python') !== false) return ['PYTHON', 'fab fa-python', '#3776ab'];
    if (strpos($t, 'js') !== false) return ['JS', 'fab fa-js', '#f7df1e'];
    if (strpos($t, 'css') !== false) return ['CSS', 'fab fa-css3-alt', '#264de4'];
    if (strpos($t, 'php') !== false) return ['PHP', 'fab fa-php', '#8892bf'];
    if (strpos($t, 'json') !== false) return ['JSON', 'fas fa-code', '#cbcb41'];
    return ['WEB', 'fab fa-html5', '#ff007f'];
}

// === ROUTINE ACTIONS / DATA PIPELINES ===

// Terminate Deployed Node
if (isset($_GET['delete_id'])) {
    $target = generate_slug($_GET['delete_id']);
    $meta_path = "$storage_dir/$target.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            rrmdir("$storage_dir/$target");
            if (file_exists("$archives_dir/$target.zip")) unlink("$archives_dir/$target.zip");
            unlink($meta_path);
            header("Location: " . basename($_SERVER['PHP_SELF']) . "?notify=deleted");
            exit;
        }
    }
}

// Delete Zip archive
if (isset($_GET['delete_zip'])) {
    $target = generate_slug($_GET['delete_zip']);
    $meta_path = "$storage_dir/$target.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            if (isset($meta['status']) && $meta['status'] === 'uploaded') {
                if (file_exists("$archives_dir/$target.zip")) unlink("$archives_dir/$target.zip");
                unlink($meta_path);
            }
            header("Location: " . basename($_SERVER['PHP_SELF']) . "?notify=zip_deleted");
            exit;
        }
    }
}

// KATABUM unarchive procedure
if (isset($_GET['unarchive'])) {
    $target = generate_slug($_GET['unarchive']);
    $meta_path = "$storage_dir/$target.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            $zip_file = "$archives_dir/$target.zip";
            $site_folder = "$storage_dir/$target";
            if (file_exists($zip_file)) {
                $zip = new ZipArchive;
                if ($zip->open($zip_file) === TRUE) {
                    if (is_dir($site_folder)) rrmdir($site_folder);
                    mkdir($site_folder, 0777, true);
                    
                    $top_folders = []; $top_files = [];
                    for ($i = 0; $i < $zip->numFiles; $i++) {
                        $entry = $zip->getNameIndex($i);
                        if (strpos($entry, '__MACOSX/') === 0) continue;
                        $parts = explode('/', $entry);
                        if (count($parts) === 1) {
                            if ($parts[0] !== '') $top_files[] = $parts[0];
                        } elseif (count($parts) >= 2) {
                            $top_folders[$parts[0]] = true;
                        }
                    }
                    $top_folders = array_keys($top_folders);
                    $single_top_folder = (count($top_folders) === 1 && empty($top_files)) ? $top_folders[0] : null;
                    
                    $extracted_files = [];
                    for ($i = 0; $i < $zip->numFiles; $i++) {
                        $entry = $zip->getNameIndex($i);
                        if (strpos($entry, '__MACOSX/') === 0) continue;
                        if (substr($entry, -1) === '/') continue;
                        
                        $basename = basename($entry);
                        $ext = strtolower(pathinfo($basename, PATHINFO_EXTENSION));
                        if (!in_array($ext, $ALLOWED_EXTRACT_EXT)) continue;
                        
                        $rel = $entry;
                        if ($single_top_folder && strpos($rel, $single_top_folder . '/') === 0) {
                            $rel = substr($rel, strlen($single_top_folder) + 1);
                        }
                        if (empty($rel)) continue;
                        
                        $subdir = dirname($rel);
                        $target_subdir = $site_folder;
                        if ($subdir && $subdir !== '.') {
                            $target_subdir = $site_folder . '/' . $subdir;
                            if (!is_dir($target_subdir)) mkdir($target_subdir, 0777, true);
                        }
                        
                        file_put_contents("$target_subdir/$basename", $zip->getFromIndex($i));
                        $extracted_files[] = $rel;
                    }
                    $zip->close();
                    
                    // index placement checking
                    if (!file_exists("$site_folder/index.html") && !file_exists("$site_folder/index.php")) {
                        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($site_folder, FilesystemIterator::SKIP_DOTS));
                        $found_index = null;
                        foreach ($rii as $f) {
                            $bn = strtolower($f->getFilename());
                            if (($bn === 'index.html' || $bn === 'index.php') && $f->isFile()) {
                                $found_index = $f->getPathname();
                                break;
                            }
                        }
                        if ($found_index) {
                            rename($found_index, $site_folder . '/' . basename($found_index));
                        } else {
                            $rii2 = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($site_folder, FilesystemIterator::SKIP_DOTS));
                            $first_html = null;
                            foreach ($rii2 as $f) {
                                if (in_array(strtolower($f->getExtension()), ['html','htm'])) {
                                    $first_html = $f->getPathname();
                                    break;
                                }
                            }
                            if ($first_html) {
                                copy($first_html, "$site_folder/index.html");
                            }
                        }
                    }
                    
                    $meta['status'] = 'extracted';
                    $meta['extracted_at'] = time();
                    $meta['files'] = count($extracted_files);
                    file_put_contents($meta_path, json_encode($meta));
                    
                    header("Location: " . basename($_SERVER['PHP_SELF']) . "?manage=$target&notify=extracted");
                    exit;
                } else {
                    header("Location: " . basename($_SERVER['PHP_SELF']) . "?notify=zip_error");
                    exit;
                }
            }
        }
    }
}

// Unlinking Specific File inside Hosted Folder
if (isset($_GET['delete_file']) && isset($_GET['site'])) {
    $site = generate_slug($_GET['site']);
    $meta_path = "$storage_dir/$site.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            $rel = safe_rel_path($_GET['delete_file']);
            $target_file = "$storage_dir/$site/$rel";
            if (basename($rel) !== 'index.html' && basename($rel) !== 'index.php' && file_exists($target_file) && !is_dir($target_file)) {
                unlink($target_file);
            }
            header("Location: " . basename($_SERVER['PHP_SELF']) . "?manage=$site&notify=file_deleted");
            exit;
        }
    }
}

// Appending custom user-asset into existing web structures
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_to_site']) && isset($_FILES['extra_file'])) {
    $site = generate_slug($_POST['upload_to_site']);
    $meta_path = "$storage_dir/$site.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            $site_folder = "$storage_dir/$site";
            $orig = $_FILES['extra_file']['name'];
            $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
            if (in_array($ext, $ALLOWED_EXTRACT_EXT)) {
                $target_sub = isset($_POST['target_folder']) ? safe_rel_path($_POST['target_folder']) : '';
                $dest_dir = $site_folder . ($target_sub ? '/' . $target_sub : '');
                if (!is_dir($dest_dir)) mkdir($dest_dir, 0777, true);
                $safe_name = basename($orig);
                move_uploaded_file($_FILES['extra_file']['tmp_name'], "$dest_dir/$safe_name");
            }
            header("Location: " . basename($_SERVER['PHP_SELF']) . "?manage=$site&notify=file_uploaded");
            exit;
        }
    }
}

// Webkit folder uploads system handling
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['folder_upload']) && isset($_FILES['folder_files'])) {
    $site = generate_slug($_POST['folder_alias']);
    $meta_path = "$storage_dir/$site.meta.json";
    $can_save = true;
    if (file_exists($meta_path)) {
        $existing_meta = json_decode(file_get_contents($meta_path), true);
        if ($existing_meta['creator_id'] !== $_SESSION['user_identity'] && empty($_SESSION['is_admin_active'])) {
            $can_save = false;
        }
    }
    if ($can_save) {
        $site_folder = "$storage_dir/$site";
        if (!is_dir($site_folder)) mkdir($site_folder, 0777, true);
        
        $files = $_FILES['folder_files'];
        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;
            $name = $files['name'][$i];
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($ext, $ALLOWED_EXTRACT_EXT)) continue;
            
            $clean_name = safe_rel_path($name);
            $subdir = dirname($clean_name);
            $dest_dir = $site_folder;
            if ($subdir && $subdir !== '.') {
                $dest_dir = $site_folder . '/' . $subdir;
                if (!is_dir($dest_dir)) mkdir($dest_dir, 0777, true);
            }
            $basename = basename($clean_name);
            move_uploaded_file($files['tmp_name'][$i], "$dest_dir/$basename");
        }
        
        // Final verify
        if (!file_exists("$site_folder/index.html") && !file_exists("$site_folder/index.php")) {
            $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($site_folder, FilesystemIterator::SKIP_DOTS));
            foreach ($rii as $f) {
                if (in_array(strtolower($f->getExtension()), ['html','htm'])) {
                    rename($f->getPathname(), "$site_folder/index.html");
                    break;
                }
            }
        }
        
        $meta_data = [
            'creator_id' => $_SESSION['user_identity'],
            'timestamp' => time(),
            'type' => 'folder-upload',
            'status' => 'extracted'
        ];
        file_put_contents($meta_path, json_encode($meta_data));
        header("Location: " . basename($_SERVER['PHP_SELF']) . "?deploy=success&mode=folder");
        exit;
    }
}

// Inline Sub-editor modifications saving
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_inline']) && isset($_POST['site']) && isset($_POST['file_path'])) {
    $site = generate_slug($_POST['site']);
    $meta_path = "$storage_dir/$site.meta.json";
    if (file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            $rel = safe_rel_path($_POST['file_path']);
            $target_file = "$storage_dir/$site/$rel";
            if (file_exists($target_file) && !is_dir($target_file)) {
                file_put_contents($target_file, $_POST['inline_content']);
            }
            header("Location: " . basename($_SERVER['PHP_SELF']) . "?manage=$site&notify=file_saved");
            exit;
        }
    }
}

// === GENERAL FORM DEPLOYMENTS ===
$deploy_error = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST' && (isset($_POST['raw_terminal_code']) || isset($_FILES['binary_file']) || isset($_FILES['zip_archive']))) {
    $final_slug = ""; $deploy_mode = "";
    if (!empty($_POST['manual_alias'])) {
        $final_slug = generate_slug($_POST['manual_alias']);
    }
    if (isset($_FILES['zip_archive']) && !empty($_FILES['zip_archive']['name'])) {
        $deploy_mode = "zip";
        if (!$final_slug) $final_slug = generate_slug(preg_replace('/\\.(zip|ZIP)$/', '', $_FILES['zip_archive']['name']));
    } elseif (isset($_FILES['binary_file']) && !empty($_FILES['binary_file']['name'])) {
        $deploy_mode = "file";
        if (!$final_slug) $final_slug = generate_slug($_FILES['binary_file']['name']);
    } elseif (isset($_POST['code_language'])) {
        $deploy_mode = "code";
        if (!$final_slug) $final_slug = 'code-' . rand(1000, 9999);
    }
    
    if ($final_slug) {
        $meta_path = "$storage_dir/$final_slug.meta.json";
        $can_save = true;
        if (file_exists($meta_path)) {
            $existing_meta = json_decode(file_get_contents($meta_path), true);
            if ($existing_meta['creator_id'] !== $_SESSION['user_identity'] && empty($_SESSION['is_admin_active'])) {
                $can_save = false;
                $deploy_error = "SECURITY ALERT: This alias is claimed by another cadet.";
            }
        }
        
        if ($can_save) {
            if ($deploy_mode === "zip" && !empty($_FILES['zip_archive']['tmp_name'])) {
                $dest_zip = "$archives_dir/$final_slug.zip";
                if (move_uploaded_file($_FILES['zip_archive']['tmp_name'], $dest_zip)) {
                    $meta_data = [
                        'creator_id' => $_SESSION['user_identity'],
                        'timestamp' => time(),
                        'type' => 'zip-uploaded',
                        'status' => 'uploaded',
                        'original_name' => $_FILES['zip_archive']['name'],
                        'zip_size' => $_FILES['zip_archive']['size']
                    ];
                    file_put_contents($meta_path, json_encode($meta_data));
                    $_SESSION['last_deploy_url'] = get_live_path($final_slug);
                    header("Location: " . basename($_SERVER['PHP_SELF']) . "?deploy=success&mode=zip_uploaded");
                    exit;
                }
            } elseif ($deploy_mode === "file" && !empty($_FILES['binary_file']['tmp_name'])) {
                $site_path = "$storage_dir/$final_slug";
                if (!is_dir($site_path)) mkdir($site_path, 0777, true);
                
                $orig_name = $_FILES['binary_file']['name'];
                $ext = strtolower(pathinfo($orig_name, PATHINFO_EXTENSION));
                
                if (in_array($ext, $ALLOWED_EXTRACT_EXT)) {
                    if ($ext === 'html' || $ext === 'htm') move_uploaded_file($_FILES['binary_file']['tmp_name'], "$site_path/index.html");
                    elseif ($ext === 'php') move_uploaded_file($_FILES['binary_file']['tmp_name'], "$site_path/index.php");
                    else {
                        move_uploaded_file($_FILES['binary_file']['tmp_name'], "$site_path/$orig_name");
                        if (!file_exists("$site_path/index.html") && !file_exists("$site_path/index.php")) {
                            file_put_contents("$site_path/index.html", "<!DOCTYPE html><html><body style='background:#12051e; color:#ff1493'><pre>Asset successfully hosted!</pre></body></html>");
                        }
                    }
                    $meta_data = ['creator_id' => $_SESSION['user_identity'], 'timestamp' => time(), 'type' => 'file-' . $ext, 'status' => 'extracted'];
                    file_put_contents($meta_path, json_encode($meta_data));
                    $_SESSION['last_deploy_url'] = get_live_path($final_slug);
                    header("Location: " . basename($_SERVER['PHP_SELF']) . "?deploy=success&mode=file");
                    exit;
                }
            } elseif ($deploy_mode === "code" && isset($_POST['code_language'])) {
                $site_path = "$storage_dir/$final_slug";
                if (!is_dir($site_path)) mkdir($site_path, 0777, true);
                
                $lang = $_POST['code_language'];
                $code = $_POST['raw_terminal_code'];
                
                if ($lang === 'html') file_put_contents("$site_path/index.html", $code);
                elseif ($lang === 'php') file_put_contents("$site_path/index.php", $code);
                elseif ($lang === 'css') {
                    file_put_contents("$site_path/style.css", $code);
                    file_put_contents("$site_path/index.html", "<!DOCTYPE html><html><head><link rel='stylesheet' href='style.css'></head><body><h1>Hosted style node</h1></body></html>");
                } elseif ($lang === 'js') {
                    file_put_contents("$site_path/script.js", $code);
                    file_put_contents("$site_path/index.html", "<!DOCTYPE html><html><body><pre id='exec'></pre><script src='script.js'></script></body></html>");
                }
                
                $meta_data = ['creator_id' => $_SESSION['user_identity'], 'timestamp' => time(), 'type' => 'code-' . $lang, 'status' => 'extracted', 'language' => $lang];
                file_put_contents($meta_path, json_encode($meta_data));
                $_SESSION['last_deploy_url'] = get_live_path($final_slug);
                header("Location: " . basename($_SERVER['PHP_SELF']) . "?deploy=success&mode=code");
                exit;
            }
        }
    }
}

// === FETCH DATA ===
$my_terminal_data = []; $all_metas = glob("$storage_dir/*.meta.json");
foreach ($all_metas as $m_file) {
    if (!file_exists($m_file)) continue;
    $m_content = json_decode(file_get_contents($m_file), true);
    $slug = basename($m_file, '.meta.json');
    if (!$slug) continue;
    
    list($type_label, $type_icon, $type_color) = get_type_info($m_content);
    $status = isset($m_content['status']) ? $m_content['status'] : 'extracted';
    $file_count = count_files("$storage_dir/$slug");
    $zip_exists = file_exists("$archives_dir/$slug.zip");
    $zip_size = $zip_exists ? filesize("$archives_dir/$slug.zip") : 0;
    
    $entry = [
        'slug' => $slug,
        'url'  => get_live_path($slug),
        'date' => date('d M, H:i', $m_content['timestamp']),
        'raw_time' => $m_content['timestamp'],
        'creator' => $m_content['creator_id'],
        'type_label' => $type_label,
        'type_icon' => $type_icon,
        'type_color' => $type_color,
        'file_count' => $file_count,
        'status' => $status,
        'zip_exists' => $zip_exists,
        'zip_size' => $zip_size,
        'original_name' => isset($m_content['original_name']) ? $m_content['original_name'] : ''
    ];

    if ($m_content['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
        $my_terminal_data[] = $entry;
    }
}
usort($my_terminal_data, function($a, $b) { return $b['raw_time'] - $a['raw_time']; });

// EDIT BUFFER LOAD
$edit_buffer = ""; $edit_id = "";
if (isset($_GET['edit_target'])) {
    $target = generate_slug($_GET['edit_target']);
    $target_folder = "$storage_dir/$target";
    if (file_exists("$target_folder/index.html")) { $edit_buffer = file_get_contents("$target_folder/index.html"); $edit_id = $target; }
    elseif (file_exists("$target_folder/index.php")) { $edit_buffer = file_get_contents("$target_folder/index.php"); $edit_id = $target; }
}

// RECURSIVE FILE MANAGER GRID SCANS
$manage_site = ""; $manage_files = []; $manage_meta = null;
if (isset($_GET['manage'])) {
    $manage_site = generate_slug($_GET['manage']);
    $manage_folder = "$storage_dir/$manage_site";
    $manage_meta_path = "$storage_dir/$manage_site.meta.json";
    if (is_dir($manage_folder) && file_exists($manage_meta_path)) {
        $manage_meta = json_decode(file_get_contents($manage_meta_path), true);
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($manage_folder, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
        foreach ($rii as $f) {
            $rel = ltrim(str_replace($manage_folder, '', $f->getPathname()), '/.');
            if (!$rel) continue;
            $manage_files[] = [
                'name' => $rel,
                'basename' => $f->getFilename(),
                'is_dir' => $f->isDir(),
                'url' => $f->isFile() ? get_file_url($manage_site, $rel) : '',
                'size' => $f->isFile() ? $f->getSize() : 0,
                'depth' => substr_count($rel, '/')
            ];
        }
        usort($manage_files, function($a, $b) {
            if ($a['is_dir'] !== $b['is_dir']) return $b['is_dir'] - $a['is_dir'];
            return strcmp($a['name'], $b['name']);
        });
    }
}

// EDIT TARGET BUFFER IN FILE LINE EDIT
$inline_edit_file = ""; $inline_edit_content = ""; $inline_edit_site = "";
if (isset($_GET['edit_file']) && isset($_GET['site'])) {
    $inline_edit_site = generate_slug($_GET['site']);
    $rel = safe_rel_path($_GET['edit_file']);
    $target_file = "$storage_dir/$inline_edit_site/$rel";
    $meta_path = "$storage_dir/$inline_edit_site.meta.json";
    if (file_exists($target_file) && file_exists($meta_path)) {
        $meta = json_decode(file_get_contents($meta_path), true);
        if ($meta['creator_id'] === $_SESSION['user_identity'] || !empty($_SESSION['is_admin_active'])) {
            $inline_edit_file = $rel;
            $inline_edit_content = file_get_contents($target_file);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no text-slate-100">
    <title>MKMODZ | ULTRA CLOUD TERMINAL v9.0</title>
    <!-- Beautiful display and monospace fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material-darker.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/monokai.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/ayu-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/php/php.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js"></script>
    
    <style>
        /* ==========================================
           HACKER PRO THEME DEVIATION & PRESETS SYSTEM
           ========================================== */
        :root {
            /* Preset 1 (Default): Golden Pink Nexus */
            --glow-color: rgba(255, 20, 147, 0.35);
            --border-neon: rgba(255, 20, 147, 0.3);
            --gold-accent: #ffd700;
            --pink-accent: #ff007f;
            --cyber-blue: #00e1ff;
            --bg-base: #06020c;
            --panel-glass: rgba(18, 5, 28, 0.72);
            --text-glowing: #ffe6f3;
            --grid-line: rgba(255, 20, 147, 0.05);
            
            --font-display: 'Orbitron', 'Cinzel', sans-serif;
            --font-body: 'Rajdhani', sans-serif;
            --font-secondary: 'Space Grotesk', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        /* Preset 2: Toxic Cyber Pink & Cyan */
        .theme-toxic {
            --glow-color: rgba(14, 165, 233, 0.4);
            --border-neon: rgba(14, 165, 233, 0.35);
            --gold-accent: #00ffcc;
            --pink-accent: #ec4899;
            --cyber-blue: #38bdf8;
            --bg-base: #030a13;
            --panel-glass: rgba(7, 18, 33, 0.78);
            --text-glowing: #e0f2fe;
            --grid-line: rgba(14, 165, 233, 0.06);
        }

        /* Preset 3: Emerald Overlord Matrix Grid */
        .theme-matrix {
            --glow-color: rgba(16, 185, 129, 0.45);
            --border-neon: rgba(16, 185, 129, 0.35);
            --gold-accent: #10b981;
            --pink-accent: #059669;
            --cyber-blue: #34d399;
            --bg-base: #020804;
            --panel-glass: rgba(5, 18, 10, 0.85);
            --text-glowing: #d1fae5;
            --grid-line: rgba(16, 185, 129, 0.08);
        }

        /* Preset 4: Amber Retro System Terminal */
        .theme-amber {
            --glow-color: rgba(245, 158, 11, 0.45);
            --border-neon: rgba(245, 158, 11, 0.38);
            --gold-accent: #f59e0b;
            --pink-accent: #b45309;
            --cyber-blue: #fbbf24;
            --bg-base: #100b02;
            --panel-glass: rgba(28, 18, 4, 0.82);
            --text-glowing: #fef3c7;
            --grid-line: rgba(245, 158, 11, 0.07);
        }

        /* Preset 5: Deep Obsidian Ultra Violet */
        .theme-violet {
            --glow-color: rgba(139, 92, 246, 0.45);
            --border-neon: rgba(139, 92, 246, 0.35);
            --gold-accent: #a78bfa;
            --pink-accent: #8b5cf6;
            --cyber-blue: #c084fc;
            --bg-base: #07030e;
            --panel-glass: rgba(17, 8, 31, 0.8);
            --text-glowing: #f5f3ff;
            --grid-line: rgba(139, 92, 246, 0.06);
        }

        /* Essential Reset and Modern Typographic Hierarchy */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            outline: none;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-base);
            color: var(--text-glowing);
            font-family: var(--font-body);
            overflow-x: hidden;
            min-height: 100vh;
            letter-spacing: 0.5px;
            perspective: 1000px;
            transition: background-color 0.5s ease;
        }

        /* Aesthetic Grid Matrix Rain Canvas Background */
        #matrixCanvas {
            position: fixed;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            opacity: 0.18;
            transition: opacity 0.5s ease;
        }

        /* Real CRT Scanline & Phosphor Decay simulation */
        body::after {
            content: " ";
            display: block;
            position: fixed;
            inset: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.015), rgba(0, 0, 0, 0.03));
            background-size: 100% 4px, 4px 100%;
            z-index: 99999;
            pointer-events: none;
        }

        /* Dynamic Cosmic Cyber Backdrops */
        .cyber-grid {
            position: fixed;
            inset: 0;
            background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
                              linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
            background-size: 40px 40px;
            z-index: 2;
            pointer-events: none;
        }

        .radial-core-glow {
            position: fixed;
            top: -10%;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 450px;
            background: radial-gradient(circle, rgba(255, 20, 147, 0.08) 0%, transparent 70%);
            filter: blur(80px);
            z-index: 2;
            pointer-events: none;
            transition: background 0.5s ease;
        }

        /* Container Limit Boundaries */
        .container {
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
            padding: 30px 20px;
            position: relative;
            z-index: 10;
        }

        /* ==========================================
           COMPONENTS: HEADER, BUTTONS & GLASS CARDS
           ========================================== */
        
        /* Premium Header Block */
        .brand-chassis {
            background: linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 28px;
            padding: 45px 35px;
            text-align: center;
            margin-bottom: 30px;
            border: 1px solid var(--border-neon);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.08);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .brand-chassis::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--gold-accent), var(--pink-accent), transparent);
            animation: flow-shimmer 6s infinite linear;
        }

        @keyframes flow-shimmer {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
        }

        .brand-subtext {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            letter-spacing: 6px;
            color: var(--pink-accent);
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 12px;
            text-shadow: 0 0 8px rgba(255, 20, 147, 0.45);
        }

        .brand-title {
            font-family: var(--font-display);
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 900;
            color: #ffffff;
            background: linear-gradient(to right, #ffffff, var(--gold-accent), var(--pink-accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 15px rgba(255, 20, 147, 0.25));
            letter-spacing: -1px;
        }

        .brand-version-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            border: 1px solid var(--border-neon);
            background: rgba(255, 255, 255, 0.02);
            border-radius: 30px;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--gold-accent);
            margin-top: 18px;
            text-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
            letter-spacing: 2px;
        }

        .brand-version-pill span {
            width: 6px;
            height: 6px;
            background-color: var(--cyber-blue);
            border-radius: 50%;
            animation: pulse-active 1.8s infinite ease-in-out;
        }

        @keyframes pulse-active {
            0%, 100% { transform: scale(0.8); opacity: 0.4; }
            50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 8px var(--cyber-blue); }
        }

        /* Orbital Stats Row */
        .orbital-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 35px;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            padding-top: 30px;
        }

        .stat-orbital-card {
            text-align: center;
            background: rgba(255, 255, 255, 0.01);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            padding: 12px;
            transition: all 0.3s ease;
        }

        .stat-orbital-card:hover {
            background: rgba(255, 255, 255, 0.03);
            border-color: var(--border-neon);
            transform: translateY(-2px);
        }

        .stat-orbital-card .val {
            font-family: var(--font-display);
            font-size: 1.8rem;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 0 10px var(--glow-color);
        }

        .stat-orbital-card .lbl {
            font-family: var(--font-secondary);
            font-size: 0.68rem;
            color: #8c7a95;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 5px;
        }

        /* Glass Futuristic Containers */
        .glass-chassis {
            background: var(--panel-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid var(--border-neon);
            border-radius: 24px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 
                0 30px 60px rgba(0, 0, 0, 0.75), 
                0 10px 20px rgba(0, 0, 0, 0.45), 
                0 0 35px rgba(255, 20, 147, 0.06), 
                inset 0 1.5px 0 rgba(255, 255, 255, 0.08),
                inset 0 -1.5px 0 rgba(0, 0, 0, 0.35);
            position: relative;
            overflow: hidden;
            transform: translate3d(0, 0, 0);
            transition: border-color 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
                        box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
                        transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .glass-chassis:hover {
            transform: translate3d(0, -6px, 0);
            border-color: var(--glow-color);
            box-shadow: 
                0 45px 80px rgba(0, 0, 0, 0.85), 
                0 15px 30px rgba(0, 0, 0, 0.55), 
                0 0 55px var(--glow-color), 
                inset 0 1.5px 0 rgba(255, 255, 255, 0.15);
        }

        /* Scan-laser accent effect on cards */
        .glass-chassis::after {
            content: "";
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--cyber-blue), transparent);
            opacity: 0.4;
            animation: line-scan-laser 8s infinite linear;
            pointer-events: none;
        }

        @keyframes line-scan-laser {
            0% { top: -20px; }
            50% { top: 110%; }
            100% { top: 110%; }
        }

        .glass-header {
            font-family: var(--font-display);
            font-size: 1rem;
            font-weight: 800;
            color: var(--gold-accent);
            letter-spacing: 3px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-transform: uppercase;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
            border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
            padding-bottom: 15px;
        }

        .glass-header div {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .glass-header i {
            color: var(--pink-accent);
        }

        /* Customizable Options HUD Overlay */
        .hud-theme-panel {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            padding: 15px 25px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
            z-index: 100;
            gap: 15px;
            flex-wrap: wrap;
        }

        .theme-button-container {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .theme-pill-trigger {
            padding: 6px 14px;
            font-family: var(--font-mono);
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            border-radius: 10px;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.02);
            color: #8c7a95;
            transition: all 0.3s ease;
        }

        .theme-pill-trigger.active-theme {
            background-color: var(--pink-accent);
            color: #fff;
            border-color: var(--pink-accent);
            box-shadow: 0 0 10px var(--pink-accent);
        }

        .theme-pill-trigger:hover {
            color: #ffffff;
            border-color: var(--pink-accent);
        }

        /* Premium Sound Controller overlay bar */
        .audio-hud-switch {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(0, 0, 0, 0.25);
            padding: 6px 14px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--cyber-blue);
        }

        .audio-toggle-checkbox {
            cursor: pointer;
            width: 32px;
            height: 18px;
            -webkit-appearance: none;
            background: #271439;
            outline: none;
            border-radius: 20px;
            position: relative;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.4);
            transition: background .3s;
            border: 1px solid rgba(255,255,255,0.08);
        }

        .audio-toggle-checkbox:checked {
            background: var(--pink-accent);
            box-shadow: 0 0 8px var(--pink-accent);
        }

        .audio-toggle-checkbox::before {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            top: 1px;
            left: 1px;
            background: #ffffff;
            transition: transform .3s;
        }

        .audio-toggle-checkbox:checked::before {
            transform: translateX(14px);
        }

        /* Master interactive bento columns layout */
        .bento-twin-columns {
            display: grid;
            grid-template-columns: 1fr 1.6fr;
            gap: 25px;
            margin-bottom: 25px;
        }

        @media (max-width: 991px) {
            .bento-twin-columns {
                grid-template-columns: 1fr;
            }
            .orbital-stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
        }

        /* Tab Trigger Switchboard Layout */
        .terminal-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .terminal-tab-trigger {
            flex: 1;
            min-width: 110px;
            padding: 14px 10px;
            text-align: center;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.01);
            border: 1px solid var(--border-neon);
            border-radius: 14px;
            font-family: var(--font-secondary);
            font-size: 0.74rem;
            color: var(--text-glowing);
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }

        .terminal-tab-trigger:hover {
            background: rgba(255, 116, 177, 0.04);
            border-color: var(--pink-accent);
            transform: translateY(-1px);
        }

        .terminal-tab-trigger.active-tab {
            background: linear-gradient(135deg, var(--gold-accent), var(--pink-accent));
            color: #030107;
            border-color: var(--gold-accent);
            font-weight: 900;
            box-shadow: 0 4px 15px var(--glow-color);
        }

        /* Control Input Units */
        .control-input-group {
            margin-bottom: 22px;
        }

        .control-input-group label {
            display: block;
            font-family: var(--font-secondary);
            font-size: 0.76rem;
            font-weight: 700;
            color: var(--gold-accent);
            letter-spacing: 2.5px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .control-input-group label::before {
            content: "❖ ";
            color: var(--pink-accent);
        }

        input[type="text"], input[type="password"], textarea, select {
            width: 100%;
            background-color: rgba(6, 2, 10, 0.82);
            border: 1px solid var(--border-neon);
            border-radius: 14px;
            padding: 16px;
            color: #ffffff;
            font-family: var(--font-mono);
            font-size: 0.86rem;
            transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
            border-color: var(--gold-accent);
            box-shadow: 0 0 12px var(--glow-color);
            background-color: rgba(6, 2, 11, 0.95);
        }

        /* Buttons styles */
        .titan-trigger {
            width: 100%;
            padding: 18px;
            border: none;
            cursor: pointer;
            background: linear-gradient(135deg, var(--gold-accent), var(--pink-accent));
            color: #050209;
            font-family: var(--font-display);
            font-weight: 900;
            border-radius: 14px;
            font-size: 0.84rem;
            letter-spacing: 3.5px;
            text-transform: uppercase;
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            box-shadow: 0 8px 20px var(--glow-color);
        }

        .titan-trigger:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px var(--glow-color), 0 0 10px rgba(255,255,255,0.2);
            filter: brightness(1.1);
        }

        .titan-trigger-ghost {
            background: transparent;
            border: 1px solid var(--border-neon);
            color: var(--text-glowing);
            box-shadow: none;
        }

        .titan-trigger-ghost:hover {
            background-color: rgba(255, 20, 147, 0.05);
            border-color: var(--pink-accent);
        }

        /* Deployed signals rows design */
        .satellite-row {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.03), rgba(255, 215, 0, 0.015));
            border: 1px solid var(--border-neon);
            border-radius: 18px;
            padding: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            text-align: left;
            position: relative;
        }

        .satellite-row:hover {
            border-color: var(--gold-accent);
            transform: translateX(4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 8px var(--glow-color);
        }

        .satellite-avatar {
            font-size: 1.5rem;
            color: var(--pink-accent);
            background: rgba(255, 20, 147, 0.05);
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-neon);
            margin-right: 15px;
            flex-shrink: 0;
        }

        .satellite-info {
            flex: 1;
            min-width: 0;
            display: flex;
            align-items: center;
        }

        .satellite-tag-content {
            display: flex;
            flex-direction: column;
        }

        .satellite-tag-content b {
            font-family: var(--font-display);
            font-size: 0.94rem;
            color: #ffffff;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .satellite-meta {
            display: flex;
            gap: 15px;
            font-size: 0.68rem;
            color: #8c7a95;
            font-family: var(--font-mono);
            flex-wrap: wrap;
        }

        .satellite-meta span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .satellite-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 0.58rem;
            font-weight: 800;
            border: 1px solid;
            font-family: var(--font-mono);
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        .satellite-badge.status-uploaded {
            background-color: rgba(245, 158, 11, 0.08);
            border-color: var(--gold-accent);
            color: var(--gold-accent);
        }

        .satellite-badge.status-ready {
            background-color: rgba(16, 185, 129, 0.08);
            border-color: #10b981;
            color: #10b981;
        }

        .action-circle-group {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }

        .satellite-circle-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            border: 1px solid var(--border-neon);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gold-accent);
            background: rgba(6, 2, 10, 0.7);
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .satellite-circle-btn:hover {
            border-color: var(--gold-accent);
            background-color: rgba(255, 215, 0, 0.1);
            transform: translateY(-2px);
        }

        .satellite-circle-btn.accent-btn {
            color: var(--pink-accent);
        }

        .satellite-circle-btn.accent-btn:hover {
            border-color: var(--pink-accent);
            background-color: rgba(255, 20, 147, 0.1);
        }

        /* High-End Diagnostic Analytics Widget (Bento column left) */
        .diagnostic-card {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .diagnostic-row {
            display: flex;
            justify-content: space-between;
            font-family: var(--font-mono);
            font-size: 0.75rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            padding-bottom: 8px;
        }

        .diagnostic-row label {
            color: #8c7a95;
        }

        .diagnostic-row span {
            color: var(--gold-accent);
            font-weight: 700;
        }

        /* Live CPU Core animation circles */
        .cpu-core-visualizer {
            display: flex;
            justify-content: space-around;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .cpu-core-ring {
            position: relative;
            width: 60px;
            height: 60px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--border-neon);
        }

        .cpu-core-ring svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }

        .cpu-core-ring circle {
            fill: none;
            stroke: var(--pink-accent);
            stroke-width: 3px;
            stroke-dasharray: 188;
            stroke-dashoffset: 130;
            animation: ring-decay 12s infinite linear;
        }

        @keyframes ring-decay {
            0% { stroke-dashoffset: 188; }
            50% { stroke-dashoffset: 40; stroke: var(--cyber-blue); }
            100% { stroke-dashoffset: 188; }
        }

        .cpu-core-text {
            font-family: var(--font-mono);
            font-size: 0.58rem;
            color: #ffffff;
            font-weight: 900;
            text-align: center;
        }

        /* Live packet diagnostics streams */
        .cyber-logs-display {
            background-color: rgba(3, 1, 6, 0.9);
            border: 1px solid var(--border-neon);
            border-radius: 12px;
            padding: 15px;
            font-family: var(--font-mono);
            font-size: 0.68rem;
            height: 130px;
            overflow-y: auto;
            color: var(--cyber-blue);
            line-height: 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        /* Modals & Fullscreen overlays */
        .fs-dimmer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 200000;
            background: rgba(3, 1, 6, 0.96);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            overflow: hidden;
        }

        .center-popup {
            width: 100%;
            max-width: 820px;
            padding: 40px;
            border-radius: 28px;
            background: radial-gradient(circle at top, var(--bg-base) 0%, rgba(3,1,6,0.98) 70%);
            border: 2px solid var(--gold-accent);
            box-shadow: 0 30px 70px rgba(0,0,0,0.9), 0 0 40px var(--glow-color);
            position: relative;
        }

        .file-scroller-chassis {
            background: rgba(0, 0, 0, 0.45);
            border: 1px solid var(--border-neon);
            border-radius: 16px;
            margin-top: 20px;
            max-height: 280px;
            overflow-y: auto;
            padding: 12px;
        }

        .scroller-file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10.5px 14px;
            border-radius: 10px;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            border: 1px solid transparent;
            margin-bottom: 6px;
        }

        .scroller-file-item:hover {
            background: rgba(255, 215, 0, 0.05);
            color: var(--gold-accent);
            border-color: rgba(255, 215, 0, 0.15);
        }

        /* Drag & Drop high-performance zones */
        .upload-drag-dock {
            border: 2px dashed var(--border-neon);
            border-radius: 18px;
            padding: 40px 20px;
            background: rgba(255, 20, 147, 0.015);
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .upload-drag-dock:hover {
            border-color: var(--gold-accent);
            background: rgba(255, 215, 0, 0.03);
            box-shadow: inset 0 0 15px rgba(255, 215, 0, 0.08);
        }

        .upload-drag-dock i {
            font-size: 2.8rem;
            color: var(--gold-accent);
            margin-bottom: 15px;
            text-shadow: 0 0 10px var(--gold-accent);
        }

        /* Language chip switches */
        .language-chips-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }

        .lang-cyber-badge {
            padding: 10px 18px;
            text-transform: uppercase;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            font-weight: 700;
            border: 1px solid var(--border-neon);
            border-radius: 18px;
            background: rgba(255, 20, 147, 0.01);
            color: #ffb6d9;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .lang-cyber-badge.badge-active {
            background: linear-gradient(135deg, var(--gold-accent), var(--pink-accent));
            color: #030107;
            border-color: var(--gold-accent);
            font-weight: 900;
            box-shadow: 0 0 12px var(--glow-color);
        }

        /* Advanced Instruction Booklet visual styling */
        .instructions-briefing-sheet {
            background-color: rgba(0, 0, 0, 0.35);
            border: 1px solid var(--border-neon);
            border-radius: 16px;
            padding: 20px;
            font-family: var(--font-secondary);
            font-size: 0.8rem;
            color: #cfc2df;
            line-height: 1.5rem;
            margin-top: 25px;
        }

        .instructions-briefing-sheet h4 {
            font-family: var(--font-display);
            color: var(--gold-accent);
            margin-bottom: 12px;
            font-size: 0.86rem;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* High-Definition copy feedback */
        .toast-diagnostics-bar {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 100000;
            background: rgba(3, 1, 6, 0.94);
            border: 1.5px solid var(--cyber-blue);
            border-radius: 16px;
            padding: 16px 24px;
            font-family: var(--font-mono);
            font-size: 0.76rem;
            color: #ffffff;
            box-shadow: 0 15px 40px rgba(0,0,0,0.8), 0 0 15px var(--cyber-blue);
            display: flex;
            align-items: center;
            gap: 15px;
            transform: translateY(120px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .toast-diagnostics-bar.active-toast {
            transform: translateY(0);
            opacity: 1;
        }

        .CodeMirror {
            border: 1.5px solid var(--border-neon) !important;
            border-radius: 16px;
            font-size: 14px;
            background: #030107 !important;
            height: 380px !important;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
            margin-top: 10px;
        }

        .footer {
            text-align: center;
            padding: 50px 10px;
            font-size: 0.72rem;
            letter-spacing: 4px;
            font-family: var(--font-display);
            color: #8c7a95;
            border-top: 1px dashed rgba(255, 255, 255, 0.06);
            margin-top: 30px;
        }
    </style>
</head>
<body class="theme-nexus" id="sys-body">

    <!-- Orbital Backdrops and Matrix Rain canvas container -->
    <div class="cyber-grid"></div>
    <div class="radial-core-glow"></div>
    <canvas id="matrixCanvas"></canvas>

    <!-- Synthetic Toast Diagnostics Bar -->
    <div id="diagnostics-toast" class="toast-diagnostics-bar">
        <i class="fas fa-satellite-dish" style="color: var(--cyber-blue); font-size: 1.2rem;"></i>
        <div>
            <div style="font-weight: 800; font-size: 0.65rem; color: #8c7a95; letter-spacing: 1px; text-transform: uppercase;">TELEMETRY LINK STATUS</div>
            <div id="toast-text-field" style="margin-top: 3px;">Establishing communication nodes...</div>
        </div>
    </div>

    <!-- WHATSAPP SECURITY ACCESS GATEWAY -->
    <?php if(!isset($_SESSION['member_verified'])): ?>
    <div class="fs-dimmer" id="lockout-screen">
        <div class="center-popup" style="max-width: 460px; text-align: center; border-color: var(--pink-accent);">
            <i class="fab fa-whatsapp" style="font-size: 4rem; color: #25d366; margin-bottom: 20px; filter: drop-shadow(0 0 15px #25d366);"></i>
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 3px; margin-bottom: 12px; color: #ffffff;">SIGNALS ENVELOPE ACCESS</h3>
            <p style="font-family: var(--font-secondary); font-size: 0.88rem; color: #cfc2df; margin-bottom: 30px; line-height: 1.5rem;">
                Official encrypted command dispatch networks are awaiting operator signature verification. Verify membership immediately to deploy signals.
            </p>
            <a href="<?php echo $WHATSAPP_LINK; ?>" target="_blank" onclick="simulateAudioSFX('success')" class="titan-trigger" style="background:#25d366; color:#030107; text-decoration:none; display:block; text-align:center;">
                <i class="fab fa-whatsapp" style="margin-right:8px;"></i> JOIN COMMANDS NETWORK
            </a>
            <a href="?verify_user=success" onclick="simulateAudioSFX('bypass')" style="display:block; margin-top:20px; font-size:0.8rem; text-decoration:none; color: var(--gold-accent); font-weight:800; font-family: var(--font-mono); letter-spacing: 1px;">
                ◆ BYPASS / SECURITY CLEARED
            </a>
        </div>
    </div>
    <?php endif; ?>

    <!-- DEPLOYMENT COMPILATION RESULTS MODAL -->
    <?php if(isset($_GET['deploy']) && $_GET['deploy'] === 'success'): ?>
    <div class="fs-dimmer" id="live-deploy-modal">
        <div class="center-popup" style="max-width: 480px; text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #00ff88; margin-bottom: 20px; filter: drop-shadow(0 0 12px #00ff88);"></i>
            <h3 style="font-family: var(--font-display); color: var(--gold-accent); font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 12px;">SATELLITE LAUNCH SECURE</h3>
            <p style="font-family: var(--font-secondary); font-size: 0.84rem; color: #cfc2df; margin-bottom: 25px; line-height: 1.4rem;">
                Your autonomous cloud node container has launched securely. Routing vectors completely calculated.
            </p>
            <div class="control-input-group">
                <input type="text" readonly id="deployLiveUrl" value="<?php echo htmlspecialchars($_SESSION['last_deploy_url']); ?>" style="text-align: center; margin-bottom: 12px;">
            </div>
            <button class="titan-trigger" onclick="copyLaunchUrl()" style="margin-bottom: 10px;">COPY LIVE OVERLAY</button>
            <div style="display:flex; gap:12px;">
                <?php if($_GET['mode'] !== 'zip_uploaded'): ?>
                    <a href="<?php echo htmlspecialchars($_SESSION['last_deploy_url']); ?>" target="_blank" onclick="simulateAudioSFX('success')" class="titan-trigger text-decoration-none text-center" style="flex:1;">OPEN LINK</a>
                <?php endif; ?>
                <a href="<?php echo basename($_SERVER['PHP_SELF']); ?>" class="titan-trigger titan-trigger-ghost text-decoration-none text-center" style="flex:1;">CLOSE HUD</a>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- FILE PIPELINES NOTIFICATIONS FRAME -->
    <?php if(isset($_GET['notify'])):
        $notify = $_GET['notify'];
        $nd_data = [
            'deleted' => ['Permanently terminated target virtual node container from clouds.', 'var(--pink-accent)'],
            'file_deleted' => ['File correctly unlinked from target container structure.', '#10b981'],
            'file_uploaded' => ['Inline document assets hosted recursively.', '#10b981'],
            'file_saved' => ['Modifications successfully committed to sandbox memory arrays.', '#10b981']
        ];
        if(isset($nd_data[$notify])):
    ?>
    <div class="fs-dimmer" id="notification-modal">
        <div class="center-popup" style="max-width: 420px; text-align: center; border-color: <?php echo $nd_data[$notify][1]; ?>;">
            <i class="fas fa-database" style="font-size: 3.5rem; color: <?php echo $nd_data[$notify][1]; ?>; margin-bottom: 20px;"></i>
            <p style="font-family: var(--font-secondary); font-size: 0.94rem; color: #cfc2df; margin-bottom: 25px; line-height: 1.5rem;">
                <?php echo $nd_data[$notify][0]; ?>
            </p>
            <a href="<?php echo basename($_SERVER['PHP_SELF']); ?>" class="titan-trigger text-decoration-none text-center block">DISMISS TELEMETRY</a>
        </div>
    </div>
    <?php endif; endif; ?>

    <!-- SUB-DIRECTORY SYSTEM FILE EXPLORER MODAL -->
    <?php if($manage_site && !empty($manage_files)): ?>
    <div class="fs-dimmer" id="directory-scroller-modal">
        <div class="center-popup">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
                <h3 style="font-family: var(--font-display); color: var(--gold-accent); font-size: 1.15rem; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-folder-open" style="color: var(--pink-accent);"></i> DIRECTORY CONTENT: <?php echo strtoupper($manage_site); ?>
                </h3>
                <a href="<?php echo basename($_SERVER['PHP_SELF']); ?>" style="color:var(--pink-accent); font-size:2rem; text-decoration:none;">&times;</a>
            </div>

            <!-- Inline recursive dynamic uploader -->
            <div style="background: rgba(255, 20, 147, 0.02); border: 1.5px dashed var(--border-neon); padding: 22px; border-radius:16px; margin-bottom: 20px;">
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="upload_to_site" value="<?php echo htmlspecialchars($manage_site); ?>">
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        <input type="text" name="target_folder" placeholder="Container custom subpath (Optional)" style="flex:1; font-size:12px;">
                        <input type="file" name="extra_file" required style="flex:1; font-size:12px; border:1px solid rgba(255,255,255,0.06); padding:10px;">
                    </div>
                    <button class="titan-trigger" style="padding:14px; margin-top:15px; font-size:0.75rem;">HOST ADDITIONAL FILE</button>
                </form>
            </div>

            <div class="file-scroller-chassis">
                <?php foreach($manage_files as $f): 
                    list($file_ico, $file_color) = get_file_icon($f['basename']);
                    if($f['is_dir']) { $file_ico = "fas fa-folder"; $file_color = "var(--gold-accent)"; }
                ?>
                    <div class="scroller-file-item">
                        <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                            <i class="<?php echo $file_ico; ?>" style="color:<?php echo $file_color; ?>; font-size: 1rem; flex-shrink:0;"></i>
                            <span style="font-size: 0.8rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"><?php echo htmlspecialchars($f['name']); ?></span>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <?php if(!$f['is_dir']): ?>
                                <a href="?edit_file=<?php echo urlencode($f['name']); ?>&site=<?php echo urlencode($manage_site); ?>" onclick="simulateAudioSFX('success')" style="color:var(--gold-accent); font-size:0.85rem;" title="Edit inline buffers"><i class="fas fa-edit"></i></a>
                                <a href="?delete_file=<?php echo urlencode($f['name']); ?>&site=<?php echo urlencode($manage_site); ?>" onclick="return confirm('Confirm permanent unlinking of this file inside the container?')" style="color:var(--pink-accent); font-size:0.85rem;" title="Delete file"><i class="fas fa-trash"></i></a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- FILE BUFFER EDITOR SHIELD -->
    <?php if($inline_edit_file): ?>
    <div class="fs-dimmer" id="inline-editor-modal">
        <div class="center-popup" style="max-width: 820px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
                <h3 style="font-family: var(--font-display); color: var(--gold-accent); font-size: 1.1rem; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-edit" style="color: var(--pink-accent);"></i> BUFFER SUB-EDIT: <?php echo htmlspecialchars($inline_edit_file); ?>
                </h3>
                <a href="?manage=<?php echo urlencode($inline_edit_site); ?>" style="color:var(--pink-accent); font-size:2rem; text-decoration:none;">&times;</a>
            </div>

            <form method="POST">
                <input type="hidden" name="save_inline" value="1">
                <input type="hidden" name="site" value="<?php echo htmlspecialchars($inline_edit_site); ?>">
                <input type="hidden" name="file_path" value="<?php echo htmlspecialchars($inline_edit_file); ?>">
                <div class="control-input-group">
                    <textarea name="inline_content" id="subEditor" style="height: 320px;"><?php echo htmlspecialchars($inline_edit_content); ?></textarea>
                </div>
                <button class="titan-trigger" type="submit" style="margin-top:15px; font-weight: 800;">COMMIT FILE CHANGES</button>
            </form>
        </div>
    </div>
    <?php endif; ?>

    <!-- PRIMARY SYSTEM MAIN LAYOUT -->
    <div class="container" id="system-container">
        
        <!-- Interactive Custom HUD Options overlay -->
        <div class="hud-theme-panel" id="hud-top-dashboard">
            <div class="theme-button-container">
                <button class="theme-pill-trigger active-theme" onclick="switchPresetTheme('nexus', this)">Nexus Default</button>
                <button class="theme-pill-trigger" onclick="switchPresetTheme('toxic', this)">Cyber Toxic</button>
                <button class="theme-pill-trigger" onclick="switchPresetTheme('matrix', this)">Matrix Emerald</button>
                <button class="theme-pill-trigger" onclick="switchPresetTheme('amber', this)">Amber CRT</button>
                <button class="theme-pill-trigger" onclick="switchPresetTheme('violet', this)">Obsidian Violet</button>
            </div>
            
            <!-- Synth Web Audio Toggle Controls -->
            <div class="audio-hud-switch">
                <i class="fas fa-volume-up" id="audio-icon-display" style="margin-right: 5px;"></i>
                <span>Synth Sounds</span>
                <input type="checkbox" id="audio-console-toggle" class="audio-toggle-checkbox">
            </div>
        </div>

        <!-- Supercharged Header Console -->
        <header class="brand-chassis" id="header-brand-box">
            <div class="brand-subtext">ULTIMATE HACKER CLOUD SERVER</div>
            <h1 class="brand-title">MKMODZ ELITE CLOUD</h1>
            <div class="brand-version-pill">
                <span></span> V<?php echo htmlspecialchars($SYSTEM_VERSION); ?> // SECURE DEPLOYER
            </div>

            <div class="orbital-stats-grid">
                <div class="stat-orbital-card">
                    <div class="val"><?php echo count($my_terminal_data); ?></div>
                    <div class="lbl">My Live Nodes</div>
                </div>
                <div class="stat-orbital-card">
                    <div class="val"><?php echo count($all_metas); ?></div>
                    <div class="lbl">Global Deploys</div>
                </div>
                <div class="stat-orbital-card">
                    <div class="val">128-Bit</div>
                    <div class="lbl">Crypto Protection</div>
                </div>
            </div>
        </header>

        <?php if($deploy_error): ?>
            <div style="background:rgba(239, 68, 68, 0.12); border:1.8px solid var(--pink-accent); color:#fecdd3; padding:22px; border-radius:18px; margin-bottom:25px; font-weight:800; font-family:var(--font-secondary); font-size:0.86rem; display:flex; align-items:center; gap:12px;">
                <i class="fas fa-exclamation-triangle" style="color:var(--pink-accent); font-size:1.2rem;"></i> <?php echo htmlspecialchars($deploy_error); ?>
            </div>
        <?php endif; ?>

        <!-- Triple columns interactive dashboard grid -->
        <div class="bento-twin-columns" id="dashboard-columns-root">
            
            <!-- Left Grid: Telemetry, stats, diagnostic signals, rules -->
            <div class="diagnostic-card" id="bento-column-left">
                
                <section class="glass-chassis">
                    <div class="glass-header">
                        <div><i class="fas fa-satellite-dish"></i> BYPASS DIAGNOSTICS</div>
                        <span style="font-size: 0.6rem; background: rgba(0,255,136,0.08); color: #00ff88; padding: 3px 8px; border-radius: 6px; border: 1px solid #00ff88;">ONLINE</span>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:18px;">
                        
                        <!-- Mini core load visual meters -->
                        <div class="cpu-core-visualizer">
                            <div class="cpu-core-ring">
                                <svg><circle cx="30" cy="30" r="28" style="stroke-dasharray: 175; stroke-dashoffset: 75;"></circle></svg>
                                <div class="cpu-core-text">CORE 1<br><span style="color:var(--cyber-blue)">58%</span></div>
                            </div>
                            <div class="cpu-core-ring">
                                <svg><circle cx="30" cy="30" r="28" style="stroke-dasharray: 175; stroke-dashoffset: 140;"></circle></svg>
                                <div class="cpu-core-text">CORE 2<br><span style="color:var(--gold-accent)">20%</span></div>
                            </div>
                            <div class="cpu-core-ring">
                                <svg><circle cx="30" cy="30" r="28" style="stroke-dasharray: 175; stroke-dashoffset: 110;"></circle></svg>
                                <div class="cpu-core-text">CORE 3<br><span style="color:var(--pink-accent)">42%</span></div>
                            </div>
                        </div>

                        <div class="diagnostic-row">
                            <label>OPERATOR HANDLE:</label>
                            <span><?php echo htmlspecialchars($_SESSION['user_identity']); ?></span>
                        </div>
                        <div class="diagnostic-row">
                            <label>ENCRYPTED CORE LINK:</label>
                            <span style="color:var(--cyber-blue)">SECURE TUNNEL V9</span>
                        </div>
                        <div class="diagnostic-row">
                            <label>STATUS PREGNANCY:</label>
                            <span style="color: #00ff88;">ACTIVE COMPILING</span>
                        </div>
                        <div class="diagnostic-row">
                            <label>ROOT COMMAND UNLOCKED:</label>
                            <span><?php echo empty($_SESSION['is_admin_active']) ? 'STRICT' : 'UNRESTRICTED OVERLORD'; ?></span>
                        </div>
                    </div>
                </section>

                <section class="glass-chassis">
                     <div class="glass-header">
                        <div><i class="fas fa-terminal"></i> PACKET STREAM METRICS</div>
                     </div>
                     <div class="cyber-logs-display" id="telemetrystream">
                         <div>[00:01:45] Initiating telemetry diagnostic buffers...</div>
                         <div>[00:01:46] Securing sandboxed PHP routes...</div>
                         <div>[00:01:47] Mapping static sub-folders successfully.</div>
                     </div>
                </section>
            </div>

            <!-- Right Grid: Forms, active file listings -->
            <div style="display:flex; flex-direction:column; gap:25px;" id="bento-column-right">
                
                <section class="glass-chassis">
                    <div class="glass-header">
                        <div><i class="fas fa-rocket"></i> SECURE DEPLOYMENT PROTOCOLS</div>
                    </div>

                    <div class="terminal-tabs">
                        <div class="terminal-tab-trigger <?php echo (!$edit_id && !isset($_GET['tab']))?'active-tab':''; ?>" id="terminal-t-code" onclick="switchFormTab('code')">Code Buffer</div>
                        <div class="terminal-tab-trigger" id="terminal-t-file" onclick="switchFormTab('file')">Single File</div>
                        <div class="terminal-tab-trigger" id="terminal-t-folder" onclick="switchFormTab('folder')">Folder System</div>
                        <div class="terminal-tab-trigger" id="terminal-t-zip" onclick="switchFormTab('zip')">ZIP Repositories</div>
                        <?php if($edit_id): ?>
                            <div class="terminal-tab-trigger active-tab" id="terminal-t-editor" onclick="switchFormTab('editor')">Index Editor</div>
                        <?php endif; ?>
                    </div>

                    <!-- TAB 1: CODE WRITER BUFFER -->
                    <div id="terminal-panel-code" style="display: <?php echo (!$edit_id)?'block':'none'; ?>;">
                        <form method="POST" id="mainCodeForm">
                            <div class="control-input-group">
                                <label>AUTONOMOUS ALIAS (Prefix URL path)</label>
                                <input type="text" name="manual_alias" placeholder="e.g. awesome-landing-page" required>
                            </div>
                            <div class="control-input-group">
                                <label>PARSING FRAMEWORK ENGINE</label>
                                <div class="language-chips-row">
                                    <div class="lang-cyber-badge badge-active" data-lang="html">HTML</div>
                                    <div class="lang-cyber-badge" data-lang="css">CSS stylesheet</div>
                                    <div class="lang-cyber-badge" data-lang="js">JavaScript</div>
                                    <div class="lang-cyber-badge" data-lang="php">PHP Compiler</div>
                                </div>
                                <input type="hidden" name="code_language" id="mainLangInput" value="html">
                            </div>
                            <div class="control-input-group">
                                <label>CODE SOURCE CONTENT BUFFER</label>
                                <textarea name="raw_terminal_code" id="mainRawEditor" placeholder="Paste source layout script here..."></textarea>
                            </div>
                            <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('laser')">TRANSMIT & HOSt CODE</button>
                        </form>
                    </div>

                    <!-- TAB 2: SINGLE FILE COMPILER -->
                    <div id="terminal-panel-file" style="display: none;">
                        <form method="POST" enctype="multipart/form-data">
                            <div class="control-input-group">
                                <label>TARGET HOSt ALIAS</label>
                                <input type="text" name="manual_alias" placeholder="e.g. customized-signal-alias" required>
                            </div>
                            <div class="control-input-group">
                                <label>CHOOSE CONTAINER DOCUMENT</label>
                                <div class="upload-drag-dock" onclick="document.getElementById('sys-file-input').click()">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p style="font-size:0.9rem; font-weight:800; font-family: var(--font-secondary);">CLICK OR DRAG FILE HERE</p>
                                    <p id="targetSkinFileName" style="font-size:0.72rem; color:#8c7a95; margin-top:8px; font-family: var(--font-mono);"></p>
                                </div>
                                <input type="file" id="sys-file-input" name="binary_file" required style="display:none;">
                            </div>
                            <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('laser')">DEPLOY BINARY DOCUMENT</button>
                        </form>
                    </div>

                    <!-- TAB 3: WEBKIT DIRECTORY FOLDER SYSTEM -->
                    <div id="terminal-panel-folder" style="display:none;">
                        <form method="POST" enctype="multipart/form-data">
                            <div class="control-input-group">
                                <label>SATELLITE ROOT NODE ALIAS</label>
                                <input type="text" name="folder_alias" placeholder="e.g. interactive-bento-grid" required>
                            </div>
                            <div class="control-input-group">
                                <label>CHOOSE COMPREHENSIVE DIRECTORY</label>
                                <div class="upload-drag-dock" onclick="document.getElementById('sys-folder-input').click()">
                                    <i class="fas fa-folder-open"></i>
                                    <p style="font-size:0.9rem; font-weight:800; font-family:var(--font-secondary);">SELECT SOURCE DIRECTORY PATH</p>
                                    <p id="targetSkinFolderCount" style="font-size:0.72rem; color:#8c7a95; margin-top:8px; font-family: var(--font-mono);"></p>
                                </div>
                                <input type="file" id="sys-folder-input" name="folder_files[]" webkitdirectory directory multiple required style="display:none;">
                                <input type="hidden" name="folder_upload" value="1">
                            </div>
                            <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('laser')">COMPILE SUB-DIRECTORIES</button>
                        </form>
                    </div>

                    <!-- TAB 4: COMPRESSED ZIP ARCHIVES -->
                    <div id="terminal-panel-zip" style="display:none;">
                        <form method="POST" enctype="multipart/form-data">
                            <div class="control-input-group">
                                <label>MANUAL DEPLOY SLUG PREFIX</label>
                                <input type="text" name="manual_alias" placeholder="e.g. retro-cyber-hub">
                            </div>
                            <div class="control-input-group">
                                <label>UPLOAD COMPRESSED ARCHIVE (.ZIP)</label>
                                <div class="upload-drag-dock" onclick="document.getElementById('sys-zip-input').click()">
                                    <i class="fas fa-file-archive"></i>
                                    <p style="font-size:0.9rem; font-weight:800; font-family: var(--font-secondary);">CLICK OR DROp COMPRESSED ZIP</p>
                                    <p id="targetSkinZipName" style="font-size:0.72rem; color:#8c7a95; margin-top:8px; font-family: var(--font-mono);"></p>
                                </div>
                                <input type="file" id="sys-zip-input" name="zip_archive" accept=".zip" required style="display:none;">
                            </div>
                            <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('laser')">TRANSMIT COMPRESSED REPOSITORY</button>
                        </form>
                    </div>

                    <!-- TAB 5: COMPILER OVERWRITE EDITOR -->
                    <?php if($edit_id): ?>
                    <div id="terminal-panel-editor" style="display:block;">
                        <form method="POST">
                            <div class="control-input-group">
                                <label>MUTATING SYSTEM CONTAINER ID</label>
                                <input type="text" name="manual_alias" value="<?php echo htmlspecialchars($edit_id); ?>" readonly required>
                            </div>
                            <div class="control-input-group">
                                <label>MUTATE SOURCE STRUCTURES</label>
                                <textarea name="raw_terminal_code" id="mainCompilerEditor" style="height:350px;"><?php echo htmlspecialchars($edit_buffer); ?></textarea>
                                <input type="hidden" name="code_language" value="html">
                            </div>
                            <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('success')">COMMIT MutATED CODES</button>
                        </form>
                    </div>
                    <?php endif; ?>

                </section>
            </div>
        </div>

        <!-- Satellite nodes listing details -->
        <section class="glass-chassis" id="hosted-signals-table-section">
            <div class="glass-header">
                <div><i class="fas fa-satellite"></i> OPERATORS ACTIVE CONSOLE SLOTS</div>
                <span class="brand-version-pill" style="margin-top:0; border:none; padding: 2px 8px; font-size:10px;"><i class="fas fa-signal"></i> Active Slots</span>
            </div>

            <div style="max-height: 480px; overflow-y:auto; padding-right:5px;">
                <?php if(empty($my_terminal_data)): ?>
                    <div style="text-align:center; padding:55px 15px; opacity:0.6;">
                        <i class="fas fa-satellite-dish" style="font-size:3rem; color:var(--pink-accent); margin-bottom:15px; filter: drop-shadow(0 0 10px var(--pink-accent));"></i>
                        <p style="font-family:var(--font-display); font-size:0.84rem; letter-spacing:3px;">NO COMPILING SIGNALS FOUND</p>
                    </div>
                <?php else: ?>
                    <?php foreach($my_terminal_data as $row):
                        $is_uploaded = ($row['status'] === 'uploaded' && $row['zip_exists']);
                    ?>
                        <div class="satellite-row">
                            <div class="satellite-info">
                                <div class="satellite-avatar">
                                    <i class="<?php echo $is_uploaded ? 'fas fa-file-archive' : 'fas fa-link'; ?>"></i>
                                </div>
                                <div class="satellite-tag-content">
                                    <b><?php echo strtoupper(htmlspecialchars($row['slug'])); ?></b>
                                    <div class="satellite-meta">
                                        <span class="satellite-badge <?php echo $is_uploaded?'status-uploaded':'status-ready'; ?>">
                                            <?php echo strtoupper(htmlspecialchars($row['status'])); ?>
                                        </span>
                                        <span><i class="fas fa-calendar"></i> <?php echo htmlspecialchars($row['date']); ?></span>
                                        <span><i class="fas fa-database"></i> <?php echo htmlspecialchars($row['file_count']); ?> modules</span>
                                    </div>
                                </div>
                            </div>

                            <div class="action-circle-group">
                                <?php if($is_uploaded): ?>
                                    <a href="?unarchive=<?php echo urlencode($row['slug']); ?>" onclick="simulateAudioSFX('bypass')" class="satellite-circle-btn accent-btn" title="Unarchive / Katabum compile"><i class="fas fa-file-archive"></i></a>
                                    <a href="?delete_zip=<?php echo urlencode($row['slug']); ?>" onclick="return confirm('Terminal confirmation needed to vanish raw ZIP repository?')" class="satellite-circle-btn" title="Delete ZIP archive"><i class="fas fa-trash"></i></a>
                                <?php else: ?>
                                    <a href="?manage=<?php echo urlencode($row['slug']); ?>" onclick="simulateAudioSFX('success')" class="satellite-circle-btn" title="Inspect files pathway"><i class="fas fa-folder-open"></i></a>
                                    <a href="?edit_target=<?php echo urlencode($row['slug']); ?>" onclick="simulateAudioSFX('success')" class="satellite-circle-btn accent-btn" title="Index Editor overrides"><i class="fas fa-edit"></i></a>
                                    <a href="<?php echo htmlspecialchars($row['url']); ?>" target="_blank" onclick="simulateAudioSFX('bypass')" class="satellite-circle-btn" title="Execute live browser module"><i class="fas fa-play"></i></a>
                                    <a href="?delete_id=<?php echo urlencode($row['slug']); ?>" onclick="return confirm('Confirm total unlinking of this entire satellite node container from active server orbits? This cannot be undone.')" class="satellite-circle-btn" title="Vanish entire container"><i class="fas fa-trash"></i></a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>

        <!-- Overlord root commands gateway console panel -->
        <section class="glass-chassis" style="border-color: rgba(255, 20, 147, 0.4);" id="security-gateway-section">
            <div class="glass-header" style="border-color: rgba(255, 20, 147, 0.15);">
                <div style="color:var(--pink-accent);"><i class="fas fa-shield-alt"></i> SECURITY CORE OVERLORD RESTRAINT</div>
            </div>

            <?php if(empty($_SESSION['is_admin_active'])): ?>
                <form method="POST">
                    <div class="control-input-group">
                        <input type="password" name="root_access_key" placeholder="PROVIDE PASSKEY CODE" style="text-align:center; font-family: var(--font-mono); letter-spacing: 2.5px; margin-bottom:15px;">
                    </div>
                    <button class="titan-trigger" type="submit" onclick="simulateAudioSFX('laser')">DE-REStRICT TERMINAL SECURITY</button>
                </form>
                <?php if(isset($error_feedback)): ?>
                    <p style="color:var(--pink-accent); font-family: var(--font-mono); font-size:0.75rem; text-align:center; margin-top:12px; font-weight:800;"><?php echo htmlspecialchars($error_feedback); ?></p>
                <?php endif; ?>
            <?php else: ?>
                <div style="text-align:center; padding:15px 0;">
                    <i class="fas fa-unlock" style="font-size:2.8rem; color:#00ff88; margin-bottom:15px; filter: drop-shadow(0 0 10px #00ff88)"></i>
                    <p style="font-family: var(--font-secondary); font-size:0.94rem; font-weight:800; margin-bottom:15px; letter-spacing: 1px;">AUTONOMOUS OVERLORD COMMAND ROUTING ACTIVATED</p>
                    <a href="?cmd=lockdown" onclick="simulateAudioSFX('alarm')" class="titan-trigger titan-trigger-ghost text-decoration-none text-center" style="display:inline-block; width:auto; padding:12px 30px;">ENGAGE INSTANT LOCKDOWN</a>
                </div>
            <?php endif; ?>
        </section>

        <!-- Dynamic Instructions Instruction manual booklet card -->
        <section class="instructions-briefing-sheet" id="briefing-manual-chassis">
            <h4><i class="fas fa-book-open" style="margin-right: 8px;"></i> Cadet Instruction Manual Booklet Protocols</h4>
            <p style="margin-bottom: 12px;">Welcome Cadet to MKMODZ Ultimate Cloud Terminal interface parameters. Understand system triggers to maximize operations efficiency:</p>
            <ul style="list-style-type: none; padding-left:0; display:flex; flex-direction:column; gap:8.5px;">
                <li><strong style="color: var(--pink-accent);">❖ CODE COMPILING:</strong> Select Code Buffer tab, type manual target subfolder routing name, write source layouts, specify framework language parsing.</li>
                <li><strong style="color: var(--pink-accent);">❖ RECURSIVE DIRECTORY COMPRESSING (ZIP):</strong> Upload archives .ZIP repos, click unarchive trigger row, structures flatten recursively or deploy with deep layouts.</li>
                <li><strong style="color: var(--pink-accent);">❖ SECTOR OVERLORD PRIVILEGES:</strong> De-restrict security locks under master key pass to unlock all hosted slots unlinking/editing permissions regardless of cadet session signatures.</li>
            </ul>
        </section>

        <!-- Minimalist, non-tech larping professional footer -->
        <footer class="footer" id="interactive-page-footer">
            DESIGNED BY MKMODZ ELITE TERMINAL // CYBER NEXUS V<?php echo htmlspecialchars($SYSTEM_VERSION); ?>
        </footer>
    </div>

    <!-- ==========================================
       CLIENT SIDE INTERACTIVE JS COMPILER LOGICS
       ========================================== -->
    <script>
        // System wide Theme switcher presets
        function switchPresetTheme(themeName, element) {
            const body = document.getElementById("sys-body");
            
            // Clean previously set presets
            body.className = "";
            
            if (themeName === 'nexus') {
                body.classList.add('theme-nexus');
            } else if (themeName === 'toxic') {
                body.classList.add('theme-toxic');
            } else if (themeName === 'matrix') {
                body.classList.add('theme-matrix');
            } else if (themeName === 'amber') {
                body.classList.add('theme-amber');
            } else if (themeName === 'violet') {
                body.classList.add('theme-violet');
            }
            
            // Toggle active pill styling
            document.querySelectorAll(".theme-pill-trigger").forEach(pill => {
                pill.classList.remove("active-theme");
            });
            element.classList.add("active-theme");
            
            // Log telemetry event
            simulateAudioSFX('click');
            triggerToastDiagnostics("Switched system visuals preset: " + themeName.toUpperCase());
        }

        // Web Audio Synthesized Retro Sounds (No outside dependencies!)
        let audioContext = null;
        const soundCheckbox = document.getElementById("audio-console-toggle");

        function getAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            return audioContext;
        }

        function simulateAudioSFX(type) {
            if (!soundCheckbox.checked) return;
            
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;

                if (type === 'click') {
                    // Quick console synthesizer click sound
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(950, now);
                    osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.05);
                } else if (type === 'laser') {
                    // Futuristic cybernetic laser transmission fire sound
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(1400, now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.22);
                } else if (type === 'success') {
                    // Positive multi-note harmonic melody link trigger
                    const scale = [523.25, 659.25, 783.99, 1046.50]; // Chord arpeggio 
                    scale.forEach((freq, index) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + (index * 0.05));
                        gain.gain.setValueAtTime(0.03, now + (index * 0.05));
                        gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.05) + 0.1);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now + (index * 0.05));
                        osc.stop(now + (index * 0.05) + 0.1);
                    });
                } else if (type === 'alarm') {
                    // Security breach active lock alarm chime
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(580, now + 0.18);
                    osc.frequency.linearRampToValueAtTime(220, now + 0.36);
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.38);
                } else if (type === 'bypass') {
                    // High frequency synthetic sweep injection hum
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
                    gain.gain.setValueAtTime(0.03, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.26);
                }
            } catch (e) {
                console.error("Audio Synthesis error: ", e);
            }
        }

        // Attach listener clicks automatically on interactives
        document.querySelectorAll("input, button, select, a, .terminal-tab-trigger, .lang-cyber-badge").forEach(elem => {
            elem.addEventListener("click", () => {
                simulateAudioSFX('click');
            });
        });

        // Trigger premium diagnostics overlay feedback toast notifications
        let toastTimeout = null;
        function triggerToastDiagnostics(message) {
            const toast = document.getElementById("diagnostics-toast");
            const label = document.getElementById("toast-text-field");
            
            label.innerText = message;
            toast.classList.add("active-toast");
            
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove("active-toast");
            }, 3500);
        }

        // Copy deployment launched url
        function copyLaunchUrl() {
            const liveUrlInput = document.getElementById("deployLiveUrl");
            if (liveUrlInput) {
                liveUrlInput.select();
                document.execCommand("copy");
                simulateAudioSFX('success');
                triggerToastDiagnostics("Satellite live URL copied to operators clipboard.");
            }
        }

        // Subtabs routing dashboard panels
        function switchFormTab(targetId) {
            const ids = ['code','file','folder','zip','editor'];
            ids.forEach(id => {
                const p = document.getElementById("terminal-panel-" + id);
                const t = document.getElementById("terminal-t-" + id);
                if (p) {
                    p.style.display = (id === targetId) ? "block" : "none";
                }
                if (t) {
                    t.classList.toggle("active-tab", id === targetId);
                }
            });
            triggerToastDiagnostics("Redirecting secure pipeline: " + targetId.toUpperCase());
        }

        // Multi language framework pills click switching
        document.querySelectorAll(".lang-cyber-badge").forEach(pill => {
            pill.addEventListener("click", () => {
                document.querySelectorAll(".lang-cyber-badge").forEach(p => p.classList.remove("badge-active"));
                pill.classList.add("badge-active");
                
                const chosenLang = pill.getAttribute("data-lang");
                document.getElementById("mainLangInput").value = chosenLang;
                
                // Adjust CodeMirror mode on-the-fly
                if (mainCMWriter) {
                    let mapModelType = "htmlmixed";
                    if (chosenLang === "css") mapModelType = "text/css";
                    else if (chosenLang === "js") mapModelType = "text/javascript";
                    else if (chosenLang === "php") mapModelType = "application/x-httpd-php";
                    mainCMWriter.setOption("mode", mapModelType);
                }
                
                triggerToastDiagnostics("Switched source parsing layout: " + chosenLang.toUpperCase());
            });
        });

        // HTML5 drag/drop file indicators
        const zoneFile = document.getElementById("sys-file-input");
        if (zoneFile) {
            zoneFile.addEventListener("change", (e) => {
                const name = e.target.files[0]?.name || "Empty documentation";
                document.getElementById("targetSkinFileName").innerText = "✔ DETECTED DOCUMENT: " + name;
                triggerToastDiagnostics("Binary buffer mapped successfully.");
            });
        }

        const zoneFolder = document.getElementById("sys-folder-input");
        if (zoneFolder) {
            zoneFolder.addEventListener("change", (e) => {
                const count = e.target.files.length || 0;
                document.getElementById("targetSkinFolderCount").innerText = "✔ DETECTED SUB-ITEMS: " + count + " parts";
                triggerToastDiagnostics("Multi-level tree directories nested.");
            });
        }

        const zoneZip = document.getElementById("sys-zip-input");
        if (zoneZip) {
            zoneZip.addEventListener("change", (e) => {
                const name = e.target.files[0]?.name || "Unpacked folder";
                document.getElementById("targetSkinZipName").innerText = "✔ DETECTED REPOSITORY: " + name;
                triggerToastDiagnostics("Compressed ZIP mapped securely.");
            });
        }

        // HIGH PERFORMANCE CYBER MATRIX FLOATING BINARY MATRIX RAIN BACKGROUND EFFECT
        const canvas = document.getElementById("matrixCanvas");
        const canvasCtx = canvas.getContext("2d");

        function adjustMatrixSizing() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        adjustMatrixSizing();
        window.addEventListener("resize", adjustMatrixSizing);

        // Character glyph vectors
        const characterGlys = "10XYZΩΨΦ0101CRYPTOTUNNELBYPASSVERIFYING9.0.0";
        const glyphArr = characterGlys.split("");
        
        const sizeChar = 15;
        const columnsY = Math.floor(canvas.width / sizeChar) + 1;
        const indexColumns = Array(columnsY).fill(0).map(() => Math.floor(Math.random() * -100));

        function drawMatrixTick() {
            // Slight dark opacity fill to create phosphor trails
            canvasCtx.fillStyle = "rgba(6, 2, 12, 0.084)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            // Fetch active accent colors on dynamic presets
            const bodyStyleComputed = window.getComputedStyle(document.body);
            const activeGreenGlow = bodyStyleComputed.getPropertyValue('--gold-accent').trim() || "#ffd700";

            canvasCtx.fillStyle = activeGreenGlow;
            canvasCtx.font = sizeChar + "px 'JetBrains Mono'";

            indexColumns.forEach((yTracker, indexColumn) => {
                const randomSymbol = glyphArr[Math.floor(Math.random() * glyphArr.length)];
                const xCoord = indexColumn * sizeChar;
                const yCoord = yTracker * sizeChar;

                canvasCtx.fillText(randomSymbol, xCoord, yCoord);

                if (yCoord > canvas.height + Math.random() * 800) {
                    indexColumns[indexColumn] = 0;
                } else {
                    indexColumns[indexColumn] = yTracker + 1;
                }
            });
        }
        setInterval(drawMatrixTick, 35);

        // Simulated telemetry events pipeline generator loop
        const simulatedLogsList = [
            "SYS: Diagnostic audit loops completed successfully.",
            "NET: Secured telemetry interfaces under tunnel security.",
            "FILE: Mapping nested folders on dynamic lists.",
            "SEC: Guarding active bypass scripts seamlessly.",
            "CORE: CPU core load balanced and within secure guidelines.",
            "DATABASE: Meta registries safely parsed to memory.",
            "SYS: Dynamic CDM workspace theme synced."
        ];

        const logPanel = document.getElementById("telemetrystream");
        if (logPanel) {
            setInterval(() => {
                const randomMsg = simulatedLogsList[Math.floor(Math.random() * simulatedLogsList.length)];
                const timestamp = new Date().toTimeString().split(' ')[0];
                
                const logItem = document.createElement("div");
                logItem.innerText = `[${timestamp}] ${randomMsg}`;
                logPanel.appendChild(logItem);
                
                // Keep scroll stuck top/bottom
                logPanel.scrollTop = logPanel.scrollHeight;
                
                // Trim trailing elements to prevent performance leak
                if (logPanel.children.length > 50) {
                    logPanel.removeChild(logPanel.firstChild);
                }
            }, 6000);
        }

        // Instantiate Codemirror overrides with materials configurations
        let mainCMWriter = null;
        const commonCMConfig = {
            lineNumbers: true,
            theme: 'material-darker',
            mode: 'htmlmixed',
            lineWrapping: true,
            indentWithTabs: true,
            tabSize: 4
        };

        if (document.getElementById("mainRawEditor")) {
            mainCMWriter = CodeMirror.fromTextArea(document.getElementById("mainRawEditor"), commonCMConfig);
        }
        if (document.getElementById("mainCompilerEditor")) {
            CodeMirror.fromTextArea(document.getElementById("mainCompilerEditor"), commonCMConfig);
        }
        if (document.getElementById("subEditor")) {
            CodeMirror.fromTextArea(document.getElementById("subEditor"), {
                lineNumbers: true, 
                theme: 'material-darker', 
                mode: 'htmlmixed',
                lineWrapping: true
            });
        }
    </script>
</body>
</html>
