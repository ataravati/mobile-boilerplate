let _filename = null;
let _basePath = null;
let _loaded = false;
let _duration = -1;
let _volume = 1;
let _playing = false;
let _currentTime = 0;

const Sound = (filename, basePath, callback) => {
  _filename = filename;
  _basePath = basePath;

  setTimeout(() => {
    _loaded = true;
    _duration = 10;

    callback();
  }, 2000);
};

Sound.prototype.filename = () => _filename;
Sound.prototype.basePath = () => _basePath;
Sound.prototype.isLoaded = () => _loaded;
Sound.prototype.play = onEnd => {
  _playing = true;
  setTimeout(() => {
    onEnd(true);
  }, _duration * 1000);
};
Sound.prototype.pause = callback => {
  _playing = false;
  callback();
};
Sound.prototype.stop = callback => {
  _playing = false;
  _currentTime = 0;
  callback();
};
Sound.prototype.reset = () => {};
Sound.prototype.release = () => {};
Sound.prototype.getDuration = () => _duration;
Sound.prototype.getVolume = () => _volume;
Sound.prototype.setVolume = value => {
  _volume = value;
};
Sound.prototype.getCurrentTime = callback => {
  callback(_currentTime, _playing);
};
Sound.prototype.setCurrentTime = value => {
  _currentTime = value;
};

Sound.setCategory = jest.fn((value, mixWithOthers) => {});
Sound.setMode = jest.fn(value => {});
Sound.setActive = jest.fn(value => {});

export default Sound;
