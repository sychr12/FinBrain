export type ImageAIStatus = "idle" | "checking" | "approved" | "blocked";

export interface ImageAIResult {
  approved: boolean;
  reason: string;
  recognitionSummary: string;
  dataUrl?: string;
  checks: {
    realPhotoScore: number;
    faceDetected: boolean;
    drawingRisk: number;
  };
}

type FaceDetectorConstructor = new (options?: {
  fastMode?: boolean;
  maxDetectedFaces?: number;
}) => {
  detect(image: CanvasImageSource): Promise<Array<unknown>>;
};

declare global {
  interface Window {
    FaceDetector?: FaceDetectorConstructor;
  }
}

export async function validateHumanProfileImage(file: File): Promise<ImageAIResult> {
  if (!file.type.startsWith("image/")) {
    return blocked("Envie um arquivo de imagem.", 0, 1, false);
  }

  if (file.size > 4 * 1024 * 1024) {
    return blocked("A imagem deve ter ate 4 MB.", 0, 1, false);
  }

  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);

  if (image.width < 220 || image.height < 220) {
    return blocked("A foto precisa ter pelo menos 220 x 220 pixels.", 0.2, 0.7, false);
  }

  const metrics = analyzeImage(image);
  const faceDetected = await detectFace(image);
  const realPhotoScore = scoreRealPhoto(metrics, faceDetected);
  const drawingRisk = scoreDrawingRisk(metrics, faceDetected);

  if (drawingRisk > 0.72) {
    return blocked(
      "A IA bloqueou a imagem por parecer desenho, anime, avatar ou arte digital.",
      realPhotoScore,
      drawingRisk,
      faceDetected
    );
  }

  if (!faceDetected && realPhotoScore < 0.68) {
    return blocked(
      "A IA nao encontrou evidencias suficientes de uma foto humana real.",
      realPhotoScore,
      drawingRisk,
      false
    );
  }

  const recognitionSummary = buildRecognitionSummary(metrics, faceDetected);

  return {
    approved: true,
    reason: "Foto real validada. O reconhecimento facial foi concluido.",
    recognitionSummary,
    dataUrl,
    checks: {
      realPhotoScore,
      faceDetected,
      drawingRisk,
    },
  };
}

function blocked(
  reason: string,
  realPhotoScore: number,
  drawingRisk: number,
  faceDetected: boolean
): ImageAIResult {
  return {
    approved: false,
    reason,
    recognitionSummary: "",
    checks: {
      realPhotoScore,
      faceDetected,
      drawingRisk,
    },
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Nao foi possivel ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Imagem invalida."));
    image.src = src;
  });
}

async function detectFace(image: HTMLImageElement) {
  if (typeof window === "undefined" || !window.FaceDetector) {
    return false;
  }

  try {
    const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(image);
    return faces.length > 0;
  } catch {
    return false;
  }
}

function analyzeImage(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const size = 160;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return {
      uniqueColorRatio: 0,
      edgeRatio: 0,
      skinRatio: 0,
      saturationAverage: 0,
      luminanceSpread: 0,
    };
  }

  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  const colors = new Set<string>();

  let skin = 0;
  let edge = 0;
  let saturationSum = 0;
  let luminanceMin = 255;
  let luminanceMax = 0;
  let count = 0;

  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const i = (y * size + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      colors.add(`${r >> 4}-${g >> 4}-${b >> 4}`);
      saturationSum += max === 0 ? 0 : (max - min) / max;
      luminanceMin = Math.min(luminanceMin, luminance);
      luminanceMax = Math.max(luminanceMax, luminance);

      if (r > 70 && g > 35 && b > 20 && r > g && g > b && r - b > 25 && max - min > 12) {
        skin++;
      }

      if (x > 0 && y > 0) {
        const prev = ((y - 2) * size + (x - 2)) * 4;
        const delta =
          Math.abs(r - pixels[prev]) +
          Math.abs(g - pixels[prev + 1]) +
          Math.abs(b - pixels[prev + 2]);
        if (delta > 75) edge++;
      }

      count++;
    }
  }

  return {
    uniqueColorRatio: colors.size / Math.max(count, 1),
    edgeRatio: edge / Math.max(count, 1),
    skinRatio: skin / Math.max(count, 1),
    saturationAverage: saturationSum / Math.max(count, 1),
    luminanceSpread: (luminanceMax - luminanceMin) / 255,
  };
}

function scoreRealPhoto(
  metrics: ReturnType<typeof analyzeImage>,
  faceDetected: boolean
) {
  let score = 0;

  if (metrics.uniqueColorRatio > 0.16) score += 0.25;
  if (metrics.edgeRatio > 0.08 && metrics.edgeRatio < 0.42) score += 0.2;
  if (metrics.skinRatio > 0.02 && metrics.skinRatio < 0.45) score += 0.25;
  if (metrics.saturationAverage > 0.12 && metrics.saturationAverage < 0.62) score += 0.15;
  if (metrics.luminanceSpread > 0.28) score += 0.15;
  if (faceDetected) score += 0.25;

  return Math.min(score, 1);
}

function scoreDrawingRisk(
  metrics: ReturnType<typeof analyzeImage>,
  faceDetected: boolean
) {
  let risk = 0;

  if (metrics.uniqueColorRatio < 0.11) risk += 0.28;
  if (metrics.edgeRatio > 0.46) risk += 0.22;
  if (metrics.skinRatio < 0.015) risk += 0.2;
  if (metrics.saturationAverage > 0.68) risk += 0.18;
  if (metrics.luminanceSpread < 0.22) risk += 0.12;
  if (faceDetected) risk -= 0.18;

  return Math.max(0, Math.min(risk, 1));
}

function buildRecognitionSummary(
  metrics: ReturnType<typeof analyzeImage>,
  faceDetected: boolean
) {
  const assinatura = [
    Math.round(metrics.uniqueColorRatio * 100),
    Math.round(metrics.edgeRatio * 100),
    Math.round(metrics.skinRatio * 100),
    Math.round(metrics.luminanceSpread * 100),
  ].join("-");

  return faceDetected
    ? `Face humana detectada. Assinatura facial local: FB-${assinatura}.`
    : `Foto humana aprovada por heuristica visual. Assinatura facial local: FB-${assinatura}.`;
}
