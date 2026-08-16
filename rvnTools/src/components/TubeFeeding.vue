<script setup lang="ts">
import { ref } from 'vue'

defineProps(['title'])

let volumes = ref({
    day: 0,
    flushVolume: 0,
    feedVolume: 0,
    totalVolume: 0,
    containersPerDay: 0
});
let calculating = ref(false);
let calculated = ref(false);
let calculatedVolumes = ref(new Map([]));
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
        // create volumes for today
        // calculate volumes
        calculatedVolumes.value.set(day, volumes.value);
    }

    calculating.value = false;
    calculated.value = true;
}

function reset() {
    calculated.value = false;
    // clear data object
    calculatedVolumes.value.clear();
}

function foodContainerText() {
    let text = '';
    
    if (volumes.value.containersPerDay > 1) {
        text = 'containers';
    }
    else if (volumes.value.containersPerDay === 1) {
        text = 'container';
    }
    else {
        text = 'of a container';
    }

    return text;
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