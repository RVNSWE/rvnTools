import { expect, test } from 'vitest'
import { useTubeFeedCalculator } from '../useTubeFeedCalculator';

test('checks the flush volume is being set correctly according to bodyweight', () => {
    const comp = useTubeFeedCalculator();

    comp.bodyWeight.value = -1;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(1.5);

    comp.bodyWeight.value = 0.99;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(1.5);
    
    comp.bodyWeight.value = 1;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(2);
    
    comp.bodyWeight.value = 1.49;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(2);
    
    comp.bodyWeight.value = 1.5;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(2.5);
    
    comp.bodyWeight.value = 1.99;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(2.5);
    
    comp.bodyWeight.value = 2;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(3);
    
    comp.bodyWeight.value = 2.99;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(3);
    
    comp.bodyWeight.value = 3;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(4);
    
    comp.bodyWeight.value = 4.99;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(4);
    
    comp.bodyWeight.value = 5;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(5);
    
    comp.bodyWeight.value = 9.99;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(5);
    
    comp.bodyWeight.value = 10;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(10);
    
    comp.bodyWeight.value = 100;
    comp.getFlushVol();
    expect(comp.flushVol.value).toBe(10);
})

test('checks the max volume per meal calculation', () => {
    const comp = useTubeFeedCalculator();
    
    comp.bodyWeight.value = -1;
    comp.getMaxVolPerMeal();
    expect(Math.round(comp.maxVolPerMeal.value)).toBe(-10);
    
    comp.bodyWeight.value = 0;
    comp.getMaxVolPerMeal();
    expect(Math.round(comp.maxVolPerMeal.value)).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.getMaxVolPerMeal();
    expect(Math.round(comp.maxVolPerMeal.value)).toBe(10);

    comp.bodyWeight.value = 33.33;
    comp.getMaxVolPerMeal();
    expect(Math.round(comp.maxVolPerMeal.value)).toBe(333);
    
    comp.bodyWeight.value = 1000;
    comp.getMaxVolPerMeal();
    expect(Math.round(comp.maxVolPerMeal.value)).toBe(10000);
})

test('checks the RER calculation', () => {
    const comp = useTubeFeedCalculator();

    comp.days.value = 1;
    comp.day.value = 1;
    comp.species.value = 'cat';

    comp.bodyWeight.value = -1;
    comp.getRer();
    expect(Math.round(comp.rer.value)).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.getRer();
    expect(Math.round(comp.rer.value)).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.getRer();
    expect(Math.round(comp.rer.value)).toBe(70);

    comp.bodyWeight.value = 33.33;
    comp.getRer();
    expect(Math.round(comp.rer.value)).toBe(971);
    
    comp.bodyWeight.value = 1000;
    comp.getRer();
    expect(Math.round(comp.rer.value)).toBe(12448);
})

test('checks the food per day calculation', () => {
    const comp = useTubeFeedCalculator();

    comp.kcalPerG.value = 1;
    
    comp.bodyWeight.value = -1;
    comp.rer.value = NaN;
    comp.getFoodVolPerDay();
    expect(Math.round(comp.foodVolPerDay.value)).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.rer.value = 0;
    comp.getFoodVolPerDay();
    expect(Math.round(comp.foodVolPerDay.value)).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.rer.value = 70;
    comp.getFoodVolPerDay();
    expect(Math.round(comp.foodVolPerDay.value)).toBe(70);

    comp.bodyWeight.value = 33.33;
    comp.rer.value = 971;
    comp.getFoodVolPerDay();
    expect(Math.round(comp.foodVolPerDay.value)).toBe(971);
    
    comp.bodyWeight.value = 1000;
    comp.rer.value = 12448;
    comp.getFoodVolPerDay();
    expect(Math.round(comp.foodVolPerDay.value)).toBe(12448);
})

test('checks the containers per day calculation', () => {
    const comp = useTubeFeedCalculator();

    comp.dietNetWeight.value = 200;
    
    comp.bodyWeight.value = -1;
    comp.foodVolPerDay.value = NaN;
    comp.getContainersPerDay();
    expect(Math.round(comp.containersPerDay.value * 100) / 100).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.foodVolPerDay.value = 0;
    comp.getContainersPerDay();
    expect(Math.round(comp.containersPerDay.value * 100) / 100).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.foodVolPerDay.value = 70;
    comp.getContainersPerDay();
    expect(Math.round(comp.containersPerDay.value * 100) / 100).toBe(0.4);

    comp.bodyWeight.value = 33.33;
    comp.foodVolPerDay.value = 971;
    comp.getContainersPerDay();
    expect(Math.round(comp.containersPerDay.value * 100) / 100).toBe(4.9);
    
    comp.bodyWeight.value = 1000;
    comp.foodVolPerDay.value = 12448;
    comp.getContainersPerDay();
    expect(Math.round(comp.containersPerDay.value * 100) / 100).toBe(62.2);
})

