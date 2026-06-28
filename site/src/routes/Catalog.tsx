import { Link } from "@tanstack/react-router";
import { algorithms } from "../registry";

export function Catalog() {
  return (
    <>
      <h1>Algorithm visualizations</h1>
      <p className="legend">
        Step-by-step walkthroughs on top of the real solutions in <code>src/</code>. Pick an algorithm.
      </p>
      <div className="catalog">
        {algorithms.map((algo) => (
          <Link
            key={algo.slug}
            className="card"
            to="/algo/$slug"
            params={{ slug: algo.slug }}
          >
            <div className="title">{algo.title}</div>
            <div className="tags">
              {algo.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
