<?php
/*
Plugin Name: FW Module Loader
Description: Loads a hosted React site in a shortcode. Use the shortcode [module_loader url="https://example.com/module"]
Version: 1.0
Author: Focus Wider (Didier Hartong)
*/

class ModuleLoaderHelper
{
    private $url;
    private $skeletonFormat;
    public function __construct($url, $skeletonFormat = null)
    {
        $this->url = $url;
        $this->skeletonFormat = $skeletonFormat;
    }
    private function generateHash($str)
    {
        return substr(md5($str), 0, 8);
    }
    private function loadCss($elemId, $href)
    {
        $id = "css" . $elemId . $this->generateHash($href);
        return "<link id=\"$id\" rel=\"stylesheet\" type=\"text/css\" href=\"$href\">";
    }
    private function loadExternalScript($elemId, $src)
    {
        $id = "script" . $elemId . $this->generateHash($src);
        return "<script id=\"$id\" type=\"module\" src=\"$src\"></script>";
    }
    private function loadInlineScript($elemId, $script)
    {
        $id = "script" . $elemId . $this->generateHash(substr($script, 0, 100));
        return "<script id=\"$id\" type=\"module\">$script</script>";
    }
    function curl_get_contents($url)
    {
        if (!function_exists("curl_init")) {
            die("The cURL library is not installed.");
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt(
            $ch,
            CURLOPT_USERAGENT,
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        );

        $data = curl_exec($ch);

        if (curl_errno($ch)) {
            return false;
        }

        curl_close($ch);
        return $data;
    }
    public function render()
    {
        if (!$this->url) {
            return "<div>URL not configured</div>";
        }

        // $contents = ''
        try {
            // $content = $this->curl_get_contents($this->url);

            $content = $this->curl_get_contents($this->url . "?_c=" . time());
            if (!$contents) {
                return "<div>Failed to retrieve contents</div>";
            }
            $dom = new DOMDocument();
            try {
                @$dom->loadHTML(
                    $content,
                    LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
                );
            } catch (Exception $e) {
                return "<div>Failed to load HTML</div>";
            }

            $moduleEntry = $dom->getElementsByTagName("div");

            if ($moduleEntry->length === 0) {
                error_log(
                    "Could not load external module. No module entry found."
                );
                return "<div>URL not configured</div>";
            }
            if ($moduleEntry->length > 1) {
                error_log("Multiple module entries found");
                return "<div>Multiple module entries found</div>";
            }

            $rootElemId = $moduleEntry[0]->getAttribute("id");
            $output = "";

            // Load CSS
            $links = $dom->getElementsByTagName("link");
            foreach ($links as $link) {
                if ($link->hasAttribute("href")) {
                    $href =
                        $this->url . ltrim($link->getAttribute("href"), "/");
                    $output .= $this->loadCss($rootElemId, $href);
                }
            }
            // Load external scripts
            $scripts = $dom->getElementsByTagName("script");
            foreach ($scripts as $script) {
                if ($script->hasAttribute("src")) {
                    $src =
                        $this->url . ltrim($script->getAttribute("src"), "/");
                    $output .= $this->loadExternalScript($rootElemId, $src);
                }
            }
            // Load inline scripts
            foreach ($scripts as $script) {
                if (!$script->hasAttribute("src")) {
                    $output .= $this->loadInlineScript(
                        $rootElemId,
                        $script->textContent
                    );
                }
            } // Add root element
            $output .= "<div id=\"$rootElemId\">Laden...</div>";
            return $output;
        } catch (Exception $e) {
            return "<div>Failed to retrieve contents</div>";
        }
    }
}

function module_loader($atts = [])
{
    $defaults = [
        "url" => "default_val",
        "param2" => "pa2",
    ];

    $atts = shortcode_atts($defaults, $atts, "module_loader_shortcode");
    ?>
<?php
try {
    $loader = new ModuleLoaderHelper($atts["url"]);
} catch (Exception $e) {
    return "<div>Error: " . $e->getMessage() . "</div>";
}
return $loader->render();
}
function module_loader_shortcode($atts = [])
{
    try {
        return module_loader($atts);
    } catch (Exception $e) {
        return "<div>Error: " . $e->getMessage() . "</div>";
    }
}
add_shortcode("module_loader", "module_loader_shortcode"); // include plugin_dir_path(__FILE__) . "options.php";
