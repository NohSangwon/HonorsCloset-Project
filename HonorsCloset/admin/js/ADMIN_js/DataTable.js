// DataTable tr 클릭시 CheckBox=true Event -- 동적으로 tr에 넣기
$(document).on('click', '#DataTable', function (event) {
  var targetTR = event.target.parentElement.closest('tr').rowIndex;
  var checkbox = document.getElementsByName('name');

  if (targetTR == 0) {
    var check_all = document.getElementById('check_all');
    var DataTable = document.getElementById('DataTable');
    if (check_all.checked == true) {
      check_all.checked = false;
      for (var i = 0; i < DataTable.rows.length - 1; i++) {
        checkbox[i].checked = false;
      }
    }
    else {
      check_all.checked = true;
      for (var i = 0; i < DataTable.rows.length - 1; i++) {
        checkbox[i].checked = true;
      }
    }
  }
  else {
    if (checkbox[targetTR - 1].checked == true) {
      checkbox[targetTR - 1].checked = false;
    }
    else {
      checkbox[targetTR - 1].checked = true;
    }
  }
})