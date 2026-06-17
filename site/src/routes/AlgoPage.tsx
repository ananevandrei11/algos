import { Link, useParams } from "@tanstack/react-router";
import { findAlgo } from "../registry";

export function AlgoPage() {
  const { slug } = useParams({ from: "/algo/$slug" });
  const algo = findAlgo(slug);

  if (!algo) {
    return (
      <>
        <h1>Not found</h1>
        <p className="legend">
          No algorithm with slug <code>{slug}</code>. <Link to="/">Back to catalog</Link>.
        </p>
      </>
    );
  }

  const { Visualization } = algo;
  return (
    <>
      <p className="legend">
        <Link to="/">← Catalog</Link>
      </p>
      <Visualization />
    </>
  );
}
