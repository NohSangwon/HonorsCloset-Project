function checkADMIN(){
  if(
    req.session.user != undefined || req.session.user != null){
    res.send('권한이 없습니다.');
    return '-9999';
  }
  if(req.session.user.Spec != "0"){
    console.log('관리자가 아닙니다.')
    res.send('권한이 없습니다.');
    return '-9999';
  }
}

module.exports = checkADMIN();
