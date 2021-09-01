$(function () {
  var tickProcessIns = new TickProcess({
    el: '#axis',
    // loop: true,
    data: [
      '2020-09-02',
      '2020-05-02',
      '2020-05-03',
      '2020-05-04',
      '2020-05-05',
      '2020-05-06',
      '2020-05-02',
      '2020-05-03',
    ],
    onChange: function (v) {
      console.log(v)
    },
  })

  tickProcessIns.init()

  $('#play').on('click', function (e) {
    console.log(tickProcessIns.playing)
    if (tickProcessIns.playing) {

      tickProcessIns.pause()
      return
    }
    tickProcessIns.play()
  })
})
