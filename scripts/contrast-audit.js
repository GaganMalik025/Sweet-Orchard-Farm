/**
 * Contrast audit. Paste into the browser console on a rendered page.
 *
 *   contrastAudit()               // every text element on the page
 *   contrastAudit('#masthead')    // one subtree
 *
 * Why this exists rather than a colour-picker or a linter: two things on this
 * site defeat the naive approach of reading `color` and `background-color`
 * and comparing them.
 *
 *   1. Some backgrounds are `oklab(... / 0.55)` (Tailwind's alpha syntax).
 *      Parsing that string for numbers yields the oklab components, which
 *      score as near-black — the NowPill once "measured" 1.12:1 that way.
 *      So every layer is painted onto a canvas and read back as real pixels.
 *
 *   2. The masthead's text sits over a photograph, which has no single
 *      background colour. There, the whole composite (photo, blurred, under
 *      every vignette layer) is rebuilt and sampled under each line of text,
 *      and the WORST pixel is reported — an average would hide exactly the
 *      failure you care about.
 *
 * Thresholds are WCAG AA: 4.5:1 for body text, 3:1 for large text (>=24px,
 * or >=18.66px when bold). Elements with their own fill — a button, the
 * NowPill chip — have that fill composited over the sample first.
 *
 * Caveat: the masthead numbers are specific to the current photograph and
 * viewport width. Re-run after changing the image, the blur, or any vignette
 * stop. To check a phone width, render the site in an <iframe> of that width
 * and run this inside it — resizing the browser window may not actually
 * change the viewport.
 */
