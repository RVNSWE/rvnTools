import { ref } from 'vue'

export function useTubeFeedCalculator() {
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

    return {
        maxVolPerMeal,
        rer,
        containersPerDay,
        dietWaterVol,
        additionalWaterVol,
        foodVolPerDay,
        waterVolPerDay,
        totalVolPerDay,
        mealsPerDay,
        totalVolPerMeal,
        foodVolPerMeal,
        waterVolPerMeal,
        dilutionRate,
        formattedPlan,
        interval,
        mealHalfTime,
        midPoint,
        startTime,
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