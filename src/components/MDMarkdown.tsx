import { useTheme } from "next-themes";
import MDEditor from "@uiw/react-md-editor";

export const MDMarkdown = ({ source }: { source: string }) => {
  const { resolvedTheme } = useTheme();
  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      className="no-copy"
    >
      <MDEditor.Markdown
        source={source}
        style={{ whiteSpace: "pre-wrap" }}
        className="m-0! space-y-0! bg-transparent! text-sm text-md-editor-text"
      />
    </div>
  );
};
