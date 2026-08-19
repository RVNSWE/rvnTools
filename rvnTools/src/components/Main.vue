<script setup lang="ts">
import { ref } from 'vue'
import TubeFeeding from './TubeFeeding.vue';

const page = ref('main')
</script>

<template>
    <hgroup>
        <h1>Veterinary Patient Care Tools</h1>
        <h2 id="tools-subheading">A digital toolkit for RVNs</h2>
    </hgroup>

    <div class="centred-container">
            <section>
            <p id="tools-subheading">Tube Feeding</p>
            <p>Generates a nutrition and fluid plan, complete with feeding schedule and basic information handout.</p>
            </section>
            <section>
                <p id="tools-subheading">Weight Clinics</p>
                <p>Estimates the ideal body weight, the next target weight, and % weight loss per week since the last appointment.</p>
            </section>
            <section>
                <p id="tools-subheading">Fluid Ins and Outs</p>
                <p>Gives an overview of fluid intake vs output, taking into account metabolic needs and hydration status.</p>
            </section>
    </div>
</template>