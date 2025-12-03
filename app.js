// app.js

// ===============================
// Helpers
// ===============================

function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// ===============================
// Nav & Layout
// ===============================

function initHeader() {
  const header = $(".site-header");
  const navToggle = $(".nav-toggle");

  if (!header || !navToggle) return;

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("nav-open", !expanded);
  });

  // Close mobile nav when clicking a link
  $all(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("nav-open");
    });
  });
}

function initFooterYear() {
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ===============================
// Toast / Feedback
// ===============================

function createToastContainer() {
  let toast = $("#adcraft-toast");
  if (toast) return toast;

  toast = document.createElement("div");
  toast.id = "adcraft-toast";
  toast.style.position = "fixed";
  toast.style.left = "50%";
  toast.style.bottom = "1.6rem";
  toast.style.transform = "translateX(-50%) translateY(40px)";
  toast.style.padding = "0.45rem 0.9rem";
  toast.style.borderRadius = "999px";
  toast.style.fontSize = "0.8rem";
  toast.style.background =
    "radial-gradient(circle at top left, rgba(15,23,42,0.98), rgba(15,23,42,0.95))";
  toast.style.border = "1px solid rgba(148,163,184,0.65)";
  toast.style.color = "#e5e7eb";
  toast.style.opacity = "0";
  toast.style.pointerEvents = "none";
  toast.style.transition =
    "opacity 160ms ease-out, transform 160ms ease-out, visibility 160ms ease-out";
  toast.style.boxShadow = "0 16px 40px rgba(15,23,42,0.9)";
  toast.style.zIndex = "999";
  toast.style.visibility = "hidden";

  document.body.appendChild(toast);
  return toast;
}

let toastTimeout = null;

function showToast(message) {
  const toast = createToastContainer();
  toast.textContent = message;
  toast.style.visibility = "visible";
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(40px)";
    toast.style.visibility = "hidden";
  }, 1800);
}

// ===============================
// Generator Logic
// ===============================

// Build the prompt (for when you plug in a real AI backend)
function buildPromptFromInputs(payload) {
  const {
    product,
    audience,
    platform,
    goal,
    tone,
    length,
    includeEmojis,
    includeHashtags,
    includeVideoScript,
  } = payload;

  return `
You are a senior performance marketer and direct response copywriter.

Write HIGH-CONVERTING ad copy for the following:

Product / offer:
${product.trim()}

Target audience:
${audience.trim() || "Use your best guess based on the product and goal."}

Platform: ${platform}
Goal: ${goal}
Tone / style: ${tone}
Length: ${length}
Include emojis: ${includeEmojis ? "Yes" : "No"}
Include hashtags (if the platform uses them): ${
    includeHashtags ? "Yes" : "No"
  }
Also generate a short video ad script outline: ${
    includeVideoScript ? "Yes" : "No"
  }

Return 3 variations. For each variation, include:
- Primary text (the main ad body)
- Headline (if the platform uses headlines)
- Short supporting description or caption
- A clear call-to-action
${
  includeVideoScript
    ? "- A short bullet-point video script outline (for a 20–30s ad)"
    : ""
}
`;
}

