<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    WorldState: {
        type: Object,
        required: true
    }
})

const now = ref(Date.now())
let timer = null

onMounted(() => {
    timer = setInterval(() => {
        now.value = Date.now()
    }, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})

function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}м ${seconds}с`
}

const vallisTime = computed(() => {
    // Длительность полного цикла: 26 минут 40 секунд = 1600 секунд
    const CYCLE_LENGTH = 1600 
    
    // Смещение для синхронизации с сервером (стандарт для Warframe API)
    // Если будет небольшой сдвиг, это число правится на +- несколько секунд
    const OFFSET = 150 

    // Берем текущее время сервера из WorldState (поле Time) или локальное
    // В твоем файле это props.WorldState.Time (в секундах)
    const serverTime = props.WorldState?.Time || Math.floor(Date.now() / 1000)
    
    // Вычисляем текущую точку в бесконечном цикле
    const timeSinceEpoch = serverTime + (now.value / 1000 - serverTime)
    const currentCycleSeconds = (timeSinceEpoch + OFFSET) % CYCLE_LENGTH

    /* Логика фаз Долины:
       Холод (Cold): 0 - 1000с (20 минут)
       Тепло (Warm): 1000 - 1600с (6 минут 40 секунд)
    */
    const isWarm = currentCycleSeconds > 1000
    
    let secondsLeft = 0
    let state = ''
    let progress = 0

    if (isWarm) {
        state = 'Warm'
        secondsLeft = CYCLE_LENGTH - currentCycleSeconds
        progress = (currentCycleSeconds - 1000) / 600
    } else {
        state = 'Cold'
        secondsLeft = 1000 - currentCycleSeconds
        progress = currentCycleSeconds / 1000
    }

    return {
        state,
        isWarm,
        timeString: formatTime(secondsLeft * 1000),
        progress: (progress * 100).toFixed(2)
    }
})
</script>

<template>
    <div v-if="vallisTime" class="CetusClock">
        <div class="state-label">
            Orb Vallis: <b :class="vallisTime.isWarm ? 'warm' : 'cold'">{{ vallisTime.state }}</b>
        </div>
        
        <div class="time-text">
            Until Next Phase: {{ vallisTime.timeString }}
        </div>

        <div class="progress-bar">
            <div 
                class="fill" 
                :class="vallisTime.isWarm ? 'warm-bg' : 'cold-bg'"
                :style="{ width: vallisTime.progress + '%' }"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.CetusClock {
    background-color: #FFFFFF10;
    padding: 10px;
    border-radius: 10px;
}

.state-label .warm {
    color: #FF5500;
}

.state-label .cold {
    color: #00AAFF;
}

.time-text {
    margin-bottom: 10px;
}

.progress-bar .fill {
    height: 100%;
    transition: width 1s linear;
}

.CetusClock .progress-bar{
    width: 100%;
    height: 20px;
    background-color: #00000030;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
}

.progress-bar .fill.warm-bg {
    background: linear-gradient(90deg, #FF5500, #FF8844);
}

.progress-bar .fill.cold-bg {
    background: linear-gradient(90deg, #00AAFF, #00DDFF);
}
</style>