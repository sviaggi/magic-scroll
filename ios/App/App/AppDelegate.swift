import UIKit
import Capacitor
import AVFoundation   // add

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Let Web Audio (metronome, backing track, abcjs playback) sound even
        // when the hardware mute switch is on, and mix politely with other apps.
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("[MagicScroll] AVAudioSession error: (error)")
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // NEW: a real file — from "Open in…", a Mail attachment, or AirDrop —
        // as opposed to a custom URL scheme / universal link. Read it, hand
        // it to the WebView as base64, and let window.__handleNativeSharedFile
        // (defined in MagicScroll-release.html — the main Magic Scroll repo,
        // not this one — see its "NATIVE iOS BRIDGE" comment) do the rest via
        // the same loadFile() path every other import route uses.
        //
        // KNOWN GAP: this evaluates the JS immediately, which only works if
        // the WKWebView has already loaded (the common case — the app was
        // already running or backgrounded, then the user picked "Open in
        // Magic Scroll"). A COLD launch straight into a shared file — the
        // app wasn't running at all — races the page's own load, and
        // evaluateJavaScript() could fire before window.__handleNativeSharedFile
        // exists yet. I didn't add a queue/retry for that here: doing it right
        // means hooking into Capacitor's WKNavigationDelegate (CAPBridgeViewController
        // already sets itself as the navigation delegate; overriding it wrong
        // risks breaking the bridge's own init), and I have no Xcode/simulator
        // here to verify that against a real cold-launch test. If cold-launch
        // shares turn out to matter in practice, that's the next thing to add
        // — flagging it now rather than shipping an untested guess at it.
        if url.isFileURL {
            do {
                let data = try Data(contentsOf: url)
                let base64 = data.base64EncodedString()
                let filename = url.lastPathComponent.replacingOccurrences(of: "'", with: "\\'")
                let js = "window.__handleNativeSharedFile && window.__handleNativeSharedFile('\(base64)', '\(filename)', 'application/octet-stream')"
                if let bridgeVC = self.window?.rootViewController as? CAPBridgeViewController {
                    bridgeVC.bridge?.webView?.evaluateJavaScript(js, completionHandler: nil)
                }
                // iOS copies "Open in…" files into a private Inbox/ directory
                // for us — clean it up once read, matching Apple's own sample
                // code for this exact scenario.
                try? FileManager.default.removeItem(at: url)
            } catch {
                print("[MagicScroll] share-bridge failed to read shared file: \(error)")
            }
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