// Mock generator for now (you can replace this with a real API call)
function mockGenerateAds(payload) {
  const {
    product,
    audience,
    platform,
    goal,
    tone,
    length,
    includeEmojis,
    includeHashtags,
    includeVideoScript,
  } = payload;

  const emojiSet = includeEmojis ? " 🚀🔥✨" : "";
  const hashTagChunk = includeHashtags
    ? (() => {
        if (platform === "TikTok" || platform === "X (Twitter)") {
          return " #ads #marketing #fyp";
        }
        if (platform === "Facebook / Instagram") {
          return " #facebookads #instagramads";
        }
        if (platform === "YouTube") {
          return " #youtubeads";
        }
        if (platform === "Google Ads") {
          return " #searchads";
        }
        if (platform === "LinkedIn") {
          return " #b2bmarketing";
        }
        return " #ads";
      })()
    : "";

  const baseAudience =
    audience.trim() ||
    "your ideal customers who are actively looking for what you offer";

  const lengthDescriptor =
    length === "Short"
      ? "Keep it punchy and to the point."
      : length === "Long"
      ? "Lean into story and emotion."
      : "Balance clarity with personality.";

  const angleTemplates = [
    {
      angle: "Pain → Solution",
      headlinePrefix: "Stop",
      cta: goal === "Sales" ? "Shop Now" : goal === "Leads" ? "Get Started" : "Learn More",
    },
    {
      angle: "Before / After",
      headlinePrefix: "Imagine",
      cta:
        goal === "Bookings"
          ? "Book Your Spot"
          : goal === "App installs"
          ? "Download the App"
          : "Try It Today",
    },
    {
      angle: "Proof & Authority",
      headlinePrefix: "Why",
      cta: "See How It Works",
    },
  ];

  const videoScriptOutline = (variantIndex) =>
    includeVideoScript
      ? [
          `Hook (${variantIndex + 1}): Pattern interrupt that calls out ${
            baseAudience
          }.`,
          "Problem: 1–2 quick lines showing the frustration or missed opportunity.",
          `Solution: Introduce your product as the fast, easy way to solve it.`,
          "Social proof: Mention results, reviews, or proof points.",
          "CTA: Direct, simple invitation to click, book, or buy.",
        ]
      : null;

  const variants = angleTemplates.map((angleObj, index) => {
    const primary = (() => {
      const base = `If ${baseAudience} are still struggling without ${product
        .trim()
        .toLowerCase()}, they’re leaving results on the table.${emojiSet}`;

      const bodyA =
        tone === "Edgy"
          ? ` You’re not here to play it safe—you’re here to win. That means ads that stop the scroll and move people to ${goal.toLowerCase()}.`
          : tone === "Luxury"
          ? ` They want premium quality and a seamless experience—and that’s exactly what your brand delivers.`
          : tone === "UGC-style"
          ? ` Real people. Real reactions. Real results. Show them what happens when they finally discover you.`
          : tone === "Story-based"
          ? ` Tell the story of someone just like them—and how everything changed once they tried your offer.`
          : ` Make it clear, confident, and benefit-driven so they instantly understand why this matters.`;

      const lengthTail =
        length === "Short"
          ? ` In one tight, high-impact paragraph, highlight the core benefit and invite them to take action.${emojiSet}`
          : length === "Long"
          ? ` Build a mini narrative: call out the problem, agitate it slightly, then present your product as the clear, low-friction solution with 2–3 specific benefits.${emojiSet}`
          : ` Use 2–3 concise sentences to bridge from their current frustration to your solution, focusing on clarity and outcomes.${emojiSet}`;

      return base + bodyA + " " + lengthTail + hashTagChunk;
    })();

    const headline = (() => {
      const cleanProduct =
        product.trim().length > 60
          ? product.trim().slice(0, 57) + "..."
          : product.trim();
      const prefix = angleObj.headlinePrefix;

      if (angleObj.angle === "Pain → Solution") {
        return `${prefix} wasting ad spend—start converting with ${cleanProduct}`;
      }
      if (angleObj.angle === "Before / After") {
        return `${prefix} your life with ${cleanProduct} in the mix`;
      }
      return `${prefix} ${baseAudience} choose ${cleanProduct} over other options`;
    })();

    const description =
      angleObj.angle === "Pain → Solution"
        ? `Call out the biggest friction your audience feels right now, then position your offer as the obvious next step.`
        : angleObj.angle === "Before / After"
        ? `Paint a quick before/after contrast so they can see the transformation your product delivers.`
        : `Highlight specific proof points—results, reviews, or milestones—that show your offer actually works.`;

    const scriptOutline = videoScriptOutline(index);

    return {
      variationIndex: index + 1,
      angle: angleObj.angle,
      platform,
      goal,
      tone,
      length,
      primary,
      headline,
      description,
      cta: angleObj.cta,
      scriptOutline,
    };
  });

  return variants;
}

