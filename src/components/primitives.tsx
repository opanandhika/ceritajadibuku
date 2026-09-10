"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const label = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} aria-labelledby={label} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-head"><h2 id={label}>{title}</h2><button className="icon-button" aria-label="Dialog tutup" onClick={onClose}><X size={22} /></button></div>
    {children}
  </dialog>;
}
export function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function PageTitle({ eyebrow, title, children, action }: { eyebrow?: string; title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return <header className="page-heading"><div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h1>{title}</h1>{children && <div className="heading-description">{children}</div>}</div>{action}</header>;
}
