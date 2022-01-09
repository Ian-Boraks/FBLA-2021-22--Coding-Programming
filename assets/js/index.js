var resultsCollapsed = false;
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

window.toggleResults = function (forceExpand = false) {
  if (animationDone) {
    animationDone = false;
    var $el = $("#" + "current-markers");
    if (resultsCollapsed || forceExpand) {
      $el.removeClass('resultsCollapsed');
      $el.addClass('resultsExpand');
      resultsCollapsed = false;
      window.setTimeout(() => {
        $el.addClass('resultsExpanded');
        $el.removeClass('resultsExpand');
        animationDone = true;
      }, 1010);
    } else {
      $el.removeClass('resultsExpanded');
      $el.addClass('resultsCollapse');
      resultsCollapsed = true;
      window.setTimeout(() => {
        $el.addClass('resultsCollapsed');
        $el.removeClass('resultsCollapse');
        animationDone = true;
      }, 1010);
    }
  }
}
