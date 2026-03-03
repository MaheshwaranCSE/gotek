"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Template = {
  id: string;
  name: string;
  fieldsData: {
    fields: { key: string; x: number; y: number }[];
  } | null;
};

const CARD_WIDTH = 600;
const CARD_HEIGHT = 380;

const AVAILABLE_FIELDS = [
  { key: "name", label: "Student Name" },
  { key: "registrationId", label: "Registration ID" },
  { key: "class", label: "Class" },
  { key: "section", label: "Section" },
];

export default function TemplateEditPage() {
  const params = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const canvasRef = useRef<any | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const fabricModule = await import("fabric");
      const fabric = (fabricModule as any).fabric ?? fabricModule.default;

      if (!isMounted || !canvasElRef.current) return;

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#020617",
      });
      canvasRef.current = canvas;
    };

    void init();

    return () => {
      isMounted = false;
      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const loadTemplate = async () => {
      const res = await fetch(`/api/templates/${params.id}`);
      if (!res.ok) return;
      const json = await res.json();
      setTemplate(json.template);

      if (canvasRef.current && json.template.fieldsData) {
        const data = json.template.fieldsData as {
          fields: { key: string; x: number; y: number }[];
        };
        data.fields.forEach((field) => {
          const text = new canvasRef.current.constructor.Text(field.key, {
            left: field.x,
            top: field.y,
            fill: "#e5e7eb",
            fontSize: 16,
          });
          text.set("dataField", field.key);
          canvasRef.current?.add(text);
        });
      }
    };

    loadTemplate();
  }, [params.id]);

  const addField = (key: string) => {
    if (!canvasRef.current) return;
    const text = new canvasRef.current.constructor.Text(key, {
      left: CARD_WIDTH / 2 - 60,
      top: CARD_HEIGHT / 2,
      fill: "#e5e7eb",
      fontSize: 16,
    });
    text.set("dataField", key);
    canvasRef.current.add(text);
  };

  const saveLayout = async () => {
    if (!canvasRef.current || !template) return;

    const fields = (canvasRef.current
      .getObjects()
      .filter((obj: any) => obj.dataField)
      .map((obj: any) => {
        const typed = obj as any;
        return {
          key: typed.dataField ?? "",
          x: typed.left ?? 0,
          y: typed.top ?? 0,
        };
      })) satisfies { key: string; x: number; y: number }[];

    await fetch(`/api/templates/${template.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldsData: { fields } }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          Edit Template Layout
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Drag and drop variable fields onto the card canvas. Positions will be saved
          and used when generating ID cards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr,280px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <canvas
            ref={canvasElRef}
            className="mx-auto rounded-xl border border-slate-800 bg-slate-950"
          />
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Fields
          </p>
          <div className="space-y-2">
            {AVAILABLE_FIELDS.map((field) => (
              <button
                key={field.key}
                type="button"
                onClick={() => addField(field.key)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 transition hover:border-sky-500 hover:bg-slate-900"
              >
                <span>{field.label}</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {field.key}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={saveLayout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
          >
            Save layout
          </button>
        </div>
      </div>
    </div>
  );
}

