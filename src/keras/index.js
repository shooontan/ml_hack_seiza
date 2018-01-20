import KerasJS from 'keras-js';

const model = new KerasJS.Model({
  filepath: './seiza_model.hdf5',
  gpu: true,
});
