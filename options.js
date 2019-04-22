// Saves options to chrome.storage
function save_options() {
  var outsourceMinAmount = document.getElementById('outsourceMinAmount').value;
  var outsourceMaxAmount = document.getElementById('outsourceMaxAmount').value;
  chrome.storage.sync.set({
    outsourceMinAmount: outsourceMinAmount,
    outsourceMaxAmount: outsourceMaxAmount
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = '保存しました';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    outsourceMinAmount: window.GithubTodoConstans.outsourceMinAmount,
    outsourceMaxAmount: window.GithubTodoConstans.outsourceMaxAmount
  }, function(items) {
    document.getElementById('outsourceMinAmount').value = items.outsourceMinAmount;
    document.getElementById('outsourceMaxAmount').value = items.outsourceMaxAmount;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
