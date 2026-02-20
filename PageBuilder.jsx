import { useState, useRef, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════
//  DRAG & DROP PAGE BUILDER
//  Components: Sidebar | Canvas | Properties Panel
// ═══════════════════════════════════════════════

// ── Component Library ──
const COMPONENT_LIBRARY = [
  { type: "heading", label: "Heading", icon: "H1", defaultProps: { text: "Your Heading Here", level: "h1", color: "#e8edf5", fontSize: 36, fontWeight: "bold", textAlign: "left" } },
  { type: "paragraph", label: "Paragraph", icon: "¶", defaultProps: { text: "Add your paragraph text here. Click to edit this content.", color: "#8a9bb5", fontSize: 16, textAlign: "left", lineHeight: 1.7 } },
  { type: "button", label: "Button", icon: "BTN", defaultProps: { text: "Click Me", bg: "#3b82f6", color: "#ffffff", fontSize: 14, borderRadius: 8, padding: "12px 24px", href: "#" } },
  { type: "image", label: "Image", icon: "IMG", defaultProps: { src: "https://picsum.photos/seed/portfolio/600/300", alt: "Image", width: "100%", height: 200, borderRadius: 8, objectFit: "cover" } },
  { type: "divider", label: "Divider", icon: "—", defaultProps: { color: "#1f2d40", thickness: 1, margin: 16 } },
  { type: "card", label: "Card", icon: "□", defaultProps: { title: "Card Title", body: "Card content goes here.", bg: "#111827", borderColor: "#1f2d40", borderRadius: 12, padding: 24, titleColor: "#e8edf5", bodyColor: "#8a9bb5" } },
  { type: "section", label: "Section", icon: "[ ]", defaultProps: { bg: "#0d1420", padding: 40, borderRadius: 12, children: [] } },
  { type: "badge", label: "Badge", icon: "⬭", defaultProps: { text: "New", bg: "rgba(59,130,246,0.15)", color: "#60a5fa", borderColor: "#3b82f6", fontSize: 12, borderRadius: 999 } },
];

// ── ID generator ──
let idCounter = 1000;
const genId = () => `el_${++idCounter}`;

// ── Deep clone ──
const clone = obj => JSON.parse(JSON.stringify(obj));

// ═══════════════════════════════════════════════
//  ELEMENT RENDERERS
// ═══════════════════════════════════════════════
function renderElement({ el, onSelect, selectedId, onUpdate, dragging, setDragging, onMoveElement }) {
  const isSelected = selectedId === el.id;
  const p = el.props;

  const wrapperStyle = {
    position: "relative",
    cursor: "pointer",
    borderRadius: 6,
    outline: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
    outlineOffset: 2,
    transition: "outline 0.15s",
    userSelect: "none",
    marginBottom: 8,
  };

  const handleClick = (e) => { e.stopPropagation(); onSelect(el.id); };

  const handleDragStart = (e) => {
    e.stopPropagation();
    setDragging({ type: "move", id: el.id });
    e.dataTransfer.effectAllowed = "move";
  };

  let content;
  switch (el.type) {
    case "heading":
      const Tag = p.level || "h2";
      content = (
        <Tag
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => onUpdate(el.id, { text: e.target.innerText })}
          style={{ fontSize: p.fontSize, color: p.color, fontWeight: p.fontWeight, textAlign: p.textAlign, outline: "none", fontFamily: "'Syne', sans-serif" }}
        >{p.text}</Tag>
      );
      break;
    case "paragraph":
      content = (
        <p
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => onUpdate(el.id, { text: e.target.innerText })}
          style={{ fontSize: p.fontSize, color: p.color, textAlign: p.textAlign, lineHeight: p.lineHeight, outline: "none" }}
        >{p.text}</p>
      );
      break;
    case "button":
      content = (
        <button
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={e => onUpdate(el.id, { text: e.target.innerText })}
          style={{ background: p.bg, color: p.color, fontSize: p.fontSize, borderRadius: p.borderRadius, padding: p.padding, border: "none", cursor: "pointer", fontFamily: "inherit", outline: "none" }}
        >{p.text}</button>
      );
      break;
    case "image":
      content = (
        <img src={p.src} alt={p.alt}
          style={{ width: p.width, height: p.height, borderRadius: p.borderRadius, objectFit: p.objectFit, display: "block" }}
        />
      );
      break;
    case "divider":
      content = <hr style={{ borderColor: p.color, borderTopWidth: p.thickness, margin: `${p.margin}px 0` }} />;
      break;
    case "card":
      content = (
        <div style={{ background: p.bg, border: `1px solid ${p.borderColor}`, borderRadius: p.borderRadius, padding: p.padding }}>
          <h3 contentEditable={isSelected} suppressContentEditableWarning onBlur={e => onUpdate(el.id, { title: e.target.innerText })}
            style={{ color: p.titleColor, marginBottom: 10, fontFamily: "'Syne', sans-serif", outline: "none" }}>{p.title}</h3>
          <p contentEditable={isSelected} suppressContentEditableWarning onBlur={e => onUpdate(el.id, { body: e.target.innerText })}
            style={{ color: p.bodyColor, outline: "none", fontSize: 14, lineHeight: 1.6 }}>{p.body}</p>
        </div>
      );
      break;
    case "section":
      content = (
        <div style={{ background: p.bg, padding: p.padding, borderRadius: p.borderRadius, minHeight: 80, border: "1px dashed #2d4060" }}>
          {el.children?.length === 0 && (
            <p style={{ color: "#4a5a72", textAlign: "center", fontSize: 13, margin: 0 }}>Drop elements here</p>
          )}
        </div>
      );
      break;
    case "badge":
      content = (
        <span contentEditable={isSelected} suppressContentEditableWarning onBlur={e => onUpdate(el.id, { text: e.target.innerText })}
          style={{ background: p.bg, color: p.color, border: `1px solid ${p.borderColor}`, borderRadius: p.borderRadius, fontSize: p.fontSize, padding: "4px 12px", display: "inline-block", outline: "none" }}>{p.text}</span>
      );
      break;
    default:
      content = <div style={{ color: "#666" }}>Unknown element</div>;
  }

  return (
    <div key={el.id} style={wrapperStyle} onClick={handleClick} draggable onDragStart={handleDragStart}>
      {isSelected && (
        <div style={{ position: "absolute", top: -22, right: 0, background: "#3b82f6", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: "4px 4px 0 0", zIndex: 10, whiteSpace: "nowrap", fontFamily: "monospace" }}>
          {el.type}
        </div>
      )}
      {content}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  PROPERTIES PANEL
// ═══════════════════════════════════════════════
function PropertiesPanel({ element, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) {
  if (!element) return (
    <div style={{ padding: 24, color: "#4a5a72", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>Select an element on the canvas to edit its properties.</p>
    </div>
  );

  const p = element.props;
  const update = (key, val) => onUpdate(element.id, { [key]: val });

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: "#4a5a72", marginBottom: 6, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      {children}
    </div>
  );

  const Input = ({ value, onChange, type = "text", min, max }) => (
    <input type={type} value={value} min={min} max={max} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      style={{ width: "100%", background: "#060a10", border: "1px solid #1f2d40", borderRadius: 6, padding: "8px 10px", color: "#e8edf5", fontSize: 13, fontFamily: "monospace", outline: "none" }} />
  );

  const ColorPicker = ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 36, height: 36, border: "1px solid #1f2d40", borderRadius: 6, cursor: "pointer", background: "none" }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{ flex: 1, background: "#060a10", border: "1px solid #1f2d40", borderRadius: 6, padding: "6px 10px", color: "#e8edf5", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
    </div>
  );

  const Select = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#060a10", border: "1px solid #1f2d40", borderRadius: 6, padding: "8px 10px", color: "#e8edf5", fontSize: 13, fontFamily: "monospace", outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const renderFields = () => {
    switch (element.type) {
      case "heading":
        return (<>
          <Field label="Text"><Input value={p.text} onChange={v => update("text", v)} /></Field>
          <Field label="Tag"><Select value={p.level} onChange={v => update("level", v)} options={["h1","h2","h3","h4"].map(v => ({value:v, label:v.toUpperCase()}))} /></Field>
          <Field label="Font Size"><Input type="number" value={p.fontSize} onChange={v => update("fontSize", v)} min={12} max={96} /></Field>
          <Field label="Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
          <Field label="Align"><Select value={p.textAlign} onChange={v => update("textAlign", v)} options={["left","center","right"].map(v=>({value:v,label:v}))} /></Field>
        </>);
      case "paragraph":
        return (<>
          <Field label="Text"><textarea value={p.text} onChange={e => update("text", e.target.value)}
            style={{ width: "100%", background: "#060a10", border: "1px solid #1f2d40", borderRadius: 6, padding: "8px 10px", color: "#e8edf5", fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical", minHeight: 80 }} /></Field>
          <Field label="Font Size"><Input type="number" value={p.fontSize} onChange={v => update("fontSize", v)} min={10} max={48} /></Field>
          <Field label="Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
          <Field label="Align"><Select value={p.textAlign} onChange={v => update("textAlign", v)} options={["left","center","right"].map(v=>({value:v,label:v}))} /></Field>
          <Field label="Line Height"><Input type="number" value={p.lineHeight} onChange={v => update("lineHeight", v)} min={1} max={3} /></Field>
        </>);
      case "button":
        return (<>
          <Field label="Label"><Input value={p.text} onChange={v => update("text", v)} /></Field>
          <Field label="Background"><ColorPicker value={p.bg} onChange={v => update("bg", v)} /></Field>
          <Field label="Text Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
          <Field label="Border Radius"><Input type="number" value={p.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={50} /></Field>
          <Field label="Font Size"><Input type="number" value={p.fontSize} onChange={v => update("fontSize", v)} min={10} max={32} /></Field>
          <Field label="Link (href)"><Input value={p.href} onChange={v => update("href", v)} /></Field>
        </>);
      case "image":
        return (<>
          <Field label="URL"><Input value={p.src} onChange={v => update("src", v)} /></Field>
          <Field label="Alt Text"><Input value={p.alt} onChange={v => update("alt", v)} /></Field>
          <Field label="Height (px)"><Input type="number" value={p.height} onChange={v => update("height", v)} min={50} max={800} /></Field>
          <Field label="Border Radius"><Input type="number" value={p.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={50} /></Field>
          <Field label="Object Fit"><Select value={p.objectFit} onChange={v => update("objectFit", v)} options={["cover","contain","fill","none"].map(v=>({value:v,label:v}))} /></Field>
        </>);
      case "card":
        return (<>
          <Field label="Title"><Input value={p.title} onChange={v => update("title", v)} /></Field>
          <Field label="Body"><textarea value={p.body} onChange={e => update("body", e.target.value)}
            style={{ width: "100%", background: "#060a10", border: "1px solid #1f2d40", borderRadius: 6, padding: "8px 10px", color: "#e8edf5", fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical", minHeight: 60 }} /></Field>
          <Field label="Background"><ColorPicker value={p.bg} onChange={v => update("bg", v)} /></Field>
          <Field label="Border Color"><ColorPicker value={p.borderColor} onChange={v => update("borderColor", v)} /></Field>
          <Field label="Border Radius"><Input type="number" value={p.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={40} /></Field>
          <Field label="Padding"><Input type="number" value={p.padding} onChange={v => update("padding", v)} min={8} max={80} /></Field>
        </>);
      case "section":
        return (<>
          <Field label="Background"><ColorPicker value={p.bg} onChange={v => update("bg", v)} /></Field>
          <Field label="Padding"><Input type="number" value={p.padding} onChange={v => update("padding", v)} min={0} max={120} /></Field>
          <Field label="Border Radius"><Input type="number" value={p.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={40} /></Field>
        </>);
      case "divider":
        return (<>
          <Field label="Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
          <Field label="Thickness (px)"><Input type="number" value={p.thickness} onChange={v => update("thickness", v)} min={1} max={10} /></Field>
          <Field label="Margin (px)"><Input type="number" value={p.margin} onChange={v => update("margin", v)} min={0} max={80} /></Field>
        </>);
      case "badge":
        return (<>
          <Field label="Text"><Input value={p.text} onChange={v => update("text", v)} /></Field>
          <Field label="Background"><Input value={p.bg} onChange={v => update("bg", v)} /></Field>
          <Field label="Text Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
          <Field label="Border Color"><ColorPicker value={p.borderColor} onChange={v => update("borderColor", v)} /></Field>
          <Field label="Border Radius"><Input type="number" value={p.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={999} /></Field>
        </>);
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1f2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(59,130,246,0.2)" }}>
          {element.type}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a5a72" }}>{element.id}</span>
      </div>

      {renderFields()}

      {/* Element Controls */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #1f2d40" }}>
        <p style={{ fontSize: 11, color: "#4a5a72", marginBottom: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={onMoveUp} style={actionBtnStyle("#1f2d40", "#8a9bb5")}>▲ Move Up</button>
          <button onClick={onMoveDown} style={actionBtnStyle("#1f2d40", "#8a9bb5")}>▼ Move Down</button>
          <button onClick={onDuplicate} style={actionBtnStyle("#1a2535", "#60a5fa")}>⊕ Duplicate</button>
          <button onClick={onDelete} style={actionBtnStyle("#2d1a1a", "#f87171")}>✕ Delete</button>
        </div>
      </div>
    </div>
  );
}

const actionBtnStyle = (bg, color) => ({
  background: bg, color, border: `1px solid ${bg}`, borderRadius: 6,
  padding: "8px 10px", fontSize: 11, cursor: "pointer", fontFamily: "monospace",
  transition: "all 0.2s", textAlign: "center",
});

// ═══════════════════════════════════════════════
//  EXPORT HELPERS
// ═══════════════════════════════════════════════
function exportToHTML(elements) {
  const generateCSS = () => `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #060a10; color: #e8edf5; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
  `;

  const generateElementHTML = (el) => {
    const p = el.props;
    switch (el.type) {
      case "heading": return `<${p.level} style="font-size:${p.fontSize}px;color:${p.color};font-weight:${p.fontWeight};text-align:${p.textAlign};margin-bottom:16px;">${p.text}</${p.level}>`;
      case "paragraph": return `<p style="font-size:${p.fontSize}px;color:${p.color};text-align:${p.textAlign};line-height:${p.lineHeight};margin-bottom:16px;">${p.text}</p>`;
      case "button": return `<a href="${p.href}" style="display:inline-block;background:${p.bg};color:${p.color};font-size:${p.fontSize}px;border-radius:${p.borderRadius}px;padding:${p.padding};text-decoration:none;margin-bottom:16px;">${p.text}</a>`;
      case "image": return `<img src="${p.src}" alt="${p.alt}" style="width:${p.width};height:${p.height}px;border-radius:${p.borderRadius}px;object-fit:${p.objectFit};display:block;margin-bottom:16px;" />`;
      case "divider": return `<hr style="border-color:${p.color};border-top-width:${p.thickness}px;margin:${p.margin}px 0;" />`;
      case "card": return `<div style="background:${p.bg};border:1px solid ${p.borderColor};border-radius:${p.borderRadius}px;padding:${p.padding}px;margin-bottom:16px;"><h3 style="color:${p.titleColor};margin-bottom:10px;">${p.title}</h3><p style="color:${p.bodyColor};line-height:1.6;font-size:14px;">${p.body}</p></div>`;
      case "section": return `<div style="background:${p.bg};padding:${p.padding}px;border-radius:${p.borderRadius}px;margin-bottom:16px;"></div>`;
      case "badge": return `<span style="background:${p.bg};color:${p.color};border:1px solid ${p.borderColor};border-radius:${p.borderRadius}px;font-size:${p.fontSize}px;padding:4px 12px;display:inline-block;margin-bottom:8px;">${p.text}</span>`;
      default: return "";
    }
  };

  const bodyContent = elements.map(generateElementHTML).join("\n    ");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported Page</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Syne:wght@700&display=swap" rel="stylesheet">
  <style>${generateCSS()}</style>
</head>
<body>
  <div class="page">
    ${bodyContent}
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════
export default function PageBuilder() {
  const [elements, setElements] = useState([
    { id: "el_001", type: "heading", props: { text: "My Portfolio Page", level: "h1", color: "#e8edf5", fontSize: 42, fontWeight: "bold", textAlign: "left" } },
    { id: "el_002", type: "paragraph", props: { text: "Welcome to my page built with the drag-and-drop builder. Edit any element by clicking it.", color: "#8a9bb5", fontSize: 16, textAlign: "left", lineHeight: 1.7 } },
    { id: "el_003", type: "divider", props: { color: "#1f2d40", thickness: 1, margin: 16 } },
    { id: "el_004", type: "card", props: { title: "Featured Project", body: "A full-stack MERN application with real-time features.", bg: "#111827", borderColor: "#1f2d40", borderRadius: 12, padding: 24, titleColor: "#e8edf5", bodyColor: "#8a9bb5" } },
    { id: "el_005", type: "button", props: { text: "View Projects →", bg: "#3b82f6", color: "#ffffff", fontSize: 14, borderRadius: 8, padding: "12px 24px", href: "#" } },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("components");
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [notification, setNotification] = useState(null);
  const canvasRef = useRef(null);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // ── Drag from sidebar ──
  const handleSidebarDragStart = (e, compType) => {
    const comp = COMPONENT_LIBRARY.find(c => c.type === compType);
    setDragging({ type: "new", compType, comp });
    e.dataTransfer.effectAllowed = "copy";
  };

  // ── Canvas drop ──
  const handleCanvasDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!dragging) return;

    if (dragging.type === "new") {
      const comp = COMPONENT_LIBRARY.find(c => c.type === dragging.compType);
      if (!comp) return;
      const newEl = { id: genId(), type: comp.type, props: clone(comp.defaultProps) };
      setElements(prev => {
        const next = [...prev];
        next.splice(dropIndex ?? next.length, 0, newEl);
        return next;
      });
      setSelectedId(newEl.id);
    } else if (dragging.type === "move") {
      const fromIdx = elements.findIndex(e => e.id === dragging.id);
      if (fromIdx === -1) return;
      setElements(prev => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        const toIdx = dropIndex ?? next.length;
        next.splice(toIdx, 0, moved);
        return next;
      });
    }
    setDragging(null);
    setDragOverIndex(null);
  };

  const handleCanvasDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragging?.type === "new" ? "copy" : "move";
    setDragOverIndex(index);
  };

  // ── Element operations ──
  const updateElement = useCallback((id, propsUpdate) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, props: { ...el.props, ...propsUpdate } } : el));
  }, []);

  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
    showNotif("Element deleted");
  }, []);

  const duplicateElement = useCallback((id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const dup = { ...clone(el), id: genId() };
    const idx = elements.findIndex(e => e.id === id);
    setElements(prev => { const next = [...prev]; next.splice(idx + 1, 0, dup); return next; });
    setSelectedId(dup.id);
    showNotif("Element duplicated");
  }, [elements]);

  const moveElement = useCallback((id, direction) => {
    const idx = elements.findIndex(e => e.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= elements.length) return;
    setElements(prev => {
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, [elements]);

  // ── Save / Load ──
  const saveLayout = () => {
    const layout = { id: Date.now(), name: `Layout ${savedLayouts.length + 1}`, elements: clone(elements), savedAt: new Date().toLocaleTimeString() };
    setSavedLayouts(prev => [layout, ...prev].slice(0, 10));
    showNotif("Layout saved!");
  };

  const loadLayout = (layout) => {
    setElements(clone(layout.elements));
    setSelectedId(null);
    showNotif("Layout loaded!");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(elements, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "layout.json"; a.click();
    showNotif("JSON exported!");
  };

  const exportHTML = () => {
    const html = exportToHTML(elements);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "page.html"; a.click();
    showNotif("HTML exported!");
  };

  const clearCanvas = () => { setElements([]); setSelectedId(null); showNotif("Canvas cleared"); };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Delete" && selectedId && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA" && !document.activeElement.contentEditable === "true") {
        deleteElement(selectedId);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, deleteElement]);

  // ── Styles ──
  const styles = {
    app: { display: "flex", flexDirection: "column", height: "100vh", background: "#060a10", color: "#e8edf5", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" },
    toolbar: { height: 56, background: "#0d1420", borderBottom: "1px solid #1f2d40", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, gap: 12 },
    brand: { fontFamily: "monospace", fontSize: 13, color: "#3b82f6", letterSpacing: "0.05em" },
    toolbarBtns: { display: "flex", gap: 8, alignItems: "center" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    sidebar: { width: 220, background: "#0d1420", borderRight: "1px solid #1f2d40", overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 },
    sidebarTabs: { display: "flex", borderBottom: "1px solid #1f2d40" },
    sidebarTab: (active) => ({ flex: 1, padding: "10px 4px", fontSize: 11, fontFamily: "monospace", border: "none", background: active ? "#060a10" : "transparent", color: active ? "#60a5fa" : "#4a5a72", cursor: "pointer", transition: "all 0.2s", borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent" }),
    sidebarBody: { flex: 1, overflowY: "auto", padding: 12 },
    compBtn: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", marginBottom: 6, background: "#111827", border: "1px solid #1f2d40", borderRadius: 8, color: "#8a9bb5", fontSize: 12, cursor: "grab", transition: "all 0.2s", textAlign: "left", userSelect: "none" },
    compBtnIcon: { width: 28, height: 28, background: "#1a2535", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 10, color: "#60a5fa", flexShrink: 0 },
    canvas: { flex: 1, overflowY: "auto", background: "#060a10", position: "relative" },
    canvasInner: { maxWidth: 800, margin: "0 auto", padding: "32px 24px", minHeight: "100%" },
    dropZone: (isOver) => ({ height: 4, background: isOver ? "#3b82f6" : "transparent", borderRadius: 2, margin: "4px 0", transition: "all 0.15s", cursor: "pointer" }),
    emptyState: { textAlign: "center", padding: "80px 40px", color: "#4a5a72" },
    props: { width: 260, background: "#0d1420", borderLeft: "1px solid #1f2d40", overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 },
    propsHeader: { padding: "12px 20px", borderBottom: "1px solid #1f2d40", fontSize: 11, fontFamily: "monospace", color: "#4a5a72", textTransform: "uppercase", letterSpacing: "0.08em" },
    propsBody: { flex: 1, overflowY: "auto" },
    notif: (type) => ({ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: type === "success" ? "#065f46" : "#7f1d1d", border: `1px solid ${type === "success" ? "#059669" : "#ef4444"}`, color: type === "success" ? "#6ee7b7" : "#fca5a5", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontFamily: "monospace", zIndex: 9999, animation: "fadeIn 0.3s ease" }),
  };

  const toolBtn = (label, onClick, variant = "default") => {
    const colors = { default: "#1f2d40", danger: "#2d1a1a", success: "#0d2a20", primary: "#1a2a4a" };
    return (
      <button onClick={onClick} style={{ background: colors[variant], border: `1px solid ${colors[variant]}`, color: variant === "danger" ? "#f87171" : variant === "success" ? "#6ee7b7" : variant === "primary" ? "#60a5fa" : "#8a9bb5", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "monospace", whiteSpace: "nowrap", transition: "all 0.2s" }}>
        {label}
      </button>
    );
  };

  return (
    <div style={styles.app}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.brand}>⊞ Page Builder</div>
        <div style={styles.toolbarBtns}>
          {toolBtn("⌫ Clear", clearCanvas, "danger")}
          {toolBtn("⬇ JSON", exportJSON)}
          {toolBtn("✦ HTML", exportHTML, "success")}
          {toolBtn("◈ Save", saveLayout, "primary")}
        </div>
        <div style={{ fontSize: 11, color: "#4a5a72", fontFamily: "monospace" }}>
          {elements.length} element{elements.length !== 1 ? "s" : ""}  {selectedId ? `· ${selectedElement?.type} selected` : ""}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTabs}>
            <button style={styles.sidebarTab(sidebarTab === "components")} onClick={() => setSidebarTab("components")}>Components</button>
            <button style={styles.sidebarTab(sidebarTab === "saved")} onClick={() => setSidebarTab("saved")}>Saved</button>
          </div>
          <div style={styles.sidebarBody}>
            {sidebarTab === "components" ? (
              <>
                <p style={{ fontSize: 10, color: "#4a5a72", marginBottom: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Drag to canvas</p>
                {COMPONENT_LIBRARY.map(comp => (
                  <div key={comp.type} style={styles.compBtn}
                    draggable onDragStart={e => handleSidebarDragStart(e, comp.type)}>
                    <div style={styles.compBtnIcon}>{comp.icon}</div>
                    {comp.label}
                  </div>
                ))}
              </>
            ) : (
              <>
                <p style={{ fontSize: 10, color: "#4a5a72", marginBottom: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Saved layouts</p>
                {savedLayouts.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#4a5a72", textAlign: "center", marginTop: 20 }}>No saved layouts yet</p>
                ) : (
                  savedLayouts.map(layout => (
                    <div key={layout.id} style={{ background: "#111827", border: "1px solid #1f2d40", borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer" }} onClick={() => loadLayout(layout)}>
                      <div style={{ fontSize: 12, color: "#e8edf5", marginBottom: 4 }}>{layout.name}</div>
                      <div style={{ fontSize: 10, color: "#4a5a72", fontFamily: "monospace" }}>{layout.elements.length} els · {layout.savedAt}</div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div style={styles.canvas} ref={canvasRef} onClick={() => setSelectedId(null)}
          onDragOver={e => { e.preventDefault(); }} onDrop={e => handleCanvasDrop(e, elements.length)}>
          <div style={styles.canvasInner}>
            {elements.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⊕</div>
                <p style={{ fontSize: 16, marginBottom: 8 }}>Canvas is empty</p>
                <p style={{ fontSize: 13 }}>Drag components from the sidebar to build your page</p>
              </div>
            ) : (
              <>
                {/* Drop zone at top */}
                <div style={styles.dropZone(dragOverIndex === 0)} onDragOver={e => handleCanvasDragOver(e, 0)} onDrop={e => handleCanvasDrop(e, 0)} onDragLeave={() => setDragOverIndex(null)} />

                {elements.map((el, idx) => (
                  <div key={el.id}>
                    {renderElement({ el, onSelect: setSelectedId, selectedId, onUpdate: updateElement, dragging, setDragging, onMoveElement: moveElement })}
                    {/* Drop zone between elements */}
                    <div style={styles.dropZone(dragOverIndex === idx + 1)}
                      onDragOver={e => handleCanvasDragOver(e, idx + 1)}
                      onDrop={e => handleCanvasDrop(e, idx + 1)}
                      onDragLeave={() => setDragOverIndex(null)} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div style={styles.props}>
          <div style={styles.propsHeader}>Properties</div>
          <div style={styles.propsBody}>
            <PropertiesPanel
              element={selectedElement}
              onUpdate={updateElement}
              onDelete={() => selectedId && deleteElement(selectedId)}
              onDuplicate={() => selectedId && duplicateElement(selectedId)}
              onMoveUp={() => selectedId && moveElement(selectedId, "up")}
              onMoveDown={() => selectedId && moveElement(selectedId, "down")}
            />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={styles.notif(notification.type)}>{notification.msg}</div>
      )}
    </div>
  );
}
