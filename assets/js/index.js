var animationCollapsed = false;
var animationDone = true;

$(function () {
  // This adds the onclick event to the hide/expand results button
  document.getElementById("hide-results-button").onclick = function () { toggleResults(); }
  toggleResults();

  // This sets up the dialog box for the help window.
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
  // This is the set of animations that need to run when toggling the results.
  let $el = [
    $("#" + "current-markers"),
    $("#" + "help")
  ];

  // These are the keywords for the css classes that will be used to animate the elements.
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

// This is the function that is called when the user clicks the hide/expand results button.
window.toggleResults = function (forceExpand = false) {
  if (animationDone) {
    animationDone = false;
    toggleAnimations(forceExpand);
  }
}
