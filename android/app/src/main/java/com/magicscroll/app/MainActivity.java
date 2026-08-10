package com.magicscroll.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import com.getcapacitor.BridgeActivity;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

// Verified against the real, currently-committed MainActivity.java (the
// stock Capacitor default, `extends BridgeActivity {}`) — this is a direct
// drop-in replacement, not a guess.
//
// Receives files via the two new AndroidManifest.xml intent-filters: SEND
// (Android's "Share…" sheet) and VIEW ("Open with…"/tapping a file). Reads
// the incoming URI's bytes and hands them to the WebView as base64 via
// window.__handleNativeSharedFile — the same bridge function
// MagicScroll-release.html's iOS AppDelegate.swift patch calls, converging
// on the same loadFile() import path every other entry point (manual file
// picker, drag-drop, PWA share-target) already uses.
//
// No <uses-permission> is needed for any of this: when the OS routes a
// matched SEND/VIEW intent to this activity, it grants a temporary read
// permission scoped to exactly that content:// URI as part of intent
// resolution — separate from (and not requiring) READ_EXTERNAL_STORAGE/
// READ_MEDIA_*, which only govern an app browsing the user's broader media
// library on its own initiative, not receiving a URI handed to it directly.
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Cold launch straight into "Share…"/"Open with… Magic Scroll".
        handleShareIntent(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // App already running/backgrounded — launchMode="singleTask" in
        // AndroidManifest.xml is what routes here instead of a fresh
        // onCreate.
        handleShareIntent(intent);
    }

    // Handles both entry points the new AndroidManifest.xml intent-filters
    // add: ACTION_SEND (Share sheet, file in EXTRA_STREAM) and ACTION_VIEW
    // (Open with…/tapped file, file in the intent's own data URI).
    //
    // KNOWN GAP (same as the iOS AppDelegate.swift patch): onCreate() fires
    // before the WebView has necessarily finished loading
    // MagicScroll-release.html, so a COLD launch straight into a shared
    // file could call evaluateJavascript before
    // window.__handleNativeSharedFile exists yet, and silently no-op.
    // onNewIntent() (the app-already-running case) doesn't have this
    // problem. A real fix means listening for the page's load-finish event
    // before flushing a cold-launch share — worth confirming on a real
    // device/emulator before relying on the cold-launch path specifically.
    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        Uri uri = null;
        if (Intent.ACTION_SEND.equals(action)) {
            uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        } else if (Intent.ACTION_VIEW.equals(action)) {
            uri = intent.getData();
        }
        if (uri == null) return;

        try {
            byte[] bytes = readUriBytes(uri);
            String base64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
            String filename = uri.getLastPathSegment();
            if (filename == null) filename = "shared-file";
            filename = filename.replace("'", "\\'");
            final String js = "window.__handleNativeSharedFile && window.__handleNativeSharedFile('"
                + base64 + "', '" + filename + "', 'application/octet-stream')";
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().post(() ->
                    bridge.getWebView().evaluateJavascript(js, null)
                );
            }
        } catch (IOException e) {
            android.util.Log.e("MagicScroll", "share-bridge failed to read shared file", e);
        }
    }

    private byte[] readUriBytes(Uri uri) throws IOException {
        InputStream in = getContentResolver().openInputStream(uri);
        if (in == null) throw new IOException("openInputStream returned null for " + uri);
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
            return out.toByteArray();
        } finally {
            in.close();
        }
    }
}