(function () {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 8;
  const pctx = probe.getContext("2d", { willReadFrequently: true });

  /** Paint `color` over a known base and read the true composited pixel. */
  function over(color, base, alpha = 1) {
    pctx.clearRect(0, 0, 8, 8);
    pctx.fillStyle = `rgb(${base.r},${base.g},${base.b})`;
    pctx.fillRect(0, 0, 8, 8);
    pctx.globalAlpha = alpha;
    pctx.fillStyle = color;
    pctx.fillRect(0, 0, 8, 8);
    pctx.globalAlpha = 1;
    const d = pctx.getImageData(4, 4, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2] };
  }

  function luminance(c) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function ratio(a, b) {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  /** Background colours from the element up to `stopAt`, bottom-first. */
  function bgStack(el, stopAt) {
    const out = [];
    let n = el;
    while (n && n !== stopAt) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") out.unshift(bg);
      n = n.parentElement;
    }
    return out;
  }

  /** Opacity compounds down the tree; 0.7 inside 0.8 is really 0.56. */
  function accumulatedOpacity(el) {
    let o = 1;
    let n = el;
    while (n && n !== document.documentElement) {
      const v = parseFloat(getComputedStyle(n).opacity);
      if (!isNaN(v)) o *= v;
      n = n.parentElement;
    }
    return o;
  }

  function isLarge(cs) {
    const size = parseFloat(cs.fontSize);
    return size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
  }

  /** Elements holding their own text (not just wrapping children that do). */
  function textElements(root) {
    return [...root.querySelectorAll("*")].filter((el) => {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && accumulatedOpacity(el) > 0;
    });
  }

  /**
   * Rebuild what is actually painted behind the masthead: the photograph at
   * its real object-fit/position/scale, blurred exactly as CSS blurs it, then
   * each vignette layer in order. Returns null for ordinary flat sections.
   */
  function photoComposite(host) {
    const img = host.querySelector("img");
    if (!img || !img.complete || !img.naturalWidth) return null;

    const W = Math.round(host.offsetWidth);
    const H = Math.round(host.offsetHeight);
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Responsive desktop/mobile vignette layers coexist in the DOM. Only
    // painted layers count: compositing display:none gradients would make
    // the audit report darker backgrounds and falsely passing contrast.
    const layers = [...host.children].filter((c) => {
      const s = getComputedStyle(c);
      return c.getAttribute("aria-hidden") !== null && s.display !== "none" && s.visibility !== "hidden";
    });
    const ground = layers.find((l) => l.contains(img));
    ctx.fillStyle = ground ? getComputedStyle(ground).backgroundColor : "#000";
    ctx.fillRect(0, 0, W, H);

    const cs = getComputedStyle(img);
    const blur = parseFloat((cs.filter.match(/blur\(([\d.]+)px\)/) || [0, 0])[1]) || 0;
    const scale = parseFloat((cs.transform.match(/matrix\(([\d.]+)/) || [0, 1])[1]) || 1;
    const [px, py] = cs.objectPosition.split(" ").map((v) => parseFloat(v) / 100);

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const cover = Math.max(W / nw, H / nh);
    const rawWidth = nw * cover;
    const rawHeight = nh * cover;
    const dw = rawWidth * scale;
    const dh = rawHeight * scale;
    // object-position is applied before CSS scales around the element centre.
    const x = W / 2 + ((W - rawWidth) * (isNaN(px) ? 0.5 : px) - W / 2) * scale;
    const y = H / 2 + ((H - rawHeight) * (isNaN(py) ? 0.5 : py) - H / 2) * scale;

    ctx.filter = `blur(${blur * scale}px)`;
    ctx.drawImage(
      img,
      x,
      y,
      dw,
      dh,
    );
    ctx.filter = "none";

    // Vignette layers, in paint order. Gradients are re-read from the
    // computed style so this stays correct when the stops are retuned.
    for (const layer of layers) {
      if (layer === ground) continue;
      const s = getComputedStyle(layer);
      if (s.backgroundImage && s.backgroundImage !== "none") {
        // Canvas can't be handed a CSS gradient, so the stops are read back
        // out of the computed value and rebuilt. Colours arrive in whatever
        // form the browser resolved them to — rgb/rgba, or oklab/oklch/color()
        // once color-mix is involved — and canvas accepts all of those as
        // fillStyle, so they are passed through untouched. Unparseable
        // gradients are skipped rather than guessed at.
        const stops = [...s.backgroundImage.matchAll(
          /((?:rgba?|oklab|oklch|color|lab|lch|hsla?)\([^)]*\))\s*([\d.]+)?%?/g,
        )];
        if (stops.length >= 2) {
          // Computed CSS may omit "to bottom" because vertical is the
          // default. The site's other direction is explicitly "to right".
          const vertical = !/to right|90deg/.test(s.backgroundImage);
          const g = vertical
            ? ctx.createLinearGradient(0, 0, 0, H)
            : ctx.createLinearGradient(0, 0, W, 0);
          stops.forEach((m, i) => {
            const pos = m[2] !== undefined ? parseFloat(m[2]) / 100 : i / (stops.length - 1);
            g.addColorStop(Math.min(1, Math.max(0, pos)), m[1]);
          });
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
      } else if (s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)") {
        ctx.fillStyle = s.backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }
    }

    return { ctx, W, H, rect: host.getBoundingClientRect() };
  }

  window.contrastAudit = function contrastAudit(selector) {
    const root = selector ? document.querySelector(selector) : document.body;
    if (!root) return `no element matches ${selector}`;

    const masthead = document.getElementById("masthead");
    const composite = masthead ? photoComposite(masthead) : null;

    const rows = textElements(root).map((el) => {
      const cs = getComputedStyle(el);
      const opacity = accumulatedOpacity(el);
      const need = isLarge(cs) ? 3 : 4.5;
      const label = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ")
        .slice(0, 38);

      let worst = Infinity;

      if (composite && masthead.contains(el)) {
        // Over the photograph: sample every pixel under the text box.
        const stack = bgStack(el, masthead);
        const r = el.getBoundingClientRect();
        const x0 = Math.max(0, Math.round(r.left - composite.rect.left));
        const y0 = Math.max(0, Math.round(r.top - composite.rect.top));
        const x1 = Math.min(composite.W - 1, Math.round(r.right - composite.rect.left));
        const y1 = Math.min(composite.H - 1, Math.round(r.bottom - composite.rect.top));
        for (let y = y0; y <= y1; y += 3) {
          for (let x = x0; x <= x1; x += 3) {
            const d = composite.ctx.getImageData(x, y, 1, 1).data;
            let bg = { r: d[0], g: d[1], b: d[2] };
            for (const layer of stack) bg = over(layer, bg);
            const rr = ratio(over(cs.color, bg, opacity), bg);
            if (rr < worst) worst = rr;
          }
        }
      } else {
        const stack = bgStack(el, document.documentElement);
        let bg = { r: 255, g: 255, b: 255 };
        for (const layer of stack) bg = over(layer, bg);
        worst = ratio(over(cs.color, bg, opacity), bg);
      }

      return { label, px: Math.round(parseFloat(cs.fontSize)), ratio: +worst.toFixed(2), need, pass: worst >= need };
    });

    const fails = rows.filter((r) => !r.pass);
    console.table(rows);
    console.log(
      `${rows.length} checked · ${fails.length} failing` +
        (composite ? " · masthead measured against real pixels" : ""),
    );
    return { checked: rows.length, failing: fails.length, fails };
  };

  console.log("contrastAudit() ready — call contrastAudit() or contrastAudit('#masthead')");
})();
