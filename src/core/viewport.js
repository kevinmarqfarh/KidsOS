// Keep fixed app surfaces inside the visible viewport when a mobile keyboard opens.
// Pinch zoom keeps the layout intact rather than shrinking the app around the zoom.
export function visibleViewportHeight(viewport, fallback) {
  const height=viewport?.height;
  if(viewport && Math.abs((viewport.scale ?? 1)-1)>0.02)return null;
  return Number.isFinite(height)&&height>0?Math.round(height):Number.isFinite(fallback)&&fallback>0?Math.round(fallback):null;
}
export function installViewport(root,host=window) {
  const viewport=host.visualViewport;
  const update=()=>{
    const height=visibleViewportHeight(viewport,host.innerHeight);
    if(height!==null)root.style.setProperty('--app-height',`${height}px`);
  };
  update();
  host.addEventListener('resize',update);
  viewport?.addEventListener('resize',update);
  return ()=>{host.removeEventListener('resize',update);viewport?.removeEventListener('resize',update);root.style.removeProperty('--app-height');};
}
