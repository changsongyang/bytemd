import type { Processor } from 'unified';
import type { Schema } from 'hast-util-sanitize';
import type { VFile } from 'vfile';

export interface EditorContext {
  /**
   * CodeMirror editor instance
   */
  editor: CodeMirror.Editor;
  /**
   * Root element, `$('.bytemd')`
   */
  $el: HTMLElement;
}

export interface BytemdToolbarItem {
  /**
   * Tooltip of toolbar item
   */
  tooltip?: string;
  /**
   * Toolbar Icon (16x16), could be <img> or inline svg
   */
  icon: string;
  /**
   * Toolbar icon click handler
   */
  onClick(context: EditorContext): void;
}

export interface BytemdPlugin {
  /**
   * Customize Markdown parse by remark plugins:
   *
   * https://github.com/remarkjs/remark/blob/main/doc/plugins.md
   */
  remark?: (p: Processor) => Processor;
  /**
   * Customize HTML parse by rehype plugins:
   *
   * https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
   */
  rehype?: (p: Processor) => Processor;
  /**
   * Register toolbar items
   */
  toolbar?: Record<string, BytemdToolbarItem>;
  /**
   * Side effect for editor, triggers when plugin list changes
   */
  editorEffect?(context: EditorContext): void | (() => void);
  /**
   * Side effect for viewer, triggers when HTML or plugin list changes
   */
  viewerEffect?(context: {
    /**
     * Root element of the Viewer, `$('.markdown-body')`
     */
    $el: HTMLElement;
    /**
     * Markdown process result
     */
    result: VFile;
  }): void | (() => void);
}

export interface EditorProps extends ViewerProps {
  /**
   * Editor display mode
   *
   * - split: edit on the left and preview on the right
   * - tab: click tabs to switch between edit and preview
   */
  mode?: 'split' | 'tab';
  /**
   * Debounce time (ms) for preview
   */
  previewDebounce?: number;
  /**
   * Inline style of the container, `$('.bytemd')`
   */
  containerStyle?: string;
  /**
   * Specify visible toolbar items and their orders
   *
   * Default: Show all available items, order: built-in -> plugin by apply order
   */
  toolbar?:
    | string[]
    | ((itemMap: Record<string, BytemdToolbarItem>) => string[]);
}

export interface ViewerProps {
  /**
   * Markdown text
   */
  value: string;
  /**
   * ByteMD plugin list
   */
  plugins?: BytemdPlugin[];
  /**
   * Customize the default sanitize schema
   *
   * Defaults to GitHub style sanitation except the `className` property is allowed
   *
   * https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/github.json
   */
  sanitize?: (schema: Schema) => Schema;
}
