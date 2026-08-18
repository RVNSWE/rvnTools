<script setup lang="ts">
import { ref } from 'vue'
import { useTubeFeedCalculator } from '../composables/useTubeFeedCalculator'

let calculating = ref(false)
let calculated = ref(false)
let calculatedVolumes = new Array()
const mealPlan = {
    days: ref(3),
    species: ref('cat'),
    bodyWeight: ref(5),
    dietName: ref('Convalescence'),
    kcalPerG: ref(1.128),
    dietNetWeight: ref(195),
    waterPercentage: ref(77),
    diluted: ref(false)
}

function processData() {
    calculating.value = true;

    for (let thisDay = 1; thisDay < mealPlan.days.value + 1; thisDay++) {
        const data = useTubeFeedCalculator()
        data.day.value = thisDay; // set the day for the current iteration
        data.days.value = mealPlan.days.value;
        data.species.value = mealPlan.species.value;
        data.bodyWeight.value = mealPlan.bodyWeight.value;
        data.dietName.value = mealPlan.dietName.value;
        data.kcalPerG.value = mealPlan.kcalPerG.value;
        data.dietNetWeight.value = mealPlan.dietNetWeight.value;
        data.waterPercentage.value = mealPlan.waterPercentage.value;
        data.diluted.value = mealPlan.diluted.value;

        if (data.bodyWeight.value < 1) {
            data.flushVol.value = 1.5;
        }
        else if (data.bodyWeight.value < 1.5) {
            data.flushVol.value = 2;
        }
        else if (data.bodyWeight.value < 2) {
            data.flushVol.value = 2.5;
        }
        else if (data.bodyWeight.value < 3) {
            data.flushVol.value = 3;
        }
        else if (data.bodyWeight.value < 5) {
            data.flushVol.value = 4;
        }
        else if (data.bodyWeight.value < 10) {
            data.flushVol.value = 5;
        }
        else {
            data.flushVol.value = 10;
        }

        data.calculate(); // perform the calculations for the current day
        calculatedVolumes.push(data); // store the calculated data for the current day in the array
    }

    calculating.value = false;
    calculated.value = true;
}

function reset() {
    mealPlan.days.value = 3;
    mealPlan. species.value = 'cat';
    mealPlan.bodyWeight.value = 5;
    mealPlan.dietName.value = 'Convalescence';
    mealPlan.kcalPerG.value = 1.128;
    mealPlan.dietNetWeight.value = 195;
    mealPlan.waterPercentage.value = 77;
    mealPlan.diluted.value = false;
    calculatedVolumes = [];
    calculated.value = false;
}

