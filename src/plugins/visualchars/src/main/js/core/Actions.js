/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Events from '../api/Events';
import VisualChars from './VisualChars';

var toggleVisualChars = function (editor, toggleState) {
  var body = editor.getBody(), selection = editor.selection, bookmark;

  toggleState.set(!toggleState.get());
  Events.fireVisualChars(editor, toggleState.get());

  bookmark = selection.getBookmark();

  if (toggleState.get() === true) {
    VisualChars.show(editor, body);
  } else {
    VisualChars.hide(editor, body);
  }

  selection.moveToBookmark(bookmark);
};

export default <any> {
  toggleVisualChars: toggleVisualChars
};