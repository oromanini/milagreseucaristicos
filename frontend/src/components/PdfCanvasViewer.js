import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Loader2 } from 'lucide-react';
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
  const renderTaskRef = useRef(null);
  const renderRequestIdRef = useRef(0);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncIsMobile = () => setIsMobile(mediaQuery.matches);

    syncIsMobile();
    mediaQuery.addEventListener('change', syncIsMobile);

    return () => mediaQuery.removeEventListener('change', syncIsMobile);
  }, []);

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
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      if (loadingTask) loadingTask.destroy();
      if (pdfDocRef.current) pdfDocRef.current.destroy();
      pdfDocRef.current = null;
    };
  }, [url]);

  const renderPage = useCallback(async () => {
    const pdfDoc = pdfDocRef.current;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const requestId = renderRequestIdRef.current + 1;
    renderRequestIdRef.current = requestId;

    if (!pdfDoc || !canvas || !wrapper || !numPages) return;

    setRendering(true);

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const pdfPage = await pdfDoc.getPage(page);
      if (renderRequestIdRef.current !== requestId) return;

      const viewport = pdfPage.getViewport({ scale: 1 });
      const scale = getViewportScale(viewport.width, wrapper.clientWidth - 16);
      const scaledViewport = pdfPage.getViewport({ scale });
      const context = canvas.getContext('2d');

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const renderTask = pdfPage.render({ canvasContext: context, viewport: scaledViewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      if (renderTaskRef.current === renderTask) {
        renderTaskRef.current = null;
      }
    } catch (error) {
      if (error?.name === 'RenderingCancelledException') {
        return;
      }
      console.error('Erro ao renderizar página do PDF:', error);
      toast.error('Falha ao renderizar a página do PDF.');
    } finally {
      if (renderRequestIdRef.current === requestId) {
        setRendering(false);
      }
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

      <div ref={wrapperRef} className="relative rounded-md border border-[#27272A] bg-[#0A0A0B] overflow-auto min-h-[320px] p-2">
        {isBusy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0A0A0B]/80">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#27272A] bg-[#121214] px-3 py-2 text-sm text-[#E5E5E5]">
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
              {statusText}
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block mx-auto max-w-full h-auto"
          aria-label={`Visualizador de PDF: ${title}`}
        />
      </div>

      {isMobile ? (
        <a
          href={url}
          download
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e5be4a]"
        >
          Baixar PDF no celular para visualizar melhor
          <FileText className="w-4 h-4" />
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#D4AF37] text-xs hover:underline"
        >
          Abrir PDF em nova aba <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
