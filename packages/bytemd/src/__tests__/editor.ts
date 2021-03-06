import { Editor } from '../..';
import { render, fireEvent, act, RenderResult } from '@testing-library/svelte';

function sleep(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

function getCodeMirror($: RenderResult) {
  const dom = $.container.querySelector('.CodeMirror') as any;
  return dom.CodeMirror as CodeMirror.Editor;
}

const heading = '# title';
const headingHtml = '<h1>title</h1>';
const paragraph = 'abc';
const paragraphHtml = '<p>abc</p>';

test('value', async () => {
  const $ = render(Editor, { value: heading });
  const onChange = jest.fn();
  $.component.$on('change', onChange);
  await sleep();
  expect(getCodeMirror($).getValue()).toEqual(heading);

  // // change from UI
  // getCodeMirror($).setValue(paragraph);
  // await sleep();
  // expect(getCodeMirror($).getValue()).toEqual(paragraph);
  // expect(onChange).toBeCalled();
  // expect(onChange).toBeCalledTimes(1);
  // // expect(onChange).toBeCalledWith()

  // change from props
  $.component.$set({ value: heading });
  expect(getCodeMirror($).getValue()).toEqual(heading);
  expect(onChange).not.toBeCalled();
});

test('preview debounce', async () => {
  const $ = render(Editor, {});
  $.component.$set({ value: paragraph });
  expect($.container.querySelector('.markdown-body').innerHTML).toEqual('');
  await sleep(400);
  expect($.container.querySelector('.markdown-body').innerHTML).toEqual(
    paragraphHtml
  );
});

describe('mode', () => {
  test('split', async () => {
    const $ = render(Editor, { mode: 'split' });
    await act();
    expect($.container.querySelector('.bytemd-editor')).toBeVisible();
    expect($.container.querySelector('.bytemd-preview')).toBeVisible();
  });

  test('tab', async () => {
    const $ = render(Editor, { mode: 'tab' });
    const write = $.getByText('Write');
    const preview = $.getByText('Preview');

    expect($.container.querySelector('.bytemd-editor')).toBeVisible();
    expect(write).toHaveClass('bytemd-tab-active');
    expect($.container.querySelector('.bytemd-preview')).not.toBeVisible();
    expect(preview).not.toHaveClass('bytemd-tab-active');

    await fireEvent.click(preview);
    expect($.container.querySelector('.bytemd-editor')).not.toBeVisible();
    expect(write).not.toHaveClass('bytemd-tab-active');
    expect($.container.querySelector('.bytemd-preview')).toBeVisible();
    expect(preview).toHaveClass('bytemd-tab-active');
  });
});

describe('plugin', () => {
  test('editor effect', async () => {
    const $ = render(Editor, {});
    const editorOff = jest.fn();
    const editorEffect = jest.fn(() => editorOff);

    $.component.$set({ plugins: [{ editorEffect }] });
    await sleep();
    expect(editorEffect).toBeCalled();
    expect(editorEffect).toBeCalledTimes(1);
    expect(editorEffect).toBeCalledWith(
      expect.objectContaining({
        $el: $.container.querySelector('.bytemd'),
        editor: getCodeMirror($),
      })
    );

    $.component.$set({ plugins: [] });
    await sleep();
    expect(editorOff).toBeCalled();
    expect(editorOff).toBeCalledTimes(1);
  });
});
