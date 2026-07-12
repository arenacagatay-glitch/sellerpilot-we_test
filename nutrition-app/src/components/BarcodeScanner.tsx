import { useEffect, useRef, useState } from 'react';
import { X, ScanBarcode } from 'lucide-react';
import { Button } from './ui';

// Native BarcodeDetector (Chrome/Android) için minimal tip tanımı
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>;
}
declare global {
  interface Window {
    BarcodeDetector?: new (opts?: { formats?: string[] }) => BarcodeDetectorLike;
  }
}

export function BarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'unsupported' | 'denied'>('idle');

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    if (!supported) {
      setStatus('unsupported');
      return;
    }

    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;
    const detector = new window.BarcodeDetector!({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
    });

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cancelled) return;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setStatus('scanning');

        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0 && codes[0].rawValue) {
              onDetected(codes[0].rawValue);
              return;
            }
          } catch {
            /* frame atla */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setStatus('denied');
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/90">
      <div className="flex items-center justify-between p-4 text-white">
        <span className="flex items-center gap-2 font-semibold">
          <ScanBarcode size={20} /> Barkod okut
        </span>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {status === 'scanning' && (
        <div className="relative mx-auto w-full max-w-md flex-1">
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-64 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-brand" />
          <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">
            Barkodu çerçeveye getir
          </p>
        </div>
      )}

      {status !== 'scanning' && (
        <div className="flex flex-1 items-center px-6 text-center text-white/80">
          {status === 'unsupported'
            ? 'Bu tarayıcı kamerayla barkod okumayı desteklemiyor. Numarayı elle girebilirsin.'
            : status === 'denied'
              ? 'Kamera izni verilmedi. Barkod numarasını elle girebilirsin.'
              : 'Kamera hazırlanıyor…'}
        </div>
      )}

      {/* Elle giriş her zaman mevcut */}
      <div className="mx-auto w-full max-w-md p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-white outline-none placeholder:text-slate-400"
            inputMode="numeric"
            placeholder="Barkod numarası"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <Button onClick={() => manual.trim() && onDetected(manual.trim())} disabled={manual.trim().length < 6}>
            Ara
          </Button>
        </div>
      </div>
    </div>
  );
}
