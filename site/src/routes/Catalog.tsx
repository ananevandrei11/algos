import { Link } from "@tanstack/react-router";
import { algorithms } from "../registry";

export function Catalog() {
  const grouped = algorithms.reduce(
    (acc, algo) => {
      const category = algo.tags[0] || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(algo);
      return acc;
    },
    {} as Record<string, typeof algorithms>
  );

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <>
      <h1>Algorithm visualizations</h1>
      <p className="legend">
        Step-by-step walkthroughs on top of the real solutions in <code>src/</code>. Pick an algorithm.
      </p>
      {sortedCategories.map((category) => (
        <div key={category}>
          <h2 className="category-header">{category}</h2>
          <div className="catalog">
            {grouped[category].map((algo) => (
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
        </div>
      ))}
    </>
  );
}
