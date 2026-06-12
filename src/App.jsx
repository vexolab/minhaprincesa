import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarHeart,
  CloudSun,
  Copy,
  Download,
  FileUp,
  Heart,
  ImagePlus,
  Loader2,
  MapPin,
  Move,
  Music2,
  Pause,
  PenLine,
  Play,
  Share2,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VALENTINES_STYLE_ID = "blend";
const ROMANTIC_MOODS = [
  {
    id: "mix",
    name: "Tudo que é nosso",
    description: "Mistura cartas, cinema, céu e colagens.",
    preview: "/theme/minimal-dusk-sky.webp",
  },
  {
    id: "letters",
    name: "Carta guardada",
    description: "Papel, luz suave e fotos que parecem lembranças.",
    preview: "/theme/minimal-blush-thread.webp",
  },
  {
    id: "cinema",
    name: "Filme de amor",
    description: "Fotos inteiras, sombras profundas e clima de cena.",
    preview: "/theme/dark-embrace-film.webp",
  },
  {
    id: "starlight",
    name: "Nossa constelação",
    description: "Preto, dourado e noites que ficaram na memória.",
    preview: "/theme/minimal-charcoal-gold.webp",
  },
];
const ROMANTIC_MOOD_IDS = new Set(ROMANTIC_MOODS.map((mood) => mood.id));
const EDITOR_STEPS = [
  { id: "story", name: "Declaração", shortName: "Texto" },
  { id: "moments", name: "Momentos", shortName: "Fotos" },
  { id: "visual", name: "Visual", shortName: "Visual" },
  { id: "music", name: "Música", shortName: "Música" },
];
const ROMANTIC_SCENES = {
  mix: {
    opening: "/theme/minimal-charcoal-gold.webp",
    openingTone: "dark",
    openingOverlay: "bg-[linear-gradient(180deg,rgba(8,7,6,0.12),rgba(8,7,6,0.58))]",
    time: "/theme/minimal-dusk-sky.webp",
    acts: [
      "/theme/minimal-oxblood-paper.webp",
      "/theme/scrapbook-roses.webp",
      "/theme/minimal-charcoal-gold.webp",
      "/theme/analog-worktable.webp",
    ],
    actTone: "dark",
    future: "/theme/minimal-window-light.webp",
    futureTone: "light",
    final: "/theme/burgundy-velvet.webp",
    finalTone: "dark",
  },
  letters: {
    opening: "/theme/minimal-blush-thread.webp",
    openingTone: "light",
    openingOverlay: "bg-[#fffaf1]/18",
    time: "/theme/burgundy-velvet.webp",
    acts: [
      "/theme/minimal-window-light.webp",
      "/theme/pressed-flower-letter.webp",
      "/theme/minimal-blush-thread.webp",
      "/theme/ivory-roses-painting.webp",
    ],
    actTone: "light",
    future: "/theme/minimal-window-light.webp",
    futureTone: "light",
    final: "/theme/pressed-flower-letter.webp",
    finalTone: "light",
  },
  cinema: {
    opening: "/theme/dark-embrace-film.webp",
    openingTone: "dark",
    openingOverlay: "bg-[linear-gradient(180deg,rgba(8,4,7,0.24),rgba(8,4,7,0.82))]",
    time: "/theme/burgundy-velvet.webp",
    acts: [
      "/theme/dark-embrace-film.webp",
      "/theme/burgundy-velvet.webp",
      "/theme/analog-worktable.webp",
      "/theme/midnight-garden.webp",
    ],
    actTone: "dark",
    future: "/theme/minimal-dusk-sky.webp",
    futureTone: "dark",
    final: "/theme/dark-embrace-film.webp",
    finalTone: "dark",
  },
  starlight: {
    opening: "/theme/minimal-charcoal-gold.webp",
    openingTone: "dark",
    openingOverlay: "bg-[linear-gradient(180deg,rgba(5,5,4,0.04),rgba(5,5,4,0.56))]",
    time: "/theme/minimal-dusk-sky.webp",
    acts: [
      "/theme/minimal-charcoal-gold.webp",
      "/theme/midnight-garden.webp",
      "/theme/minimal-dusk-sky.webp",
      "/theme/minimal-oxblood-paper.webp",
    ],
    actTone: "dark",
    future: "/theme/minimal-charcoal-gold.webp",
    futureTone: "dark",
    final: "/theme/midnight-garden.webp",
    finalTone: "dark",
  },
};

const MUSIC_TRACKS = [
  {
    id: "aurora",
    name: "Aurora de Domingo",
    description: "Piano doce, leve e bem emocional.",
    bpm: 76,
    wave: "sine",
    lead: "triangle",
    pad: "sine",
    gain: 0.062,
    progression: [
      [60, 64, 67, 72],
      [57, 60, 64, 69],
      [53, 57, 60, 64],
      [55, 59, 62, 67],
    ],
    bass: [48, 45, 41, 43],
    arp: [0, 1, 2, 3, 2, 1, 0, 2],
    melody: [72, null, 71, 69, null, 67, 69, null, 72, null, 76, 74, null, 72, 71, null],
  },
  {
    id: "serenata",
    name: "Serenata Baixinha",
    description: "Valsa sintética, íntima, com clima de carta.",
    bpm: 92,
    wave: "triangle",
    lead: "sine",
    pad: "triangle",
    gain: 0.052,
    progression: [
      [62, 65, 69, 74],
      [59, 62, 65, 71],
      [55, 59, 62, 67],
      [57, 60, 64, 69],
    ],
    bass: [50, 47, 43, 45],
    arp: [0, 2, 1, 2, 3, 2, 1, 2],
    melody: [74, 72, null, 69, 71, null, 72, null, 74, 76, null, 72, 69, null, 67, null],
  },
  {
    id: "neon",
    name: "Noite Neon",
    description: "Mais Wrapped: pulsante, colorida e cinematográfica.",
    bpm: 104,
    wave: "sawtooth",
    lead: "square",
    pad: "triangle",
    gain: 0.044,
    progression: [
      [49, 56, 61, 65],
      [52, 56, 59, 64],
      [54, 58, 61, 66],
      [47, 54, 59, 63],
    ],
    bass: [37, 40, 42, 35],
    arp: [0, 1, 2, 1, 3, 2, 1, 2],
    melody: [73, null, 76, null, 78, 76, null, 73, null, 71, 73, null, 76, null, 78, null],
  },
  {
    id: "jardim",
    name: "Jardim Suspenso",
    description: "Sinos suaves e camada ambiente para fotos delicadas.",
    bpm: 68,
    wave: "sine",
    lead: "triangle",
    pad: "sine",
    gain: 0.055,
    progression: [
      [64, 67, 71, 76],
      [60, 64, 67, 72],
      [57, 60, 64, 69],
      [59, 62, 67, 71],
    ],
    bass: [52, 48, 45, 47],
    arp: [3, 2, 1, 0, 1, 2, 3, 2],
    melody: [76, null, 74, null, 72, 71, null, 69, 71, null, 72, null, 74, null, 76, null],
  },
];

const TRACK_BY_ID = Object.fromEntries(MUSIC_TRACKS.map((track) => [track.id, track]));
const MAX_IMAGE_EDGE = 1400;
const IMAGE_QUALITY = 0.78;
const DRAFT_DB_NAME = "nossa-historia-drafts";
const DRAFT_DB_VERSION = 1;
const DRAFT_STORE = "drafts";
const MAIN_DRAFT_ID = "main";
const LOCAL_AUDIO_DRAFT_ID = "local-audio";
const STORY_ACTS = [
  {
    id: "beginning",
    title: "Onde tudo começou",
    subtitle: "Antes de existir a gente, existiu aquele primeiro instante.",
  },
  {
    id: "love",
    title: "Quando virou amor",
    subtitle: "Os dias em que eu percebi que você já morava em mim.",
  },
  {
    id: "home",
    title: "O que construímos",
    subtitle: "A rotina, as viagens, a família e o nosso jeito de ser casa.",
  },
  {
    id: "future",
    title: "O que ainda quero viver",
    subtitle: "Porque a parte mais bonita também é tudo que ainda vem.",
  },
];
const MOMENT_LAYOUTS = [
  { id: "photo", label: "Foto principal" },
  { id: "quote", label: "Frase cinematográfica" },
  { id: "number", label: "Número marcante" },
  { id: "letter", label: "Carta íntima" },
];
const MOMENT_LAYOUT_CYCLE = ["photo", "quote", "number", "letter"];
const BREATH_PRESETS = [
  {
    id: "love",
    title: "O que eu amo em você",
    eyebrow: "Uma pausa só para te lembrar",
    background: "/theme/pressed-flower-letter.webp",
    light: true,
  },
  {
    id: "us",
    title: "Uma verdade sobre nós",
    eyebrow: "No meio das nossas memórias",
    background: "/theme/minimal-blush-thread.webp",
    light: true,
  },
  {
    id: "promise",
    title: "Uma promessa para você",
    eyebrow: "Daqui para frente",
    background: "/theme/minimal-charcoal-gold.webp",
    light: false,
  },
  {
    id: "feeling",
    title: "Só para você saber",
    eyebrow: "Sem foto. Só sentimento.",
    background: "/theme/burgundy-velvet.webp",
    light: false,
  },
];
const BREATH_PRESET_BY_ID = Object.fromEntries(BREATH_PRESETS.map((preset) => [preset.id, preset]));

const initialStory = {
  fromName: "",
  toName: "",
  city: "",
  introMessage: "",
  finalMessage: "",
  audioSource: "synth",
  youtubeUrl: "",
  autoAdvance: false,
  reasons: ["", "", ""],
  futureMessage: "",
  moodId: "mix",
  styleId: VALENTINES_STYLE_ID,
  trackId: "aurora",
  collagePhotos: [],
  moments: [
    {
      id: "moment-1",
      kind: "moment",
      photo: "",
      date: "",
      title: "",
      text: "",
      weather: null,
      actId: "",
      layout: "",
      focalX: 50,
      focalY: 50,
      zoom: 1,
    },
  ],
};

const heartSeeds = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${(index * 29 + 11) % 96}%`,
  delay: `${(index % 8) * 0.42}s`,
  duration: `${5 + (index % 6) * 0.34}s`,
  drift: `${index % 2 === 0 ? "" : "-"}${18 + (index % 5) * 9}px`,
}));
const constellationStars = Array.from({ length: 38 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 84)}%`,
  top: `${7 + ((index * 53) % 80)}%`,
  size: `${2 + (index % 4)}px`,
  delay: `${(index % 7) * 0.28}s`,
}));

function createMoment() {
  return {
    id: crypto?.randomUUID?.() ?? `moment-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: "moment",
    photo: "",
    date: "",
    title: "",
    text: "",
    weather: null,
    actId: "",
    layout: "",
    focalX: 50,
    focalY: 50,
    zoom: 1,
  };
}

function createBreath() {
  return {
    id: crypto?.randomUUID?.() ?? `breath-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind: "breath",
    breathStyle: "love",
    title: "O que eu amo em você",
    text: "",
  };
}

function isBreath(entry) {
  return entry?.kind === "breath";
}

function normalizeStory(story) {
  let photoIndex = 0;
  const safeMoments = [...(story.moments ?? [])].flatMap((entry) => {
    if (isBreath(entry)) {
      const text = entry.text?.trim?.() ?? "";
      if (!text) return [];
      const preset = BREATH_PRESET_BY_ID[entry.breathStyle] ?? BREATH_PRESETS[0];
      return [{
        id: entry.id,
        kind: "breath",
        breathStyle: preset.id,
        title: entry.title?.trim?.() || preset.title,
        text,
      }];
    }

    if (!entry.title?.trim?.() || !entry.photo) return [];
    const index = photoIndex;
    photoIndex += 1;
    return [{
      id: entry.id,
      kind: "moment",
      photo: entry.photo,
      date: entry.date ?? "",
      title: entry.title.trim(),
      text: entry.text?.trim?.() ?? "",
      weather: entry.weather ?? null,
      actId: STORY_ACTS.some((act) => act.id === entry.actId) ? entry.actId : "",
      layout: MOMENT_LAYOUTS.some((layout) => layout.id === entry.layout)
        ? entry.layout
        : MOMENT_LAYOUT_CYCLE[index % MOMENT_LAYOUT_CYCLE.length],
      focalX: Math.min(100, Math.max(0, Number(entry.focalX) || 50)),
      focalY: Math.min(100, Math.max(0, Number(entry.focalY) || 50)),
      zoom: Math.min(1.8, Math.max(1, Number(entry.zoom) || 1)),
    }];
  });

  return {
    fromName: story.fromName.trim(),
    toName: story.toName.trim(),
    city: story.city?.trim?.() ?? "",
    introMessage: story.introMessage?.trim?.() ?? "",
    finalMessage: story.finalMessage?.trim?.() ?? "",
    audioSource: ["synth", "local", "youtube"].includes(story.audioSource) ? story.audioSource : "synth",
    youtubeUrl: story.youtubeUrl?.trim?.() ?? "",
    autoAdvance: Boolean(story.autoAdvance),
    reasons: (story.reasons ?? ["", "", ""]).slice(0, 3).map((reason) => reason?.trim?.() ?? ""),
    futureMessage: story.futureMessage?.trim?.() ?? "",
    moodId: ROMANTIC_MOOD_IDS.has(story.moodId) ? story.moodId : "mix",
    styleId: VALENTINES_STYLE_ID,
    trackId: TRACK_BY_ID[story.trackId] ? story.trackId : "aurora",
    collagePhotos: (story.collagePhotos ?? []).filter(Boolean),
    moments: safeMoments,
  };
}

function sortMoments(moments) {
  return [...moments];
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatWeekday(dateValue) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date(`${dateValue}T12:00:00`));
}

function formatDateWithWeekday(dateValue) {
  if (!dateValue) return "";
  const weekday = formatWeekday(dateValue);
  const date = formatDate(dateValue);
  return weekday ? `${weekday}, ${date}` : date;
}

function getFirstChronologicalDate(moments) {
  return moments.reduce((firstDate, moment) => {
    if (!moment.date) return firstDate;
    if (!firstDate || moment.date < firstDate) return moment.date;
    return firstDate;
  }, "");
}

function getWeatherLabel(code) {
  if (code === 0) return "ceu limpo";
  if ([1, 2].includes(code)) return "ceu aberto com nuvens";
  if (code === 3) return "dia nublado";
  if ([45, 48].includes(code)) return "neblina";
  if ([51, 53, 55, 56, 57].includes(code)) return "garoa";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "chuva";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "neve";
  if ([95, 96, 99].includes(code)) return "tempestade";
  return "clima guardado na memoria";
}

function getWeatherLine(moment) {
  if (!moment.weather) return "";
  const temp = Number.isFinite(moment.weather.temp) ? `${Math.round(moment.weather.temp)}C` : "";
  const rain = Number.isFinite(moment.weather.precipitation) && moment.weather.precipitation > 0.2 ? " com chuva" : "";
  return [getWeatherLabel(moment.weather.code), temp].filter(Boolean).join(", ") + rain;
}

function getMomentMeta(moment) {
  const weekday = formatWeekday(moment.date);
  const weatherLine = getWeatherLine(moment);
  return [weekday, weatherLine].filter(Boolean).join(" | ");
}

function lowercaseFirst(value) {
  if (!value) return "";
  return value.charAt(0).toLocaleLowerCase("pt-BR") + value.slice(1);
}

function makeIntroCopy(story, moments) {
  const firstMoment = moments.find((moment) => !isBreath(moment) && (moment.title || moment.date));
  const place = story.city ? ` em ${story.city}` : "";
  const firstReference = firstMoment?.date ? `desde ${formatDate(firstMoment.date)}` : "desde que a gente virou nos";
  return `${story.toName || "Meu amor"}, eu fiz essa retrospectiva para te lembrar que a nossa historia nao mora so nas fotos. Ela mora nos detalhes: no dia, no clima, nos caminhos${place}, e em tudo que ficou comigo ${firstReference}.`;
}

function makeFinalCopy(story, moments) {
  const count = moments.filter((moment) => !isBreath(moment)).length;
  return `${story.toName || "Meu amor"}, depois de ${count} ${count === 1 ? "momento" : "momentos"}, eu so tenho uma certeza bonita: se a vida me desse tudo de novo, eu ainda procuraria voce no meio do mundo. Com amor, ${story.fromName || "eu"}.`;
}

function makeMomentCopy(story, moment, index, moments) {
  const title = lowercaseFirst(moment.title || "esse momento");
  const weekday = formatWeekday(moment.date);
  const weather = getWeatherLine(moment);
  const firstDate = getFirstChronologicalDate(moments);
  const dayNumber = daysBetween(firstDate, moment.date);
  const opening = weekday
    ? `Era ${weekday}${weather ? `, com ${weather}` : ""}`
    : weather
      ? `Foi um daqueles momentos, com ${weather}`
      : "Foi um daqueles momentos";
  const relationshipContext = Number.isFinite(dayNumber)
    ? `, no ${relationshipDayLabel(dayNumber).toLocaleLowerCase("pt-BR")}`
    : "";
  const closings = [
    `e eu guardei ${title} como quem guarda uma luz acesa por dentro.`,
    `e foi ali que mais uma parte da minha vida comecou a ter o seu nome.`,
    `e ate hoje esse pedaco da gente volta em mim com um sorriso bobo.`,
    `e eu entendi que algumas memorias nao passam: elas ficam morando na gente.`,
  ];

  return `${opening}${relationshipContext}. ${closings[index % closings.length]}`;
}

async function fetchWeatherForStory(city, moments) {
  const filledMoments = moments.filter((moment) => moment.date);
  if (!city.trim()) throw new Error("Informe uma cidade para buscar o clima.");
  if (!filledMoments.length) throw new Error("Adicione datas aos momentos antes de buscar o clima.");

  const today = new Date().toISOString().slice(0, 10);
  const pastDates = filledMoments.map((moment) => moment.date).filter((date) => date <= today).sort();
  if (!pastDates.length) throw new Error("O clima historico so aparece para datas que ja passaram.");

  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", city.trim());
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "pt");
  geoUrl.searchParams.set("format", "json");
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) throw new Error("Nao consegui localizar essa cidade.");
  const geoData = await geoResponse.json();
  const place = geoData.results?.[0];
  if (!place) throw new Error("Nao encontrei essa cidade. Tente algo como Sao Paulo ou Rio de Janeiro.");

  const archiveUrl = new URL("https://archive-api.open-meteo.com/v1/archive");
  archiveUrl.searchParams.set("latitude", String(place.latitude));
  archiveUrl.searchParams.set("longitude", String(place.longitude));
  archiveUrl.searchParams.set("start_date", pastDates[0]);
  archiveUrl.searchParams.set("end_date", pastDates[pastDates.length - 1]);
  archiveUrl.searchParams.set("daily", "weather_code,temperature_2m_mean,precipitation_sum");
  archiveUrl.searchParams.set("timezone", "auto");
  const archiveResponse = await fetch(archiveUrl);
  if (!archiveResponse.ok) throw new Error("Nao consegui buscar o clima dessas datas.");
  const archiveData = await archiveResponse.json();

  const weatherByDate = new Map();
  archiveData.daily?.time?.forEach((date, index) => {
    weatherByDate.set(date, {
      code: archiveData.daily.weather_code?.[index],
      temp: archiveData.daily.temperature_2m_mean?.[index],
      precipitation: archiveData.daily.precipitation_sum?.[index],
      city: [place.name, place.admin1, place.country_code].filter(Boolean).join(", "),
    });
  });

  return { place, weatherByDate };
}

function daysBetween(startDate, currentDate) {
  if (!startDate || !currentDate) return null;
  const start = new Date(`${startDate}T12:00:00`).getTime();
  const current = new Date(`${currentDate}T12:00:00`).getTime();
  return Math.max(1, Math.round((current - start) / 86400000) + 1);
}