test('checks the diet water volume calculation', () => {
    const comp = useTubeFeedCalculator();

    comp.waterPercentage.value = 88;
    
    comp.bodyWeight.value = -1;
    comp.foodVolPerDay.value = NaN;
    comp.getDietWaterVol();
    expect(Math.round(comp.dietWaterVol.value * 100) / 100).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.foodVolPerDay.value = 0;
    comp.getDietWaterVol();
    expect(Math.round(comp.dietWaterVol.value * 100) / 100).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.foodVolPerDay.value = 70;
    comp.getDietWaterVol();
    expect(Math.round(comp.dietWaterVol.value * 100) / 100).toBe(61.6);

    comp.bodyWeight.value = 33.33;
    comp.foodVolPerDay.value = 971;
    comp.getDietWaterVol();
    expect(Math.round(comp.dietWaterVol.value * 100) / 100).toBe(854.48);
    
    comp.bodyWeight.value = 1000;
    comp.foodVolPerDay.value = 12448;
    comp.getDietWaterVol();
    expect(Math.round(comp.dietWaterVol.value * 100) / 100).toBe(10954.24);
})

test('checks the additional water requirement calculation', () => {
    const comp = useTubeFeedCalculator();
    
    comp.species.value = 'cat';
    comp.waterPercentage.value = 88;
    
    comp.bodyWeight.value = -1;
    comp.dietWaterVol.value = NaN;
    comp.getAdditionalWaterVol();
    expect(Math.round(comp.additionalWaterVol.value * 100) / 100).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.dietWaterVol.value = 0;
    comp.getAdditionalWaterVol();
    expect(Math.round(comp.additionalWaterVol.value * 100) / 100).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.dietWaterVol.value = 61.6;
    comp.getAdditionalWaterVol();
    expect(Math.round(comp.additionalWaterVol.value * 100) / 100).toBe(18.4);

    comp.bodyWeight.value = 33.33;
    comp.dietWaterVol.value = 854.48;
    comp.getAdditionalWaterVol();
    expect(Math.round(comp.additionalWaterVol.value * 100) / 100).toBe(255.25);
    
    comp.bodyWeight.value = 1000;
    comp.dietWaterVol.value = 10954.24;
    comp.getAdditionalWaterVol();
    expect(Math.round(comp.additionalWaterVol.value * 100) / 100).toBe(3272);
})

test('checks the total volume per day calculation', () => {
    const comp = useTubeFeedCalculator();
    
    comp.species.value = 'cat';
    comp.waterPercentage.value = 88;
    
    comp.bodyWeight.value = -1;
    comp.foodVolPerDay.value = NaN;
    comp.additionalWaterVol.value = NaN;
    comp.getTotalVolPerDay();
    expect(Math.round(comp.totalVolPerDay.value * 100) / 100).toBe(NaN);
    
    comp.bodyWeight.value = 0;
    comp.foodVolPerDay.value = 0;
    comp.additionalWaterVol.value = 0;
    comp.getTotalVolPerDay();
    expect(Math.round(comp.totalVolPerDay.value * 100) / 100).toBe(0);
    
    comp.bodyWeight.value = 1;
    comp.foodVolPerDay.value = 70;
    comp.additionalWaterVol.value = 18.4;
    comp.getTotalVolPerDay();
    expect(Math.round(comp.totalVolPerDay.value * 100) / 100).toBe(88.4);

    comp.bodyWeight.value = 33.33;
    comp.foodVolPerDay.value = 971;
    comp.additionalWaterVol.value = 255.25;
    comp.getTotalVolPerDay();
    expect(Math.round(comp.totalVolPerDay.value * 100) / 100).toBe(1226.25);
    
    comp.bodyWeight.value = 1000;
    comp.foodVolPerDay.value = 12448;
    comp.additionalWaterVol.value = 3272;
    comp.getTotalVolPerDay();
    expect(Math.round(comp.totalVolPerDay.value * 100) / 100).toBe(15720);
})