exports.task = {
  build: {
    options: {
      banner: '<%= banner.exapanded %>'
    },
    files: {
      '<%= path.build %>/<%= path.styles %>/app.css':'<%= path.source %>/<%= path.styles %>/app.less'
    }
  }
};