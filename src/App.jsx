import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#FDFAF7",
  fucsia: "#E8196A",
  fucsiaLight: "#FFF0F5",
  amarillo: "#F5E642",
  lila: "#C8B4E8",
  lilaLight: "#F3EEFF",
  negro: "#1A1A1A",
  gris: "#888",
  grisClarito: "#F0EBE5",
  blanco: "#FFFFFF",
  borde: "#E4DDD7",
  verde: "#2EAF6A",
  verdeLight: "#E6F9EE",
  error: "#D93838",
};

const STEPS = [
  { id: 1, label: "Servicio" },
  { id: 2, label: "Fecha" },
  { id: 3, label: "Horario" },
  { id: 4, label: "Datos" },
  { id: 5, label: "Seña" },
  { id: 6, label: "Listo" },
];

// ─── CATÁLOGO DE SERVICIOS ────────────────────────────────────────────────────
const SERVICIOS_BASE = [
  {
    id: "b1", name: "Esmaltado semipermanente liso", price: 35000,
    info: "Incluye esmaltado en gel semipermanente con cualquier color liso.",
  },
  {
    id: "b2", name: "Capping + esmaltado semipermanente liso", price: 42000,
    info: "Incluye refuerzo de la uña trabajado con bases rubber + esmaltado gel semipermanente con cualquier color liso.",
  },
  {
    id: "b3", name: "Extensiones soft gel + esmaltado semipermanente liso", price: 50000,
    info: "Incluye extensiones con tips + esmaltado gel semipermanente con cualquier color liso.",
  },
];

const DECORACIONES = [
  { id: "d1", name: "Deco por uña", price: 1000, perUna: true },
  { id: "d2", name: "French simple o con colores", price: 2000 },
  { id: "d3", name: "Full Cromadas / Cat Eye / Glitter", price: 4000 },
  { id: "d4", name: "Full diseño — dibujos", price: 4000, consultar: true, needsPhoto: true },
  { id: "d5", name: "Soft gel por uña para arreglos", price: 1000, perUna: true },
];

const RETIRADOS = [
  { id: "r1", name: "Retirado de semi de otro salón sin manicura", price: 18000 },
  { id: "r2", name: "Retirado capping/esculpidas de otro salón sin manicura", price: 25000 },
  { id: "r3", name: "Retirado con manicura completa sin esmaltar", price: 32000 },
];

const SLOTS = {
  "2025-06-30": ["09:00", "10:30", "12:00", "14:00", "16:00"],
  "2025-07-01": ["09:00", "11:00", "14:00", "17:00"],
  "2025-07-02": ["10:00", "13:00", "15:30"],
  "2025-07-03": ["09:00", "12:00", "16:00"],
  "2025-07-04": ["10:30", "14:00", "17:00"],
  "2025-07-07": ["09:00", "10:30", "15:00"],
  "2025-07-08": ["09:00", "11:00", "14:00", "17:00"],
  "2025-07-09": ["10:00", "13:00"],
  "2025-07-10": ["09:00", "12:00", "16:00"],
  "2025-07-11": ["10:30", "14:00", "17:00"],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const DIAS_CORTO = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MESES_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const MESES_LARGO = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Dom
  const diff = (day + 6) % 7; // cuántos días restar para llegar al lunes
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
}

