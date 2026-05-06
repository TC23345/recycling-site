import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

const components: MDXComponents = {
  // Wrap rendered tables (remark-gfm) so they can scroll horizontally on
  // narrow viewports instead of forcing the whole page to overflow.
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
