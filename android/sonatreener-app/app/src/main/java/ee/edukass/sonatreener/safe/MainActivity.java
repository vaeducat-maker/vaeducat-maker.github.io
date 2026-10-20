package ee.edukass.sonatreener.safe;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.webkit.*;
import android.widget.*;
import android.view.ViewGroup;

/** Single-purpose Android System WebView application. */
public final class MainActivity extends Activity {
    private static final String HOME = "https://edukass.ee/games/kiire-sonatreener/";
    private WebView web;
    private TextView offline;
    private FrameLayout root;
    private boolean failed;

    private static boolean allowed(Uri u) {
        if (u == null || !"https".equalsIgnoreCase(u.getScheme())) return false;
        String h = u.getHost(), p = u.getPath();
        return h != null && (h.equalsIgnoreCase("edukass.ee")
            || h.equalsIgnoreCase("www.edukass.ee"))
            && p != null && (p.equals("/games/kiire-sonatreener")
            || p.startsWith("/games/kiire-sonatreener/"));
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(247, 250, 246));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(247, 250, 246));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));

        offline = new TextView(this);
        offline.setText("Нет соединения с Sõnatreener.\nНажми, чтобы попробовать снова.");
        offline.setTextColor(Color.rgb(30,65,49));
        offline.setTextSize(18f);
        offline.setGravity(Gravity.CENTER);
        offline.setPadding(28,28,28,28);
        offline.setBackgroundColor(Color.rgb(247,250,246));
        offline.setVisibility(View.GONE);
        offline.setOnClickListener(v -> {
            offline.setVisibility(View.GONE);
            web.loadUrl(HOME);
        });
        root.addView(offline,new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setSupportMultipleWindows(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onCreateWindow(WebView w,boolean dialog,
                   boolean userGesture,android.os.Message message) { return false; }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView w, WebResourceRequest r) {
                if (!r.isForMainFrame()) return false;
                if (allowed(r.getUrl())) return false;
                Toast.makeText(MainActivity.this, "Доступны только уроки Sõnatreener",
                    Toast.LENGTH_SHORT).show();
                return true;
            }
            @Override public void onPageStarted(WebView w,String url,android.graphics.Bitmap icon) {
                failed = false;
                offline.setVisibility(View.GONE);
            }
            @Override public void onPageFinished(WebView w,String url) {
                if (!failed && allowed(Uri.parse(url))) offline.setVisibility(View.GONE);
            }
            @Override public void onReceivedError(WebView w,WebResourceRequest r,
                    WebResourceError e) {
                if (r.isForMainFrame()) {
                    failed = true;
                    offline.setVisibility(View.VISIBLE);
                }
            }
        });
        if (state == null || web.restoreState(state) == null) web.loadUrl(HOME);
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
    @Override protected void onSaveInstanceState(Bundle state) {
        if (web != null) web.saveState(state);
        super.onSaveInstanceState(state);
    }
    @Override protected void onDestroy() {
        if (web != null) {
            root.removeView(web);
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
