import { useTheme } from "next-themes";
import MDEditor from "@uiw/react-md-editor";


export const MDMarkdown = ({ source }: { source: string }) => {
  const { resolvedTheme } = useTheme();


  const isDark = resolvedTheme === "dark";

  return (
    <div data-color-mode={isDark ? "dark" : "light"} className="no-copy">
      <MDEditor.Markdown
        source={source}

        style={{
          "--color-canvas-subtle": isDark ? "#232629" : undefined
        } as React.CSSProperties}
        className="m-0! p-0! min-h-0! bg-transparent!  text-sm text-md-editor-text
          [&_ol]:list-decimal [&_ol]:pl-0! [&_ol]:ml-4! [&_ol]:my-2
          [&_ul]:list-disc [&_ul]:pl-0! [&_ul]:ml-4! [&_ul]:my-2
          [&_li]:my-0.5 [&_li]:pl-1
          [&_p]:mb-2 [&_p]:last:mb-0 [&_p]:leading-relaxed
          [&_pre]:my-2 [&_pre]:p-3! [&_pre]:rounded-md [&_pre]:bg-muted/30
          [&_pre_code]:p-0! [&_pre_code]:bg-transparent!
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-muted/50
          [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold
          [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold
          [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:font-bold"
      />
    </div>
  );
};






