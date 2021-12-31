var resultsCollapsed = false;

$(function () {
  document.getElementById("current-markers").onclick = function () { toggleResults(); }
});

function toggleResults() {
  var $el = $("#" + "current-markers");
  if (resultsCollapsed) {
    $el.removeClass('resultsCollapsed');
    $el.addClass('resultsExpand');
    resultsCollapsed = false;
    window.setTimeout(() => { 
      $el.addClass('resultsExpanded'); 
      $el.removeClass('resultsExpand');
    }, 1010);
  } else {
    $el.removeClass('resultsExpanded'); 
    $el.addClass('resultsCollapse');
    resultsCollapsed = true;
    window.setTimeout(() => {
      $el.addClass('resultsCollapsed');
      $el.removeClass('resultsCollapse');
    }, 1010);
  }
}
