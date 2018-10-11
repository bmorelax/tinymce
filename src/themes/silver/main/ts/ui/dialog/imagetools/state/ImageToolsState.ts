import { Cell, Option } from '@ephox/katamari';
import { URL } from '@ephox/sand';
import Tools from 'tinymce/core/api/util/Tools';
import UndoStack from '../UndoStack';
import { Blob } from '@ephox/dom-globals';

interface BlobState {
  blob: Blob;
  url: string;
}

interface UndoRedoState {
  undoEnabled: boolean;
  redoEnabled: boolean;
}

const makeState = (initialState: BlobState) => {
  const blobState = Cell(initialState);
  const tempState = Cell(Option.none());
  const undoStack = UndoStack();
  undoStack.add(initialState);

  const getBlobState = (): BlobState => {
    return blobState.get();
  };

  const setBlobState = (state: BlobState): void => {
    blobState.set(state);
  };

  const getTempState = (): BlobState => {
    return tempState.get().fold(() => {
      return blobState.get();
    }, (temp) => {
      return temp;
    });
  };

  const updateTempState = (blob: Blob): string => {
    const newTempState = createState(blob);

    destroyTempState();
    tempState.set(Option.some(newTempState));
    return newTempState.url;
  };

  const createState = (blob: Blob): BlobState => {
    return {
      blob,
      url: URL.createObjectURL(blob)
    };
  };

  const destroyState = (state: BlobState): void => {
    URL.revokeObjectURL(state.url);
  };

  const destroyStates = (states: BlobState[]): void => {
    Tools.each(states, destroyState);
  };

  const destroyTempState = (): void => {
    tempState.get().each(destroyState);
    tempState.set(Option.none());
  };

  const addBlobState = (blob: Blob): string => {
    const newState = createState(blob);
    setBlobState(newState);
    const removed = undoStack.add(newState).removed;
    destroyStates(removed);
    return newState.url;
  };

  const addTempState = (blob: Blob): string => {
    const newState = createState(blob);
    tempState.set(Option.some(newState));
    return newState.url;
  };

  const applyTempState = (postApply: () => void): void => {
    return tempState.get().fold(() => {
      // TODO: Inform the user of failures somehow
    }, (temp) => {
      addBlobState(temp.blob);
      postApply();
    });
  };

  const undo = (): string => {
    const currentState = undoStack.undo();
    setBlobState(currentState);
    return currentState.url;
  };

  const redo = (): string => {
    const currentState = undoStack.redo();
    setBlobState(currentState);
    return currentState.url;
  };

  const getHistoryStates = (): UndoRedoState => {
    const undoEnabled = undoStack.canUndo();
    const redoEnabled = undoStack.canRedo();
    return {
      undoEnabled,
      redoEnabled
    };
  };

  return {
    getBlobState,
    setBlobState,
    addBlobState,
    getTempState,
    updateTempState,
    addTempState,
    applyTempState,
    destroyTempState,
    undo,
    redo,
    getHistoryStates
  };
};

export {
  makeState
};