function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} al ${sunday.getDate()} de ${MESES_LARGO[monday.getMonth()]}`;
  }
  return `${monday.getDate()} ${MESES_ES[monday.getMonth()]} – ${sunday.getDate()} ${MESES_ES[sunday.getMonth()]}`;
}

// ─── STEPPER ──────────────────────────────────────────────────────────────────
function Stepper({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px 10px", gap: 0 }}>
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? C.fucsia : active ? C.amarillo : "transparent",
                border: `2px solid ${done ? C.fucsia : active ? C.negro : C.borde}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
                color: done ? C.blanco : active ? C.negro : C.gris,
                transition: "all 0.2s",
              }}>
                {done ? "✓" : step.id}
              </div>
              <span style={{ fontSize: 8.5, fontWeight: active ? 800 : 500, color: active ? C.negro : C.gris, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 22, height: 1.5, margin: "0 3px 14px", background: i < current - 1 ? C.fucsia : C.borde, borderRadius: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Header() {
  return (
    <div style={{ padding: "22px 20px 16px", borderBottom: `1.5px solid ${C.borde}` }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.amarillo, padding: "3px 10px 3px 8px", borderRadius: 20, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>💅</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: C.negro, letterSpacing: "0.08em", textTransform: "uppercase" }}>nails.hunter</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: C.negro, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Reservá tu turno</div>
      <div style={{ fontSize: 13, color: C.gris, marginTop: 4 }}>📍 Belgrano, CABA</div>
      <div style={{ fontSize: 11, color: C.gris, marginTop: 2, fontStyle: "italic" }}>La dirección exacta te la mandamos al confirmar el turno</div>
    </div>
  );
}

function Btn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "14px",
      background: disabled ? C.grisClarito : C.fucsia,
      color: disabled ? C.gris : C.blanco,
      border: "none", borderRadius: 12,
      fontSize: 14, fontWeight: 800, letterSpacing: "0.03em",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      {children}
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", color: C.gris, fontSize: 13, cursor: "pointer", padding: "4px 0", fontWeight: 600, textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>
      ← Volver
    </button>
  );
}