function totalDays(moments) {
  const firstDate = getFirstChronologicalDate(moments);
  if (!firstDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  return daysBetween(firstDate, today);
}

function timeTogetherParts(startDate) {
  if (!startDate) return { years: 0, months: 0, days: 1 };

  const start = new Date(`${startDate}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const end = today < start ? start : today;
  let years = end.getFullYear() - start.getFullYear();
  let cursor = new Date(start);
  cursor.setFullYear(start.getFullYear() + years);

  if (cursor > end) {
    years -= 1;
    cursor = new Date(start);
    cursor.setFullYear(start.getFullYear() + years);
  }

  let months = 0;
  while (months < 11) {
    const next = new Date(cursor);
    next.setMonth(cursor.getMonth() + 1);
    if (next > end) break;
    cursor = next;
    months += 1;
  }

  const days = Math.max(0, Math.floor((end.getTime() - cursor.getTime()) / 86400000));
  return { years, months, days };
}

function durationLabel(value, singular, plural) {
  return value === 1 ? singular : plural;
}

function getMomentImageStyle(moment, { xOffset = 0, yOffset = 0, zoomBoost = 0 } = {}) {
  const focalX = Math.min(100, Math.max(0, (moment.focalX ?? 50) + xOffset));
  const focalY = Math.min(100, Math.max(0, (moment.focalY ?? 50) + yOffset));
  const zoom = Math.min(2.2, (moment.zoom ?? 1) + zoomBoost);
  const endZoom = Math.min(2.24, zoom + 0.055);

  return {
    "--photo-scale": zoom,
    "--photo-scale-end": endZoom,
    objectPosition: `${focalX}% ${focalY}%`,
    transform: `scale(${zoom})`,
  };
}

function getRomanticScene(moodId) {
  return ROMANTIC_SCENES[moodId] ?? ROMANTIC_SCENES.mix;
}

function buildPresentationSequence(story) {
  const sequence = [{ id: "opening", type: "opening" }];
  const entries = story.moments ?? [];
  const photoMoments = entries.filter((entry) => !isBreath(entry));
  const hasDatedMoments = photoMoments.some((moment) => moment.date);
  const hasCustomBreaths = entries.some(isBreath);
  let photoIndex = 0;
  let lastActId = "";

  const hasCollagePhotos = (story.collagePhotos ?? []).filter(Boolean).length > 0;
  if (hasDatedMoments) {
    sequence.push({ id: "time-together", type: "time" });
  }
  if (hasCollagePhotos || hasDatedMoments) {
    sequence.push({ id: "collage", type: "collage" });
  }

  entries.forEach((entry, entryIndex) => {
    if (isBreath(entry)) {
      sequence.push({ id: `breath-${entry.id}`, type: "breath", breath: entry });
      return;
    }

    const act = STORY_ACTS.find((item) => item.id === entry.actId);
    if (act && entry.actId !== lastActId) {
      sequence.push({ id: `act-${act.id}-${entryIndex}`, type: "act", act });
    }
    lastActId = entry.actId || "";

    sequence.push({
      id: `moment-${entry.id}`,
      type: "moment",
      moment: entry,
      momentIndex: photoIndex,
      photoMoments,
    });
    photoIndex += 1;
  });

  if (!hasCustomBreaths && story.reasons?.some(Boolean)) {
    sequence.push({ id: "reasons", type: "reasons" });
  }

  if (story.futureMessage) {
    sequence.push({ id: "future-message", type: "future" });
  }

  const allPhotos = entries.filter((m) => !isBreath(m) && m.photo);
  if (allPhotos.length > 0) {
    sequence.push({ id: "photo-mosaic", type: "mosaic" });
  }
  sequence.push({ id: "secret-letter", type: "secret" });
  sequence.push({ id: "final", type: "final" });
  return sequence;
}

function getSlideDuration(slide) {
  if (!slide) return 7000;
  if (slide.type === "opening") return 7500;
  if (slide.type === "time") return 6200;
  if (slide.type === "collage") return 6800;
  if (slide.type === "mosaic") return 8500;
  if (slide.type === "act") return 3800;
  if (slide.type === "breath") return Math.min(9000, Math.max(5600, (slide.breath.text?.length ?? 0) * 42));
  if (slide.type === "reasons") return 7200;
  if (slide.type === "future") return 6500;
  if (slide.type === "secret") return 10000;
  if (slide.type === "moment") {
    const readingTime = Math.ceil((slide.moment.text?.length ?? 0) / 18) * 1000;
    return Math.min(12000, Math.max(6500, readingTime + 3800));
  }
  return 9000;
}

function encodeStory(story) {
  const normalized = normalizeStory(story);
  if (normalized.audioSource === "local") {
    normalized.audioSource = "synth";
  }
  const json = JSON.stringify(normalized);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeStory(value) {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  return {
    ...initialStory,
    ...parsed,
    moments: parsed.moments?.length ? parsed.moments : initialStory.moments,
  };
}

function buildShareUrl(story) {
  const encoded = encodeStory(story);
  return `${window.location.origin}${window.location.pathname}?story=${encoded}`;
}

function estimateShareUrlLength(story) {
  const prefix = typeof window === "undefined" ? 32 : `${window.location.origin}${window.location.pathname}?story=`.length;
  const textLength =
    (story.fromName?.length ?? 0) +
    (story.toName?.length ?? 0) +
    (story.city?.length ?? 0) +
    (story.introMessage?.length ?? 0) +
    (story.finalMessage?.length ?? 0) +
    (story.youtubeUrl?.length ?? 0) +
    520;
  const momentsLength = (story.moments ?? []).reduce((sum, moment) => {
    return (
      sum +
      (moment.photo?.length ?? 0) +
      (moment.date?.length ?? 0) +
      (moment.title?.length ?? 0) +
      (moment.text?.length ?? 0) +
      JSON.stringify(moment.weather ?? "").length +
      140
    );
  }, 0);

  return prefix + Math.ceil((textLength + momentsLength) * 1.35);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Nao consegui ler essa foto."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Nao consegui preparar essa foto."));
    image.src = dataUrl;
  });
}

async function compressImageFile(file) {
  const original = await readFileAsDataUrl(file);
  if (file.type === "image/gif") return original;

  try {
    const image = await loadImage(original);
    const ratio = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * ratio));
    const height = Math.max(1, Math.round(image.height * ratio));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#140713";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const compressed = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    return compressed.length < original.length ? compressed : original;
  } catch {
    return original;
  }
}

function pluralizeDay(value) {
  return `${value} ${value === 1 ? "dia" : "dias"}`;
}

function relationshipDayLabel(value) {
  if (!Number.isFinite(value)) return "Uma memória nossa";
  return value === 1 ? "Nosso primeiro dia" : `${value} dias juntos`;
}

function getYouTubeId(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "").slice(0, 32);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] ?? "";
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] ?? "";
      return parsed.searchParams.get("v") ?? "";
    }
  } catch {
    return "";
  }

  return "";
}

function readAudioFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Escolha um arquivo de audio."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        dataUrl: String(reader.result ?? ""),
        name: file.name,
        size: file.size,
        type: file.type,
      });
    reader.onerror = () => reject(new Error("Nao consegui ler essa musica."));
    reader.readAsDataURL(file);
  });
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(dataUrl ?? "");
  if (!match) return null;

  const mimeType = match[1];
  const isBase64 = Boolean(match[2]);
  const payload = match[3];
  const binary = isBase64 ? atob(payload) : decodeURIComponent(payload);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return { bytes, mimeType };
}

function extensionForMime(mimeType, fallback = "bin") {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/aac": "aac",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
  };
  return extensions[mimeType] ?? fallback;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openDraftDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Este navegador nao permite salvar rascunhos locais."));
      return;
    }

    const request = indexedDB.open(DRAFT_DB_NAME, DRAFT_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Nao consegui abrir o salvamento local."));
  });
}

async function putDraftRecord(record) {
  const db = await openDraftDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFT_STORE, "readwrite");
    const store = transaction.objectStore(DRAFT_STORE);
    store.put(record);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Nao consegui salvar o rascunho."));
    };
  });
}

async function getDraftRecord(id = MAIN_DRAFT_ID) {
  const db = await openDraftDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFT_STORE, "readonly");
    const store = transaction.objectStore(DRAFT_STORE);
    const request = store.get(id);
    request.onsuccess = () => {
      db.close();
      resolve(request.result ?? null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Nao consegui carregar o rascunho."));
    };
  });
}

async function deleteDraftRecord(id = MAIN_DRAFT_ID) {
  const db = await openDraftDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DRAFT_STORE, "readwrite");
    const store = transaction.objectStore(DRAFT_STORE);
    store.delete(id);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Nao consegui apagar o rascunho."));
    };
  });
}

async function fetchPublishedStory() {
  const response = await fetch(`/story.json?ts=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) return null;

  const publication = await response.json();
  if (!publication?.published || !publication.story?.moments?.length) return null;
  return publication;
}

function midiToFreq(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function playNote(ctx, destination, note, time, duration, options = {}) {
  if (!Number.isFinite(note)) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const attack = options.attack ?? 0.025;
  const releaseAt = Math.max(time + attack + 0.02, time + duration);

  osc.type = options.type ?? "sine";
  osc.frequency.setValueAtTime(midiToFreq(note), time);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(options.filter ?? 2400, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(Math.max(options.gain ?? 0.04, 0.0002), time + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  osc.start(time);
  osc.stop(releaseAt + 0.08);
}

function scheduleStep(engine, track) {
  const { ctx, master } = engine;
  const step = engine.step;
  const secondsPerBeat = 60 / track.bpm;
  const stepDuration = secondsPerBeat / 2;
  const bar = Math.floor(step / 8) % track.progression.length;
  const position = step % 8;
  const chord = track.progression[bar];
  const time = engine.nextTime;

  if (position === 0) {
    playNote(ctx, master, track.bass[bar], time, secondsPerBeat * 1.65, {
      type: "sine",
      gain: track.gain * 0.75,
      filter: 820,
      attack: 0.04,
    });

    chord.forEach((note, index) => {
      playNote(ctx, master, note + 12, time + index * 0.012, secondsPerBeat * 3.4, {
        type: track.pad,
        gain: track.gain * 0.34,
        filter: 1300,
        attack: 0.08,
      });
    });
  }

  const arpNote = chord[track.arp[position] % chord.length] + 12;
  playNote(ctx, master, arpNote, time, stepDuration * 0.78, {
    type: track.wave,
    gain: track.gain,
    filter: track.id === "neon" ? 1800 : 2800,
    attack: 0.018,
  });

  const melody = track.melody[step % track.melody.length];
  if (melody && position % 2 === 0) {
    playNote(ctx, master, melody, time + stepDuration * 0.16, secondsPerBeat * 0.92, {
      type: track.lead,
      gain: track.gain * 0.54,
      filter: 3200,
      attack: 0.035,
    });
  }

  engine.nextTime += stepDuration;
  engine.step = (engine.step + 1) % 32;
}

function useLoveSynth() {
  const engineRef = useRef(null);
  const [audioState, setAudioState] = useState({
    playing: false,
    muted: false,
    blocked: false,
    trackId: null,
  });

  const ensureEngine = useCallback(() => {
    if (engineRef.current?.ctx?.state !== "closed") return engineRef.current;
    engineRef.current = null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const delay = ctx.createDelay();
    const feedback = ctx.createGain();
    const wet = ctx.createGain();

    master.gain.value = 0.52;
    delay.delayTime.value = 0.24;
    feedback.gain.value = 0.18;
    wet.gain.value = 0.14;

    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    engineRef.current = {
      ctx,
      master,
      interval: null,
      nextTime: 0,
      step: 0,
      muted: false,
      volume: 0.52,
    };

    return engineRef.current;
  }, []);

  const clearScheduler = useCallback(() => {
    const engine = engineRef.current;
    if (engine?.interval) {
      window.clearInterval(engine.interval);
      engine.interval = null;
    }
  }, []);

  const scheduleAhead = useCallback((engine, track) => {
    while (engine.nextTime < engine.ctx.currentTime + 0.72) {
      scheduleStep(engine, track);
    }
  }, []);

  const play = useCallback(
    async (trackId) => {
      const track = TRACK_BY_ID[trackId] ?? MUSIC_TRACKS[0];
      const engine = ensureEngine();

      if (!engine) {
        setAudioState((current) => ({ ...current, blocked: true }));
        return false;
      }

      try {
        await engine.ctx.resume();
      } catch {
        setAudioState((current) => ({ ...current, playing: false, blocked: true }));
        return false;
      }

      clearScheduler();
      engine.nextTime = engine.ctx.currentTime + 0.08;
      engine.step = 0;

      const tick = () => scheduleAhead(engine, track);
      tick();
      engine.interval = window.setInterval(tick, 110);

      setAudioState((current) => ({
        ...current,
        playing: true,
        blocked: false,
        trackId: track.id,
      }));

      return true;
    },
    [clearScheduler, ensureEngine, scheduleAhead],
  );

  const pause = useCallback(async () => {
    const engine = engineRef.current;
    clearScheduler();
    if (engine?.ctx?.state && engine.ctx.state !== "closed") await engine.ctx.suspend();
    setAudioState((current) => ({ ...current, playing: false }));
  }, [clearScheduler]);

  const toggleMute = useCallback(() => {
    const engine = ensureEngine();
    if (!engine) return;

    const nextMuted = !engine.muted;
    engine.muted = nextMuted;
    engine.master.gain.setTargetAtTime(nextMuted ? 0.0001 : engine.volume, engine.ctx.currentTime, 0.035);
    setAudioState((current) => ({ ...current, muted: nextMuted }));
  }, [ensureEngine]);

  useEffect(
    () => () => {
      clearScheduler();
      const engine = engineRef.current;
      engineRef.current = null;
      if (engine?.ctx?.state && engine.ctx.state !== "closed") {
        engine.ctx.close().catch(() => {});
      }
    },
    [clearScheduler],
  );

  return { audioState, play, pause, toggleMute };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useTypedText(text, active) {
  const reducedMotion = usePrefersReducedMotion();
  const [typed, setTyped] = useState(reducedMotion || !active ? text : "");

  useEffect(() => {
    if (!active || reducedMotion) {
      setTyped(text);
      return undefined;
    }

    setTyped("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 42);

    return () => window.clearInterval(timer);
  }, [active, reducedMotion, text]);

  return { typed, reducedMotion };
}

export default function App() {
  const [mode, setMode] = useState("create");
  const [story, setStory] = useState(initialStory);
  const [slideIndex, setSlideIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const [loadNotice, setLoadNotice] = useState("");
  const [weatherStatus, setWeatherStatus] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [localAudio, setLocalAudio] = useState(null);
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState("Preparando salvamento...");
  const [publishedMode, setPublishedMode] = useState(false);
  const [publishStatus, setPublishStatus] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [booting, setBooting] = useState(true);
  const audio = useLoveSynth();

  useEffect(() => {
    let cancelled = false;

    async function restoreDraftOrLink() {
      const params = new URLSearchParams(window.location.search);
      const encodedStory = params.get("story");
      const isEditorPath = window.location.pathname === "/criar" || params.get("edit") === "1";

      if (encodedStory) {
        try {
          const loaded = decodeStory(encodedStory);
          if (cancelled) return;
          setStory(loaded);
          setMode("present");
          setSlideIndex(0);
          setLoadNotice("História carregada. Toque em Começar nossa história para abrir a apresentação com som.");
          setDraftStatus("História carregada pelo link. Também vou salvar uma cópia neste aparelho.");
        } catch {
          if (cancelled) return;
          setLoadNotice("Não consegui ler esse link. Dá para criar uma nova história por aqui.");
          setDraftStatus("Link inválido. Comece uma nova história ou recupere um rascunho salvo.");
        } finally {
          if (!cancelled) {
            setDraftReady(true);
            setBooting(false);
          }
        }
        return;
      }

      if (!isEditorPath) {
        try {
          const publication = await fetchPublishedStory();
          if (cancelled) return;

          if (publication) {
            setStory({ ...initialStory, ...publication.story });
            setLocalAudio(publication.localAudio ?? null);
            setMode("present");
            setPublishedMode(true);
            setSlideIndex(0);
            setLoadNotice("");
            setDraftStatus("Apresentação publicada.");
            setBooting(false);
            return;
          }
        } catch {
          // No published story yet. The creator flow remains available.
        }
      }

      try {
        const record = await getDraftRecord();
        if (cancelled) return;

        if (record?.story) {
          const audioRecord = record.localAudio?.hasData ? await getDraftRecord(LOCAL_AUDIO_DRAFT_ID) : null;
          setStory({
            ...initialStory,
            ...record.story,
            moments: record.story.moments?.length ? record.story.moments : initialStory.moments,
          });
          setLocalAudio(audioRecord?.localAudio ?? null);
          setLoadNotice("Recuperei seu rascunho salvo neste aparelho.");
          setDraftStatus(`Rascunho recuperado. Último salvamento: ${new Date(record.updatedAt).toLocaleString("pt-BR")}.`);
        } else {
          setDraftStatus("Rascunho novo. Vou salvar automaticamente neste aparelho.");
        }
      } catch (error) {
        if (!cancelled) {
          setDraftStatus(error.message || "Não consegui ativar o salvamento local.");
        }
      } finally {
        if (!cancelled) {
          setDraftReady(true);
          setBooting(false);
        }
      }
    }

    restoreDraftOrLink();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!draftReady) return undefined;

    const timeout = window.setTimeout(async () => {
      try {
        await putDraftRecord({
          id: MAIN_DRAFT_ID,
          story,
          localAudio: localAudio
            ? {
                hasData: true,
                name: localAudio.name,
                size: localAudio.size,
                type: localAudio.type,
              }
            : null,
          updatedAt: new Date().toISOString(),
        });
        setDraftStatus(`Salvo neste aparelho às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`);
      } catch (error) {
        setDraftStatus(error.message || "Não consegui salvar o rascunho neste aparelho.");
      }
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [draftReady, localAudio, story]);

  const orderedMoments = useMemo(() => sortMoments(story.moments), [story.moments]);
  const readyStory = useMemo(() => normalizeStory({ ...story, moments: orderedMoments }), [orderedMoments, story]);
  const canPresent =
    readyStory.fromName &&
    readyStory.toName &&
    readyStory.moments.some((entry) => !isBreath(entry));
  const linkLength = useMemo(() => {
    if (!canPresent) return 0;
    return estimateShareUrlLength(readyStory);
  }, [canPresent, readyStory]);

  if (booting) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#140713] px-6 text-center text-white">
        <div className="grid gap-5">
          <Heart className="mx-auto h-12 w-12 fill-pink-300 text-pink-300" />
          <p className="font-display text-3xl">Preparando uma história especial...</p>
        </div>
      </main>
    );
  }

  function updateStory(field, value) {
    setStory((current) => ({ ...current, [field]: value }));
    setShareStatus("");
  }

  function updateMoment(id, patch) {
    setStory((current) => ({
      ...current,
      moments: current.moments.map((moment) => (moment.id === id ? { ...moment, ...patch } : moment)),
    }));
    setShareStatus("");
  }

  function removeMoment(id) {
    setStory((current) => {
      const nextMoments = current.moments.filter((moment) => moment.id !== id);
      return { ...current, moments: nextMoments.length ? nextMoments : [createMoment()] };
    });
    setShareStatus("");
  }

  function addMoment() {
    setStory((current) => ({ ...current, moments: [...current.moments, createMoment()] }));
  }

  function addBreath() {
    setStory((current) => ({ ...current, moments: [...current.moments, createBreath()] }));
    setShareStatus("");
  }

  function moveMoment(id, direction) {
    setStory((current) => {
      const currentIndex = current.moments.findIndex((moment) => moment.id === id);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= current.moments.length) return current;

      const moments = [...current.moments];
      [moments[currentIndex], moments[targetIndex]] = [moments[targetIndex], moments[currentIndex]];
      return { ...current, moments };
    });
    setShareStatus("");
  }

  async function handlePhoto(id, file) {
    if (!file) return;
    setShareStatus("Otimizando a foto antes de guardar...");

    try {
      const photo = await compressImageFile(file);
      updateMoment(id, { photo });
      setShareStatus(
        `Foto otimizada. Tamanho na historia: ${(photo.length / 1024).toFixed(0)} KB em base64.`,
      );
    } catch {
      setShareStatus("Nao consegui otimizar essa foto. Tente outra imagem.");
    }
  }

  async function handleAddCollagePhoto(file) {
    if (!file) return;
    setShareStatus("Otimizando foto da colagem...");
    try {
      const photo = await compressImageFile(file);
      setStory((current) => ({
        ...current,
        collagePhotos: [...(current.collagePhotos ?? []), photo],
      }));
      setShareStatus(`Foto adicionada à colagem. ${(photo.length / 1024).toFixed(0)} KB.`);
    } catch {
      setShareStatus("Não consegui adicionar essa foto. Tente outra imagem.");
    }
  }

  function removeCollagePhoto(index) {
    setStory((current) => ({
      ...current,
      collagePhotos: (current.collagePhotos ?? []).filter((_, i) => i !== index),
    }));
    setShareStatus("");
  }

  async function handleAudioUpload(file) {
    if (!file) return;
    setShareStatus("Carregando a musica para esta sessao...");

    try {
      const audioFile = await readAudioFile(file);
      await putDraftRecord({
        id: LOCAL_AUDIO_DRAFT_ID,
        localAudio: audioFile,
        updatedAt: new Date().toISOString(),
      });
      setLocalAudio(audioFile);
      setStory((current) => ({ ...current, audioSource: "local" }));
      setShareStatus(
        `Musica carregada: ${audioFile.name}. Ela toca neste aparelho, mas nao entra no link compartilhado.`,
      );
    } catch (error) {
      setShareStatus(error.message || "Nao consegui carregar essa musica.");
    }
  }

  function generateIntro() {
    setStory((current) => ({
      ...current,
      introMessage: makeIntroCopy(current, sortMoments(current.moments)).slice(0, 320),
    }));
    setShareStatus("");
  }

  function generateFinal() {
    setStory((current) => ({
      ...current,
      finalMessage: makeFinalCopy(current, sortMoments(current.moments)).slice(0, 260),
    }));
    setShareStatus("");
  }

  function generateMomentText(id) {
    setStory((current) => {
      const moments = sortMoments(current.moments);
      const target = moments.find((moment) => moment.id === id);
      const index = moments.findIndex((moment) => moment.id === id);
      if (!target) return current;

      return {
        ...current,
        moments: current.moments.map((moment) =>
          moment.id === id ? { ...moment, text: makeMomentCopy(current, target, index, moments).slice(0, 180) } : moment,
        ),
      };
    });
    setShareStatus("");
  }

  async function fillWeather() {
    setWeatherLoading(true);
    setWeatherStatus("Buscando o clima dessas datas...");

    try {
      const { place, weatherByDate } = await fetchWeatherForStory(story.city, orderedMoments);
      setStory((current) => ({
        ...current,
        city: [place.name, place.admin1].filter(Boolean).join(", "),
        moments: current.moments.map((moment) => ({
          ...moment,
          weather: weatherByDate.get(moment.date) ?? moment.weather ?? null,
        })),
      }));
      setWeatherStatus("Clima preenchido. Agora os textos sugeridos conseguem usar esse detalhe.");
      setShareStatus("");
    } catch (error) {
      setWeatherStatus(error.message || "Nao consegui buscar o clima agora.");
    } finally {
      setWeatherLoading(false);
    }
  }

  async function copyShareLink() {
    if (!canPresent) return;
    const url = publishedMode ? `${window.location.origin}/` : buildShareUrl(readyStory);

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setShareStatus(
      url.length > 12000
        ? `Link copiado, mas ficou grande: ${url.length.toLocaleString("pt-BR")} caracteres. Se algum app cortar o link, reduza fotos ou use storage externo.`
        : `Link copiado. Ele ficou com ${url.length.toLocaleString("pt-BR")} caracteres.`,
    );
  }

  async function clearSavedDraft() {
    try {
      await deleteDraftRecord(MAIN_DRAFT_ID);
      await deleteDraftRecord(LOCAL_AUDIO_DRAFT_ID);
      setDraftStatus("Rascunho salvo apagado deste aparelho.");
      setShareStatus("Rascunho local apagado. A história aberta na tela continua aqui até você sair ou recarregar.");
    } catch (error) {
      setDraftStatus(error.message || "Não consegui apagar o rascunho.");
    }
  }

  function downloadDraftBackup() {
    const backup = {
      kind: "nossa-historia-draft",
      version: 1,
      exportedAt: new Date().toISOString(),
      story,
      localAudio,
    };
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    downloadBlob(blob, `nossa-historia-backup-${date}.json`);
    setShareStatus("Backup baixado. Ele guarda textos, fotos, enquadramentos, clima e a música enviada.");
  }

  async function importDraftBackup(file) {
    if (!file) return;
    setShareStatus("Lendo o backup antes de restaurar...");

    try {
      const backup = JSON.parse(await file.text());
      if (backup?.kind !== "nossa-historia-draft" || backup?.version !== 1 || !backup?.story) {
        throw new Error("Este arquivo não é um backup válido do Nossa História.");
      }

      const importedMoments = Array.isArray(backup.story.moments)
        ? backup.story.moments.map((moment) => {
            const fallback = isBreath(moment) ? createBreath() : createMoment();
            return {
              ...fallback,
              ...moment,
              id: moment.id || fallback.id,
            };
          })
        : [];
      const importedStory = {
        ...initialStory,
        ...backup.story,
        moments: importedMoments.length ? importedMoments : [createMoment()],
      };
      const importedAudio = backup.localAudio?.dataUrl ? backup.localAudio : null;
      const importedAt = new Date().toISOString();

      await putDraftRecord({
        id: MAIN_DRAFT_ID,
        story: importedStory,
        localAudio: importedAudio
          ? {
              hasData: true,
              name: importedAudio.name,
              size: importedAudio.size,
              type: importedAudio.type,
            }
          : null,
        updatedAt: importedAt,
      });

      if (importedAudio) {
        await putDraftRecord({
          id: LOCAL_AUDIO_DRAFT_ID,
          localAudio: importedAudio,
          updatedAt: importedAt,
        });
      } else {
        await deleteDraftRecord(LOCAL_AUDIO_DRAFT_ID);
      }

      audio.pause();
      setStory(importedStory);
      setLocalAudio(importedAudio);
      setMode("create");
      setPublishedMode(false);
      setSlideIndex(0);
      setDraftStatus("Backup restaurado e salvo novamente neste aparelho.");
      setShareStatus("Backup importado com sucesso. Confira as fotos e continue editando normalmente.");
      window.history.replaceState(null, "", "/criar");
    } catch (error) {
      setShareStatus(error.message || "Não consegui importar este backup.");
    }
  }

  async function exportForVercel() {
    if (!canPresent) return;
    setPublishing(true);
    setPublishStatus("Preparando fotos, música e configuração...");

    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const publicationStory = normalizeStory(readyStory);
      const publicFolder = zip.folder("public");
      const mediaFolder = publicFolder.folder("media");

      let publicationPhotoIndex = 0;
      publicationStory.moments = publicationStory.moments.map((moment) => {
        if (isBreath(moment)) return moment;
        publicationPhotoIndex += 1;
        const parsed = parseDataUrl(moment.photo);
        if (!parsed) return moment;

        const extension = extensionForMime(parsed.mimeType, "jpg");
        const fileName = `momento-${String(publicationPhotoIndex).padStart(2, "0")}.${extension}`;
        mediaFolder.file(fileName, parsed.bytes, { binary: true });
        return { ...moment, photo: `/media/${fileName}` };
      });

      let publishedAudio = null;
      if (publicationStory.audioSource === "local") {
        const parsedAudio = parseDataUrl(localAudio?.dataUrl);
        if (parsedAudio) {
          const extension = extensionForMime(parsedAudio.mimeType, "mp3");
          const fileName = `nossa-musica.${extension}`;
          mediaFolder.file(fileName, parsedAudio.bytes, { binary: true });
          publishedAudio = {
            dataUrl: `/media/${fileName}`,
            name: localAudio.name ?? fileName,
            type: parsedAudio.mimeType,
          };
        } else {
          publicationStory.audioSource = "synth";
        }
      }

      const publication = {
        published: true,
        version: 1,
        generatedAt: new Date().toISOString(),
        story: publicationStory,
        localAudio: publishedAudio,
      };

      publicFolder.file("story.json", JSON.stringify(publication, null, 2));
      zip.file(
        "LEIA-ME.txt",
        [
          "NOSSA HISTORIA - PACOTE PARA VERCEL",
          "",
          "1. Extraia este ZIP na raiz do projeto.",
          "2. Confirme que existem public/story.json e public/media/.",
          "3. Rode npm run build para testar.",
          "4. Suba o projeto na Vercel.",
          "5. O link principal abre a declaracao. O editor fica em /criar.",
          "",
          "Nao apague src/, package.json ou vercel.json.",
        ].join("\r\n"),
      );

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });
      downloadBlob(blob, "nossa-historia-vercel.zip");
      setPublishStatus("Pacote pronto. Extraia o ZIP na raiz do projeto antes de publicar na Vercel.");
    } catch (error) {
      setPublishStatus(error.message || "Não consegui preparar o pacote de publicação.");
    } finally {
      setPublishing(false);
    }
  }

  async function startPresentation() {
    if (!canPresent) return;
    setStory(readyStory);
    setSlideIndex(0);
    setMode("present");

    try {
      const url = buildShareUrl(readyStory);
      if (url.length < 50000) {
        window.history.replaceState(null, "", url);
      } else {
        setShareStatus("A apresentação abriu, mas não coloquei o link gigante na barra para evitar travamento. Use Copiar link se precisar testar.");
      }
    } catch {
      setShareStatus("A história abriu, mas o link ficou grande demais para entrar na barra do navegador.");
    }

    audio.pause();
  }

  function backToCreate() {
    audio.pause();
    if (publishedMode) {
      window.location.assign("/criar");
      return;
    }
    setMode("create");
    setSlideIndex(0);
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (mode === "present") {
    return (
      <Presentation
        audio={audio}
        copyShareLink={copyShareLink}
        localAudio={localAudio}
        loadNotice={loadNotice}
        onBackToCreate={backToCreate}
        publishedMode={publishedMode}
        setSlideIndex={setSlideIndex}
        shareStatus={shareStatus}
        slideIndex={slideIndex}
        story={readyStory}
      />
    );
  }

  return (
    <CreateMode
      addMoment={addMoment}
      addBreath={addBreath}
      canPresent={Boolean(canPresent)}
      clearSavedDraft={clearSavedDraft}
      copyShareLink={copyShareLink}
      downloadDraftBackup={downloadDraftBackup}
      draftStatus={draftStatus}
      exportForVercel={exportForVercel}
      fillWeather={fillWeather}
      generateFinal={generateFinal}
      generateIntro={generateIntro}
      generateMomentText={generateMomentText}
      handlePhoto={handlePhoto}
      handleAddCollagePhoto={handleAddCollagePhoto}
      removeCollagePhoto={removeCollagePhoto}
      handleAudioUpload={handleAudioUpload}
      linkLength={linkLength}
      localAudio={localAudio}
      loadNotice={loadNotice}
      moments={orderedMoments}
      moveMoment={moveMoment}
      publishStatus={publishStatus}
      publishing={publishing}
      removeMoment={removeMoment}
      importDraftBackup={importDraftBackup}
      shareStatus={shareStatus}
      startPresentation={startPresentation}
      story={story}
      updateMoment={updateMoment}
      updateStory={updateStory}
      weatherLoading={weatherLoading}
      weatherStatus={weatherStatus}
    />
  );
}

function CreateMode({
  addBreath,
  addMoment,
  canPresent,
  clearSavedDraft,
  copyShareLink,
  downloadDraftBackup,
  draftStatus,
  exportForVercel,
  fillWeather,
  generateFinal,
  generateIntro,
  generateMomentText,
  handleAddCollagePhoto,
  handleAudioUpload,
  handlePhoto,
  importDraftBackup,
  removeCollagePhoto,
  linkLength,
  localAudio,
  loadNotice,
  moments,
  moveMoment,
  publishStatus,
  publishing,
  removeMoment,
  shareStatus,
  startPresentation,
  story,
  updateMoment,
  updateStory,
  weatherLoading,
  weatherStatus,
}) {
  const [editorStep, setEditorStep] = useState("story");
  const editorTopRef = useRef(null);
  const backupInputRef = useRef(null);
  const editorStepIndex = EDITOR_STEPS.findIndex((step) => step.id === editorStep);

  function changeEditorStep(stepId) {
    setEditorStep(stepId);
    window.requestAnimationFrame(() => {
      editorTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0e0810] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#16101a_0%,#0e0810_46%,#080608_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-8%,rgba(160,60,96,0.28),transparent_64%)]" />

      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-7 px-4 py-5 sm:px-6 lg:py-10">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] px-1 pb-8 pt-2 sm:px-0 sm:pb-10">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#e8a0b8]">
              <Heart className="h-3.5 w-3.5 fill-current" />
              Nossa História
            </div>
            <div className="hidden text-[11px] font-bold tracking-[0.14em] text-white/36 sm:block">
              Feito para emocionar
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium leading-6 text-pink-100/70">Uma declaração em stories para amor, Dia dos Namorados e memórias de família.</p>
              <h1 className="font-display text-[2.8rem] leading-[0.9] text-white sm:text-6xl lg:text-7xl">
                Transforme fotos em uma declaração que parece feita à mão.
              </h1>
            </div>
            <div className="border-l border-[#d99aae]/34 pl-5 text-sm leading-6 text-white/56">
              A música é gerada no navegador com Web Audio API. No celular, ela começa depois do toque em
              <span className="font-semibold text-white/82"> Começar nossa história</span>, já dentro da apresentação.
            </div>
          </div>
        </header>

        {loadNotice ? (
          <div className="rounded-lg border border-amber-200/25 bg-amber-200/12 px-4 py-3 text-sm font-semibold text-amber-50">
            {loadNotice}
          </div>
        ) : null}

        <nav
          aria-label="Etapas da criação"
          className="sticky top-2 z-30 grid grid-cols-4 gap-1 rounded-2xl border border-white/[0.09] bg-[#120d14]/94 p-1.5 shadow-[0_20px_56px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
          ref={editorTopRef}
        >
          {EDITOR_STEPS.map((step, index) => {
            const active = step.id === editorStep;

            return (
              <button
                aria-current={active ? "step" : undefined}
                className={`grid min-h-12 place-items-center rounded-xl px-1.5 py-2.5 text-center transition-all duration-200 ${
                  active
                    ? "bg-white text-[#231318] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                    : "text-white/44 hover:bg-white/[0.06] hover:text-white/72"
                }`}
                key={step.id}
                onClick={() => changeEditorStep(step.id)}
                type="button"
              >
                <span className={`text-[9px] font-black uppercase ${active ? "opacity-50" : "opacity-40"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-0.5 text-xs font-black sm:hidden">{step.shortName}</span>
                <span className="mt-0.5 hidden text-xs font-black sm:block">{step.name}</span>
              </button>
            );
          })}
        </nav>

        {editorStep === "story" ? (
          <>
        <section className="grid gap-4 lg:grid-cols-2">
          <TextInput
            label="Quem está declarando?"
            onChange={(value) => updateStory("fromName", value)}
            placeholder="Seu nome"
            value={story.fromName}
          />
          <TextInput
            label="Quem vai receber?"
            onChange={(value) => updateStory("toName", value)}
            placeholder="Nome do seu amor"
            value={story.toName}
          />
        </section>

        <section className="editor-panel grid gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-pink-200/80">Copy semi automatica</p>
              <h2 className="font-display text-3xl leading-none text-white sm:text-4xl">Uma abertura com cara de carta.</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-[#1a0714] transition hover:-translate-y-0.5"
                onClick={generateIntro}
                type="button"
              >
                <PenLine className="h-4 w-4" />
                Intro
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/14 px-4 text-sm font-black text-white transition hover:bg-white/10"
                onClick={generateFinal}
                type="button"
              >
                <Heart className="h-4 w-4" />
                Final
              </button>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Introducao romantica</span>
            <textarea
              className="min-h-28 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/30 focus:border-pink-200"
              maxLength={320}
              onChange={(event) => updateStory("introMessage", event.target.value)}
              placeholder="Clique em Intro para gerar uma sugestao, ou escreva do seu jeito."
              value={story.introMessage}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Mensagem final</span>
            <textarea
              className="min-h-24 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/30 focus:border-pink-200"
              maxLength={260}
              onChange={(event) => updateStory("finalMessage", event.target.value)}
              placeholder="Clique em Final para sugerir um fechamento."
              value={story.finalMessage}
            />
          </label>
        </section>

        <section className="editor-panel grid gap-4 p-4 sm:p-5">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100/80">Ritmo da apresentação</p>
            <h2 className="font-display text-3xl leading-none text-white sm:text-4xl">Você decide onde a história respira.</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/62">
              As páginas com frases agora podem ser adicionadas e ordenadas junto das fotos, na etapa Momentos.
            </p>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">O que ainda quero viver</span>
            <textarea
              className="min-h-24 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/30 focus:border-pink-200"
              maxLength={220}
              onChange={(event) => updateStory("futureMessage", event.target.value)}
              placeholder="Uma viagem, uma casa, domingos juntos, uma família..."
              value={story.futureMessage ?? ""}
            />
          </label>

          <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/18 px-4">
            <span>
              <span className="block text-sm font-black text-white">Avançar automaticamente</span>
              <span className="mt-1 block text-xs font-semibold text-white/55">Cada tela respeita o tempo de leitura e também aceita toque.</span>
            </span>
            <input
              checked={Boolean(story.autoAdvance)}
              className="h-5 w-5 accent-pink-400"
              onChange={(event) => updateStory("autoAdvance", event.target.checked)}
              type="checkbox"
            />
          </label>
        </section>
          </>
        ) : null}

        {editorStep === "visual" ? (
        <section className="editor-panel grid gap-4 p-4 sm:p-5">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-pink-200/80">Clima da história</p>
            <h2 className="font-display text-3xl leading-none text-white sm:text-4xl">Como você quer que esse amor seja lembrado?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ROMANTIC_MOODS.map((mood) => {
              const selected = story.moodId === mood.id;

              return (
                <button
                  aria-pressed={selected}
                  className={`overflow-hidden rounded-lg border text-left transition ${
                    selected
                      ? "border-[#e3a7b9]/70 bg-white/[0.08] text-white shadow-[0_14px_42px_rgba(0,0,0,0.2)]"
                      : "border-white/[0.09] bg-black/20 text-white hover:border-[#d99aae]/36 hover:bg-white/[0.035]"
                  }`}
                  key={mood.id}
                  onClick={() => updateStory("moodId", mood.id)}
                  type="button"
                >
                  <span className="relative block h-24 overflow-hidden">
                    <img alt="" className="h-full w-full object-cover" src={mood.preview} />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(10,5,9,0.72))]" />
                    {selected ? (
                      <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-white/24 bg-[#5c2033]/88 text-white backdrop-blur">
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </span>
                    ) : null}
                  </span>
                  <span className="grid min-h-[92px] content-start gap-1.5 p-3">
                    <span className="text-sm font-black leading-tight">{mood.name}</span>
                    <span className={`text-xs font-semibold leading-4 ${selected ? "text-white/68" : "text-white/52"}`}>
                      {mood.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        ) : null}

        {editorStep === "moments" ? (
          <>
        <section className="editor-panel grid gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#f0c97a]/80">Colagem de abertura</p>
              <h2 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                Fotos que aparecem juntas antes dos seus momentos.
              </h2>
              <p className="mt-1.5 text-xs font-medium leading-5 text-white/52">
                Adicione de 1 a 9 fotos. Elas aparecem espalhadas no slide de colagem, sem spoilar os momentos que vêm depois.
              </p>
            </div>
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-[#1a0714] transition hover:-translate-y-0.5">
              <ImagePlus className="h-4 w-4" />
              Adicionar foto
              <input
                accept="image/*"
                className="hidden"
                multiple
                onChange={async (event) => {
                  const files = Array.from(event.target.files ?? []);
                  for (const file of files) await handleAddCollagePhoto(file);
                  event.target.value = "";
                }}
                type="file"
              />
            </label>
          </div>
          {(story.collagePhotos ?? []).length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {(story.collagePhotos ?? []).map((photo, i) => (
                <div className="group relative aspect-square overflow-hidden rounded-lg border border-white/12 bg-black/24" key={i}>
                  <img alt="" className="h-full w-full object-cover" src={photo} />
                  <button
                    className="absolute inset-0 grid place-items-center bg-black/0 text-white/0 transition group-hover:bg-black/52 group-hover:text-white"
                    onClick={() => removeCollagePhoto(i)}
                    title="Remover foto"
                    type="button"
                  >
                    <X className="h-5 w-5 drop-shadow" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-lg border border-dashed border-white/14 py-8 text-sm font-medium text-white/38">
              Nenhuma foto ainda — adicione para ativar o slide de colagem.
            </div>
          )}
        </section>

        <section className="editor-panel grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
          <TextInput
            label="Cidade dos momentos"
            onChange={(value) => updateStory("city", value)}
            placeholder="Ex: Sao Paulo, Rio de Janeiro, Recife..."
            value={story.city}
          />
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#ffd2df] px-4 text-sm font-black text-[#3a0d1f] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={weatherLoading}
            onClick={fillWeather}
            type="button"
          >
            {weatherLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudSun className="h-4 w-4" />}
            Buscar clima
          </button>
          <p className="text-xs font-semibold leading-5 text-white/74 sm:col-span-2">
            O dia da semana aparece automaticamente. O clima historico precisa da cidade e usa uma API aberta, sem login.
            Momentos sem data continuam normalmente e ficam sem clima.
            {weatherStatus ? <span className="mt-1 block text-pink-100">{weatherStatus}</span> : null}
          </p>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-pink-200/80">Momentos</p>
              <h2 className="font-display text-3xl leading-none text-white sm:text-4xl">Fotos e pausas, na ordem que você escolher.</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-[#1a0714] transition hover:-translate-y-0.5"
                onClick={addMoment}
                type="button"
              >
                <ImagePlus className="h-4 w-4" />
                Foto
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-pink-100/24 bg-pink-100/10 px-4 text-sm font-black text-pink-50 transition hover:bg-pink-100/16"
                onClick={addBreath}
                type="button"
              >
                <Sparkles className="h-4 w-4" />
                Respiro
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {moments.map((moment, index) =>
              isBreath(moment) ? (
                <BreathEditor
                  index={index}
                  key={moment.id}
                  moment={moment}
                  momentsCount={moments.length}
                  moveMoment={moveMoment}
                  removeMoment={removeMoment}
                  updateMoment={updateMoment}
                />
              ) : (
                <MomentEditor
                  generateMomentText={generateMomentText}
                  handlePhoto={handlePhoto}
                  index={index}
                  key={moment.id}
                  moment={moment}
                  momentsCount={moments.length}
                  moveMoment={moveMoment}
                  photoNumber={moments.slice(0, index + 1).filter((entry) => !isBreath(entry)).length}
                  removeMoment={removeMoment}
                  updateMoment={updateMoment}
                />
              ),
            )}
          </div>
        </section>
          </>
        ) : null}

        {editorStep === "music" ? (
        <section className="grid gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100/80">Trilha sonora</p>
            <h2 className="font-display text-3xl leading-none text-white sm:text-4xl">Uma trilha para segurar a emoção.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["synth", "Trilha interna", "Gerada pelo app"],
              ["local", "MP3/M4A", "Mais estavel"],
              ["youtube", "YouTube", "Player oficial"],
            ].map(([source, title, description]) => (
              <button
                className={`min-h-20 rounded-lg border p-4 text-left transition ${
                  story.audioSource === source
                    ? "border-[#e3a7b9]/62 bg-white/[0.08] text-white"
                    : "border-white/[0.09] bg-white/[0.035] text-white hover:border-[#d99aae]/34"
                }`}
                key={source}
                onClick={() => updateStory("audioSource", source)}
                type="button"
              >
                <span className="block text-sm font-black">{title}</span>
                <span className={story.audioSource === source ? "mt-1 block text-xs font-bold text-white/62" : "mt-1 block text-xs font-bold text-white/48"}>
                  {description}
                </span>
              </button>
            ))}
          </div>

          {story.audioSource === "local" ? (
            <label className="grid cursor-pointer gap-2 rounded-lg border border-white/12 bg-white/[0.06] p-4">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/74">Musica de voces</span>
              <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-[#1a0714]">
                <Upload className="h-4 w-4" />
                Escolher MP3/M4A
              </span>
              <input
                accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/aac,audio/wav"
                className="hidden"
                onChange={(event) => handleAudioUpload(event.target.files?.[0])}
                type="file"
              />
              <span className="text-xs font-semibold leading-5 text-white/74">
                {localAudio
                  ? `${localAudio.name} carregada para tocar neste aparelho.`
                  : "Essa musica toca na apresentacao atual, mas nao entra no link compartilhado."}
              </span>
            </label>
          ) : null}

          {story.audioSource === "youtube" ? (
            <label className="grid gap-2 rounded-lg border border-white/12 bg-white/[0.06] p-4">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/74">Link do YouTube</span>
              <input
                className="min-h-12 rounded-md border border-white/10 bg-black/20 px-4 text-base font-bold text-white outline-none transition placeholder:text-white/30 focus:border-pink-200"
                onChange={(event) => updateStory("youtubeUrl", event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                value={story.youtubeUrl}
              />
              <span className="text-xs font-semibold leading-5 text-white/74">
                O app usa o player oficial. No celular, normalmente voce precisa tocar no play do YouTube.
              </span>
            </label>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {MUSIC_TRACKS.map((track) => (
              <button
                className={`flex min-h-24 items-start gap-3 rounded-lg border p-4 text-left transition ${
                  story.audioSource === "synth" && story.trackId === track.id
                    ? "border-[#e3a7b9]/62 bg-white/[0.08] text-white"
                    : "border-white/[0.09] bg-white/[0.035] text-white hover:border-[#d99aae]/34"
                }`}
                key={track.id}
                onClick={() => {
                  updateStory("trackId", track.id);
                  updateStory("audioSource", "synth");
                }}
                type="button"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/15">
                  <Music2 className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-black">{track.name}</span>
                  <span className={story.trackId === track.id ? "mt-1 block text-sm text-white/62" : "mt-1 block text-sm text-white/48"}>
                    {track.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
        ) : null}

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-black text-white/58 transition hover:bg-white/[0.05] hover:text-white disabled:invisible"
            disabled={editorStepIndex === 0}
            onClick={() => changeEditorStep(EDITOR_STEPS[editorStepIndex - 1]?.id)}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
          <p className="text-[11px] font-black uppercase text-white/34">
            {editorStepIndex + 1} de {EDITOR_STEPS.length}
          </p>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-black text-[#231318] transition hover:-translate-y-0.5 disabled:invisible"
            disabled={editorStepIndex === EDITOR_STEPS.length - 1}
            onClick={() => changeEditorStep(EDITOR_STEPS[editorStepIndex + 1]?.id)}
            type="button"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <section className="editor-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-pink-100">Proteja este rascunho</p>
            <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-white/72">
              Baixe uma cópia completa para guardar ou importar depois, mesmo em outro navegador.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-[#231318] transition hover:-translate-y-0.5"
              onClick={downloadDraftBackup}
              type="button"
            >
              <Download className="h-4 w-4" />
              Baixar backup
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/16 bg-black/18 px-4 text-sm font-black text-white transition hover:bg-white/[0.06]"
              onClick={() => backupInputRef.current?.click()}
              type="button"
            >
              <FileUp className="h-4 w-4" />
              Importar backup
            </button>
            <input
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                importDraftBackup(file);
              }}
              ref={backupInputRef}
              type="file"
            />
          </div>
        </section>

        <footer className="sticky bottom-3 z-20 rounded-2xl border border-white/[0.09] bg-[#120d14]/94 p-3.5 shadow-[0_20px_64px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="text-xs font-medium leading-5 text-white/68">
              <span className="mb-1 block text-[#e8a0b8]">{draftStatus}</span>
              {canPresent ? (
                <>
                  Link rápido estimado: <span className="text-white/90">{linkLength.toLocaleString("pt-BR")} caracteres</span>.
                  {linkLength > 12000
                    ? " Use Finalizar para Vercel para gerar o link definitivo sem base64."
                    : " Serve para teste. Para o envio final, gere o pacote da Vercel."}
                </>
              ) : (
                "Preencha os nomes e pelo menos um momento com foto e título. Data e texto são opcionais."
              )}
              {shareStatus ? <span className="mt-1 block text-[#e8a0b8]">{shareStatus}</span> : null}
              {publishStatus ? <span className="mt-1 block text-amber-200/90">{publishStatus}</span> : null}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-bold text-white/80 transition enabled:hover:bg-white/[0.08] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-36"
                onClick={clearSavedDraft}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Apagar rascunho
              </button>
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-bold text-white/80 transition enabled:hover:bg-white/[0.08] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-36"
                disabled={!canPresent}
                onClick={copyShareLink}
                type="button"
              >
                <Copy className="h-4 w-4" />
                Copiar link
              </button>
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8f3654] px-5 text-sm font-black text-white shadow-[0_12px_36px_rgba(143,54,84,0.32)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#a04465] enabled:hover:shadow-[0_16px_44px_rgba(143,54,84,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canPresent}
                onClick={startPresentation}
                type="button"
              >
                <Sparkles className="h-4 w-4" />
                Ver nossa história
              </button>
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffefd8] px-5 text-sm font-black text-[#3a0d1f] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canPresent || publishing}
                onClick={exportForVercel}
                type="button"
              >
                {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Finalizar para Vercel
              </button>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

function TextInput({ label, onChange, placeholder, value }) {
  return (
    <label className="editor-panel grid gap-2 p-4">
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/58">{label}</span>
      <input
        className="min-h-12 border-0 border-b border-white/12 bg-transparent px-0 text-base font-semibold text-white outline-none transition placeholder:text-white/24 focus:border-[#d99aae]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function BreathEditor({ index, moment, momentsCount, moveMoment, removeMoment, updateMoment }) {
  const preset = BREATH_PRESET_BY_ID[moment.breathStyle] ?? BREATH_PRESETS[0];

  return (
    <article className="editor-panel grid gap-4 border-pink-100/14 p-4 sm:grid-cols-[220px_1fr]">
      <div className="relative min-h-52 overflow-hidden rounded-lg border border-white/12">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src={preset.background} />
        <div className={`absolute inset-0 ${preset.light ? "bg-[#fff8ee]/72" : "bg-black/52"}`} />
        <div className={`relative grid h-full content-center gap-3 p-5 ${preset.light ? "text-[#3a2118]" : "text-white"}`}>
          <Sparkles className={`h-5 w-5 ${preset.light ? "text-[#9a5260]" : "text-[#ffd2df]"}`} />
          <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">Página de respiro</p>
          <p className="font-display text-3xl leading-[0.96]">{moment.title || preset.title}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-100">Pausa entre as fotos</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-white/56">
            Esta tela entra exatamente nesta posição da apresentação.
          </p>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Estilo da pausa</span>
          <select
            className="min-h-11 rounded-md border border-white/10 bg-[#1a0c18] px-3 text-sm font-bold text-white outline-none focus:border-pink-200"
            onChange={(event) => {
              const nextPreset = BREATH_PRESET_BY_ID[event.target.value] ?? BREATH_PRESETS[0];
              updateMoment(moment.id, { breathStyle: nextPreset.id, title: nextPreset.title });
            }}
            value={preset.id}
          >
            {BREATH_PRESETS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Título da pausa</span>
          <input
            className="min-h-11 rounded-md border border-white/10 bg-black/20 px-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-pink-200"
            maxLength={64}
            onChange={(event) => updateMoment(moment.id, { title: event.target.value })}
            placeholder="Ex: O que eu amo em você"
            value={moment.title ?? ""}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Frase</span>
          <textarea
            className="min-h-28 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/30 focus:border-pink-200"
            maxLength={220}
            onChange={(event) => updateMoment(moment.id, { text: event.target.value })}
            placeholder="Ex: O seu jeito de cuidar de mim até nos dias em que eu esqueço de me cuidar."
            value={moment.text ?? ""}
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-white/44">{(moment.text ?? "").length}/220</span>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              aria-label={`Mover respiro ${index + 1} para cima`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
              disabled={index === 0}
              onClick={() => moveMoment(moment.id, -1)}
              title="Mover para cima"
              type="button"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              aria-label={`Mover respiro ${index + 1} para baixo`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
              disabled={index === momentsCount - 1}
              onClick={() => moveMoment(moment.id, 1)}
              title="Mover para baixo"
              type="button"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/12 px-3 text-xs font-black text-white/80 transition hover:bg-white/10"
              onClick={() => removeMoment(moment.id)}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MomentEditor({
  generateMomentText,
  handlePhoto,
  index,
  moment,
  momentsCount,
  moveMoment,
  photoNumber,
  removeMoment,
  updateMoment,
}) {
  const inputId = `photo-${moment.id}`;
  const meta = getMomentMeta(moment);
  const dragStateRef = useRef(null);
  const dragFrameRef = useRef(null);
  const pendingFocusRef = useRef(null);
  const [draggingPhoto, setDraggingPhoto] = useState(false);

  useEffect(
    () => () => {
      if (dragFrameRef.current) window.cancelAnimationFrame(dragFrameRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!draggingPhoto) return undefined;

    const releaseDrag = (event) => {
      if (dragStateRef.current?.pointerId !== event.pointerId) return;
      dragStateRef.current = null;
      setDraggingPhoto(false);
    };

    window.addEventListener("pointerup", releaseDrag, true);
    window.addEventListener("pointercancel", releaseDrag, true);
    return () => {
      window.removeEventListener("pointerup", releaseDrag, true);
      window.removeEventListener("pointercancel", releaseDrag, true);
    };
  }, [draggingPhoto]);

  function queuePhotoPosition(focalX, focalY) {
    pendingFocusRef.current = { focalX, focalY };
    if (dragFrameRef.current) return;

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      if (!pendingFocusRef.current) return;
      updateMoment(moment.id, pendingFocusRef.current);
      pendingFocusRef.current = null;
    });
  }

  function startPhotoDrag(event) {
    if (event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragStateRef.current = {
      height: bounds.height,
      pointerId: event.pointerId,
      startFocalX: moment.focalX ?? 50,
      startFocalY: moment.focalY ?? 50,
      startX: event.clientX,
      startY: event.clientY,
      width: bounds.width,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    setDraggingPhoto(true);
  }

  function movePhoto(event) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const focalX = Math.min(100, Math.max(0, drag.startFocalX - ((event.clientX - drag.startX) / drag.width) * 100));
    const focalY = Math.min(100, Math.max(0, drag.startFocalY - ((event.clientY - drag.startY) / drag.height) * 100));
    queuePhotoPosition(focalX, focalY);
  }

  function stopPhotoDrag(event) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggingPhoto(false);
  }

  return (
    <article className="editor-panel grid gap-4 p-4 sm:grid-cols-[220px_1fr]">
      <div className="grid gap-3">
        {moment.photo ? (
          <div
            aria-label={`Reposicionar foto ${photoNumber}`}
            className={`group relative grid aspect-[4/5] touch-none place-items-center overflow-hidden rounded-lg border border-white/14 bg-black/24 select-none ${
              draggingPhoto ? "cursor-grabbing border-pink-200/48" : "cursor-grab"
            }`}
            onDoubleClick={() => updateMoment(moment.id, { focalX: 50, focalY: 50 })}
            onLostPointerCapture={() => {
              dragStateRef.current = null;
              setDraggingPhoto(false);
            }}
            onPointerCancel={stopPhotoDrag}
            onPointerDown={startPhotoDrag}
            onPointerMove={movePhoto}
            onPointerUp={stopPhotoDrag}
            role="application"
            title="Arraste para reposicionar. Clique duas vezes para centralizar."
          >
            <img
              alt=""
              className={`pointer-events-none h-full w-full object-cover ${draggingPhoto ? "" : "transition-transform duration-300"}`}
              draggable="false"
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white/0 transition group-hover:bg-black/12 group-hover:text-white/90">
              <Move className="h-7 w-7 drop-shadow-lg" />
            </span>
            <label
              className="absolute bottom-2 left-2 inline-flex cursor-pointer items-center gap-1 rounded-full bg-black/64 px-2.5 py-1.5 text-[11px] font-black text-white backdrop-blur transition hover:bg-black/82"
              htmlFor={inputId}
              onPointerDown={(event) => event.stopPropagation()}
              title="Trocar foto"
            >
              <Upload className="h-3 w-3" />
              Foto {photoNumber}
            </label>
          </div>
        ) : (
          <label
            className="group relative grid aspect-[4/5] cursor-pointer place-items-center overflow-hidden rounded-lg border border-white/14 bg-black/24"
            htmlFor={inputId}
          >
            <span className="grid place-items-center gap-2 px-4 text-center text-sm font-bold text-white/74">
              <ImagePlus className="mx-auto h-7 w-7" />
              Escolher foto
            </span>
          </label>
        )}
        <input
          accept="image/*"
          className="hidden"
          id={inputId}
          onChange={(event) => handlePhoto(moment.id, event.target.files?.[0])}
          type="file"
        />
        {moment.photo ? (
          <div className="grid gap-3 rounded-lg border border-white/10 bg-black/18 p-3">
            <label className="grid gap-1.5">
              <span className="flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-white/68">
                <span>Foco horizontal</span>
                <span>{Math.round(moment.focalX ?? 50)}%</span>
              </span>
              <input
                max="100"
                min="0"
                onChange={(event) => updateMoment(moment.id, { focalX: Number(event.target.value) })}
                type="range"
                value={moment.focalX ?? 50}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-white/68">
                <span>Foco vertical</span>
                <span>{Math.round(moment.focalY ?? 50)}%</span>
              </span>
              <input
                max="100"
                min="0"
                onChange={(event) => updateMoment(moment.id, { focalY: Number(event.target.value) })}
                type="range"
                value={moment.focalY ?? 50}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-white/68">
                <span>Zoom</span>
                <span>{Number(moment.zoom ?? 1).toFixed(1)}x</span>
              </span>
              <input
                max="1.8"
                min="1"
                onChange={(event) => updateMoment(moment.id, { zoom: Number(event.target.value) })}
                step="0.1"
                type="range"
                value={moment.zoom ?? 1}
              />
            </label>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Data (opcional)</span>
            <input
              className="min-h-11 rounded-md border border-white/10 bg-black/20 px-3 text-sm font-bold text-white outline-none focus:border-pink-200"
              onChange={(event) => updateMoment(moment.id, { date: event.target.value })}
              type="date"
              value={moment.date}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Título</span>
            <input
              className="min-h-11 rounded-md border border-white/10 bg-black/20 px-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-pink-200"
              maxLength={54}
              onChange={(event) => updateMoment(moment.id, { title: event.target.value })}
              placeholder="Ex: o dia em que tudo ficou diferente"
              value={moment.title}
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Capítulo (opcional)</span>
            <select
              className="min-h-11 rounded-md border border-white/10 bg-[#1a0c18] px-3 text-sm font-bold text-white outline-none focus:border-pink-200"
              onChange={(event) => updateMoment(moment.id, { actId: event.target.value })}
              value={moment.actId ?? ""}
            >
              <option value="">Sem capítulo</option>
              {STORY_ACTS.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Tipo de tela</span>
            <select
              className="min-h-11 rounded-md border border-white/10 bg-[#1a0c18] px-3 text-sm font-bold text-white outline-none focus:border-pink-200"
              onChange={(event) => updateMoment(moment.id, { layout: event.target.value })}
              value={moment.layout ?? ""}
            >
              <option value="">Variar automaticamente</option>
              {MOMENT_LAYOUTS.map((layout) => (
                <option key={layout.id} value={layout.id}>
                  {layout.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/50">Texto curto (opcional)</span>
          <textarea
            className="min-h-28 resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/30 focus:border-pink-200"
            maxLength={180}
            onChange={(event) => updateMoment(moment.id, { text: event.target.value })}
            placeholder="Escreva como se estivesse falando baixinho no ouvido."
            value={moment.text ?? ""}
          />
        </label>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-white/44">{(moment.text ?? "").length}/180</span>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              aria-label={`Mover momento ${index + 1} para cima`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
              disabled={index === 0}
              onClick={() => moveMoment(moment.id, -1)}
              title="Mover para cima"
              type="button"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              aria-label={`Mover momento ${index + 1} para baixo`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
              disabled={index === momentsCount - 1}
              onClick={() => moveMoment(moment.id, 1)}
              title="Mover para baixo"
              type="button"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-3 text-xs font-black text-[#1a0714] transition hover:-translate-y-0.5"
              onClick={() => generateMomentText(moment.id)}
              type="button"
            >
              <PenLine className="h-4 w-4" />
              Sugerir texto
            </button>
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/12 px-3 text-xs font-black text-white/80 transition hover:bg-white/10"
              onClick={() => removeMoment(moment.id)}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </button>
          </div>
        </div>
        {meta ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-100/18 bg-pink-100/10 px-3 py-2 text-xs font-bold text-pink-50">
            <CloudSun className="h-4 w-4" />
            {meta}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Presentation({
  audio,
  copyShareLink,
  localAudio,
  loadNotice,
  onBackToCreate,
  publishedMode,
  setSlideIndex,
  shareStatus,
  slideIndex,
  story,
}) {
  const touchStart = useRef(null);
  const sequence = useMemo(() => buildPresentationSequence(story), [story]);
  const slidesCount = sequence.length;
  const currentSlide = sequence[slideIndex] ?? sequence[0];
  const theme = getTheme(story.styleId);
  const moodId = ROMANTIC_MOOD_IDS.has(story.moodId) ? story.moodId : "mix";
  const localAudioRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const transitionTimersRef = useRef([]);
  const transitionLockRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);
  const [localPlaying, setLocalPlaying] = useState(false);
  const [localMuted, setLocalMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const audioSource = story.audioSource === "local" && !localAudio?.dataUrl ? "synth" : story.audioSource;
  const youtubeId = getYouTubeId(story.youtubeUrl);
  const slideDuration = getSlideDuration(currentSlide);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2800);
  }, []);

  const transitionTo = useCallback(
    (nextIndex) => {
      const targetIndex = Math.max(0, Math.min(slidesCount - 1, nextIndex));
      if (targetIndex === slideIndex || transitionLockRef.current) return;

      revealControls();
      if (reducedMotion) {
        setSlideIndex(targetIndex);
        return;
      }

      transitionLockRef.current = true;
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      setTransitionPhase("cover");

      transitionTimersRef.current = [
        window.setTimeout(() => setSlideIndex(targetIndex), 230),
        window.setTimeout(() => setTransitionPhase("reveal"), 270),
        window.setTimeout(() => {
          transitionLockRef.current = false;
          setTransitionPhase("idle");
        }, 980),
      ];
    },
    [reducedMotion, revealControls, setSlideIndex, slideIndex, slidesCount],
  );

  const goNext = useCallback(() => {
    transitionTo(slideIndex + 1);
  }, [slideIndex, transitionTo]);

  const goPrev = useCallback(() => {
    transitionTo(slideIndex - 1);
  }, [slideIndex, transitionTo]);

  useEffect(() => {
    setSlideIndex((current) => Math.min(current, slidesCount - 1));
  }, [setSlideIndex, slidesCount]);

  useEffect(
    () => () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    if (!started) return undefined;
    revealControls();
    return () => window.clearTimeout(controlsTimerRef.current);
  }, [revealControls, slideIndex, started]);

  useEffect(() => {
    if (!started || !story.autoAdvance || ["secret", "final"].includes(currentSlide.type)) return undefined;
    const timer = window.setTimeout(goNext, slideDuration);
    return () => window.clearTimeout(timer);
  }, [currentSlide, goNext, slideDuration, started, story.autoAdvance]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!started) return;
      if (event.key === "ArrowRight" || event.key === " ") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "Escape") onBackToCreate();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, onBackToCreate, started]);

  function handlePointerDown(event) {
    if (!started || event.target.closest("[data-no-nav]")) return;
    touchStart.current = {
      controlsWereVisible: controlsVisible,
      x: event.clientX,
      y: event.clientY,
    };
    revealControls();
  }

  function handlePointerUp(event) {
    if (!started || event.target.closest("[data-no-nav]") || !touchStart.current) return;
    const pointerStart = touchStart.current;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    touchStart.current = null;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext();
      else goPrev();
      return;
    }

    if (Math.abs(deltaX) < 14 && Math.abs(deltaY) < 14) {
      if (!pointerStart.controlsWereVisible) return;
      if (event.clientX > window.innerWidth / 2) goNext();
      else goPrev();
    }
  }

  async function startStory() {
    setStarted(true);

    try {
      await document.documentElement.requestFullscreen?.();
    } catch { /* fullscreen is optional */ }

    try {
      if (audioSource === "local" && localAudioRef.current) {
        localAudioRef.current.volume = 0;
        await localAudioRef.current.play();
        setLocalPlaying(true);
        let vol = 0;
        const fade = window.setInterval(() => {
          vol = Math.min(1, vol + 0.05);
          if (localAudioRef.current) localAudioRef.current.volume = vol;
          if (vol >= 1) window.clearInterval(fade);
        }, 100);
      } else if (audioSource === "synth") {
        await audio.play(story.trackId);
      }
    } catch {
      // The story still starts if the device keeps audio blocked.
    }
  }

  async function togglePlay() {
    if (audioSource === "local" && localAudioRef.current) {
      if (localAudioRef.current.paused) {
        await localAudioRef.current.play();
        setLocalPlaying(true);
      } else {
        localAudioRef.current.pause();
        setLocalPlaying(false);
      }
      return;
    }

    if (audioSource === "youtube") return;

    if (audio.audioState.playing) {
      await audio.pause();
    } else {
      await audio.play(story.trackId);
    }
  }

  function toggleLocalMute() {
    if (!localAudioRef.current) return;
    const nextMuted = !localMuted;
    localAudioRef.current.muted = nextMuted;
    setLocalMuted(nextMuted);
  }

  useEffect(() => {
    setLocalPlaying(false);
    setLocalMuted(false);
  }, [localAudio?.dataUrl]);

  return (
    <main
      className={`storybook-safe-area fixed inset-0 isolate h-[100svh] overflow-hidden ${theme.root}`}
      onPointerDown={handlePointerDown}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse") revealControls();
      }}
      onPointerUp={handlePointerUp}
    >
      <div className={`absolute inset-0 -z-10 slow-shimmer ${theme.backdrop}`} />
      <AmbientHearts moodId={moodId} styleId={story.styleId} />
      <div
        aria-hidden="true"
        className={`story-scene-curtain fixed inset-0 z-30 pointer-events-none ${
          transitionPhase === "cover"
            ? "story-scene-curtain-cover"
            : transitionPhase === "reveal"
              ? "story-scene-curtain-reveal"
              : ""
        }`}
      />
      {audioSource === "local" && localAudio?.dataUrl ? (
        <audio
          loop
          onPause={() => setLocalPlaying(false)}
          onPlay={() => setLocalPlaying(true)}
          ref={localAudioRef}
          src={localAudio.dataUrl}
        />
      ) : null}

      {started ? (
        <div className="story-progress pointer-events-none fixed inset-x-0 z-40 px-3 sm:px-5">
          <div className="flex gap-[3px]">
            {sequence.map((slide, index) => (
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/16" key={slide.id}>
                <span
                  className={`block h-full rounded-full ${theme.progress} ${
                    story.autoAdvance && index === slideIndex ? "story-progress-active" : "transition-all duration-300"
                  }`}
                  key={`${slide.id}-${slideIndex}`}
                  style={{
                    width: index < slideIndex ? "100%" : index === slideIndex ? (story.autoAdvance ? "0%" : "54%") : "0%",
                    "--slide-duration": `${slideDuration}ms`,
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {started ? (
        <div
          className={`story-audio-controls fixed right-3 z-50 flex gap-1.5 transition-opacity duration-300 sm:right-5 sm:gap-2 ${
            controlsVisible ? "story-controls-visible" : "story-controls-hidden"
          }`}
          data-no-nav
        >
          <IconButton
            label={
              audioSource === "youtube"
                ? "Use o player do YouTube"
                : audioSource === "local"
                  ? localPlaying
                    ? "Pausar música"
                    : "Tocar música"
                  : audio.audioState.playing
                    ? "Pausar trilha"
                    : "Tocar trilha"
            }
            onClick={togglePlay}
          >
            {(audioSource === "local" ? localPlaying : audio.audioState.playing) ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </IconButton>
          {audioSource === "youtube" ? null : (
            <IconButton
              label={(audioSource === "local" ? localMuted : audio.audioState.muted) ? "Ativar som" : "Silenciar"}
              onClick={audioSource === "local" ? toggleLocalMute : audio.toggleMute}
            >
              {(audioSource === "local" ? localMuted : audio.audioState.muted) ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </IconButton>
          )}
        </div>
      ) : null}

      {started && audioSource === "youtube" && youtubeId ? (
        <div className="story-youtube-player fixed left-1/2 z-40 w-[min(230px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-md border border-white/16 bg-black/50 shadow-soft backdrop-blur sm:w-[250px]" data-no-nav>
          <iframe
            allow="autoplay; encrypted-media; picture-in-picture"
            className="h-[78px] w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&playsinline=1`}
            title="Player da musica no YouTube"
          />
        </div>
      ) : null}

      {started && !publishedMode ? (
        <div
          className={`story-back-control fixed left-3 z-50 flex gap-2 transition-opacity duration-300 sm:left-5 ${
            controlsVisible ? "story-controls-visible" : "story-controls-hidden"
          }`}
          data-no-nav
        >
          <IconButton label="Voltar para criar" onClick={onBackToCreate}>
            <ArrowLeft className="h-4 w-4" />
          </IconButton>
        </div>
      ) : null}

      {started && loadNotice && slideIndex === 0 ? (
        <div className="fixed inset-x-4 bottom-20 z-40 rounded-lg border border-white/20 bg-black/68 px-4 py-3 text-xs font-bold leading-5 text-white/92 backdrop-blur" data-no-nav>
          {loadNotice}
        </div>
      ) : null}

      <section className="story-stage grid h-full min-h-0 place-items-center">
        {currentSlide.type === "opening" ? (
          <OpeningSlide active={started} moodId={moodId} story={story} theme={theme} />
        ) : currentSlide.type === "time" ? (
          <TimeTogetherSlide moodId={moodId} story={story} />
        ) : currentSlide.type === "collage" ? (
          <CollageSlide story={story} />
        ) : currentSlide.type === "mosaic" ? (
          <PhotoMosaicSlide story={story} />
        ) : currentSlide.type === "act" ? (
          <ActSlide act={currentSlide.act} index={STORY_ACTS.findIndex((act) => act.id === currentSlide.act.id)} moodId={moodId} theme={theme} />
        ) : currentSlide.type === "moment" ? (
          <MomentSlide
            index={currentSlide.momentIndex}
            moment={currentSlide.moment}
            moodId={moodId}
            moments={currentSlide.photoMoments}
            styleId={story.styleId}
            theme={theme}
          />
        ) : currentSlide.type === "breath" ? (
          <BreathSlide breath={currentSlide.breath} />
        ) : currentSlide.type === "reasons" ? (
          <ReasonsSlide story={story} theme={theme} />
        ) : currentSlide.type === "future" ? (
          <FutureSlide moodId={moodId} story={story} />
        ) : currentSlide.type === "secret" ? (
          <SecretLetterSlide story={story} />
        ) : currentSlide.type === "final" ? (
          <FinalSlide
            copyShareLink={copyShareLink}
            onBackToCreate={onBackToCreate}
            publishedMode={publishedMode}
            shareStatus={shareStatus}
            story={story}
            theme={theme}
            moodId={moodId}
          />
        ) : null}
      </section>

      {started ? (
        <div
          className={`story-navigation fixed left-3 right-3 z-40 flex items-center justify-between gap-3 transition-opacity duration-300 sm:left-4 sm:right-4 ${
            controlsVisible ? "story-controls-visible" : "story-controls-hidden"
          }`}
          data-no-nav
        >
          <button
            aria-label="Tela anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/34 text-white/90 backdrop-blur transition hover:bg-white/12 disabled:opacity-20 sm:h-12 sm:w-12"
            disabled={slideIndex === 0}
            onClick={goPrev}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="story-copy-light grid place-items-center rounded-full bg-black/34 p-2.5 backdrop-blur" aria-hidden="true">
            <Heart className="h-3.5 w-3.5 fill-current opacity-68" />
          </div>
          <button
            aria-label="Próxima tela"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/34 text-white/90 backdrop-blur transition hover:bg-white/12 disabled:opacity-20 sm:h-12 sm:w-12"
            disabled={slideIndex === slidesCount - 1}
            onClick={goNext}
            type="button"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {!started ? (
        <StartGate
          audioSource={audioSource}
          moodId={moodId}
          onBackToCreate={onBackToCreate}
          onStart={startStory}
          publishedMode={publishedMode}
          story={story}
        />
      ) : null}
    </main>
  );
}

function getTheme(styleId) {
  const themes = {
    classic: {
      root: "bg-[#fff1df] text-[#3a2118]",
      backdrop:
        "bg-[linear-gradient(135deg,rgba(216,161,93,0.25),transparent_34%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.68),transparent_55%),linear-gradient(180deg,#fff1df,#f0cfac)]",
      progress: "bg-[#b85b6b]",
      eyebrow: "text-[#8a4351]",
      title: "font-display text-[#3a2118]",
      body: "text-[#5f4331]",
    },
    art: {
      root: "bg-[#25101d] text-white",
      backdrop:
        "bg-[linear-gradient(145deg,#2a1122_0%,#55203d_45%,#183044_100%)]",
      progress: "bg-[#f8c9b4]",
      eyebrow: "story-copy-light text-[#ffe1d3]",
      title: "story-copy-light font-black",
      body: "story-copy-muted",
    },
    spotify: {
      root: "bg-[#0d0710] text-white",
      backdrop:
        "bg-[linear-gradient(145deg,rgba(255,79,139,0.82)_0%,rgba(20,8,22,0.96)_34%,rgba(181,31,71,0.72)_68%,rgba(255,220,153,0.28)_100%)]",
      progress: "bg-[#ff8fb0]",
      eyebrow: "story-copy-light text-[#ffe1e9]",
      title: "story-copy-light font-black",
      body: "story-copy-muted",
    },
    timeline: {
      root: "bg-[#170b12] text-white",
      backdrop:
        "bg-[linear-gradient(160deg,rgba(108,36,53,0.72),rgba(23,11,18,0.96)_42%,rgba(216,161,93,0.28)_100%)]",
      progress: "bg-[#f0cfac]",
      eyebrow: "story-copy-light text-[#ffe2bf]",
      title: "story-copy-light font-display",
      body: "story-copy-muted",
    },
    blend: {
      root: "bg-[#140713] text-white",
      backdrop:
        "bg-[linear-gradient(145deg,rgba(255,79,139,0.68)_0%,rgba(68,22,48,0.96)_34%,rgba(181,31,71,0.62)_66%,rgba(255,241,223,0.28)_100%)]",
      progress: "bg-[#ffd2df]",
      eyebrow: "story-copy-light text-[#ffe1e9]",
      title: "story-copy-light font-black",
      body: "story-copy-muted",
    },
  };

  return themes[styleId] ?? themes.spotify;
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/34 text-white/90 backdrop-blur transition hover:bg-white/12 sm:h-12 sm:w-12"
      onClick={onClick}
      type="button"
    >
      {children}
      <span className="pointer-events-none absolute right-0 top-14 hidden whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] font-bold text-white group-hover:block">
        {label}
      </span>
    </button>
  );
}

function WeatherBadge({ className = "", moment, tone = "dark" }) {
  const meta = getWeatherLine(moment);
  if (!meta) return null;

  const toneClass =
    tone === "light"
      ? "bg-[#fffaf1]/88 text-[#4a2c1d] border-[#7c4a24]/24 shadow-[0_8px_26px_rgba(58,33,24,0.12)]"
      : "story-copy-light bg-black/48 text-white border-white/28 shadow-[0_8px_28px_rgba(0,0,0,0.28)]";

  return (
    <p className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] backdrop-blur ${toneClass} ${className}`}>
      <CloudSun className="h-4 w-4" />
      {meta}
    </p>
  );
}

function AmbientHearts({ moodId, styleId }) {
  const color = styleId === "classic" ? "text-[#b85b6b]" : styleId === "spotify" ? "text-[#ffd2df]" : "text-pink-100";
  if (["cinema", "starlight"].includes(moodId)) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {heartSeeds.slice(0, 6).map((heart) => (
        <Heart
          className={`ambient-heart absolute fill-current ${heart.id % 3 === 0 ? "h-4 w-4" : "h-3 w-3"} ${color}`}
          key={heart.id}
          style={{
            left: heart.left,
            top: `${(heart.id * 17 + 14) % 90}%`,
            "--delay": heart.delay,
            "--duration": heart.duration,
          }}
        />
      ))}
    </div>
  );
}

function StartGate({ audioSource, moodId, onBackToCreate, onStart, publishedMode, story }) {
  const scene = getRomanticScene(moodId);
  const light = scene.openingTone === "light";
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState(reducedMotion ? 3 : 0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timers = [
      window.setTimeout(() => setPhase(1), 180),
      window.setTimeout(() => setPhase(2), 720),
      window.setTimeout(() => setPhase(3), 1300),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion]);

  const audioHint =
    audioSource === "youtube"
      ? "O player da música aparece logo depois."
      : "Toque para começar com a trilha sonora.";

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-[#10070e]/96 px-6 py-12 text-center backdrop-blur-xl"
      data-no-nav
    >
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={scene.opening} />
      <div className={`absolute inset-0 ${scene.openingOverlay}`} />
      <div className={`absolute inset-0 ${light ? "bg-[#fff8ee]/18" : "bg-[linear-gradient(180deg,rgba(12,5,10,0.28),rgba(12,5,10,0.72))]"}`} />

      <div className="relative mx-auto grid w-full max-w-md gap-7">
        <div
          className={`gate-reveal mx-auto grid gap-4 ${phase >= 1 ? "is-visible" : ""} ${light ? "text-[#9a5260]" : "text-[#efb2c4]"}`}
        >
          <Heart className="heart-beat-glow mx-auto h-9 w-9 fill-current" />
          <span className="mx-auto h-px w-16 bg-current opacity-38" />
        </div>

        <div className="grid gap-3">
          <p
            className={`gate-reveal text-[11px] font-black uppercase tracking-[0.26em] ${phase >= 1 ? "is-visible" : ""} ${
              light ? "story-copy-dark text-[#8a4351]" : "story-copy-light text-pink-100"
            }`}
          >
            Uma história feita especialmente para
          </p>
          <h1
            className={`gate-reveal break-words font-display text-5xl leading-[0.88] sm:text-7xl ${phase >= 2 ? "is-visible" : ""} ${
              light ? "story-copy-dark text-[#3a2118]" : "story-copy-light"
            }`}
          >
            {story.toName || "meu amor"}
          </h1>
          <p
            className={`gate-reveal mx-auto max-w-sm text-base font-medium leading-7 ${phase >= 2 ? "is-visible" : ""} ${
              light ? "story-copy-dark text-[#51382c]" : "story-copy-muted"
            }`}
          >
            {audioHint}
          </p>
        </div>

        <div className={`gate-reveal grid gap-4 ${phase >= 3 ? "is-visible" : ""}`}>
          <button
            className={`mx-auto inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl px-10 text-base font-black shadow-[0_18px_52px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5 active:scale-[0.98] ${
              light ? "bg-[#7a4350] text-white hover:bg-[#8a4f5e]" : "bg-white text-[#1a0714] hover:bg-white/94"
            }`}
            onClick={onStart}
            type="button"
          >
            <Play className="h-5 w-5 fill-current" />
            Começar nossa história
          </button>
          {!publishedMode ? (
            <button
              className={`mx-auto text-sm font-medium underline underline-offset-4 transition ${
                light
                  ? "story-copy-dark text-[#51382c] decoration-[#51382c]/30 hover:text-[#7a4350]"
                  : "story-copy-muted decoration-white/36 hover:text-white"
              }`}
              onClick={onBackToCreate}
              type="button"
            >
              Voltar para editar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OpeningSlide({ active, moodId, story, theme }) {
  const line = `${story.toName || "Meu amor"}, preparei algo pra você...`;
  const { typed, reducedMotion } = useTypedText(line, active);
  const scene = getRomanticScene(moodId);
  const light = scene.openingTone === "light";

  return (
    <div className="scene-fade relative grid h-full w-full place-items-center overflow-hidden px-6 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={scene.opening} />
      <div className={`absolute inset-0 ${scene.openingOverlay}`} />
      <div
        className={`absolute inset-0 ${
          light
            ? "bg-[linear-gradient(180deg,rgba(255,250,241,0.2),rgba(255,250,241,0.64))]"
            : "bg-[linear-gradient(180deg,rgba(6,3,5,0.3),rgba(6,3,5,0.7))]"
        }`}
      />
      <div className="relative mx-auto grid w-full max-w-md gap-5 sm:gap-9">
        <div className={`mx-auto grid gap-3.5 ${light ? "text-[#9a5260]" : "text-[#efb2c4]"}`}>
          <Heart className="heart-beat-glow mx-auto h-6 w-6 fill-current" />
          <span className="mx-auto h-px w-14 bg-current opacity-36" />
        </div>
        <div>
          <p className={`mb-4 text-[11px] font-black uppercase tracking-[0.26em] ${light ? "story-copy-dark text-[#8a4351]" : theme.eyebrow}`}>
            Feito com tudo que sinto
          </p>
          <h1
            className={`min-h-[90px] break-words font-display text-[2.4rem] leading-[0.94] sm:min-h-32 sm:text-6xl ${
              light ? "story-copy-dark text-[#3a2118]" : theme.title
            } ${reducedMotion ? "" : "typing-caret"}`}
          >
            {typed}
          </h1>
        </div>
        <p
          className={`mx-auto max-w-sm text-sm font-medium leading-7 sm:text-base sm:leading-8 ${
            light ? "story-copy-dark text-[#51382c]" : theme.body
          }`}
        >
          {story.introMessage || "Eu juntei alguns pedaços da gente. Um por tela, no ritmo da nossa história."}
        </p>
      </div>
    </div>
  );
}

function TimeTogetherSlide({ moodId, story }) {
  const firstDate = getFirstChronologicalDate(story.moments);
  const scene = getRomanticScene(moodId);
  const parts = timeTogetherParts(firstDate);
  const stats = [
    { value: parts.years, label: durationLabel(parts.years, "ano", "anos") },
    { value: parts.months, label: durationLabel(parts.months, "mês", "meses") },
    { value: parts.days, label: durationLabel(parts.days, "dia", "dias") },
  ];

  return (
    <article className="scene-rise relative grid h-full w-full place-items-center overflow-hidden px-5 py-4 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={scene.time} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,8,24,0.5),rgba(20,8,24,0.9))]" />
      <div className="relative mx-auto grid w-full max-w-lg gap-6 sm:gap-8">
        <div className="grid gap-2">
          <p className="story-copy-light text-xs font-black uppercase tracking-[0.22em] text-[#ffe1e9]">Nosso tempo</p>
          <h2 className="story-copy-light font-display text-4xl leading-[0.94] sm:text-7xl">
            O tempo passou. A gente ficou.
          </h2>
          {firstDate ? (
            <p className="story-copy-muted mx-auto inline-flex items-center justify-center gap-2 text-sm font-bold">
              <CalendarHeart className="h-4 w-4 text-pink-200" />
              Desde {formatDate(firstDate)}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              className="gentle-pop grid min-h-32 place-items-center content-center gap-1.5 rounded-2xl border border-white/16 bg-black/34 px-2 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-sm sm:min-h-40"
              key={stat.label}
              style={{ animationDelay: `${index * 130}ms` }}
            >
              <strong className="stat-number-glow text-4xl font-black leading-none text-[#ffd2df] sm:text-6xl">{stat.value}</strong>
              <span className="story-copy-muted text-[9px] font-black uppercase tracking-[0.14em] sm:text-[11px]">{stat.label}</span>
            </div>
          ))}
        </div>

        <p className="story-copy-muted mx-auto max-w-sm text-base font-semibold leading-7">
          E mesmo assim, ainda parece que a parte mais bonita está só começando.
        </p>
      </div>
    </article>
  );
}

const COLLAGE_ROTATIONS = [-6, 4, -9, 5, -3, 7, -5, 6, -8];
const PHOTO_MOTION_CLASSES = [
  "photo-cinematic-motion",
  "photo-motion-out",
  "photo-motion-pan-r",
  "photo-motion-pan-l",
  "photo-motion-up",
];
function getMotionClass(index) {
  return PHOTO_MOTION_CLASSES[index % PHOTO_MOTION_CLASSES.length];
}

function CollageSlide({ story }) {
  const firstDate = getFirstChronologicalDate(story.moments);
  const place = story.city?.trim();
  const collagePhotos = (story.collagePhotos ?? []).filter(Boolean);
  const hasPhotos = collagePhotos.length > 0;

  const ambient = (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(108,33,53,0.22),transparent_70%)]" />
      <div className="absolute right-[8%] top-[8%] h-52 w-52 rounded-full bg-[radial-gradient(ellipse,rgba(240,201,122,0.07),transparent_70%)]" />
      <div className="absolute bottom-[10%] left-[4%] h-44 w-44 rounded-full bg-[radial-gradient(ellipse,rgba(232,160,184,0.09),transparent_70%)]" />
    </div>
  );

  const nameBlock = (
    <div className="luxury-rise grid gap-1" style={{ animationDelay: "120ms" }}>
      <span className="story-copy-light break-words font-display text-[2.8rem] italic leading-[0.9] text-white sm:text-6xl">
        {story.fromName || "Eu"}
      </span>
      <span className="story-copy-light font-display text-2xl leading-none text-[#e8a0b8]/52">&amp;</span>
      <span className="story-copy-light break-words font-display text-[2.8rem] italic leading-[0.9] text-white sm:text-6xl">
        {story.toName || "você"}
      </span>
    </div>
  );

  const pills = (firstDate || place) ? (
    <div
      className="luxury-rise mx-auto flex max-w-full flex-wrap items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.1em]"
      style={{ animationDelay: "320ms" }}
    >
      {firstDate ? (
        <span className="story-copy-light inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-2 backdrop-blur">
          <CalendarHeart className="h-3.5 w-3.5 text-[#f0c97a]" />
          {formatDate(firstDate)}
        </span>
      ) : null}
      {place ? (
        <span className="story-copy-light inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-2 backdrop-blur">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#f0c97a]" />
          <span className="truncate">{place}</span>
        </span>
      ) : null}
    </div>
  ) : null;

  if (!hasPhotos) {
    return (
      <article className="scene-fade relative grid h-full w-full place-items-center overflow-hidden bg-[#08050a] px-6 py-4 text-center">
        {ambient}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="luxury-rise absolute left-[4%] top-[10%] -rotate-[13deg] font-display text-4xl italic text-white/12" style={{ animationDelay: "60ms" }}>amor</span>
          <span className="luxury-rise absolute right-[5%] top-[7%] rotate-[9deg] text-[10px] font-black uppercase tracking-[0.26em] text-[#f0c97a]/26" style={{ animationDelay: "140ms" }}>sempre</span>
          <span className="luxury-rise absolute left-[2%] top-[40%] -rotate-[6deg] font-display text-xl italic text-[#e8a0b8]/22" style={{ animationDelay: "100ms" }}>desde sempre</span>
          <span className="luxury-rise absolute right-[3%] top-[46%] rotate-[7deg] font-display text-3xl italic text-white/11" style={{ animationDelay: "180ms" }}>juntos</span>
          <span className="luxury-rise absolute bottom-[17%] left-[4%] rotate-[11deg] font-display text-2xl italic text-[#f0c97a]/20" style={{ animationDelay: "80ms" }}>nossa</span>
          <span className="luxury-rise absolute bottom-[11%] right-[3%] -rotate-[8deg] text-[9px] font-black uppercase tracking-[0.22em] text-white/16" style={{ animationDelay: "220ms" }}>para sempre</span>
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-sm gap-5 text-center">
          <p className="luxury-rise story-copy-light text-[10px] font-black uppercase tracking-[0.28em] text-[#f0c97a]" style={{ animationDelay: "0ms" }}>a nossa história</p>
          {nameBlock}
          <div className="luxury-rise mx-auto flex items-center gap-3 text-[#e8a0b8]/50" style={{ animationDelay: "260ms" }}>
            <span className="h-px w-10 bg-current" />
            <Heart className="h-3 w-3 fill-current" />
            <span className="h-px w-10 bg-current" />
          </div>
          {pills}
        </div>
      </article>
    );
  }

  const shown = collagePhotos.slice(0, 9);
  const cols = shown.length <= 2 ? shown.length : shown.length <= 4 ? 2 : 3;
  const colClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <article className="scene-fade relative flex h-full w-full flex-col overflow-hidden bg-[#08050a]">
      {ambient}
      <div className="relative z-10 shrink-0 px-4 pb-2 pt-4 text-center">
        <p className="luxury-rise story-copy-light text-[10px] font-black uppercase tracking-[0.26em] text-[#f0c97a]" style={{ animationDelay: "0ms" }}>
          a nossa história
        </p>
      </div>
      <div className="relative min-h-0 flex-1 px-3">
        <div className={`grid h-full auto-rows-fr gap-1.5 ${colClass}`}>
          {shown.map((photo, i) => (
            <div
              key={i}
              className="luxury-rise relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.54)]"
              style={{
                animationDelay: `${60 + i * 70}ms`,
                borderRadius: "10px",
                transform: `rotate(${COLLAGE_ROTATIONS[i % COLLAGE_ROTATIONS.length]}deg)`,
              }}
            >
              <img alt="" className="photo-filter-luxury h-full w-full object-cover" src={photo} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 shrink-0 px-4 pb-3 pt-2 text-center">
        <div className="luxury-rise flex flex-col items-center gap-2" style={{ animationDelay: `${60 + shown.length * 70}ms` }}>
          <span className="story-copy-light break-words font-display text-2xl italic leading-none text-white sm:text-3xl">
            {story.fromName || "Eu"} &amp; {story.toName || "você"}
          </span>
          {pills}
        </div>
      </div>
    </article>
  );
}

function PhotoMosaicSlide({ story }) {
  const photoMoments = story.moments.filter((m) => !isBreath(m) && m.photo);
  const total = photoMoments.length;
  if (total === 0) return null;

  const cols = total === 1 ? 1 : total <= 4 ? 2 : 3;
  const colClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  const shown = photoMoments.slice(0, 12);
  const extra = total > 12 ? total - 12 : 0;

  return (
    <article className="scene-fade relative flex h-full w-full flex-col overflow-hidden bg-[#080508]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_55%,rgba(108,33,53,0.14),transparent_70%)]" />

      <div className="relative z-10 shrink-0 px-4 pb-2 pt-5">
        <p className="luxury-rise story-copy-light text-center text-[10px] font-black uppercase tracking-[0.26em] text-[#f0c97a]">
          tudo isso somos nós
        </p>
      </div>

      <div className="relative min-h-0 flex-1 px-3">
        <div className={`grid h-full auto-rows-fr gap-1 ${colClass}`}>
          {shown.map((moment, i) => {
            const spanFull = cols === 3 && i === 0 && total % 3 !== 0;
            return (
              <div
                key={moment.id}
                className={`luxury-rise relative overflow-hidden rounded-md ${spanFull ? "col-span-2" : ""}`}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <img
                  alt=""
                  className="photo-filter-luxury h-full w-full object-cover"
                  src={moment.photo}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/24 to-transparent" />
              </div>
            );
          })}
          {extra > 0 ? (
            <div className="luxury-rise relative flex items-center justify-center overflow-hidden rounded-md bg-white/6 backdrop-blur">
              <span className="font-display text-3xl italic text-white/52">+{extra}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 shrink-0 px-4 pb-4 pt-2">
        <p
          className="luxury-rise story-copy-muted text-center text-xs font-medium"
          style={{ animationDelay: "520ms" }}
        >
          cada foto, um pedaço do que somos
        </p>
      </div>
    </article>
  );
}

function ActSlide({ act, index, moodId, theme }) {
  const scene = getRomanticScene(moodId);
  const backdrop = scene.acts[index % scene.acts.length];
  const light = scene.actTone === "light";

  if (index % 2 === 1) {
    return (
      <article className="scene-paper grid h-full w-full overflow-hidden bg-[#f4eee6] text-[#31231d] sm:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[31svh] overflow-hidden sm:order-2 sm:min-h-0">
          <img alt="" className="h-full w-full object-cover" src={backdrop} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,238,230,0.04),rgba(244,238,230,0.28))] sm:bg-[linear-gradient(90deg,rgba(244,238,230,0.32),rgba(244,238,230,0.02))]" />
        </div>
        <div className="grid content-center gap-4 px-6 py-6 text-left sm:px-12">
          <div className="flex items-center gap-3 text-[#9a5260]">
            <span className="h-px w-10 bg-current opacity-32" />
            <Heart className="h-3.5 w-3.5 fill-current opacity-60" />
            <span className="h-px w-10 bg-current opacity-32" />
          </div>
          <h2 className="story-copy-dark max-w-lg break-words font-display text-5xl leading-[0.92] text-[#31231d] sm:text-7xl">
            {act.title}
          </h2>
          <p className="story-copy-dark max-w-md text-base font-semibold leading-7 text-[#503d33] sm:text-lg sm:leading-8">
            {act.subtitle}
          </p>
          <span className="mt-2 h-px w-16 bg-[#8a4351]/32" />
        </div>
      </article>
    );
  }

  return (
    <article className="scene-cut relative grid h-full w-full place-items-center overflow-hidden px-6 py-4 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={backdrop} />
      <div className={`absolute inset-0 ${light ? "bg-[#fffaf1]/78" : "bg-[linear-gradient(180deg,rgba(12,4,8,0.58),rgba(10,4,7,0.94))]"}`} />
      <div className="relative mx-auto grid max-w-xl gap-5 sm:gap-7">
        <div className={`mx-auto flex items-center gap-3 ${light ? "text-[#9a5260]" : "text-[#efb2c4]"}`}>
          <span className="h-px w-10 bg-current opacity-32" />
          <Heart className="h-3.5 w-3.5 fill-current opacity-60" />
          <span className="h-px w-10 bg-current opacity-32" />
        </div>
        <h2 className={`break-words font-display text-[2.8rem] leading-[0.88] sm:text-8xl ${light ? "story-copy-dark text-[#3a2118]" : theme.title}`}>
          {act.title}
        </h2>
        <span className={`mx-auto h-px w-20 ${light ? "bg-[#9a5260]/38" : "bg-pink-200/36"}`} />
        <p className={`mx-auto max-w-md text-base font-medium leading-7 sm:text-lg sm:leading-8 ${light ? "story-copy-dark text-[#51382c]" : theme.body}`}>
          {act.subtitle}
        </p>
      </div>
    </article>
  );
}

function BreathSlide({ breath }) {
  const preset = BREATH_PRESET_BY_ID[breath.breathStyle] ?? BREATH_PRESETS[0];
  const light = preset.light;

  return (
    <article className="scene-paper relative grid h-full w-full place-items-center overflow-hidden px-6 py-5 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={preset.background} />
      <div className={`absolute inset-0 ${light ? "bg-[#fffaf1]/80" : "bg-[linear-gradient(180deg,rgba(8,4,6,0.44),rgba(8,4,6,0.86))]"}`} />
      <div className={`relative mx-auto grid w-full max-w-xl gap-5 sm:gap-6 ${light ? "text-[#3a2118]" : "text-white"}`}>
        <div className="mx-auto grid gap-3.5">
          <Heart className={`mx-auto h-6 w-6 fill-current ${light ? "text-[#9a5260]" : "text-[#ffd2df]"}`} />
          <span className={`mx-auto h-px w-16 ${light ? "bg-[#9a5260]/38" : "bg-[#ffd2df]/44"}`} />
        </div>
        <p className={`text-[10px] font-black uppercase tracking-[0.26em] sm:text-[11px] ${light ? "story-copy-dark text-[#8a4351]" : "story-copy-light text-[#ffd2df]"}`}>
          {preset.eyebrow}
        </p>
        <h2 className={`break-words font-display text-[2.6rem] leading-[0.88] sm:text-8xl ${light ? "story-copy-dark text-[#3a2118]" : "story-copy-light"}`}>
          {breath.title}
        </h2>
        <p className={`mx-auto max-w-lg text-lg font-medium leading-8 sm:text-2xl sm:leading-9 ${light ? "story-copy-dark text-[#4e372c]" : "story-copy-muted"}`}>
          {breath.text}
        </p>
      </div>
    </article>
  );
}

function ReasonsSlide({ story, theme }) {
  const reasons = story.reasons.filter(Boolean);
  const title =
    reasons.length === 1
      ? "O que não sai da minha cabeça."
      : reasons.length === 2
        ? "Razões que me fazem certeza de você."
        : "O que eu amo em você.";

  return (
    <article className="scene-paper relative grid h-full w-full content-center gap-5 overflow-hidden px-5 py-4 text-[#3a2118] sm:max-w-3xl sm:gap-7">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/pressed-flower-letter.webp" />
      <div className="absolute inset-0 bg-[#fffaf1]/82" />
      <div className="relative grid gap-3 text-center">
        <p className="story-copy-dark text-xs font-black uppercase tracking-[0.22em] text-[#8a4351]">No meio de tudo isso</p>
        <h2 className="story-copy-dark font-display text-4xl leading-[0.94] text-[#3a2118] sm:text-7xl">{title}</h2>
      </div>
      <div className="relative grid gap-3">
        {reasons.map((reason, index) => (
          <div
            className="gentle-pop grid grid-cols-[38px_1fr] items-center gap-3 border-b border-[#6f4936]/22 py-3 text-left sm:grid-cols-[46px_1fr] sm:gap-4 sm:py-4"
            key={`${reason}-${index}`}
            style={{ animationDelay: `${index * 130}ms` }}
          >
            <span className="story-copy-dark text-3xl font-black text-[#8a4351] sm:text-4xl">{String(index + 1).padStart(2, "0")}</span>
            <p className="story-copy-dark text-base font-bold leading-6 text-[#3f2a20] sm:text-xl sm:leading-7">{reason}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function FutureSlide({ moodId, story }) {
  const scene = getRomanticScene(moodId);
  const light = scene.futureTone === "light";

  return (
    <article className="scene-fade relative grid h-full w-full place-items-center overflow-hidden px-6 py-4 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={scene.future} />
      <div className={`absolute inset-0 ${light ? "bg-[#fff8ee]/64" : "bg-[linear-gradient(180deg,rgba(6,3,6,0.38),rgba(6,3,6,0.88))]"}`} />
      <div
        className={`absolute inset-x-[8%] top-1/2 h-px bg-gradient-to-r from-transparent to-transparent ${
          light ? "via-[#6f3948]/22" : "via-white/20"
        }`}
      />
      <div className="relative mx-auto grid max-w-xl gap-5 sm:gap-7">
        <Sparkles className={`mx-auto h-7 w-7 ${light ? "text-[#8a4351]" : "text-[#ffd2df]"}`} />
        <p className={`text-[11px] font-black uppercase tracking-[0.26em] ${light ? "story-copy-dark text-[#8a4351]" : "story-copy-light text-[#ffe1e9]"}`}>
          O melhor ainda está por vir
        </p>
        <h2 className={`font-display text-[2.6rem] leading-[0.92] sm:text-7xl ${light ? "story-copy-dark text-[#3a2118]" : "story-copy-light text-white"}`}>
          Ainda quero viver...
        </h2>
        <span className={`mx-auto h-px w-16 ${light ? "bg-[#9a5260]/32" : "bg-pink-200/32"}`} />
        <p className={`mx-auto max-w-lg text-lg font-medium leading-8 sm:text-2xl sm:leading-9 ${light ? "story-copy-dark text-[#4a3326]" : "story-copy-muted"}`}>
          {story.futureMessage}
        </p>
      </div>
    </article>
  );
}

function MomentSlide({ index, moment, moodId, moments, styleId, theme }) {
  const firstDate = getFirstChronologicalDate(moments);
  const dayNumber = daysBetween(firstDate, moment.date);

  if (styleId === "blend") {
    if (moodId === "letters") {
      return <LetterMoodMoment dayNumber={dayNumber} index={index} moment={moment} />;
    }

    if (moodId === "cinema") {
      return <CinemaMoment dayNumber={dayNumber} index={index} moment={moment} />;
    }

    if (moodId === "starlight") {
      return <StarlightMoment dayNumber={dayNumber} index={index} moment={moment} />;
    }

    return (
      <BlendSequenceMoment
        dayNumber={dayNumber}
        index={index}
        moment={moment}
        moments={moments}
      />
    );
  }

  if (moment.layout === "quote") {
    return <QuoteMoment dayNumber={dayNumber} moment={moment} theme={theme} />;
  }

  if (moment.layout === "number") {
    return <NumberMoment dayNumber={dayNumber} moment={moment} theme={theme} />;
  }

  if (moment.layout === "letter") {
    return <LetterMoment dayNumber={dayNumber} moment={moment} />;
  }

  if (styleId === "classic") {
    return <ClassicMoment dayNumber={dayNumber} index={index} moment={moment} theme={theme} />;
  }

  if (styleId === "art") {
    return <ArtMoment dayNumber={dayNumber} index={index} moment={moment} theme={theme} />;
  }

  if (styleId === "timeline") {
    return <TimelineMoment index={index} moment={moment} moments={moments} theme={theme} />;
  }

  return <SpotifyMoment dayNumber={dayNumber} index={index} moment={moment} theme={theme} />;
}

function LetterMoodMoment({ dayNumber, index, moment }) {
  const variant = index % 3;

  if (variant === 1) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/minimal-blush-thread.webp" />
        <div className="absolute inset-0 bg-[#fffaf1]/16" />
        <div className="relative h-full">
          <LetterMoment dayNumber={dayNumber} moment={moment} />
        </div>
      </div>
    );
  }

  if (variant === 2) {
    return <QuoteMoment dayNumber={dayNumber} moment={moment} theme={getTheme("blend")} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/minimal-window-light.webp" />
      <div className="absolute inset-0 bg-[#fffaf0]/42" />
      <div className="relative h-full">
        <ClassicMoment dayNumber={dayNumber} moment={moment} theme={getTheme("classic")} />
      </div>
    </div>
  );
}

function CinemaMoment({ dayNumber, index, moment }) {
  return (
    <article className="scene-cinema letterbox relative h-full w-full overflow-hidden bg-black">
      <img
        alt=""
        className={`${getMotionClass(index)} photo-filter-luxury h-full w-full object-cover`}
        src={moment.photo}
        style={getMomentImageStyle(moment)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,2,4,0.28),rgba(4,2,4,0.06)_34%,rgba(4,2,4,0.96)_100%)]" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-52" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[clamp(44px,8svh,72px)] text-[10px] font-black uppercase tracking-[0.22em] text-white sm:px-10">
        <span className="story-copy-light">Nossa cena</span>
        <span className="story-copy-light">{relationshipDayLabel(dayNumber)}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 grid gap-3 px-5 pb-[clamp(48px,9svh,80px)] sm:max-w-4xl sm:gap-4 sm:px-12">
        {moment.date ? (
          <p className="story-copy-light text-[11px] font-black uppercase tracking-[0.2em] text-[#ffd2df]">
            {formatDateWithWeekday(moment.date)}
          </p>
        ) : null}
        <h2 className="story-copy-light max-w-3xl font-display text-[2.2rem] leading-[0.9] sm:text-7xl">{moment.title}</h2>
        {moment.text ? (
          <p className="story-copy-muted max-w-2xl text-sm font-medium leading-6 sm:text-xl sm:leading-8">{moment.text}</p>
        ) : null}
      </div>
    </article>
  );
}

function StarlightMoment({ dayNumber, index, moment }) {
  return (
    <article className="scene-stars relative grid h-full w-full content-center gap-4 overflow-hidden px-5 py-2 text-center sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:gap-10 sm:px-10 sm:text-left">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/minimal-charcoal-gold.webp" />
      <div className="absolute inset-0 bg-black/36" />
      {constellationStars.slice(0, 12).map((star) => (
        <span
          className="constellation-star pointer-events-none absolute rounded-full bg-[#f7d889] shadow-[0_0_10px_rgba(247,216,137,0.72)]"
          key={star.id}
          style={{
            animationDelay: star.delay,
            height: star.size,
            left: star.left,
            top: star.top,
            width: star.size,
          }}
        />
      ))}

      <div className="relative mx-auto h-[40svh] w-full max-w-[300px] sm:h-auto sm:max-w-sm">
        <div className="h-full overflow-hidden rounded-t-[999px] border border-[#f7d889]/52 bg-black/38 p-2.5 shadow-[0_28px_90px_rgba(0,0,0,0.52),0_0_60px_rgba(247,216,137,0.08)] sm:aspect-[4/5] sm:h-auto">
          <div className="relative h-full overflow-hidden rounded-t-[999px]">
            <img
              alt=""
              className={`${getMotionClass(index)} photo-filter-luxury h-full w-full object-cover`}
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(4,4,3,0.72))]" />
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 h-[2px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f7d889]/52 to-transparent" />
      </div>

      <div className="relative grid gap-2.5 sm:gap-4">
        <p className="gold-text-glow text-[10px] font-black uppercase tracking-[0.24em] text-[#f7d889] sm:text-xs">
          Uma estrela nossa
        </p>
        <div>
          <p className="gold-text-glow mb-1.5 text-3xl font-black leading-none text-[#f7d889] sm:text-7xl">{relationshipDayLabel(dayNumber)}</p>
          <h2 className="story-copy-light font-display text-3xl leading-[0.92] sm:text-6xl">{moment.title}</h2>
        </div>
        {moment.text ? (
          <p className="story-copy-muted mx-auto max-w-xl text-sm font-medium leading-6 sm:mx-0 sm:text-lg sm:leading-8">{moment.text}</p>
        ) : null}
        {moment.date ? (
          <p className="story-copy-light text-[10px] font-black uppercase tracking-[0.14em] sm:text-[11px]">
            {formatDateWithWeekday(moment.date)}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function BlendSequenceMoment({ dayNumber, index, moment, moments }) {
  const variant = index % 9;

  if (variant === 0) {
    return <CleanPhotoMoment dayNumber={dayNumber} index={index} moment={moment} moments={moments} />;
  }

  if (variant === 1) {
    return <QuoteMoment dayNumber={dayNumber} moment={moment} theme={getTheme("blend")} />;
  }

  if (variant === 2) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/pressed-flower-letter.webp" />
        <div className="absolute inset-0 bg-[#fffaf1]/28" />
        <div className="relative h-full">
          <LetterMoment dayNumber={dayNumber} moment={moment} />
        </div>
      </div>
    );
  }

  if (variant === 3) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/minimal-oxblood-paper.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,5,8,0.08),rgba(10,5,8,0.48))]" />
        <div className="relative h-full">
          <NumberMoment dayNumber={dayNumber} moment={moment} theme={getTheme("spotify")} />
        </div>
      </div>
    );
  }

  if (variant === 4) {
    return <CleanEditorialMoment dayNumber={dayNumber} index={index} moment={moment} />;
  }

  if (variant === 5) {
    return <ArtMoment dayNumber={dayNumber} index={index} moment={moment} theme={getTheme("art")} />;
  }

  if (variant === 6) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/analog-worktable.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,7,0.46),rgba(12,7,7,0.84))]" />
        <div className="relative h-full">
          <TimelineMoment index={index} moment={moment} moments={moments} theme={getTheme("timeline")} />
        </div>
      </div>
    );
  }

  if (variant === 7) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/ivory-roses-painting.webp" />
        <div className="absolute inset-0 bg-[#fffaf0]/68" />
        <div className="relative h-full">
          <ClassicMoment dayNumber={dayNumber} moment={moment} theme={getTheme("classic")} />
        </div>
      </div>
    );
  }

  return <BlendMoment dayNumber={dayNumber} index={index} moment={moment} moments={moments} />;
}

function CleanPhotoMoment({ dayNumber, index, moment, moments }) {
  return (
    <article className="scene-fade grid h-full w-full overflow-hidden bg-[#f5efe7] text-[#30231d] sm:grid-cols-[1.08fr_0.92fr]">
      <div className="relative min-h-[44svh] overflow-hidden sm:min-h-0">
        <img
          alt=""
          className={`${getMotionClass(index)} photo-filter-timeline h-full w-full object-cover`}
          src={moment.photo}
          style={getMomentImageStyle(moment)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(20,12,10,0.34))] sm:bg-[linear-gradient(90deg,transparent_72%,rgba(245,239,231,0.32))]" />
        <p className="story-copy-light absolute bottom-3 left-4 text-[10px] font-black uppercase sm:bottom-5 sm:left-6 sm:text-xs">
          foto {index + 1} de {moments.length}
        </p>
      </div>

      <div className="grid content-center gap-3 px-5 py-5 text-left sm:px-10">
        <p className="story-copy-dark text-[10px] font-black uppercase text-[#8a4351] sm:text-xs">
          {relationshipDayLabel(dayNumber)}
        </p>
        <h2 className="story-copy-dark font-display text-4xl leading-[0.94] text-[#30231d] sm:text-6xl">{moment.title}</h2>
        {moment.date ? (
          <p className="story-copy-dark text-xs font-black uppercase text-[#745444]">{formatDateWithWeekday(moment.date)}</p>
        ) : null}
        {moment.text ? (
          <p className="story-copy-dark max-w-lg text-sm font-semibold leading-6 text-[#4f3c32] sm:text-lg sm:leading-8">
            {moment.text}
          </p>
        ) : null}
        <div className="mt-1">
          <WeatherBadge moment={moment} tone="light" />
        </div>
      </div>
    </article>
  );
}

function CleanEditorialMoment({ dayNumber, index, moment }) {
  return (
    <article className="scene-fade grid h-full w-full content-center gap-4 overflow-hidden bg-[#11100f] px-5 py-3 text-white sm:max-w-4xl sm:gap-6 sm:px-10">
      <div className="flex items-center justify-between border-b border-white/18 pb-3 text-[10px] font-black uppercase text-white/82 sm:text-xs">
        <span>Nossa memória</span>
        <span>{relationshipDayLabel(dayNumber)}</span>
      </div>
      <div className="relative h-[42svh] overflow-hidden bg-[#211d1a] sm:aspect-[16/9] sm:h-auto">
        <img
          alt=""
          className={`${getMotionClass(index)} photo-filter-classic h-full w-full object-cover`}
          src={moment.photo}
          style={getMomentImageStyle(moment)}
        />
        <div className="absolute inset-0 border border-white/12" />
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_0.9fr] sm:items-end sm:gap-8">
        <div>
          {moment.date ? (
            <p className="story-copy-light text-[10px] font-black uppercase text-[#e8b8c6] sm:text-xs">
              {formatDateWithWeekday(moment.date)}
            </p>
          ) : null}
          <h2 className="story-copy-light mt-2 font-display text-4xl leading-[0.94] sm:text-6xl">{moment.title}</h2>
        </div>
        {moment.text ? (
          <p className="story-copy-muted text-sm font-semibold leading-6 sm:text-lg sm:leading-8">{moment.text}</p>
        ) : null}
      </div>
    </article>
  );
}

function QuoteMoment({ dayNumber, moment, theme }) {
  return (
    <article className="scene-cinema relative h-full w-full overflow-hidden">
      <img
        alt=""
        className="photo-cinematic-motion h-full w-full object-cover"
        src={moment.photo}
        style={getMomentImageStyle(moment)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,8,0.5),rgba(8,4,8,0.64)_35%,rgba(8,4,8,0.98)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 grid gap-3 px-5 pb-6 sm:gap-4 sm:px-12 sm:pb-8">
        <p className={`text-[11px] font-black uppercase tracking-[0.24em] ${theme.eyebrow}`}>
          {relationshipDayLabel(dayNumber)}
        </p>
        <div className="relative">
          <span className="pointer-events-none absolute -left-1 -top-5 font-display text-[4.5rem] leading-none text-white/10 sm:-top-7 sm:text-[7rem]">{'"'}</span>
          <h2 className="story-copy-light max-w-3xl font-display text-[1.9rem] leading-[1.0] sm:text-6xl">
            {moment.text || moment.title}
          </h2>
        </div>
        {moment.text || moment.date ? (
          <div className="story-copy-muted flex flex-wrap items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm">
            {moment.text ? <span>{moment.title}</span> : null}
            {moment.date ? (
              <>
                {moment.text ? <span className="h-1 w-1 rounded-full bg-white/44" /> : null}
                <span>{formatDateWithWeekday(moment.date)}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function NumberMoment({ dayNumber, moment, theme }) {
  const hasDayNumber = Number.isFinite(dayNumber);

  return (
    <article className="scene-rise relative grid h-full w-full content-center gap-3 overflow-hidden px-4 py-2 sm:max-w-6xl sm:grid-cols-[1.08fr_0.92fr] sm:items-center sm:gap-10 sm:px-8">
      <div className="absolute -right-6 top-10 text-[11rem] font-black leading-none text-white/[0.05] sm:text-[20rem]">
        {hasDayNumber ? dayNumber : <Heart className="h-40 w-40 fill-current sm:h-72 sm:w-72" />}
      </div>
      <div className="relative z-10 order-2 grid gap-2 sm:order-1 sm:gap-4">
        <p className={`text-xs font-black uppercase tracking-[0.22em] ${theme.eyebrow}`}>
          {hasDayNumber ? "Um número que virou história" : "Uma memória que virou história"}
        </p>
        {hasDayNumber ? (
          <p className="text-[4.25rem] font-black leading-[0.8] text-[#ffd2df] sm:text-[10rem]">{dayNumber}</p>
        ) : (
          <Heart className="h-16 w-16 fill-[#ffd2df] text-[#ffd2df] sm:h-28 sm:w-28" />
        )}
        <p className="story-copy-light text-2xl font-black leading-none sm:text-5xl">
          {hasDayNumber ? (dayNumber === 1 ? "dia inesquecível" : "dias juntos") : "um pedaço da gente"}
        </p>
        {moment.text ? (
          <p className={`mt-3 max-w-md text-sm font-semibold leading-6 sm:text-lg sm:leading-8 ${theme.body}`}>{moment.text}</p>
        ) : null}
      </div>
      <div className="relative z-10 order-1 mx-auto h-[43svh] w-full max-w-md sm:order-2 sm:h-[min(72vh,680px)]">
        <div className="relative h-full overflow-hidden rounded-md border border-white/14 bg-black/30 shadow-glow sm:rounded-lg">
          <img
            alt=""
            className="photo-cinematic-motion photo-filter-spotify h-full w-full object-cover"
            src={moment.photo}
            style={getMomentImageStyle(moment)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(5,3,5,0.88)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 grid gap-1.5 p-4 sm:p-6">
            <h2 className="story-copy-light text-2xl font-black leading-[0.94] sm:text-4xl">{moment.title}</h2>
            {moment.date ? (
              <p className="story-copy-muted text-[9px] font-black uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.12em]">
                {formatDateWithWeekday(moment.date)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function LetterMoment({ dayNumber, moment }) {
  return (
    <article className="scene-paper grid h-full w-full content-center px-4 py-2 text-[#3a2118] sm:max-w-4xl">
      <div className="relative mx-auto w-full max-w-2xl rounded-sm border border-[#b8873a]/36 bg-[#fff5e6] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:p-5">
        <div className="absolute inset-2 border border-[#b8873a]/18" />
        <div className="relative grid gap-4">
          <div className="h-[41svh] overflow-hidden border-4 border-white bg-white shadow-md sm:h-[min(58vh,560px)]">
            <img
              alt=""
              className="photo-cinematic-motion h-full w-full object-cover"
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9a5260] sm:text-[11px]">
              {relationshipDayLabel(dayNumber)}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-none sm:text-5xl">{moment.title}</h2>
          </div>
          {moment.text ? <p className="font-display text-lg leading-7 sm:text-2xl sm:leading-9">{moment.text}</p> : null}
          {moment.text || moment.date ? <div className="h-px bg-[#b8873a]/22" /> : null}
          {moment.date ? (
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7b5426]">{formatDateWithWeekday(moment.date)}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SpotifyMoment({ dayNumber, index, moment, theme }) {
  return (
    <article className="scene-rise grid h-full w-full content-center gap-3 px-5 py-2 sm:max-w-5xl sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:gap-6 sm:px-8">
      <div className="pointer-events-none absolute right-2 top-14 -z-10 text-[8rem] font-black leading-none text-white/[0.06] sm:text-[16rem]">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="mx-auto h-[40svh] w-full max-w-md">
        <div className="gentle-pop relative h-full overflow-hidden rounded-md border border-white/12 bg-black shadow-glow sm:aspect-square sm:h-auto">
          <img
            alt=""
            className={`${getMotionClass(index)} photo-filter-spotify h-full w-full object-cover`}
            src={moment.photo}
            style={getMomentImageStyle(moment)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(0,0,0,0.62))]" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100 sm:text-xs">Nossa foto</p>
            <p className="mt-1 text-sm font-black text-white sm:text-lg">{moment.title}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-5">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.24em] ${theme.eyebrow}`}>De coração aberto</p>
        <div>
          <p className="mb-1 text-3xl font-black leading-none text-[#ffd2df] sm:mb-2 sm:text-8xl">{relationshipDayLabel(dayNumber)}</p>
          <h2 className="max-w-xl text-3xl font-black leading-[0.92] text-white sm:text-7xl">{moment.title}</h2>
        </div>
        {moment.date ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-black sm:py-2 sm:text-xs sm:tracking-[0.1em]">
            <CalendarHeart className="h-4 w-4" />
            {formatDateWithWeekday(moment.date)}
          </p>
        ) : null}
        <WeatherBadge moment={moment} />
        {moment.text ? (
          <p className="story-copy-muted max-w-xl text-sm font-semibold leading-6 sm:text-xl sm:font-bold sm:leading-8">{moment.text}</p>
        ) : null}
        <div className="hidden gap-2 sm:grid">
          <div className="h-2 overflow-hidden rounded-full bg-white/16">
            <div className="h-full w-2/3 rounded-full bg-[#ffd2df]" />
          </div>
          <div className="story-copy-muted flex justify-between text-[11px] font-black uppercase tracking-[0.16em]">
            <span>{relationshipDayLabel(dayNumber)}</span>
            <span>Tocando agora</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ClassicMoment({ dayNumber, moment, theme }) {
  const relationshipLabel = Number.isFinite(dayNumber)
    ? dayNumber === 1
      ? "Primeiro dia da nossa historia"
      : `${pluralizeDay(dayNumber)} de historia`
    : "Uma lembranca da nossa historia";

  return (
    <article className="scene-paper grid h-full w-full content-center gap-3 px-5 py-2 text-center sm:max-w-3xl sm:gap-5">
      <div className="mx-auto h-[40svh] w-full max-w-[310px] sm:h-auto sm:max-w-sm">
        <div className="relative h-full rounded-sm border border-[#b8873a]/45 bg-[#fff7e8] p-2 shadow-[0_28px_80px_rgba(75,39,18,0.22)] sm:p-3">
          <div className="absolute -inset-2 -z-10 border border-[#caa65b]/30" />
          <div className="relative h-full overflow-hidden rounded-sm sm:aspect-[4/5] sm:h-auto">
            <img
              alt=""
              className="photo-cinematic-motion photo-filter-classic h-full w-full object-cover"
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_44%,rgba(46,25,15,0.38)_100%)]" />
          </div>
        </div>
      </div>
      <p className={`text-xs font-black uppercase tracking-[0.22em] ${theme.eyebrow}`}>
        {relationshipLabel}
      </p>
      <h2 className={`mx-auto max-w-2xl text-3xl leading-[0.94] sm:text-6xl ${theme.title}`}>{moment.title}</h2>
      {moment.date ? (
        <p className="font-display text-base text-[#7b5426] sm:text-xl">{formatDateWithWeekday(moment.date)}</p>
      ) : null}
      <div className="mx-auto">
        <WeatherBadge moment={moment} tone="light" />
      </div>
      {moment.text ? (
        <p className={`mx-auto max-w-xl text-sm font-semibold leading-6 sm:text-lg sm:leading-8 ${theme.body}`}>{moment.text}</p>
      ) : null}
    </article>
  );
}

function ArtMoment({ dayNumber, index, moment, theme }) {
  const rotate = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  return (
    <article className="scene-cut relative grid h-full w-full content-center gap-3 overflow-hidden px-5 py-2 sm:max-w-5xl sm:grid-cols-[1.05fr_0.95fr] sm:items-center sm:gap-10">
      <img
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/theme/ivory-roses-painting.webp"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#180a12]/84 mix-blend-multiply" />

      <div className="relative mx-auto h-[40svh] w-full max-w-[330px] sm:h-[570px] sm:max-w-sm">
        <div className={`absolute left-[4%] top-[3%] h-[82%] w-[76%] ${rotate} bg-[#f5eddf] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.34)]`}>
          <div className="relative h-full overflow-hidden">
            <img
              alt=""
              className={`${getMotionClass(index)} photo-filter-art h-full w-full object-cover`}
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(28,15,20,0.28))]" />
          </div>
        </div>

        <div className="absolute bottom-[2%] right-[1%] h-[39%] w-[46%] rotate-3 bg-[#f5eddf] p-2 shadow-[0_22px_50px_rgba(0,0,0,0.38)]">
          <div className="relative h-full overflow-hidden">
            <img
              alt=""
              className="photo-filter-art h-full w-full object-cover transition-transform duration-700"
              src={moment.photo}
              style={getMomentImageStyle(moment, { xOffset: 18, yOffset: 8, zoomBoost: 0.42 })}
            />
          </div>
        </div>

        <div className="absolute right-[2%] top-[8%] h-[20%] w-[34%] -rotate-2 overflow-hidden border-4 border-[#f5eddf] shadow-[0_16px_38px_rgba(0,0,0,0.3)]">
          <img
            alt=""
            className="photo-filter-art h-full w-full object-cover transition-transform duration-700"
            src={moment.photo}
            style={getMomentImageStyle(moment, { xOffset: -16, yOffset: -12, zoomBoost: 0.58 })}
          />
        </div>

        <div className="absolute bottom-[7%] left-[2%] grid h-11 w-11 place-items-center rounded-full border border-[#f5eddf]/70 bg-[#2a1122]/88 text-[#f8c9b4] shadow-soft sm:h-14 sm:w-14">
          <Heart className="h-5 w-5 fill-current" />
        </div>
      </div>

      <div className="relative z-10 grid gap-2.5 sm:gap-4">
        <p className={`text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em] ${theme.eyebrow}`}>Guardado assim</p>
        <h2 className="story-copy-light font-display text-3xl leading-[0.96] sm:text-7xl">{moment.title}</h2>
        {moment.date ? (
          <p className="story-copy-light w-fit border-b border-[#f8c9b4]/64 pb-1.5 text-xs font-black text-[#fff1e8] sm:pb-2 sm:text-sm">
            {formatDateWithWeekday(moment.date)}
          </p>
        ) : null}
        <WeatherBadge moment={moment} />
        {moment.text ? (
          <p className="story-copy-muted max-w-lg text-sm font-semibold leading-6 sm:text-xl sm:leading-8">{moment.text}</p>
        ) : null}
      </div>
    </article>
  );
}

function TimelineMoment({ index, moment, moments, theme }) {
  return (
    <article className="scene-rise grid h-full w-full grid-cols-[38px_1fr] gap-3 px-4 py-2 sm:max-w-4xl sm:grid-cols-[86px_1fr] sm:items-center sm:gap-4">
      <div className="relative h-full min-h-[360px] sm:min-h-[440px]">
        <div className="timeline-grow absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-[#f0cfac] via-white/50 to-pink-300" />
        {moments.map((item, itemIndex) => (
          <div
            className="absolute left-1/2 grid -translate-x-1/2 place-items-center"
            key={item.id}
            style={{ top: `${10 + (itemIndex / Math.max(1, moments.length - 1)) * 78}%` }}
          >
            <span
              className={`h-4 w-4 rounded-full border-2 sm:h-5 sm:w-5 ${
                itemIndex === index ? "border-white bg-pink-300 shadow-glow" : "border-white/44 bg-[#12131b]"
              }`}
            />
            {itemIndex === index ? (
            <span className="mt-2 whitespace-nowrap rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#12131b]">
              {item.date ? formatDate(item.date).split(" de ")[0] : String(itemIndex + 1).padStart(2, "0")}
            </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid content-center gap-3 sm:gap-5">
        <div className="relative h-[40svh] overflow-hidden rounded-md border border-white/12 bg-white/8 shadow-soft sm:aspect-[16/10] sm:h-auto sm:rounded-lg">
          <img
            alt=""
            className={`${getMotionClass(index)} photo-filter-timeline h-full w-full object-cover`}
            src={moment.photo}
            style={getMomentImageStyle(moment)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.58))]" />
          <p className="absolute bottom-3 left-3 rounded-full bg-[#fff1df] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#3a2118] sm:bottom-4 sm:left-4 sm:py-2 sm:text-xs sm:tracking-[0.14em]">
            nossa foto
          </p>
        </div>
        <div className="grid gap-3">
          {moment.date ? (
            <p className={`text-xs font-black uppercase tracking-[0.22em] ${theme.eyebrow}`}>{formatDateWithWeekday(moment.date)}</p>
          ) : null}
          <h2 className={`text-3xl leading-[0.96] sm:text-6xl ${theme.title}`}>{moment.title}</h2>
          <WeatherBadge moment={moment} />
          {moment.text ? (
            <p className={`max-w-2xl text-sm font-semibold leading-6 sm:text-lg sm:leading-8 ${theme.body}`}>{moment.text}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function BlendMoment({ dayNumber, index, moment, moments }) {
  return (
    <article className="scene-cut relative grid h-full w-full content-center gap-3 overflow-hidden px-5 py-2 sm:max-w-5xl sm:grid-cols-[0.95fr_1.05fr] sm:items-center sm:gap-10">
      <img
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/theme/minimal-charcoal-gold.webp"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.28),rgba(8,7,6,0.8))]" />
      <div className="absolute right-3 top-2 text-[6rem] font-black leading-none text-white/[0.06] sm:right-4 sm:top-16 sm:text-[15rem]">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative mx-auto h-[42svh] w-full max-w-[330px] sm:h-[560px] sm:max-w-sm">
        <div className="absolute left-[4%] top-[2%] h-[88%] w-[82%] -rotate-2 border border-[#f7d889]/38 bg-[#fff4db] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.36)]">
          <div className="absolute -left-5 top-6 h-[78%] w-px bg-gradient-to-b from-[#f0cfac] via-white to-pink-300" />
          <span className="absolute -left-[28px] top-8 h-4 w-4 rounded-full border-2 border-white bg-pink-300" />
          <span className="absolute -left-[28px] bottom-8 h-4 w-4 rounded-full border-2 border-white bg-[#f0cfac]" />
          <div className="relative h-full overflow-hidden rounded-sm">
            <img
              alt=""
              className={`${getMotionClass(index)} photo-filter-spotify h-full w-full object-cover`}
              src={moment.photo}
              style={getMomentImageStyle(moment)}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_45%,rgba(0,0,0,0.38)_100%)]" />
            <p className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#141414]">
              nossa lembrança
            </p>
          </div>
        </div>

        <div className="absolute bottom-[1%] right-[1%] h-[37%] w-[43%] rotate-3 border-[6px] border-white bg-white shadow-[0_22px_55px_rgba(0,0,0,0.4)]">
          <img
            alt=""
            className="photo-filter-classic h-full w-full object-cover transition-transform duration-700"
            src={moment.photo}
            style={getMomentImageStyle(moment, { xOffset: 17, yOffset: 10, zoomBoost: 0.48 })}
          />
        </div>

        <div className="absolute right-[3%] top-[7%] grid h-10 w-10 place-items-center rounded-full border border-white/28 bg-[#6c2435]/90 text-[#ffd2df] shadow-soft sm:h-12 sm:w-12">
          <Heart className="h-4 w-4 fill-current" />
        </div>
      </div>

      <div className="relative z-10 grid gap-2.5 sm:gap-3">
        <p className="story-copy-light text-[10px] font-black uppercase tracking-[0.18em] text-pink-100 sm:text-xs sm:tracking-[0.22em]">Um pedaço da gente</p>
        <div>
          <p className="mb-1 text-3xl font-black leading-none text-[#ffd2df] sm:text-8xl">{relationshipDayLabel(dayNumber)}</p>
          <h2 className="story-copy-light max-w-xl text-3xl font-black leading-[0.92] sm:text-7xl">{moment.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {moment.date ? (
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-black sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
              <CalendarHeart className="h-4 w-4" />
              {formatDateWithWeekday(moment.date)}
            </p>
          ) : null}
          <WeatherBadge moment={moment} />
        </div>
        {moment.text ? (
          <p className="story-copy-muted max-w-xl text-sm font-semibold leading-6 sm:text-xl sm:font-bold sm:leading-8">{moment.text}</p>
        ) : null}
      </div>
    </article>
  );
}

function SecretLetterSlide({ story }) {
  const [revealed, setRevealed] = useState(false);
  const message =
    story.finalMessage ||
    `${story.toName || "Meu amor"}, se eu pudesse escolher outra vez, ainda escolheria você. Em todos os começos, em todas as versões de mim.`;

  return (
    <article className="scene-paper relative grid h-full w-full place-items-center overflow-hidden px-5 py-4 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src="/theme/minimal-blush-thread.webp" />
      <div className="absolute inset-0 bg-[#fffaf1]/18" />

      {!revealed ? (
        <div className="relative mx-auto grid w-full max-w-sm gap-5 text-[#3a2118]">
          <button
            className="group mx-auto grid w-full gap-6 border border-[#74412f]/22 bg-[#fffbf0]/95 px-7 py-10 text-center shadow-[0_32px_100px_rgba(62,34,24,0.24)] backdrop-blur-sm transition hover:-translate-y-1.5 hover:shadow-[0_40px_120px_rgba(62,34,24,0.3)] sm:px-10 sm:py-12"
            data-no-nav
            onClick={() => setRevealed(true)}
            type="button"
          >
            <span className="wax-seal-pulse mx-auto grid h-[88px] w-[88px] place-items-center rounded-full border-2 border-[#9a5260]/36 bg-[#9a5260]/12 text-[#8a4351] shadow-[0_0_28px_rgba(155,82,96,0.18)]">
              <Heart className="h-10 w-10 fill-current" />
            </span>
            <span className="grid gap-2.5">
              <span className="story-copy-dark text-[11px] font-black uppercase tracking-[0.26em] text-[#8a4351]">Antes de ir...</span>
              <span className="story-copy-dark font-display text-[2.6rem] leading-none">Uma carta para você</span>
              <span className="story-copy-dark mt-1.5 text-sm font-semibold text-[#4a2c1d]/80">Toque para abrir</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="gentle-pop relative mx-auto grid w-full max-w-lg gap-5 border border-[#74412f]/22 bg-[#fff8eb]/94 px-6 py-8 text-left text-[#3a2118] shadow-[0_28px_90px_rgba(62,34,24,0.22)] backdrop-blur-sm sm:px-10 sm:py-11">
          <div className="grid gap-2">
            <p className="story-copy-dark text-xs font-black uppercase tracking-[0.2em] text-[#8a4351]">Para {story.toName || "o meu amor"}</p>
            <h2 className="story-copy-dark font-display text-4xl leading-none sm:text-6xl">O que eu queria te dizer...</h2>
          </div>
          <p className="story-copy-dark font-display text-xl leading-8 text-[#3f2a20] sm:text-2xl sm:leading-9">{message}</p>
          <div className="h-px bg-[#74412f]/18" />
          <p className="story-copy-dark text-right text-sm font-black text-[#7a4350]">Com amor, {story.fromName || "eu"}.</p>
        </div>
      )}
    </article>
  );
}

function FinalSlide({ copyShareLink, moodId, onBackToCreate, publishedMode, shareStatus, story, theme }) {
  const scene = getRomanticScene(moodId);
  const light = scene.finalTone === "light";
  const relationshipDays = totalDays(story.moments);
  const memoriesCount = story.moments.filter((entry) => !isBreath(entry)).length;
  const storyMeasure = Number.isFinite(relationshipDays)
    ? `${pluralizeDay(relationshipDays)} desde o primeiro marco`
    : `${memoriesCount} ${memoriesCount === 1 ? "memória guardada" : "memórias guardadas"} por você`;
  const reducedMotion = usePrefersReducedMotion();
  const [revealPhase, setRevealPhase] = useState(reducedMotion ? 3 : 0);

  useEffect(() => {
    if (reducedMotion) {
      setRevealPhase(3);
      return undefined;
    }

    setRevealPhase(0);
    const timers = [
      window.setTimeout(() => setRevealPhase(1), 320),
      window.setTimeout(() => setRevealPhase(2), 1180),
      window.setTimeout(() => setRevealPhase(3), 2280),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [moodId, reducedMotion]);

  return (
    <article className="scene-fade relative grid h-full w-full place-items-center overflow-hidden px-5 py-3 text-center">
      <img alt="" className="absolute inset-0 h-full w-full object-cover" src={scene.final} />
      <div className={`absolute inset-0 ${light ? "bg-[#fffaf1]/62" : "bg-[linear-gradient(180deg,rgba(8,4,6,0.22),rgba(8,4,6,0.82))]"}`} />
      {revealPhase >= 3 ? <HeartRain /> : null}
      <div className="relative z-10 mx-auto grid max-w-md gap-4 sm:gap-7">
        <div
          className={`final-reveal mx-auto grid gap-3.5 ${revealPhase >= 1 ? "is-visible" : ""} ${
            light ? "text-[#9a5260]" : "text-[#efb2c4]"
          }`}
        >
          <Heart className="heart-beat-glow mx-auto h-8 w-8 fill-current" />
          <span className="mx-auto h-px w-16 bg-current opacity-38" />
        </div>
        <p
          className={`final-reveal text-[11px] font-black uppercase tracking-[0.24em] ${revealPhase >= 1 ? "is-visible" : ""} ${
            light ? "story-copy-dark text-[#8a4351]" : theme.eyebrow
          }`}
        >
          {storyMeasure}
        </p>
        <h2
          className={`final-reveal font-display text-[2.2rem] leading-[0.9] sm:text-7xl ${revealPhase >= 2 ? "is-visible" : ""} ${
            light ? "story-copy-dark text-[#3a2118]" : theme.title
          }`}
        >
          {story.toName}, eu escolheria a gente de novo.
        </h2>
        <p
          className={`final-reveal mx-auto max-w-sm text-base font-medium leading-7 sm:text-lg sm:leading-8 ${
            revealPhase >= 3 ? "is-visible" : ""
          } ${light ? "story-copy-dark text-[#51382c]" : theme.body}`}
        >
          {`Com amor, ${story.fromName}. E com todos os próximos capítulos que ainda vão virar memória.`}
        </p>
        <div
          className={`final-reveal mx-auto grid w-full max-w-sm gap-2 ${revealPhase >= 3 ? "is-visible" : ""} ${
            publishedMode ? "grid-cols-1" : "grid-cols-2"
          }`}
          data-no-nav
        >
          <button
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-black backdrop-blur transition ${
              light
                ? "border-[#7a4350]/20 bg-white/62 text-[#4a261f] hover:bg-white/82"
                : "border-white/16 bg-black/24 text-white hover:bg-white/12"
            }`}
            onClick={copyShareLink}
            type="button"
          >
            <Share2 className="h-4 w-4" />
            Link
          </button>
          {!publishedMode ? (
            <button
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition hover:-translate-y-0.5 ${
                light ? "bg-[#7a4350] text-white" : "bg-white text-black"
              }`}
              onClick={onBackToCreate}
              type="button"
            >
              <Wand2 className="h-4 w-4" />
              Editar
            </button>
          ) : null}
        </div>
        {shareStatus ? (
          <p
            className={`final-reveal text-xs font-bold ${revealPhase >= 3 ? "is-visible" : ""} ${
              light ? "story-copy-dark text-[#51382c]" : "story-copy-muted"
            }`}
          >
            {shareStatus}
          </p>
        ) : null}
      </div>
    </article>
  );
}

const BURST_HEARTS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * 2 * Math.PI;
  const dist = 90 + (i % 3) * 40;
  return {
    id: i,
    bx: `${Math.round(Math.cos(angle) * dist)}px`,
    by: `${Math.round(Math.sin(angle) * dist)}px`,
    delay: `${i * 55}ms`,
    dur: `${820 + (i % 4) * 110}ms`,
    size: i % 3 === 0 ? "22px" : "15px",
  };
});

function HeartRain() {
  const colors = ["#df91aa", "#f0c97a", "#e8a0b8", "#c87090", "#ffd2df", "#f7d889"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BURST_HEARTS.map((h) => (
        <Heart
          className="heart-burst fill-current"
          key={`burst-${h.id}`}
          style={{
            width: h.size,
            height: h.size,
            color: colors[h.id % colors.length],
            "--bx": h.bx,
            "--by": h.by,
            "--burst-delay": h.delay,
            "--burst-dur": h.dur,
          }}
        />
      ))}
      {heartSeeds.map((heart) => (
        <Heart
          className="rain-heart absolute fill-current"
          key={heart.id}
          style={{
            left: heart.left,
            width: heart.id % 3 === 0 ? "18px" : "13px",
            height: heart.id % 3 === 0 ? "18px" : "13px",
            color: colors[heart.id % colors.length],
            "--delay": heart.delay,
            "--duration": heart.duration,
            "--drift": heart.drift,
          }}
        />
      ))}
    </div>
  );
}
