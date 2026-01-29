function randomDelay(min, max) {
  const durasi = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((res) => setTimeout(res, durasi));
}

module.exports = { randomDelay };
