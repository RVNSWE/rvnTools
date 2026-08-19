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
    const formattedPlan = ref(new Array<string>())
    const interval = ref(0)
    const mealHalfTime = ref(0)
    const midPoint = ref(0)
    const startTime = ref(0)
    const days = ref(0)
    const day = ref(0)
    const species = ref('')
    const bodyWeight = ref(0)
    const dietName = ref('')
    const kcalPerG = ref(0)
    const dietNetWeight = ref(0)
    const waterPercentage = ref(0)
    const flushVol = ref(0)
    const diluted = ref(false)

    function calculate() {
        getFlushVol(); // set the volume of flush to use depending on body weight
        getMaxVolPerMeal(); // maximum volume per meal based on body weight
        getRer(); // RER calculation
        getFoodVolPerDay(); // food volume per day based on RER and kcal per gram
        getContainersPerDay(); // number of containers per day
        getDietWaterVol(); // water volume from diet
        getAdditionalWaterVol(); // additional water volume needed
        getTotalVolPerDay(); // total volume per day
        calculateMealsPerDay(); // work out how many meals to split feeding into

        getFoodVolPerMeal(); // food volume per meal
        getWaterVolPerMeal(); // water volume per meal

        if (diluted.value)
        {
            getRoundedDilutionRate(); // dilution rate if diluted
        }

        getRoundedFoodVolPerMeal(); // round food volume per meal to sensible number of decimals
        getRoundedWaterVolPerMeal(); // round water volume per meal to sensible number of decimals
        getRoundedContainersPerDay(); // round containers per day to 1 decimal place

        formatFeedingPlan(); // create the formatted feeding plan
    }

    function getFlushVol() {
        if (bodyWeight.value < 1) {
            flushVol.value = 1.5;
        }
        else if (bodyWeight.value < 1.5) {
            flushVol.value = 2;
        }
        else if (bodyWeight.value < 2) {
            flushVol.value = 2.5;
        }
        else if (bodyWeight.value < 3) {
            flushVol.value = 3;
        }
        else if (bodyWeight.value < 5) {
            flushVol.value = 4;
        }
        else if (bodyWeight.value < 10) {
            flushVol.value = 5;
        }
        else {
            flushVol.value = 10;
        }
    }

    function getMaxVolPerMeal() {
        maxVolPerMeal.value = bodyWeight.value * maxMlPerKg;
    }

    function getRer() {
        rer.value = (70 * Math.pow(bodyWeight.value, 0.75)) / days.value * day.value;
    }

    function getFoodVolPerDay() {
        foodVolPerDay.value = rer.value / kcalPerG.value;
    }

    function getContainersPerDay() {
        containersPerDay.value = Math.round(foodVolPerDay.value / dietNetWeight.value * 10) / 10;
    }

    function getDietWaterVol() {
        dietWaterVol.value = foodVolPerDay.value * (waterPercentage.value / 100);
    }

    function getAdditionalWaterVol() {
        additionalWaterVol.value = calculateBasicFluidRequirement() - dietWaterVol.value;
    }

    function getTotalVolPerDay() {
        totalVolPerDay.value = foodVolPerDay.value + additionalWaterVol.value;
    }

    function calculateMealsPerDay() {
        mealsPerDay.value = Math.ceil(totalVolPerDay.value / maxVolPerMeal.value); // number of meals per day based on total volume and max volume per meal
        adjustMealVolumes();

        while (totalVolPerMeal.value > maxVolPerMeal.value) // if the total volume per meal exceeds the maximum volume per meal, increase the number of meals per day and recalculate
        {
            mealsPerDay.value++;
            adjustMealVolumes();

            if (mealsPerDay.value > 23)
            {
                break; // constraint: do not exceed 24 meals per day
            }
        }
    }

    function adjustMealVolumes() {
        let totalFlushPerDay = 2 * flushVol.value * mealsPerDay.value; // total flush volume per day

        if (totalFlushPerDay > additionalWaterVol.value)
        {
            waterVolPerDay.value = 0; // don't add any more water if flush already exceeds requirement (constraint: water per day can never be less than 0)
            totalVolPerDay.value = foodVolPerDay.value + totalFlushPerDay; // (ml) food and flush are all that will be administered
        }
        else
        {
            waterVolPerDay.value = additionalWaterVol.value - totalFlushPerDay; // otherwise subtract the volume of flush per day from the additional water requirement
            totalVolPerDay.value = foodVolPerDay.value + additionalWaterVol.value; // (ml) total daily volume is food, flush and additional water
        }

        totalVolPerMeal.value = totalVolPerDay.value / mealsPerDay.value; // (ml) recalculate the volume per meal
    }

    function getFoodVolPerMeal() {
        foodVolPerMeal.value = foodVolPerDay.value / mealsPerDay.value;
    }

    function getWaterVolPerMeal() {
        waterVolPerMeal.value = waterVolPerDay.value / mealsPerDay.value;
    }

    function getRoundedDilutionRate() {
        let rawDilutionRate = waterVolPerDay.value / foodVolPerDay.value;

        if (rawDilutionRate < 2)
        {
            dilutionRate.value = Math.round(rawDilutionRate * 100) / 100; // round to 2 decimal places if value is less than 2
        }
        else
        {
            dilutionRate.value = Math.round(rawDilutionRate * 10) / 10; // otherwise, round to 1 decimal place
        }

        foodVolPerMeal.value += waterVolPerMeal.value; // if diluted, add water volume to food volume for total volume per meal
    }

    function getRoundedFoodVolPerMeal() {
        foodVolPerMeal.value = roundDecimal(foodVolPerMeal.value);
    }

    function getRoundedWaterVolPerMeal() {
        waterVolPerMeal.value = roundDecimal(waterVolPerMeal.value);
    }

    function getRoundedContainersPerDay() {
        containersPerDay.value = Math.round(containersPerDay.value * 10) / 10;
    }

    function calculateBasicFluidRequirement() {
        let requirement = 0;

        if (species.value === 'cat')
        {
            requirement = 80 * Math.pow(bodyWeight.value, 0.75);
        }
        else
        {
            requirement = 132 * Math.pow(bodyWeight.value, 0.75);
        }

        return requirement;
    }

    function roundDecimal(value: number) {
        let roundedValue;

        if (value < 2)
        {
            roundedValue = Math.round(value * 100) / 100; // round to 2 decimal places if value is less than 2
        }
        else if (value < 20)
        {
            roundedValue = Math.round(value * 10) / 10; // round to 1 decimal place if value is less than 20
        }
        else
        {
            roundedValue = Math.round(value); // otherwise, round to nearest whole number
        }

        return roundedValue;
    }

    function getScheduleLength() {
        let scheduleLength = (mealsPerDay.value - 1) * interval.value; // The actual number of hours the feeds are spread over
        return scheduleLength;
    }

    function calculateInterval() {
        let hours = 16; // The number of hours the feeds are spread over
        let preciseInterval = hours / mealsPerDay.value; // The interval between feeds in hours
        interval.value = Math.round(preciseInterval * 2) / 2; // Round the interval to the nearest half hour

        if (interval.value < 1)
        {
            interval.value = 1; // Constraint: The interval between feeds cannot be less than 1 hour
        }
    }

    function calculateTimeLine() {
        mealHalfTime.value = getScheduleLength() / 2; // half the number of hours the feeds are spread over
        startTime.value = Math.round((midPoint.value - mealHalfTime.value) * 2) / 2; // Calculate the feeding schedule start time from its mid point
    }

    function calculateFeedingPlan() {
        midPoint.value = 15;  // Corresponding to 15:00 (3pm)
        calculateInterval();
        calculateTimeLine();

        while (startTime.value + getScheduleLength() > 23.5) // While current end time is later than 23:30
        {
            if (startTime.value > 0)
            {
                startTime.value -= 0.5; // If possible, start feeds 30 minutes earlier (constraint: can't start before midnight)
            }
            else
            {
                if (interval.value > 1)
                {
                    interval.value -= 0.5; // reduce the feeding interval by half an hour
                }
                calculateTimeLine();
            }

            if (interval.value < 1.5)
            {
                interval.value = 1; // Constraint: The interval between feeds cannot be less than 1 hour
                break; // If the interval is already at its minimum, break to avoid an infinite loop
            }
        }

        const time = ref(startTime.value); // Start from the calculated start time
        let feedingTimes = [];

        if (mealsPerDay.value > 23)
        {
            time.value = 0; // set the time to midnight
            for (let i = 0; i < 24; i += 1)
            {
                feedingTimes.push(time.value); // add the time to the feeding times array
                time.value += 1; // increment the time by 1 hour for the next feeding
            }
        }
        else
        {
            for (let i = 0; i < mealsPerDay.value; i += 1)
            {
                feedingTimes.push(time.value); // add the time to the feeding times array
                time.value += interval.value; // increment the time by the calculated interval for the next feeding
            }
        }

        return feedingTimes; // Return the array of feeding times
    }

    function formatFeedingPlan() {
        let feedingTimes = calculateFeedingPlan(); // Get the calculated feeding times

        for (let i = 0; i < feedingTimes.length; i += 1)
        {
            let time = feedingTimes[i];
            let roundedTime = Math.round(feedingTimes[i]); // Round the feeding time to the nearest integer
            let formattedTime = ''; // Prepare a string field for the formatted (human readable) time
            let hours = Math.floor(time).toString(); // round down to the nearest whole number for hours
            let minutes = ':00'; // Default minutes to ":00"

            if (time < roundedTime) // If the real time is less than the rounded time then it was in the second half of the hour
            {
                minutes = ':30'; // Set minutes to ":30"
            }

            if (time < 10) // If the time is less than 10, prepend a "0" to the hours for formatting
            {
                hours = '0' + hours;
            }

            formattedTime = hours + minutes; // Combine hours and minutes into a formatted time string
            formattedPlan.value.push(formattedTime); // Add the formatted time to the array
        }
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
        diluted,
        maxVolPerMeal,
        rer,
        foodVolPerDay,
        waterVolPerDay,
        dietWaterVol,
        additionalWaterVol,
        totalVolPerDay,
        calculate,
        getFlushVol,
        getMaxVolPerMeal,
        getRer,
        getFoodVolPerDay,
        getContainersPerDay,
        getDietWaterVol,
        getAdditionalWaterVol,
        getTotalVolPerDay,
        getFoodVolPerMeal,
        getWaterVolPerMeal,
        getRoundedFoodVolPerMeal,
        getRoundedWaterVolPerMeal,
        getRoundedContainersPerDay,
        getRoundedDilutionRate,
        calculateMealsPerDay
    }
}