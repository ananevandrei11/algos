import { useMemo } from "react";
import { parseArgs } from "@algos/parseArgs/parseArgs";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "is-flag"; arg: string; key: string }
  | { kind: "next-is-value"; nextArg: string }
  | { kind: "set-value"; key: string; value: string | boolean }
  | { kind: "done" };

interface State {
  args: string[];
  data: Record<string, string | boolean>;
  activeIndex: number;
  processedArgs: Set<number>;
  log: LogEvent;
}

function buildStates(args: string[]): { states: State[]; answer: Record<string, string | boolean> } {
  const states: State[] = [];
  const data: Record<string, string | boolean> = {};
  const processedArgs = new Set<number>();

  for (let ind = 0; ind < args.length; ind++) {
    const i = args[ind];

    if (i.startsWith("-") || i.startsWith("--")) {
      const key = i.replace(/^--?/, "");

      states.push({
        args,
        data: { ...data },
        activeIndex: ind,
        processedArgs: new Set(processedArgs),
        log: { kind: "is-flag", arg: i, key },
      });

      const next = args[ind + 1];
      if (next?.startsWith("-") || next?.startsWith("--")) {
        data[key] = true;
        processedArgs.add(ind);

        states.push({
          args,
          data: { ...data },
          activeIndex: ind,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: true },
        });
      } else if (next !== undefined) {
        states.push({
          args,
          data: { ...data },
          activeIndex: ind,
          processedArgs: new Set(processedArgs),
          log: { kind: "next-is-value", nextArg: next },
        });

        data[key] = next || true;
        processedArgs.add(ind);
        processedArgs.add(ind + 1);

        states.push({
          args,
          data: { ...data },
          activeIndex: ind,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: data[key] },
        });
      } else {
        data[key] = true;
        processedArgs.add(ind);

        states.push({
          args,
          data: { ...data },
          activeIndex: ind,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: true },
        });
      }
    }
  }

  states.push({
    args,
    data: { ...data },
    activeIndex: args.length,
    processedArgs: new Set(processedArgs),
    log: { kind: "done" },
  });

  return { states, answer: data };
}

interface ParseArgsVizProps {
  input?: string[];
}

function ParseArgsView({ state }: { state: State }) {
  return (
    <div className="viz-container">
      <div className="array-section">
        <h3>Arguments</h3>
        <div className="array-row">
          {state.args.map((arg, i) => (
            <div
              key={i}
              className={`array-item ${state.processedArgs.has(i) ? "processed" : ""} ${i === state.activeIndex ? "active" : ""}`}
            >
              "{arg}"
            </div>
          ))}
        </div>
      </div>

      <div className="hash-table-section">
        <h3>Parsed Data</h3>
        <div className="hash-table">
          {Object.entries(state.data).map(([key, value]) => (
            <div key={key} className="hash-entry">
              <span className="key">{key}</span>
              <span className="colon">:</span>
              <span className="value">{typeof value === "boolean" ? String(value) : `"${value}"`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="log-section">
        <h3>Step Log</h3>
        <div className="log">
          {state.log.kind === "is-flag" && (
            <span>Found flag: <code>{state.log.arg}</code> → key = <code>{state.log.key}</code></span>
          )}
          {state.log.kind === "next-is-value" && (
            <span>Next arg is a value: <code>{state.log.nextArg}</code></span>
          )}
          {state.log.kind === "set-value" && (
            <span>Set <code>{state.log.key}</code> = <code>{typeof state.log.value === "boolean" ? String(state.log.value) : `"${state.log.value}"`}</code></span>
          )}
          {state.log.kind === "done" && (
            <span>Done parsing. Result: {Object.keys(state.data).length} keys</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParseArgsViz({ input = ["--verbose", "-d", "output.log", "--name", "test"] }: ParseArgsVizProps) {
  const { states, answer } = useMemo(() => buildStates(input), [input]);

  const realAnswer = useMemo(() => parseArgs(input), [input]);
  const correct = useMemo(() => JSON.stringify(answer) === JSON.stringify(realAnswer), [answer, realAnswer]);

  return (
    <div>
      <p className={correct ? "verify ok" : "verify fail"}>
        {correct ? "✓ Correct" : "✗ Mismatch"}
      </p>
      <StepPlayer states={states} render={(state) => <ParseArgsView state={state} />} />
    </div>
  );
}
