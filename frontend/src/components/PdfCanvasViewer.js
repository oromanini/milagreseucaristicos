import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';

const PDFJS_SCRIPT_ID = 'pdfjs-cdn-script';
const PDFJS_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const getViewportScale = (viewportWidth, containerWidth) => {
  if (!viewportWidth || !containerWidth) return 1;
  const computedScale = containerWidth / viewportWidth;
  return Math.min(Math.max(computedScale, 0.25), 3);
};

const loadPdfJs = async () => {
  if (typeof window === 'undefined') return null;

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    return window.pdfjsLib;
  }

  const existingScript = document.getElementById(PDFJS_SCRIPT_ID);
  if (existingScript) {
    await new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
    });

    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      return window.pdfjsLib;
    }

    return null;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = PDFJS_SCRIPT_ID;
    script.src = PDFJS_CDN_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  if (!window.pdfjsLib) return null;

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  return window.pdfjsLib;
};

export const PdfCanvasViewer = ({ url, title = 'Documento PDF' }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const pdfDocRef = useRef(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;

    setLoading(true);
    setPage(1);
    setNumPages(0);

    const bootstrap = async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        if (!pdfjsLib || cancelled) return;

        loadingTask = pdfjsLib.getDocument({
          url,
          useWorkerFetch: true,
          isEvalSupported: false,
        });

        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        pdfDocRef.current = pdfDoc;
        setNumPages(pdfDoc.numPages);
      } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        toast.error('Não foi possível carregar este PDF no visualizador embutido.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      if (loadingTask) loadingTask.destroy();
      if (pdfDocRef.current) pdfDocRef.current.destroy();
      pdfDocRef.current = null;
    };
  }, [url]);

  const renderPage = useCallback(async () => {
    const pdfDoc = pdfDocRef.current;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!pdfDoc || !canvas || !wrapper || !numPages) return;

    setRendering(true);

    try {
      const pdfPage = await pdfDoc.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1 });
      const scale = getViewportScale(viewport.width, wrapper.clientWidth - 16);
      const scaledViewport = pdfPage.getViewport({ scale });
      const context = canvas.getContext('2d');

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await pdfPage.render({ canvasContext: context, viewport: scaledViewport }).promise;
    } catch (error) {
      console.error('Erro ao renderizar página do PDF:', error);
      toast.error('Falha ao renderizar a página do PDF.');
    } finally {
      setRendering(false);
    }
  }, [page, numPages]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      renderPage();
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [renderPage]);

  const canGoPrev = page > 1;
  const canGoNext = numPages > 0 && page < numPages;
  const isBusy = loading || rendering;
  const statusText = useMemo(() => {
    if (loading) return 'Carregando PDF...';
    if (!numPages) return 'Não foi possível ler este PDF.';
    if (rendering) return `Renderizando página ${page}...`;
    return `Página ${page} de ${numPages}`;
  }, [loading, numPages, page, rendering]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canGoPrev || isBusy}
          className="border-[#27272A]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Página anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(numPages, prev + 1))}
          disabled={!canGoNext || isBusy}
          className="border-[#27272A]"
        >
          Próxima página
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
        <a
          href={url}
          download
          className="inline-flex items-center gap-1 h-9 px-3 py-2 rounded-md border border-[#27272A] text-[#E5E5E5] text-sm hover:border-[#D4AF37]"
        >
          Baixar PDF <FileText className="w-4 h-4" />
        </a>
        <span className="text-xs text-[#A1A1AA]">{statusText}</span>
      </div>

      <div ref={wrapperRef} className="rounded-md border border-[#27272A] bg-[#0A0A0B] overflow-auto min-h-[320px] p-2">
        <canvas
          ref={canvasRef}
          className="block mx-auto max-w-full h-auto"
          aria-label={`Visualizador de PDF: ${title}`}
        />
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[#D4AF37] text-xs hover:underline"
      >
        Abrir PDF em nova aba <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
