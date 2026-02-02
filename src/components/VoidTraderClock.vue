<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    WorldState: {
        type: Object,
        required: true
    },
    Locale: {
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

function formatFullDate(timestamp) {
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(new Date(timestamp))
}

function formatTimeLeft(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    let result = ''
    if (days > 0) result += `${days}d `
    result += `${hours}h ${minutes}m ${seconds}s`
    return result
}

const traders = computed(() => {
    const rawTraders = props.WorldState?.VoidTraders
    if (!Array.isArray(rawTraders)) return []

    return rawTraders.map(trader => {
        const activation = Number(trader.Activation?.$date?.$numberLong)
        const expiry = Number(trader.Expiry?.$date?.$numberLong)
        
        const isArrived = now.value >= activation
        const targetTime = isArrived ? expiry : activation
        const msLeft = targetTime - now.value
    
        const totalDuration = isArrived ? (expiry - activation) : (14 * 24 * 60 * 60 * 1000)
        const progress = Math.min(100, Math.max(0, (msLeft / totalDuration) * 100))

        return {
            id: trader._id?.$oid || Math.random(),
            name: trader.Character,
            node: trader.Node,
            isArrived,
            fullDate: formatFullDate(targetTime),
            timeString: formatTimeLeft(msLeft),
            progress: progress.toFixed(2)
        }
    })
})
</script>

<template>
    <div v-if="traders.length > 0">
        <div v-for="trader in traders" :key="trader.id" class="TraderClock">
            <div class="state">
                <b>{{ trader.name }}</b> 
                <span v-if="trader.isArrived"> is arrived <b>{{ Locale.solNodes[trader.node].value }}</b></span>
                <span v-else> will arrive to the <b>{{ Locale.solNodes[trader.node].value }}</b></span>
            </div>

            <div class="date-info">
                Arrival Date: {{ trader.fullDate }}
            </div>

            <div class="timer">
                {{ trader.isArrived ? 'Departs in:' : 'Arrives in:' }} {{ trader.timeString }}
            </div>

            <div class="progress">
                <div
                    class="progress-bar"
                    :class="{ 'arrived': trader.isArrived }"
                    :style="{ width: (100 - trader.progress) + '%' }"
                ></div>
            </div>
        </div>
    </div>
    <div v-else class="no-data">
        No void traders found in the database
    </div>
</template>

<style scoped>
.TraderClock {
    background-color: #FFFFFF10;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
}
.date-info {
    font-size: 0.9em;
    color: #ccc;
    margin: 5px 0;
}
.TraderClock .progress {
    width: 100%;
    height: 12px;
    background-color: #00000030;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 10px;
}
.TraderClock .progress .progress-bar {
    height: 100%;
    background-color: #00AEEF; /* Голубой цвет Бездны */
    transition: width 1s linear;
}
.TraderClock .progress .progress-bar.arrived {
    background-color: #FFD700; /* Золотой, когда Баро на месте */
}
.no-data {
    padding: 10px;
    opacity: 0.6;
}
</style>