function StepWrap({ title, subtitle, children }) {
  return (
    <div style={{ padding: "22px 18px calc(18px + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: 16, flex: 1, minHeight: 0 }}>
      <div style={{ flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.negro, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</h2>
        {subtitle && <p style={{ margin: "5px 0 0", fontSize: 13, color: C.gris, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── UPLOAD DE FOTO REAL ──────────────────────────────────────────────────────
function PhotoUpload({ value, onChange, labelEmpty, labelFull, accept = "image/*" }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={undefined}
        onChange={handleFile}
        style={{ display: "none" }}
      />
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          padding: value ? "12px" : "18px",
          borderRadius: 12,
          border: `1.5px ${value ? "solid" : "dashed"} ${value ? C.verde : C.borde}`,
          background: value ? C.verdeLight : C.blanco,
          cursor: "pointer", textAlign: "center", transition: "all 0.15s",
        }}
      >
        {value?.dataUrl ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={value.dataUrl} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.borde}` }} />
            <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.verde }}>{labelFull}</div>
              <div style={{ fontSize: 11, color: C.gris, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value.name} · tocá para cambiar</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 22, marginBottom: 5 }}>📎</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.negro }}>{labelEmpty}</div>
            <div style={{ fontSize: 11, color: C.gris, marginTop: 2 }}>JPG o PNG</div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TOOLTIP INFO ─────────────────────────────────────────────────────────────
function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          width: 20, height: 20, borderRadius: "50%",
          background: open ? C.fucsia : C.grisClarito,
          border: `1.5px solid ${open ? C.fucsia : C.borde}`,
          color: open ? C.blanco : C.gris,
          fontSize: 11, fontWeight: 800,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, lineHeight: 1,
        }}
      >i</button>
      {open && (
        <>
          {/* Overlay para cerrar al tocar afuera */}
          <div
            onClick={e => { e.stopPropagation(); setOpen(false); }}
            style={{ position: "fixed", inset: 0, zIndex: 9 }}
          />
          <div style={{
            position: "absolute", bottom: 26, right: 0,
            background: C.negro, color: C.blanco,
            fontSize: 12, lineHeight: 1.5,
            padding: "10px 12px", borderRadius: 10,
            width: 220, zIndex: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}>
            {text}
            <div style={{ position: "absolute", bottom: -6, right: 7, width: 12, height: 12, background: C.negro, transform: "rotate(45deg)", borderRadius: 2 }} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── HELPER PRECIO ────────────────────────────────────────────────────────────
function calcTotal(base, deco, retirado, decoCantidad = 1) {
  const b = base?.price || 0;
  const d = deco ? deco.price * (deco.perUna ? Math.max(1, decoCantidad) : 1) : 0;
  const r = retirado?.price || 0;
  return b + d + r;
}

// ─── PASO 1: SUB-PASOS DE SERVICIO ────────────────────────────────────────────
function Step1({ serviceData, onServiceChange, onNext }) {
  const { base, deco, retirado, decoPhoto, subStep } = serviceData;

  // Sub-paso A: Servicio base
  if (subStep === "base") {
    return (
      <StepWrap title="¿Qué servicio querés?" subtitle="El precio incluye el esmaltado semipermanente liso.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {SERVICIOS_BASE.map(s => {
            const sel = base?.id === s.id;
            return (
              <div key={s.id} onClick={() => onServiceChange({ ...serviceData, base: s })}
                style={{
                  padding: "13px 15px", borderRadius: 12,
                  border: `2px solid ${sel ? C.fucsia : C.borde}`,
                  background: sel ? C.fucsiaLight : C.blanco,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.negro, lineHeight: 1.3 }}>{s.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: sel ? C.fucsia : C.negro }}>${s.price.toLocaleString("es-AR")}</div>
                    <div style={{ fontSize: 10, color: C.gris }}>seña ${Math.round(s.price * 0.5).toLocaleString("es-AR")}</div>
                  </div>
                  <InfoTooltip text={s.info} />
                </div>
              </div>
            );
          })}
        </div>
        <Btn onClick={() => onServiceChange({ ...serviceData, subStep: "deco" })} disabled={!base}>Continuar</Btn>
      </StepWrap>
    );
  }

  // Sub-paso B: Decoración
  if (subStep === "deco") {
    return (
      <StepWrap title="¿Querés decoración?" subtitle="Opcional. Si no querés, saltá al siguiente paso.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {DECORACIONES.map(d => {
            const sel = deco?.id === d.id;
            const cantidad = sel ? (serviceData.decoCantidad || 1) : 1;
            return (
              <div key={d.id}>
                <div onClick={() => onServiceChange({ ...serviceData, deco: sel ? null : d, decoPhoto: sel ? null : decoPhoto, decoCantidad: sel ? undefined : 1 })}
                  style={{
                    padding: "12px 15px", borderRadius: 12,
                    border: `2px solid ${sel ? C.fucsia : C.borde}`,
                    background: sel ? C.fucsiaLight : C.blanco,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.negro }}>
                      {d.name}
                      {d.consultar && <span style={{ fontSize: 10, background: C.amarillo, color: C.negro, borderRadius: 6, padding: "1px 6px", marginLeft: 6, fontWeight: 700 }}>consultar</span>}
                    </div>
                    {d.perUna && <div style={{ fontSize: 11, color: C.gris, marginTop: 2 }}>precio por uña</div>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: sel ? C.fucsia : C.negro, flexShrink: 0 }}>
                    ${d.price.toLocaleString("es-AR")}{d.consultar ? "+" : ""}
                  </div>
                </div>

                {/* Selector de cantidad para servicios "por uña" */}
                {sel && d.perUna && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 15px", marginTop: 6,
                    background: C.lilaLight, borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.negro }}>¿Cuántas uñas?</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onServiceChange({ ...serviceData, decoCantidad: Math.max(1, cantidad - 1) }); }}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${C.negro}`,
                          background: C.blanco, fontSize: 16, fontWeight: 800, color: C.negro,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >−</button>
                      <span style={{ fontSize: 15, fontWeight: 900, color: C.negro, minWidth: 20, textAlign: "center" }}>{cantidad}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onServiceChange({ ...serviceData, decoCantidad: cantidad + 1 }); }}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${C.negro}`,
                          background: C.negro, fontSize: 16, fontWeight: 800, color: C.blanco,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >+</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Upload foto si eligió deco que la requiere */}
          {deco?.needsPhoto && (
            <PhotoUpload
              value={decoPhoto}
              onChange={(photo) => onServiceChange({ ...serviceData, decoPhoto: photo })}
              labelEmpty="Adjuntá foto de referencia del diseño"
              labelFull="Foto de referencia adjuntada"
            />
          )}

          {deco?.consultar && (
            <div style={{ padding: "12px", borderRadius: 10, background: C.lilaLight, border: `1px solid ${C.lila}` }}>
              <div style={{ fontSize: 12, color: C.negro, lineHeight: 1.5 }}>
                💬 <strong>Precio a confirmar.</strong> Te cobramos $4.000 de seña. Una vez que veamos tu referencia, te avisamos el total — la diferencia se abona en el turno.
              </div>
            </div>
          )}
        </div>

        <Btn
          onClick={() => onServiceChange({ ...serviceData, subStep: "retirado" })}
          disabled={deco?.needsPhoto && !decoPhoto}
        >
          {deco ? (deco?.needsPhoto && !decoPhoto ? "Adjuntá una foto para seguir" : "Continuar") : "Saltar, no quiero deco"}
        </Btn>
        <BackBtn onClick={() => onServiceChange({ ...serviceData, subStep: "base" })} />
      </StepWrap>
    );
  }

  // Sub-paso C: Retirado
  if (subStep === "retirado") {
    const total = calcTotal(base, deco, retirado, serviceData.decoCantidad);
    const seña = Math.round(total * 0.5);
    return (
      <StepWrap title="¿Necesitás retirado?" subtitle="Opcional. Si venís de otro salón o querés remover antes.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {RETIRADOS.map(r => {
            const sel = retirado?.id === r.id;
            return (
              <div key={r.id} onClick={() => onServiceChange({ ...serviceData, retirado: sel ? null : r })}
                style={{
                  padding: "12px 15px", borderRadius: 12,
                  border: `2px solid ${sel ? C.fucsia : C.borde}`,
                  background: sel ? C.fucsiaLight : C.blanco,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.negro, flex: 1, lineHeight: 1.3 }}>{r.name}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: sel ? C.fucsia : C.negro, flexShrink: 0, marginLeft: 8 }}>
                  ${r.price.toLocaleString("es-AR")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de precio */}
        <div style={{ padding: "14px 16px", borderRadius: 12, background: C.amarillo, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.negro, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total del servicio</div>
            <div style={{ fontSize: 11, color: C.negro, opacity: 0.65, marginTop: 2 }}>Seña (50%): ${seña.toLocaleString("es-AR")}</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.negro }}>${total.toLocaleString("es-AR")}</div>
        </div>

        <Btn onClick={onNext}>{retirado ? "Continuar" : "Saltar, no necesito retirado"}</Btn>
        <BackBtn onClick={() => onServiceChange({ ...serviceData, subStep: "deco" })} />
      </StepWrap>
    );
  }

  return null;
}

// ─── PASO 2: SEMANA ───────────────────────────────────────────────────────────
function Step2({ selected, onSelect, onNext, onBack }) {
  // Arranca siempre en la semana del 1 de julio 2025
  const startMonday = getMondayOfWeek(new Date(2025, 6, 1));
  const [monday, setMonday] = useState(startMonday);

  const days = getWeekDays(monday);

  const prevWeek = () => {
    const prev = new Date(monday);
    prev.setDate(monday.getDate() - 7);
    // No retroceder antes de la semana inicial
    if (prev >= startMonday) setMonday(prev);
  };

  const nextWeek = () => {
    const next = new Date(monday);
    next.setDate(monday.getDate() + 7);
    setMonday(next);
  };

  const isFirstWeek = toDateStr(monday) === toDateStr(startMonday);

  return (
    <StepWrap title="¿Qué día te queda bien?" subtitle="Sábados y domingos no tienen turnos.">
      <div style={{ flex: 1 }}>

        {/* Nav semana */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={prevWeek} disabled={isFirstWeek} style={{
            background: "none",
            border: `1.5px solid ${isFirstWeek ? C.grisClarito : C.borde}`,
            borderRadius: 8, width: 32, height: 32,
            cursor: isFirstWeek ? "default" : "pointer",
            fontSize: 16, color: isFirstWeek ? "#CCC" : C.negro,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>‹</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.negro }}>
            {formatWeekRange(monday)}
          </span>
          <button onClick={nextWeek} style={{
            background: "none", border: `1.5px solid ${C.borde}`,
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            fontSize: 16, color: C.negro,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>›</button>
        </div>

        {/* Cards de días — siempre 7, lunes a domingo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
          {days.map((dayDate, di) => {
            const dateStr = toDateStr(dayDate);
            const isWeekend = di === 5 || di === 6; // índice 5=Sáb, 6=Dom
            const isSelected = selected === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => { if (!isWeekend) onSelect(dateStr); }}
                style={{
                  borderRadius: 12,
                  border: `2px solid ${isSelected ? C.fucsia : isWeekend ? "transparent" : C.borde}`,
                  background: isSelected ? C.fucsiaLight : isWeekend ? C.grisClarito : C.blanco,
                  cursor: isWeekend ? "default" : "pointer",
                  padding: "10px 4px 8px",
                  textAlign: "center",
                  transition: "all 0.12s",
                }}
              >
                <div style={{
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.04em", marginBottom: 4,
                  color: isSelected ? C.fucsia : isWeekend ? "#C0B8B0" : C.gris,
                }}>
                  {DIAS_CORTO[di]}
                </div>
                <div style={{
                  fontSize: 17, lineHeight: 1,
                  fontWeight: isWeekend ? 400 : 800,
                  color: isSelected ? C.fucsia : isWeekend ? "#C0B8B0" : C.negro,
                }}>
                  {dayDate.getDate()}
                </div>
                <div style={{ fontSize: 9, marginTop: 3, color: isWeekend ? "#CCC" : C.gris }}>
                  {MESES_ES[dayDate.getMonth()]}
                </div>
                {!isWeekend && !isSelected && (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.fucsia, margin: "4px auto 0" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Btn onClick={onNext} disabled={!selected}>Continuar</Btn>
      <BackBtn onClick={onBack} />
    </StepWrap>
  );
}

// ─── PASO 3 ───────────────────────────────────────────────────────────────────
function Step3({ date, selected, onSelect, onNext, onBack }) {
  const allSlots = SLOTS[date] || [];
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const isToday = date === todayStr;

  // Si es hoy, filtrar horarios que ya pasaron (con 1h de margen mínimo)
  const slots = allSlots.filter(slot => {
    if (!isToday) return true;
    const [h, m] = slot.split(":").map(Number);
    const slotMinutes = h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + 60; // +60 min de margen
    return slotMinutes > nowMinutes;
  });

  const d = new Date(date + "T12:00:00");
  const label = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <StepWrap title="¿A qué hora?" subtitle={`Horarios disponibles para el ${label}.`}>
      {slots.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {slots.map(slot => {
            const sel = selected === slot;
            return (
              <div key={slot} onClick={() => onSelect(slot)} style={{
                padding: "10px 8px", borderRadius: 12,
                border: `2px solid ${sel ? C.fucsia : C.borde}`,
                background: sel ? C.fucsiaLight : C.blanco,
                cursor: "pointer", textAlign: "center",
                fontSize: 15, fontWeight: 800,
                color: sel ? C.fucsia : C.negro,
                transition: "all 0.15s",
              }}>
                {slot}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "24px 16px", textAlign: "center", background: C.grisClarito, borderRadius: 12, color: C.gris, fontSize: 13, lineHeight: 1.5 }}>
          No quedan horarios disponibles para este día. Elegí otra fecha. 📅
        </div>
      )}
      <div style={{ flex: 1 }} />
      <Btn onClick={onNext} disabled={!selected}>Continuar</Btn>
      <BackBtn onClick={onBack} />
    </StepWrap>
  );
}

// ─── PASO 4 ───────────────────────────────────────────────────────────────────
function Step4({ data, onChange, onNext, onBack }) {
  const [touched, setTouched] = useState({});

  const emailValid = data.mail ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.mail) : false;
  const telValid = data.celular ? data.celular.replace(/\D/g, "").length >= 8 : false;
  const nombreValid = data.nombre ? data.nombre.trim().length >= 3 : false;

  // Validar mayoría de edad (18+)
  let edadValida = false;
  let edadError = "Elegí tu fecha de nacimiento";
  if (data.nacimiento) {
    const nac = new Date(data.nacimiento + "T12:00:00");
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    if (nac > hoy) { edadValida = false; edadError = "La fecha no puede ser futura"; }
    else if (edad < 18) { edadValida = false; edadError = "Tenés que ser mayor de 18 años"; }
    else if (edad > 100) { edadValida = false; edadError = "Revisá la fecha ingresada"; }
    else edadValida = true;
  }

  const igValid = !!data.instagram?.trim();
  const valid = nombreValid && emailValid && telValid && igValid && edadValida;

  // Fecha máxima = hace 18 años desde hoy
  const hoy = new Date();
  const maxDate = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

  const fields = [
    { label: "Nombre completo", name: "nombre", type: "text", placeholder: "Ana García", valid: nombreValid, error: "Ingresá tu nombre completo", required: true },
    { label: "Mail", name: "mail", type: "email", placeholder: "ana@mail.com", valid: emailValid, error: "Ingresá un mail válido (ej: ana@mail.com)", inputMode: "email", required: true },
    { label: "Celular", name: "celular", type: "tel", placeholder: "11 1234-5678", valid: telValid, error: "Ingresá un celular válido", inputMode: "tel", required: true },
    { label: "Instagram", name: "instagram", type: "text", placeholder: "@ana.garcia", valid: igValid, error: "Ingresá tu usuario de Instagram", required: true, hint: "Por si no te encontramos por teléfono" },
    { label: "Fecha de nacimiento", name: "nacimiento", type: "date", valid: edadValida, error: edadError, required: true, max: maxDate },
  ];

  const markTouched = (name) => setTouched(t => ({ ...t, [name]: true }));

  return (
    <StepWrap title="Tus datos" subtitle="Los necesitamos para confirmar tu turno.">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map(f => {
          const showError = touched[f.name] && !f.valid && data[f.name] && f.required;
          const isDate = f.type === "date";
          return (
            <div key={f.name}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.negro, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 5 }}>
                {f.label}
                {f.hint && <span style={{ textTransform: "none", fontWeight: 500, color: C.gris, letterSpacing: "normal" }}> ({f.hint})</span>}
              </label>
              <input
                type={f.type}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                value={data[f.name] || ""}
                max={isDate ? f.max : undefined}
                onChange={e => onChange(f.name, e.target.value)}
                onBlur={e => { markTouched(f.name); e.target.style.borderColor = showError ? C.error : C.borde; }}
                onFocus={e => e.target.style.borderColor = C.fucsia}
                onClick={e => { if (isDate && e.target.showPicker) { try { e.target.showPicker(); } catch (_) {} } }}
                style={{
                  width: "100%", padding: "12px 13px", borderRadius: 10,
                  border: `1.5px solid ${showError ? C.error : C.borde}`,
                  fontSize: 16, color: data[f.name] ? C.negro : "#999", background: C.blanco,
                  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  transition: "border 0.15s",
                  WebkitAppearance: "none", appearance: "none",
                  minHeight: 46,
                }}
              />
              {showError && (
                <div style={{ fontSize: 11, color: C.error, marginTop: 4, fontWeight: 600 }}>{f.error}</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <Btn onClick={onNext} disabled={!valid}>Continuar</Btn>
      <BackBtn onClick={onBack} />
    </StepWrap>
  );
}

// ─── PASO 5 ───────────────────────────────────────────────────────────────────
function Step5({ service, timeLeft, comprobante, onUpload, onNext, onBack }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const urgent = timeLeft < 300;
  const pct = (timeLeft / 1800) * 100;
  return (
    <StepWrap title="Abonás la seña" subtitle="Una vez que confirmemos el pago, el turno queda reservado.">
      <div style={{ padding: "13px 15px", borderRadius: 12, background: urgent ? "#FFF0F0" : C.lilaLight, border: `1.5px solid ${urgent ? "#FFCACA" : C.lila}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: urgent ? "#C00" : C.negro }}>{urgent ? "⚠️ Poco tiempo" : "Tiempo para pagar"}</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: urgent ? "#C00" : C.negro, fontVariantNumeric: "tabular-nums" }}>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
        </div>
        <div style={{ height: 5, background: "#E0D8E8", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: urgent ? "#E84040" : C.lila, borderRadius: 3, transition: "width 1s linear" }} />
        </div>
      </div>
      <div style={{ padding: "16px", borderRadius: 12, background: C.amarillo, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.negro, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Monto a transferir</div>
          <div style={{ fontSize: 11, color: C.negro, opacity: 0.6 }}>{service?.name}</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.negro }}>${service?.seña?.toLocaleString("es-AR")}</div>
      </div>
      <div style={{ padding: "14px 16px", borderRadius: 12, border: `1.5px dashed ${C.borde}`, background: C.blanco }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.gris, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>CBU</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.negro, letterSpacing: "0.03em", wordBreak: "break-all" }}>0000003100012345678901</div>
        <div style={{ fontSize: 11, color: C.gris, marginTop: 4 }}>Titular: Valentina Hunter</div>
      </div>
      <PhotoUpload
        value={comprobante}
        onChange={onUpload}
        labelEmpty="Subir comprobante de transferencia"
        labelFull="Comprobante cargado"
      />
      <div style={{ flex: 1 }} />
      <Btn onClick={onNext} disabled={!comprobante}>Enviar reserva</Btn>
      <BackBtn onClick={onBack} />
    </StepWrap>
  );
}

