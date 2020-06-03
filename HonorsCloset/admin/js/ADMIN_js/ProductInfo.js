// DB 'Product' Load
var LoadProduct = function (data) {
  var Specification_Radio = document.getElementsByName('Specification');
  var Status_Radio = document.getElementsByName('Status');
  var Sex_Radio = document.getElementsByName('Sex');
  var FirstPrice_input = document.getElementById('FirstPrice');
  var RegistDate_input = document.getElementById('RegistDate');
  var Thumbnail_FileName = document.getElementById('Thumbnail_FileName');
  var Image1_FileName = document.getElementById('Image1_FileName');
  var Image2_FileName = document.getElementById('Image2_FileName');
  var Image3_FileName = document.getElementById('Image3_FileName');
  var Image4_FileName = document.getElementById('Image4_FileName');
  var Image = document.getElementById('CurrentImage');

  var Code = data.Code;
  var CodeSplited = Code.split('');

  // Add Code
  if (CodeSplited[0] == "T") {
    Specification_Radio[0].checked = true;
  }
  else if (CodeSplited[0] == "B") {
    Specification_Radio[1].checked = true;
  }
  else if (CodeSplited[0] == "O") {
    Specification_Radio[2].checked = true;
  }
  else if (CodeSplited[0] == "G") {
    Specification_Radio[3].checked = true;
  }
  else if (CodeSplited[0] == "S") {
    Specification_Radio[4].checked = true;
  }
  else { // E
    Specification_Radio[5].checked = true;
  }

  if (CodeSplited[1] == "M") {
    Sex_Radio[0].checked = true;
  }
  else if (CodeSplited[1] == "F") {
    Sex_Radio[1].checked = true;
  }
  else { // U
    Sex_Radio[2].checked = true;
  }

  if (CodeSplited[2] == "S") {
    Status_Radio[0].checked = true;
  }
  else if (CodeSplited[2] == "A") {
    Status_Radio[1].checked = true;
  }
  else { // B
    Status_Radio[2].checked = true;
  }

  // RadioButton Disable 작업
  for (var i = 0; i < Specification_Radio.length; i++) {
    Specification_Radio[i].disabled = true;
  }
  for (var i = 0; i < Status_Radio.length; i++) {
    Status_Radio[i].disabled = true;
  }
  for (var i = 0; i < Sex_Radio.length; i++) {
    Sex_Radio[i].disabled = true;
  }

  FirstPrice_input.value = data.FirstPrice;

  // 입고일 출력
  // RegistDate_input.valueAsDate = new Date(DateParse(data.RegistDate));
  RegistDate_input.value = data.RegistDate.substring(0, 4) + '-' + data.RegistDate.substring(4, 6) + '-' + data.RegistDate.substring(6, 8);

  // Image이름 작업
  var FileNames = ['파일 없음', '파일 없음', '파일 없음', '파일 없음', '파일 없음'];
  if (data.Thumbnail != undefined || data.Thumbnail != '') {
    FileNames[0] = data.Thumbnail.split('/')[4];
  }
  if (data.Image1 != undefined || data.Image1 != '') {
    FileNames[1] = data.Image1.split('/')[4]
  }
  if (data.Image2 != undefined || data.Image2 != '') {
    FileNames[2] = data.Image2.split('/')[4];
  }
  if (data.Image3 != undefined || data.Image3 != '') {
    FileNames[3] = data.Image3.split('/')[4];
  }
  if (data.Image4 != undefined || data.Image4 != '') {
    FileNames[4] = data.Image4.split('/')[4];
  }

  // Image 이름 및 hover시 이미지 출력
  Thumbnail_FileName.innerHTML = FileNames[0];
  Thumbnail_FileName.addEventListener('click', function () {
    Image.src = data.Thumbnail;
  })

  Image1_FileName.innerHTML = FileNames[1];
  Image1_FileName.addEventListener('click', function () {
    Image.src = data.Image1;
  })

  Image2_FileName.innerHTML = FileNames[2];
  Image2_FileName.addEventListener('click', function () {
    Image.src = data.Image2;
  })

  Image3_FileName.innerHTML = FileNames[3];
  Image3_FileName.addEventListener('click', function () {
    Image.src = data.Image3;
  })

  Image4_FileName.innerHTML = FileNames[4];
  Image4_FileName.addEventListener('click', function () {
    Image.src = data.Image4;
  })

  Thumbnail_FileName.style.cursor = 'pointer';
  Image1_FileName.style.cursor = 'pointer';
  Image2_FileName.style.cursor = 'pointer';
  Image3_FileName.style.cursor = 'pointer';
  Image4_FileName.style.cursor = 'pointer';
}

var URL_Code = window.location.href.split('?');
var Code = URL_Code[1].split('=')[1];
var DATA = {
  "Code": Code
}

// DataTable 'Product' Load Event
$.ajax({
  type: "POST",
  url: '/getProducts/ByCode',
  data: DATA,
  success: function (data) {
    LoadProduct(data[0]);
  },
  error: function (e) {
    alert(e.responseText);
  }
});

var Update_Button = document.getElementById('Update_Button');
Update_Button.addEventListener('click', function () {
  var Code = window.location.href.split('=')[1];
  var DATA = {
    "Code": Code
  }
  $.ajax({
    type: "POST",
    url: '/getProducts/isSelled',
    data: DATA,
    success: function (data) {
      if (data == 'err') {
        alert("판매 완료된 재고는 수정할 수 없습니다.");
        location.reload();
      }
      else {
        var RegistDate = DateToString(document.getElementById('RegistDate').value);
        var FirstPrice = document.getElementById('FirstPrice').value;
        var LastPrice = document.getElementById('FirstPrice').value;
        var Thumbnail = document.getElementById('Thumbnail_FileName').innerHTML;
        var Image1 = document.getElementById('Image1_FileName').innerHTML;
        var Image2 = document.getElementById('Image2_FileName').innerHTML;
        var Image3 = document.getElementById('Image3_FileName').innerHTML;
        var Image4 = document.getElementById('Image4_FileName').innerHTML;

        var URL = "/updateProducts/Update/" + Code + "/" + RegistDate + "/" + FirstPrice + "/" + LastPrice + "/" + Thumbnail
          + "/" + Image1 + "/" + Image2 + "/" + Image3 + "/" + Image4;

        $('#Insert_form').ajaxForm({
          url: URL,
          enctype: "multipart/form-data",
          beforeSubmit: function (data, form, option) {
            //validation체크 
            //막기위해서는 return false를 잡아주면됨
            return true;
          },
          success: function (response, status) {
            alert("수정이 완료되었습니다.");
            history.back();
          },
          error: function () {
            //에러발생을 위한 code페이지
          }
        });
        $("#Insert_form").submit();

      }
    },
    error: function (e) {
      alert(e.responseText);
    }
  });
})

var Cancel_Button = document.getElementById('Cancel_Button');
Cancel_Button.addEventListener('click', function () {
  history.back();
})

//Interface
function DateParse(str) {
  var y = str.substr(0, 4);
  var m = str.substr(4, 2);
  var d = str.substr(6, 2);

  return (y + '-' + m + '-' + d);
}

function DateToString(str) {
  var y = str.substr(0, 4);
  var m = str.substr(5, 2);
  var d = str.substr(8, 2);

  return (y + m + d);
}