import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./routes/Layout";
import { Catalog } from "./routes/Catalog";
import { AlgoPage } from "./routes/AlgoPage";

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Catalog,
});

const algoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/algo/$slug",
  component: AlgoPage,
});

const routeTree = rootRoute.addChildren([indexRoute, algoRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