// ─── PASO 6 ───────────────────────────────────────────────────────────────────
function Step6({ booking }) {
  const d = booking.date ? new Date(booking.date + "T12:00:00") : null;
  const label = d ? d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }) : "-";
  return (
    <div style={{ padding: "36px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.fucsiaLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🎉</div>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.negro }}>Tu reserva está en revisión</h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: C.gris, lineHeight: 1.6, maxWidth: 280 }}>Revisamos tu comprobante y te confirmamos el turno por mail en las próximas horas.</p>
      </div>
      <div style={{ width: "100%", background: C.blanco, border: `1.5px solid ${C.borde}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ background: C.fucsia, padding: "10px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.blanco, textTransform: "uppercase", letterSpacing: "0.1em" }}>Resumen del turno</div>
        </div>
        {[
          { label: "Servicio", value: booking.service?.name },
          { label: "Fecha", value: label },
          { label: "Horario", value: booking.time },
          { label: "Seña abonada", value: `$${booking.service?.seña?.toLocaleString("es-AR")}` },
        ].map(({ label, value }, i, arr) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", fontSize: 13, borderBottom: i < arr.length - 1 ? `1px solid ${C.borde}` : "none" }}>
            <span style={{ color: C.gris }}>{label}</span>
            <span style={{ fontWeight: 700, color: C.negro }}>{value}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: C.gris, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>Si no recibís el mail, revisá spam o escribinos a <strong>@nails.hunter</strong> 💌</p>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [serviceData, setServiceData] = useState({ base: null, deco: null, retirado: null, decoPhoto: null, subStep: "base" });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({});
  const [comprobante, setComprobante] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const timerRef = useRef(null);

  const total = calcTotal(serviceData.base, serviceData.deco, serviceData.retirado, serviceData.decoCantidad);
  const seña = Math.round(total * 0.5);
  // Objeto unificado de servicio para pasar a Step5 y Step6
  const decoLabel = serviceData.deco
    ? `${serviceData.deco.name}${serviceData.deco.perUna ? ` x${serviceData.decoCantidad || 1}` : ""}`
    : null;
  const serviceSummary = serviceData.base ? {
    name: [serviceData.base?.name, decoLabel, serviceData.retirado?.name].filter(Boolean).join(" + "),
    price: total,
    seña,
  } : null;

  useEffect(() => {
    if (step === 5) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setStep(1);
            setServiceData({ base: null, deco: null, retirado: null, decoPhoto: null, subStep: "base" });
            setDate(null); setTime(null); setForm({}); setComprobante(null);
            setTimeLeft(1800); return 1800;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, display: "flex", justifyContent: "center", alignItems: "stretch", padding: "12px 12px calc(16px + env(safe-area-inset-bottom))", fontFamily: "'Inter', system-ui, sans-serif", width: "100%", overflowX: "hidden" }}>
      <div style={{ width: "100%", maxWidth: 420, display: "flex" }}>
        <div style={{ background: C.blanco, borderRadius: 20, border: `1.5px solid ${C.borde}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", width: "100%" }}>
          <Header />
          {step < 6 && <div style={{ borderBottom: `1px solid ${C.borde}`, flexShrink: 0 }}><Stepper current={step} /></div>}
          {step === 1 && (
            <Step1
              serviceData={serviceData}
              onServiceChange={setServiceData}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && <Step2 selected={date} onSelect={d => { setDate(d); setTime(null); }} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 date={date} selected={time} onSelect={setTime} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4 data={form} onChange={(k, v) => setForm(p => ({ ...p, [k]: v }))} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <Step5 service={serviceSummary} timeLeft={timeLeft} comprobante={comprobante} onUpload={setComprobante} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
          {step === 6 && <Step6 booking={{ service: serviceSummary, date, time, form }} />}
        </div>
      </div>
    </div>
  );
}
