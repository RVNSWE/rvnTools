<script setup lang="ts">
import { ref } from 'vue'

defineProps(['title'])

let calculating = ref(false);
let calculated = ref(false);
let calculatedVolumes = ref([]);
let speciesSelection = ref([]);
let diluted = ref(false);

function processData() {
    calculating.value = true;
    
    // create data object here

        //data.FlushVolume = data.BodyWeight switch
        //{
        //    < 1 => 1.5,
        //    < 1.5 => 2.5,
        //    < 2 => 2.5,
        //    < 3 => 3,
        //    < 5 => 4,
        //    < 10 => 5,
        //    _ => 10,
        //};

        // temporary hardcoded value for days, will be replaced with user input
        let days = ref(3);

    for (let day = 1; day < days.value; day++) {
        let volumes = ref({
            day: day,
            flushVolume: 0,
            feedVolume: 0,
            totalVolume: 0
        });

        // calculate volumes
        // add volumes to calculatedVolumes array
    }

    calculating.value = false;
    calculated.value = true;
}
</script>

<template>
    <title>Tube Feeding Calculator</title>
  
    <div v-if="!calculated">
        <h2>Generate Tube Feeding Plan</h2>

        <p>This is the Tube Feeding component.</p>
    </div>

    <div v-else>
        <h2>Tube Feeding Plan</h2>

        <p>Your tube feeding plan has been calculated.</p>
    </div>
</template>