function foodContainerText(containersPerDay: number) {
    let text = '';
    
    if (containersPerDay > 1) {
        text = 'containers';
    }
    else if (containersPerDay === 1) {
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
        <select id="species" v-model="mealPlan.species.value">
            <option disabled value="">Please select one</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
        </select>

        <label for="bodyWeight">Enter body weight (kg):</label>
        <input type="number" id="bodyWeight" v-model="mealPlan.bodyWeight.value" />

        <h3>Diet Information</h3>

        <p>
            If using a liquid diet, enter the kcal/ml and the volume in ml per container instead.
        </p>

        <label for="dietName">Enter diet name:</label>
        <input type="text" id="dietName" v-model.trim="mealPlan.dietName.value" />

        <label for="kcalPerG">Enter kcal per gram:</label>
        <input type="number" id="kcalPerG" v-model="mealPlan.kcalPerG.value" />

        <label for="dietNetWeight">Enter diet net weight (g):</label>
        <input type="number" id="dietNetWeight" v-model="mealPlan.dietNetWeight.value" />

        <label for="waterPercentage">Enter diet water percentage:</label>
        <input type="number" id="waterPercentage" v-model="mealPlan.waterPercentage.value" />

        <h3>Feeding information</h3>

        <p>
            Choose "diluted" if you want to dilute the food with water before drawing it up, or "separate" if you want to
            administer food and water separately.
        </p>

        <label for="days">Number of days to re-feed over:</label>
        <input type="number" id="days" v-model="mealPlan.days.value" />

        <label for="diluted">Dilute food with water or administer separately?:</label>
        <select id="diluted" v-model="mealPlan.diluted.value">
            <option disabled value="">Please select one</option>
            <option value="false">Separate</option>
            <option value="true">Diluted</option>
        </select>

        <button @click="processData()">Calculate</button>
    </div>

    <div v-else>
        <h2>Patient and Diet Information</h2>

        <div>
            <p>
                Patient: <strong>{{ mealPlan.bodyWeight }} kg {{ mealPlan.species }}</strong>.
            </p>
            <p>
                Diet: <strong>{{ mealPlan.dietName }}, 
                    {{ mealPlan.kcalPerG }} kcal/g, 
                    {{ mealPlan.waterPercentage }} % moisture content, 
                    {{ mealPlan.dietNetWeight }} g per container</strong>.
            </p>
            <p v-if="mealPlan.days.value > 1">
                Increase from 1/{{ mealPlan.days }} to full RER over {{ mealPlan.days }} days.
            </p>
            <p v-else>
                Start at full RER.
            </p>
            <p v-if="mealPlan.diluted.value">
                Dilute the food with water at a rate of {{ calculatedVolumes[0].dilutionRate }} ml/g before drawing it up to administer.
            </p>
            <p v-else>
                Administer food and water separately.
            </p>
        </div>

        <button @click="reset()">Reset</button>
        
        <h2>Tube Feeding Plan</h2>

        <div>
                <ul v-for="meal in calculatedVolumes">
                    <li><strong><u>Day {{ meal.day }}:</u></strong></li>
                    <li>Flush Volume: {{ meal.flushVol }} ml</li>
                    <div v-if="meal.diluted.value">
                        <li>Volume per meal: {{ meal.foodVolPerMeal }} ml</li>
                        <li v-if="meal.dilutionRate.value > 0">Water: {{ meal.dilutionRate }} ml of water per gram of food</li>
                    </div>
                    <div v-else>
                        <li>Food per meal: {{ meal.foodVolPerMeal }} ml</li>
                        <li v-if="meal.waterVolPerMeal.value > 0">Water per meal: {{ meal.waterVolPerMeal }} ml</li>
                    </div>
                    <li>Meals per day: {{ meal.mealsPerDay }}</li>
                    <li>Estimated amount of food used per day: {{ meal.containersPerDay }} {{ foodContainerText(meal.containersPerDay.value) }}</li>
                    <li>Suggested feeding schedule || <span v-for="time in meal.formattedPlan.value">{{ time }} || </span></li>
                    <li>Containers per Day: {{ meal.containersPerDay }} {{ foodContainerText(meal.containersPerDay.value) }}</li>
                </ul>
        </div>
        <br />

            <p>
                <strong>It is vital you follow the above feeding plan in order to prevent refeeding syndrome.</strong> Refeeding
                syndrome is a life-threatening condition caused by reintroducing food too rapidly after prolonged
                periods of not eating, which is why it must be done gradually over the first three days.
            </p>
            <p>
                You are free to adjust the times at which you feed your pet to suit you, but please spread them out as
                much as possible and allow a minimum of one hour between feeds to avoid overloading the stomach and
                causing regurgitation.
            </p>
            <p>
                Unless advised otherwise by your clinic, fresh water should remain available at all times and you
                should leave the calculated volume of food in your pet's normal bowl between feeds to allow the
                opportunity to eat unassisted. If it has all been eaten by the time of their next scheduled feed, offer
                a fresh bowl of food instead of tube feeding.
            </p>
            <br />

            <h4>Preparing the food</h4>
            <p>
                Prepare two syringes of tap water to flush the tube with before and after feeding. If your pet has been
                offered food and eaten some but not all of it, draw the rest of it up into a syringe (or around the same volume
                of fresh food if it's looking dry or stale). This is all the food you will need to administer for this meal.
                If your pet has not eaten on their own, prepare the volume listed above.
            </p>
            <p v-if="mealPlan.diluted.value">
                If a dilution rate is provided in the instructions above, prepare a portion of food mixed with water at the
                dilution rate specified. From this, draw up the volume to be administered into a separate syringe.
            </p>
            <p v-else>
                If the instructions above specify a volume of water to administer in addition to food, either draw this up
                in its own syringe to administer separately or add it to one of the syringes of water to be used for flush.
                Draw up the specified volume of food into a syringe on its own.
            </p>
            <p>
                Place the filled syringes into a jug of <strong>warm</strong> (not hot!) water until they reach body temperature.
                <strong>DO NOT MICROWAVE</strong>, as this can create pockets of hot liquid that may scald your pet.
            </p>
            <br />

            <h4>Administering the food</h4>
                <ol>
                    <li>
                        <p>Pinch the feeding tube to prevent food from leaking out or air from being sucked in when you remove
                        the cap. Attach an empty syringe to the feeding tube port, stop pinching, and gently draw back on
                        the plunger. You should feel some resistance, and the plunger should return to its starting
                        position when you let go of it. <strong>If this does not happen, it may mean the tube has become
                        displaced. STOP immediately, and contact the clinic for advice.</strong></p>
                    </li>
                    <li>
                        <p><strong>Slowly</strong> flush the feeding tube with water before administering any food.
                        <strong>If your pet starts coughing, gagging, retching, or appearing uncomfortable while flushing, STOP
                        immediately and contact the clinic for advice.</strong></p>
                    </li>
                    <li>
                        <p>Slowly administer the prepared volume of food through the tube. You may notice your pet
                        swallowing as you do this. This is normal, as the food is being administered into the oesophagus
                        rather than directly into the stomach. If they regurgitate, slow down even more.
                        <strong>If regurgitation continues, stop feeding and contact the clinic for advice.</strong></p>
                    </li>
                    <li>
                        <p>Slowly flush the tube with water again to clear any residual food.</p>
                    </li>
                    <li>
                        <p>Place the cap back on the feeding tube and wipe away any food from the outside of the tube
                        with a clean cloth. Ensure the outside of the tube is dry before tucking it away again. Rinse
                        the used syringes with water to clean them ready for the next feed.</p>
                    </li>
                </ol>
    </div>
    
</template>