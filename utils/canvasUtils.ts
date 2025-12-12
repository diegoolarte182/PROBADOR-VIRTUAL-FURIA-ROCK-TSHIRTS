import { DesignLayer, PrintZoneConfig, ViewAngle } from '../types';
import { ZONES } from '../constants';

export const downloadMockup = async (
  view: ViewAngle,
  color: string,
  layers: Record<string, DesignLayer>,
  projectName: string,
  includeWatermark: boolean
) => {
  const canvas = document.createElement('canvas');
  const size = 2000;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // We need two SVG serializations now: Base and Shadows
  const svgBaseElement = document.getElementById('tshirt-base');
  const svgShadowElement = document.getElementById('tshirt-shadows');

  if (!svgBaseElement || !svgShadowElement) {
    alert("Error: Viewport not ready");
    return;
  }

  const serializeSVG = (el: Element) => {
      const data = new XMLSerializer().serializeToString(el);
      return new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  };

  const urlBase = URL.createObjectURL(serializeSVG(svgBaseElement));
  const urlShadow = URL.createObjectURL(serializeSVG(svgShadowElement));

  const imgBase = new Image();
  const imgShadow = new Image();

  // Promise wrapper for image loading
  const loadImg = (img: HTMLImageElement, url: string) => {
      return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
      });
  };

  try {
      // 1. Draw Base
      await loadImg(imgBase, urlBase);
      ctx.drawImage(imgBase, 0, 0, size, size);
      URL.revokeObjectURL(urlBase);

      // 2. Draw Layers (Designs)
      const layersToDraw = Object.values(layers).filter(l => {
        const zone = ZONES[l.zoneId];
        return l.visible && l.imageSrc && zone.view === view;
      });

      // Sequential loading of design layers to preserve order
      for (const layer of layersToDraw) {
        const layerImg = new Image();
        layerImg.crossOrigin = "anonymous";
        await loadImg(layerImg, layer.imageSrc!);

        const zone = ZONES[layer.zoneId];
        const scaleFactor = size / 1000;
        const zoneX = zone.area.x * scaleFactor;
        const zoneY = zone.area.y * scaleFactor;
        const zoneW = zone.area.width * scaleFactor;
        const zoneH = zone.area.height * scaleFactor;

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = layer.opacity / 100;

        const posX = zoneX + (zoneW * (layer.x / 100));
        const posY = zoneY + (zoneH * (layer.y / 100));

        ctx.translate(posX, posY);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.scale(layer.scale, layer.scale);

        const drawW = zoneW;
        const drawH = drawW * (layerImg.height / layerImg.width);
        ctx.drawImage(layerImg, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // 3. Draw Shadows Overlay (Sandwich Effect)
      // This is crucial: The shadows drawn ON TOP of the designs make it look real.
      await loadImg(imgShadow, urlShadow);
      ctx.drawImage(imgShadow, 0, 0, size, size);
      URL.revokeObjectURL(urlShadow);

      // 4. Watermark
      if (includeWatermark) {
         ctx.font = 'bold 40px sans-serif';
         ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
         ctx.textAlign = 'right';
         ctx.fillText('Furia Rock T-Shirts', size - 50, size - 50);
      }

      // 5. Download
      const link = document.createElement('a');
      link.download = `${projectName || 'mockup'}-${view}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

  } catch (e) {
      console.error(e);
      alert("Error generating mockup image.");
  }
};

export const downloadDesignOverlay = (
  layers: Record<string, DesignLayer>,
  projectName: string
) => {
    alert("Función de descarga de ZIP de diseños (Overlay) simulada.");
};
