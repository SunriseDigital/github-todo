// Saves options to chrome.storage
function save_options() {
  const props = {}
  Object.keys(window.GithubTodoConstans).forEach(key => props[key] = document.getElementById(key).value)
  chrome.storage.sync.set(props, function() {
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
  chrome.storage.sync.get(window.GithubTodoConstans, function(items) {
    Object.keys(window.GithubTodoConstans).forEach(key => document.getElementById(key).value = items[key])
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
