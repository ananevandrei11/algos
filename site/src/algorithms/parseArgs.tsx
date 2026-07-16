import { useMemo } from "react";
import { parseArgs } from "@algos/parseArgs/parseArgs";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "start"; arg: string; index: number }
  | { kind: "is-flag"; arg: string; key: string }
  | { kind: "next-is-flag"; nextArg: string }
  | { kind: "set-value"; key: string; value: string | boolean }
  | { kind: "done" };

interface State {
  data: Record<string, string | boolean>;
  currentIndex: number;
  currentArg: string | null;
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
        data: { ...data },
        currentIndex: ind,
        currentArg: i,
        processedArgs: new Set(processedArgs),
        log: { kind: "is-flag", arg: i, key },
      });

      const next = args[ind + 1];
      if (next?.startsWith("-") || next?.startsWith("--")) {
        data[key] = true;
        processedArgs.add(ind);

        states.push({
          data: { ...data },
          currentIndex: ind,
          currentArg: i,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: true },
        });
      } else if (next !== undefined) {
        states.push({
          data: { ...data },
          currentIndex: ind,
          currentArg: i,
          processedArgs: new Set(processedArgs),
          log: { kind: "next-is-flag", nextArg: next },
        });

        data[key] = next;
        processedArgs.add(ind);
        processedArgs.add(ind + 1);

        states.push({
          data: { ...data },
          currentIndex: ind,
          currentArg: i,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: next },
        });
      } else {
        data[key] = true;
        processedArgs.add(ind);

        states.push({
          data: { ...data },
          currentIndex: ind,
          currentArg: i,
          processedArgs: new Set(processedArgs),
          log: { kind: "set-value", key, value: true },
        });
      }
    }
  }

  states.push({
    data: { ...data },
    currentIndex: args.length,
    currentArg: null,
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
          {(state.currentArg ? [state.currentArg] : []).length > 0 ? (
            <>
              {Array.from(state.processedArgs).map((i) => (
                <div key={i} className="array-item processed">
                  "{state.currentArg}"
                </div>
              ))}
            </>
          ) : null}
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
          {state.log.kind === "next-is-flag" && (
            <span>Next arg is also a flag: <code>{state.log.nextArg}</code></span>
          )}
          {state.log.kind === "set-value" && (
            <span>Set <code>{state.log.key}</code> = <code>{typeof state.log.value === "boolean" ? String(state.log.value) : `"${state.log.value}"`}</code></span>
          )}
          {state.log.kind === "done" && (
            <span>Done parsing</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParseArgsViz({ input = ["--verbose", "-d", "output.log", "--name", "test"] }: ParseArgsVizProps) {
  const { states, answer } = useMemo(() => buildStates(input), [input]);

  const realAnswer = parseArgs(input);
  const correct = JSON.stringify(answer) === JSON.stringify(realAnswer);

  return (
    <div>
      <div className="verification">
        {correct ? (
          <span className="ok">✓ Correct</span>
        ) : (
          <span className="wrong">✗ Mismatch</span>
        )}
      </div>
      <StepPlayer states={states} render={(state) => <ParseArgsView state={state} />} />
    </div>
  );
}
