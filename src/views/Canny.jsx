import React, { useEffect } from 'react';

const BoardToken = process.env.REACT_APP_CANNY_BOARD_TOKEN;

const Feedback = () => {
  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          // eslint-disable-next-line no-unused-expressions
          (e.type = 'text/javascript'),
            (e.async = !0),
            (e.src = 'https://canny.io/sdk.js'),
            f.parentNode.insertBefore(e, f);
        }
      }
      if ('function' != typeof w.Canny) {
        var c = function () {
          c.q.push(arguments);
        };
        // eslint-disable-next-line no-unused-expressions
        (c.q = []),
          (w.Canny = c),
          'complete' === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent('onload', l)
            : w.addEventListener('load', l, !1);
      }
    })(window, document, 'canny-jssdk', 'script');

    // eslint-disable-next-line no-undef
    Canny('render', {
      boardToken: BoardToken,
      basePath: '/feedback', // See step 2
      ssoToken: null, // See step 3,
      theme: 'auto' // options: light [default], dark, auto
    });
  }, []);

  return <div data-canny />;
};

export default Feedback;
