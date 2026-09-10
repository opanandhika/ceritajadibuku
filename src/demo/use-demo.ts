"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book, Demo, Scenario, Session } from "../domain/model";
import { transition, type Action } from "../domain/session";
import { initialDemo } from "./seed";
import { loadDemo, saveDemo, PREVIOUS_STORAGE_KEY } from "./storage";
import { mockProvider } from "./provider";

export function useDemo() {
  const [demo, setDemo] = useState<Demo>(initialDemo);
  const state = useRef(demo);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saved" | "failed">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasPrevious, setHasPrevious] = useState(false);
  const generation = useRef(0);
  const canSave = useRef(true);
  const [scenario, setScenario] = useState<Scenario>("normal");
  const scenarioRef = useRef<Scenario>("normal");
  const [simulateStorageFailure, setSimulateStorageFailure] = useState(false);
  const failStorage = useRef(false);
  const startedOperations = useRef(new Set<string>());
  const dispatchRef = useRef<(bookId: string, sessionId: string, action: Action, version?: number) => void>(() => {});

  const persist = useCallback((value: Demo) => {
    try {
      const success = canSave.current && !failStorage.current && saveDemo(window.localStorage, value);
      setSaveState(success ? "saved" : "failed");
    } catch { setSaveState("failed"); }
  }, []);
  const commit = useCallback((update: (current: Demo) => Demo) => {
    const next = update(state.current);
    state.current = next;
    setDemo(next);
    persist(next);
  }, [persist]);
  useEffect(() => {
    let live = true;
    Promise.resolve().then(() => {
      if (!live) return;
      let result: ReturnType<typeof loadDemo>;
      try {
        setHasPrevious(window.localStorage.getItem(PREVIOUS_STORAGE_KEY) !== null);
        result = loadDemo(window.localStorage);
      }
      catch { result = { kind: "error", message: "Penyimpanan perangkat tidak tersedia. Tulisan hanya berada di memori sampai dapat disimpan." }; }
      if (result.kind === "ok") {
        state.current = result.value;
        setDemo(result.value);
        persist(result.value);
      } else if (result.kind === "error") {
        canSave.current = false;
        setLoadError(result.message);
        setSaveState("failed");
      } else persist(state.current);
      setReady(true);
    });
    return () => { live = false; generation.current += 1; };
  }, [persist]);
  useEffect(() => {
    function leave(event: BeforeUnloadEvent) {
      if (saveState === "failed") { event.preventDefault(); event.returnValue = ""; }
    }
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [saveState]);

  const run = useCallback((bookId: string, session: Session) => {
    const operation = session.operation;
    if (!operation || startedOperations.current.has(operation.id)) return;
    startedOperations.current.add(operation.id);
    const startedGeneration = generation.current;
    mockProvider.run(operation, scenarioRef.current, session.questions.map((question) => question.target))
      .then((result) => { if (generation.current === startedGeneration) dispatchRef.current(bookId, session.id, { type: "resolve", operationId: operation.id, result }, operation.version); })
      .catch(() => { if (generation.current === startedGeneration) dispatchRef.current(bookId, session.id, { type: "reject", operationId: operation.id }, operation.version); });
  }, []);
  const dispatch = useCallback((bookId: string, sessionId: string, action: Action, version?: number) => {
    const current = state.current;
    const book = current.books.find((item) => item.id === bookId);
    const session = book?.sessions.find((item) => item.id === sessionId);
    if (!book || !session) return;
    const result = transition(session, action, version ?? session.version, { credits: current.credits, characters: book.characters, privacyRevision: book.privacyRevision,
      otherJobActive: current.books.some((item) => item.sessions.some((existing) => existing.id !== sessionId && existing.operation !== null)),
    });
    if (result.session === session) return;
    commit((value) => ({ ...value, credits: value.credits - result.charge,
      events: result.charge ? [...value.events, { id: `${session.id}:${result.session.version}`, label: result.charge === 4 ? "Draf simulasi" : "Penggalian simulasi", amount: -result.charge }] : value.events,
      books: value.books.map((item) => item.id === bookId ? { ...item, sessions: item.sessions.map((existing) => existing.id === sessionId ? result.session : existing) } : item),
    }));
    run(bookId, result.session);
  }, [commit, run]);
  useEffect(() => { dispatchRef.current = dispatch; }, [dispatch]);

  const updateBook = useCallback((id: string, update: (book: Book) => Book) => commit((value) => ({ ...value, books: value.books.map((book) => book.id === id ? update(book) : book) })), [commit]);
  const chooseScenario = (value: Scenario) => { scenarioRef.current = value; setScenario(value); };
  const setStorageFailure = (value: boolean) => { failStorage.current = value; setSimulateStorageFailure(value); persist(state.current); };
  const reset = () => {
    generation.current += 1;
    startedOperations.current.clear();
    canSave.current = true;
    setLoadError(null);
    commit(initialDemo);
  };
  return { demo, ready, saveState, loadError, hasPrevious, commit, updateBook, dispatch, scenario, chooseScenario, simulateStorageFailure, setStorageFailure, reset };
}
