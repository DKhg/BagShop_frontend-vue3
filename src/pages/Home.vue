<template>
    <Header />
        <main>
          <div class="album py-5 bg-body-tertiary">
            <div class="container">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <div class="col" v-for="(item, idx) in state.items" :key="idx">
                    <Card :item="item"/>
                </div>
              </div>
            </div>
          </div>
        </main>
    <Footer />
</template>

<script>
import Card from "@/components/Card";
import axios from "axios";
import {reactive} from "vue";

export default {
    name: "Home",
    components: { Card },
    setup(){
        const state = reactive({
            items:[]
        })

        axios.get('/api/items').then((res) => {
            state.items = res.data;
        })

        return {state};
    }
}
</script>

<style scoped>
</style>