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

const cetusTime = computed(() => {
    const syndicates = props.WorldState?.SyndicateMissions
    if (!Array.isArray(syndicates)) {
        return null
    }

    const cetus = syndicates.find(s => s.Tag === 'CetusSyndicate')
    if (!cetus) {
        return null
    }

    const DAY_DURATION = 100 * 60 * 1000
    const NIGHT_DURATION = 50 * 60 * 1000

    const expiry = Number(cetus.Expiry?.$date?.$numberLong)
    if (!expiry) {
        return null
    }

    const msLeft = expiry - now.value
    if (msLeft <= 0) {
        return {
            state: 'Updating',
            timeString: 'Обновление данных...',
            progress: 0
        }
    }

    const isNight = msLeft <= NIGHT_DURATION
    const state = isNight ? 'Vome' : 'Fass'
    const phaseDuration = isNight ? NIGHT_DURATION : DAY_DURATION
    const msUntilNextPhase = isNight ? msLeft : msLeft - NIGHT_DURATION

    const progress =
        Math.min(
            100,
            Math.max(0, (msUntilNextPhase / phaseDuration) * 100)
        )

    return {
        state,
        timeString: formatTime(msUntilNextPhase),
        progress: progress.toFixed(2)
    }
})
</script>

<template>
    <div v-if="cetusTime" class="CetusClock">
        <div class="state">
            Deimos: <b>{{ cetusTime.state }}</b>
        </div>

        <div class="timer">
            Until Next Phase: {{ cetusTime.timeString }}
        </div>

        <div class="progress">
            <div
                class="progress-bar"
                :style="{ width: (100 - cetusTime.progress) + '%' }"
            ></div>
        </div>
    </div>

    <div v-else>
        Нет данных по Cetus
    </div>
</template>

<style scoped>
.CetusClock {
    background-color: #FFFFFF10;
    padding: 10px;
    border-radius: 10px;
}
.CetusClock .progress{
    width: 100%;
    height: 20px;
    background-color: #00000030;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
}
.CetusClock .progress .progress-bar{
    height: 100%;
    background-color: #ff0000aa;
    transition: width 1s linear;
}
</style>