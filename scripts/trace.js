var tickProcessIns = new TickProcess({
  el: '#axis',
  // loop: true,
  onChange: function (v) {
    console.log(v)
  },
  onEnd: function () {
    $('#play').text('>')
  },
})
$(function () {
  var data = [
    '2020-09-02',
    '2020-05-02',
    '2020-05-03',
    '2020-05-04',
    '2020-05-05',
    '2020-05-06',
    '2020-05-02',
    '2020-05-03',
  ]

  tickProcessIns.init(data)
})
$(function () {
  $('#play').on('click', function (e) {
    console.log(tickProcessIns.playing)
    if (tickProcessIns.playing) {
      tickProcessIns.pause()
      $('#play').text('>')
      return
    }
    $('#play').text('||')
    tickProcessIns.play()
  })
})