// Render result cards into the DOM
function renderResults(variants, { includeVideoScript }) {
  const resultsList = $("#resultsList");
  const placeholder = $(".results-placeholder");
  if (!resultsList) return;

  // Remove placeholder if present
  if (placeholder) {
    placeholder.remove();
  }

  resultsList.innerHTML = "";

  variants.forEach((v) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const header = document.createElement("div");
    header.className = "result-header";

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = `Variation ${v.variationIndex} · ${v.angle}`;

    const meta = document.createElement("div");
    meta.className = "result-meta";
    meta.textContent = `${v.platform} · ${v.tone} · ${v.goal}`;

    header.appendChild(title);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "result-body";

    const primaryLabel = document.createElement("div");
    primaryLabel.className = "result-label";
    primaryLabel.textContent = "Primary Text";

    const primaryText = document.createElement("p");
    primaryText.textContent = v.primary;

    const headlineLabel = document.createElement("div");
    headlineLabel.className = "result-label";
    headlineLabel.textContent = "Headline";

    const headlineText = document.createElement("p");
    headlineText.textContent = v.headline;

    const descLabel = document.createElement("div");
    descLabel.className = "result-label";
    descLabel.textContent = "Description / Caption";

    const descText = document.createElement("p");
    descText.textContent = v.description;

    const ctaLabel = document.createElement("div");
    ctaLabel.className = "result-label";
    ctaLabel.textContent = "Call to Action";

    const ctaText = document.createElement("p");
    ctaText.textContent = v.cta;

    body.appendChild(primaryLabel);
    body.appendChild(primaryText);
    body.appendChild(headlineLabel);
    body.appendChild(headlineText);
    body.appendChild(descLabel);
    body.appendChild(descText);
    body.appendChild(ctaLabel);
    body.appendChild(ctaText);

    if (includeVideoScript && v.scriptOutline) {
      const scriptLabel = document.createElement("div");
      scriptLabel.className = "result-label";
      scriptLabel.textContent = "Video Script Outline";

      const scriptList = document.createElement("ul");
      scriptList.style.margin = "0.15rem 0 0.1rem";
      scriptList.style.paddingLeft = "1.1rem";
      scriptList.style.fontSize = "0.82rem";
      scriptList.style.color = "#9ca3af";

      v.scriptOutline.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        scriptList.appendChild(li);
      });

      body.appendChild(scriptLabel);
      body.appendChild(scriptList);
    }

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const copyPrimaryBtn = document.createElement("button");
    copyPrimaryBtn.className = "btn btn-pill btn-mini";
    copyPrimaryBtn.type = "button";
    copyPrimaryBtn.textContent = "Copy Primary";

    const copyAllBtn = document.createElement("button");
    copyAllBtn.className = "btn btn-outline btn-mini";
    copyAllBtn.type = "button";
    copyAllBtn.textContent = "Copy All";

    // Copy handlers
    copyPrimaryBtn.addEventListener("click", () => {
      copyToClipboard(v.primary, copyPrimaryBtn);
    });

    copyAllBtn.addEventListener("click", () => {
      const fullBlock = [
        `Primary: ${v.primary}`,
        `Headline: ${v.headline}`,
        `Description: ${v.description}`,
        `CTA: ${v.cta}`,
        includeVideoScript && v.scriptOutline
          ? `Video Script Outline:\n- ${v.scriptOutline.join("\n- ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      copyToClipboard(fullBlock, copyAllBtn);
    });

    actions.appendChild(copyPrimaryBtn);
    actions.appendChild(copyAllBtn);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(actions);

    resultsList.appendChild(card);
  });
}

function copyToClipboard(text, buttonEl) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        animateCopyButton(buttonEl);
        showToast("Copied to clipboard");
      })
      .catch(() => {
        fallbackCopy(text, buttonEl);
      });
  } else {
    fallbackCopy(text, buttonEl);
  }
}

function fallbackCopy(text, buttonEl) {
  try {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    temp.style.pointerEvents = "none";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    animateCopyButton(buttonEl);
    showToast("Copied to clipboard");
  } catch (err) {
    console.error("Copy failed:", err);
  }
}

function animateCopyButton(buttonEl) {
  if (!buttonEl) return;
  const originalText = buttonEl.textContent;
  buttonEl.textContent = "Copied!";
  buttonEl.style.transform = "translateY(-1px) scale(1.03)";

  setTimeout(() => {
    buttonEl.textContent = originalText;
    buttonEl.style.transform = "";
  }, 1200);
}

// ===============================
// Form Handling & Mock "API" Flow
// ===============================

function initGeneratorForm() {
  const form = $("#adcraft-form");
  const resultsSection = $("#resultsSection");
  const generateButton = $("#generateButton");

  if (!form || !resultsSection || !generateButton) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const productInput = $("#productInput");
    if (!productInput.value.trim()) {
      productInput.focus();
      productInput.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Please describe your product or service first.");
      return;
    }

    const payload = {
      product: productInput.value,
      audience: $("#audienceInput").value,
      platform: $("#platformInput").value,
      goal: $("#goalInput").value,
      tone: $("#toneInput").value,
      length: $("#lengthInput").value,
      includeEmojis: $("#emojisInput").checked,
      includeHashtags: $("#hashtagsInput").checked,
      includeVideoScript: $("#videoScriptInput").checked,
    };

    const prompt = buildPromptFromInputs(payload);
    console.log("Prompt that would be sent to your AI API:\n", prompt);

    // Set loading state
    resultsSection.setAttribute("aria-busy", "true");
    generateButton.disabled = true;
    generateButton.textContent = "Generating…";

    // While we use a mock generator, simulate network latency with setTimeout.
    // When you plug in a real API:
    // - Replace the setTimeout + mockGenerateAds() call
    // - Call your backend / AI provider instead, then pass parsed variants to renderResults()
    setTimeout(() => {
      try {
        const variants = mockGenerateAds(payload);
        renderResults(variants, {
          includeVideoScript: payload.includeVideoScript,
        });
      } finally {
        resultsSection.setAttribute("aria-busy", "false");
        generateButton.disabled = false;
        generateButton.textContent = "Generate Ad Variations";
      }
    }, 700);
  });
}

// ===============================
// Init
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initFooterYear();
  initGeneratorForm();
});
 