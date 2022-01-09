var animationCollapsed = false;
var animationDone = true;

$(function () {
  document.getElementById("hide-results-button").onclick = function () { toggleResults(); }
  toggleResults();

  $("#dialog").dialog({
    closeText: "hide",
    closeOnEscape: true,
    autoOpen: false,
    draggable: false
  });
});

window.openDialogBox = function () {
  $("#dialog").dialog("close");
  $("#dialog").dialog("open");
};

window.toggleAnimations = function (forceExpand) {
  let $el = [
    $("#" + "current-markers"),
    $("#" + "help")
  ];

  let elName = [
    'results',
    'help'
  ]

  if (animationCollapsed || forceExpand) {
    for (let i = 0; i < $el.length; i++) {
      $el[i].removeClass(elName[i] + 'Collapsed');
      $el[i].addClass(elName[i] + 'Expand');
      animationCollapsed = false;
      window.setTimeout(() => {
        $el[i].addClass(elName[i] + 'Expanded');
        $el[i].removeClass(elName[i] + 'Expand');
        animationDone = true;
      }, 1010);
    }
  } else {
    for (let i = 0; i < $el.length; i++) {
      $el[i].removeClass(elName[i] + 'Expanded');
      $el[i].addClass(elName[i] + 'Collapse');
      animationCollapsed = true;
      window.setTimeout(() => {
        $el[i].addClass(elName[i] + 'Collapsed');
        $el[i].removeClass(elName[i] + 'Collapse');
        animationDone = true;
      }, 1010);
    }
  }
}

window.toggleResults = function (forceExpand = false) {
  if (animationDone) {
    animationDone = false;
    toggleAnimations(forceExpand);
  }
}
