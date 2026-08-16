<script setup lang="ts">
import { ref } from 'vue'

defineProps(['title'])

let data = ref({
    bodyWeight: 0,
    dietName: '',
    kcalPerGram: 0,
    dietNetWeight: 0,
    dietWaterPercentage: 0,
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
    
    // create data object here?

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
        calculatedVolumes.value.set(day, data.value);
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
    
    if (data.value.containersPerDay > 1) {
        text = 'containers';
    }
    else if (data.value.containersPerDay === 1) {
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

        <h3>Patient Information</h3>

        <label for="species">Select species:</label>
        <select id="species" v-model="speciesSelection">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
        </select>

        <label for="bodyWeight">Enter body weight (kg):</label>
        <input type="number" id="bodyWeight" v-model="data.bodyWeight" />

        <h3>Diet Information</h3>

        <p>
            If using a liquid diet, enter the kcal/ml and the volume in ml per container instead.
        </p>

        <label for="dietName">Enter diet name:</label>
        <input type="text" id="dietName" v-model="data.dietName" />

        <label for="kcalPerGram">Enter kcal per gram:</label>
        <input type="number" id="kcalPerGram" v-model="data.kcalPerGram" />

        <label for="dietNetWeight">Enter diet net weight (g):</label>
        <input type="number" id="dietNetWeight" v-model="data.dietNetWeight" />

        <label for="dietWaterPercentage">Enter diet water percentage:</label>
        <input type="number" id="dietWaterPercentage" v-model="data.dietWaterPercentage" />

        <h3>Feeding information</h3>

        <p>
            Choose "diluted" if you want to dilute the food with water before drawing it up, or "separate" if you want to
            administer food and water separately.
        </p>

        <label for="days">Number of days to re-feed over:</label>
        <input type="number" id="days" v-model="data.day" />

        <label for="diluted">Dilute food with water or administer separately?:</label>
        <select id="diluted" v-model="diluted">
            <option value="diluted">Diluted</option>
            <option value="separate">Separate</option>
        </select>
    </div>

    <div v-else>
        <h2>Tube Feeding Plan</h2>

        <p>Your tube feeding plan has been calculated.</p>
    </div>
</template>