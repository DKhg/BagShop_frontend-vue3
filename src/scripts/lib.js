export default {
    //숫자 단위처리
    getNumberFormatted(val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    //이메일 형식 체크
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    //날짜 형식 설정
    getDateFormatted(date) {
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}-${mm}-${dd}`;
    },
    //전화번호 형식 체크
    isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
        return phoneRegex.test(phoneNumber);
    }

}