$(document).ready(function () {

})

function check() {
    var email = signupform.email.value;
    var pass = signupform.password.value;
    var pass2 = signupform.password2.value;
    var sid = signupform.sid.value;
    var name = signupform.name.value;
    var tsid = '2015136140';

    if (!pass) {
         
        Swal.fire(
            'Warning',
            '비밀번호를 입력해주세요',
            'warning'
        )
        return false;
    }
    if (!pass2) {
        Swal.fire(
            'Warning',
            '비밀번호 확인을 입력해주세요',
            'warning'
        )
        return false;
    }

    if (!sid) {
        Swal.fire(
            'Warning',
            '학번을 입력해주세요',
            'warning'
        )
        return false;
    }
    if (!email) {
        Swal.fire(
            'Warning',
            'E-mail을 입력해주세요',
            'warning'
        )
        return false;
    }

    if (!name){
        Swal.fire(
            'Warning',
            '이름을 입력해주세요',
            'warning'
        )
        return false;
    }


    if (pass != pass2) {
        Swal.fire(
            'Warning',
            '비밀번호가 일치하지 않습니다.',
            'warning'
        )
        return false;
    }
    if (sid.length != tsid.length) {
        Swal.fire(
            'Warning',
            '학번을 올바르게 입력해주세요',
            'warning'
        )
        return false;
    }

    var emailSplit = email.split('@');

    if (emailSplit[1] != 'koreatech.ac.kr') {
        Swal.fire(
            'Warning',
            '학교 E-mail을 입력해주세요',
            'warning'
        )
        return false;
    }
    
    signupform.method = "post";
    signupform.action = "accountSave";
    signupform.submit();
    

}