import { Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const drawCrop = async ({ canvas, imageUrl, panX, panY, zoom }) => {
  if (!canvas || !imageUrl) return null;

  const image = await loadImage(imageUrl);
  const context = canvas.getContext("2d");
  const outputSize = 420;
  const baseSize = Math.min(image.naturalWidth, image.naturalHeight);
  const cropSize = baseSize / zoom;
  const maxOffsetX = (image.naturalWidth - cropSize) / 2;
  const maxOffsetY = (image.naturalHeight - cropSize) / 2;
  const centerX = image.naturalWidth / 2 + (panX / 100) * maxOffsetX;
  const centerY = image.naturalHeight / 2 + (panY / 100) * maxOffsetY;
  const sx = clamp(centerX - cropSize / 2, 0, image.naturalWidth - cropSize);
  const sy = clamp(centerY - cropSize / 2, 0, image.naturalHeight - cropSize);

  canvas.width = outputSize;
  canvas.height = outputSize;
  context.clearRect(0, 0, outputSize, outputSize);
  context.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, outputSize, outputSize);

  return canvas;
};

const AvatarCropperModal = ({ file, onApply, onClose }) => {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  useEffect(() => {
    if (!file) return undefined;

    const nextUrl = URL.createObjectURL(file);
    setImageUrl(nextUrl);
    setZoom(1);
    setPanX(0);
    setPanY(0);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  useEffect(() => {
    drawCrop({ canvas: canvasRef.current, imageUrl, panX, panY, zoom });
  }, [imageUrl, panX, panY, zoom]);

  if (!file) return null;

  const handleApply = async () => {
    const canvas = await drawCrop({ canvas: canvasRef.current, imageUrl, panX, panY, zoom });
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], `avatar-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onApply(croppedFile);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-xl">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border-light)] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-bold text-[var(--university-ink)]">Crop Profile Picture</h2>
            <p className="mt-1 text-xs font-medium text-[var(--university-muted)]">
              Adjust the photo so it fits neatly inside your avatar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--university-muted)] transition hover:bg-[var(--surface-soft)]"
            title="Close cropper"
          >
            <X size={17} />
          </button>
        </header>

        <div className="p-4 sm:p-5">
          <div className="mx-auto flex h-72 w-72 max-w-full items-center justify-center rounded-full border-4 border-white bg-[var(--surface-soft)] shadow-[0_0_0_1px_var(--border-light)]">
            <canvas ref={canvasRef} className="h-full w-full rounded-full object-cover" />
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--university-ink)]">
                <span>Zoom</span>
                <span>{zoom.toFixed(1)}x</span>
              </span>
              <div className="flex items-center gap-3">
                <Minus size={15} className="text-[var(--university-muted)]" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full accent-[var(--stratex-blue)]"
                />
                <Plus size={15} className="text-[var(--university-muted)]" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
                Horizontal Position
              </span>
              <input
                type="range"
                min="-100"
                max="100"
                value={panX}
                onChange={(event) => setPanX(Number(event.target.value))}
                className="w-full accent-[var(--stratex-blue)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[var(--university-ink)]">
                Vertical Position
              </span>
              <input
                type="range"
                min="-100"
                max="100"
                value={panY}
                onChange={(event) => setPanY(Number(event.target.value))}
                className="w-full accent-[var(--stratex-blue)]"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--border-light)] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--university-ink)] transition hover:bg-[var(--surface-soft)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--stratex-blue)] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--stratex-blue-dark)]"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AvatarCropperModal;

