import { ref } from 'vue'

export function useTubeFeedCalculator() {
    const maxMlPerKg = 10
    const maxVolPerMeal = ref(0)
    const rer = ref(0)
    const containersPerDay = ref(0)
    const dietWaterVol = ref(0)
    const additionalWaterVol = ref(0)
    const foodVolPerDay = ref(0)
    const waterVolPerDay = ref(0)
    const totalVolPerDay = ref(0)
    const mealsPerDay = ref(0)
    const totalVolPerMeal = ref(0)
    const foodVolPerMeal = ref(0)
    const waterVolPerMeal = ref(0)
    const dilutionRate = ref(0)
    const formattedPlan = ref([])
    const interval = ref(0)
    const mealHalfTime = ref(0)
    const midPoint = ref(0)
    const startTime = ref(0)
    const day = ref(0)
    const species = ref('')
    const bodyWeight = ref(0)
    const days = ref(0)
    const dietName = ref('')
    const kcalPerG = ref(0)
    const dietNetWeight = ref(0)
    const waterPercentage = ref(0)
    const flushVol = ref(0)
    const diluted = ref(false)

    function calculateFeedingPlan() {
        maxVolPerMeal.value = bodyWeight.value * maxMlPerKg; // maximum volume per meal based on body weight
        rer.value = (70 * Math.pow(bodyWeight.value, 0.75)) / days.value * day.value; // RER calculation
        foodVolPerDay.value = rer.value / kcalPerG.value; // food volume per day based on RER and kcal per gram
        containersPerDay.value = Math.ceil(foodVolPerDay.value / dietNetWeight.value); // number of containers per day
        dietWaterVol.value = foodVolPerDay.value * (waterPercentage.value / 100); // water volume from diet
        additionalWaterVol.value = calculateBasicFluidRequirement() - dietWaterVol.value; // additional water volume needed
        totalVolPerDay.value = foodVolPerDay.value + additionalWaterVol.value; // total volume per day

    }

    function calculateBasicFluidRequirement() {
        let requirement = 0;

        if (species.value = 'cat')
        {
            requirement = 80 * Math.pow(bodyWeight.value, 0.75);
        }
        else
        {
            requirement = 132 * Math.pow(bodyWeight.value, 0.75);
        }

        return requirement;
    }

    function calculateMealsPerDay() {
        mealsPerDay.value = Math.ceil(totalVolPerDay.value / maxVolPerMeal.value); // number of meals per day based on total volume and max volume per meal

    }

    function adjustMealVolumes() {
        let totalFlushPerDay = 2 * flushVol.value * mealsPerDay.value; // total flush volume per day

        if (totalFlushPerDay > additionalWaterVol.value)
        {
            waterVolPerDay.value = 0; // don't add any more water if flush already exceeds requirement (constraint: water per day can never be less than 0)
            totalVolPerDay.value = foodVolPerDay.value + totalFlushPerDay; // (ml) food and flush are all that will be administered
        }

        // TO DO: continue from HERE.
    }

    return {
        containersPerDay,
        mealsPerDay,
        foodVolPerMeal,
        waterVolPerMeal,
        dilutionRate,
        formattedPlan,
        day,
        species,
        bodyWeight,
        days,
        dietName,
        kcalPerG,
        dietNetWeight,
        waterPercentage,
        flushVol,
        diluted
    }
}