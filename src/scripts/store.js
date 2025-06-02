import { createStore } from 'vuex'

//Create a new store instance
const store = createStore({
    // state: 저장할 데이터
    state() {
        return {
            //memberId 저장
            account: {
                userId: ""
            }
        }
    },
    // mutations: 상태를 변경하는 유일한 방법 ( store.commit('setAccount')로 호출 )
    mutations: {
        setAccount(state, payload){
            state.account.userId = payload;
        }
    }
})

export default store;