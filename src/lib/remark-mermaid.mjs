/**
 * Turn fenced ```mermaid code blocks into the site's diagram markup
 * (`<div class="diagram"><pre class="mermaid">…</pre></div>`) before Shiki
 * highlights them, so the client-side Mermaid renderer + diagram-zoom in
 * GuideLayout pick them up. Source stays as portable fenced blocks that also
 * render natively on GitHub.
 */
export function remarkMermaid() {
  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const walk = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'code' && child.lang === 'mermaid') {
        node.children[i] = {
          type: 'html',
          value: `<div class="diagram"><pre class="mermaid">\n${escape(child.value)}\n</pre></div>`,
        };
      } else {
        walk(child);
      }
    }
  };

  return (tree) => walk(tree);
}
