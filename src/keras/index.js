import KerasJS from 'keras-js';

const filepath = window.location.origin;

const model = new KerasJS.Model({
  filepath: `${filepath}/seiza_model.bin`,
  filesystem: true,
});

export default model;
